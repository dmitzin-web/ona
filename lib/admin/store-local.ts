import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
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
  },
};
