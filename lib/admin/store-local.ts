import "server-only";
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import {
  assertSafePath,
  blobSha,
  checkCommit,
  ConflictError,
  conflictMessage,
  type ContentStore,
} from "./store-core";

// The admin's DEVELOPMENT store: reads and writes the working copy on disk.
//
// This lives in its own module, loaded only through a dynamic import that a
// production build compiles away (see getStore in ./store.ts), and that is
// the whole point of the file. Its paths are `process.cwd()` + a runtime
// value, which no file tracer can resolve — so while it sat in store.ts the
// tracer gave up and packed the ENTIRE project directory into every function
// that imported the store: .git, .claude, node_modules. Vercel measured the
// admin function at 383 MB against a 250 MB limit and refused the deploy.
// Never import this module statically.

export const localStore: ContentStore = {
  kind: "local",
  async list(dir) {
    assertSafePath(`${dir}/`);
    const abs = path.join(process.cwd(), dir);
    const names = (await fs.readdir(abs)).filter((n) => n.endsWith(".json"));
    return Promise.all(
      names.map(async (n) => {
        const buf = await fs.readFile(path.join(abs, n));
        return { path: `${dir}/${n}`, sha: blobSha(buf), text: buf.toString("utf8") };
      }),
    );
  },
  async read(file) {
    assertSafePath(file);
    try {
      const buf = await fs.readFile(path.join(process.cwd(), file));
      return { path: file, sha: blobSha(buf), text: buf.toString("utf8") };
    } catch {
      return null;
    }
  },
  async readMany(files) {
    return Promise.all(files.map((f) => this.read(f)));
  },
  async commit(c) {
    checkCommit(c);
    for (const [p, want] of Object.entries(c.expect)) {
      const cur = await this.read(p);
      if ((cur?.sha ?? null) !== want) throw new ConflictError(conflictMessage(want));
    }
    for (const f of c.put) {
      const abs = path.join(process.cwd(), f.path);
      await fs.mkdir(path.dirname(abs), { recursive: true });
      await fs.writeFile(abs, f.content);
    }
    for (const p of c.remove) await fs.rm(path.join(process.cwd(), p), { force: true });
    // No real commit: the working copy is the store. History below shows the
    // repository's commits, which is enough to exercise the history UI.
    return `local-${Date.now()}`;
  },
  async history(limit) {
    const out = await git(["log", `-n${limit}`, "--format=%H%x1f%an%x1f%aI%x1f%B%x1e", "--", "content"]);
    return out
      .split("\x1e")
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => {
        const [sha, name, date, message] = r.split("\x1f");
        return { sha, date, message, author: /Edited by (.+?) via/.exec(message)?.[1] ?? name };
      });
  },
  async commitFiles(sha) {
    if (!/^[0-9a-f]{40}$/.test(sha)) return [];
    const names = (await git(["show", "--name-only", "--format=", sha])).split("\n").filter((n) => n.startsWith("content/") && n.endsWith(".json"));
    const at = (ref: string, p: string) => git(["show", `${ref}:${p}`]).catch(() => null);
    return Promise.all(names.map(async (p) => ({ path: p, before: await at(`${sha}^`, p), after: await at(sha, p) })));
  },
  async listMedia(dir) {
    assertSafePath(`${dir}/`);
    const root = path.join(process.cwd(), dir);
    const walk = async (rel: string): Promise<string[]> => {
      const entries = await fs.readdir(path.join(root, rel), { withFileTypes: true });
      const out: string[] = [];
      for (const e of entries) {
        const r = rel ? `${rel}/${e.name}` : e.name;
        if (e.isDirectory()) out.push(...(await walk(r)));
        else if (/\.(avif|webp|jpe?g|png)$/i.test(e.name)) out.push(`${dir}/${r}`);
      }
      return out;
    };
    return (await walk("")).sort();
  },
  async deployStatus() {
    return { state: "local" };
  },
};

const run = promisify(execFile);
async function git(args: string[]): Promise<string> {
  return (await run("git", args, { cwd: process.cwd(), maxBuffer: 32 * 1024 * 1024 })).stdout;
}
