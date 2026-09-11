import "server-only";
import {
  assertSafePath,
  checkCommit,
  ConflictError,
  conflictMessage,
  StoreError,
  type ContentStore,
} from "./store-core";

// Where the admin reads and writes content.
//
//   production  → GitHub, through the API, with ONE server-side token
//                 (GITHUB_CONTENT_TOKEN). Editors never touch GitHub and do
//                 not need accounts there; the server makes the commit.
//   development → the working copy on disk, so the admin can be used and
//                 tested locally without committing to the real repo.
//                 ADMIN_STORAGE=github opts a dev server into GitHub mode.
//
// Production is always GitHub whatever the env says: Vercel's filesystem is
// read-only, and a "local" write there would fail on the first save.
//
// Every write is ONE commit, even when it touches several files (a gallery
// photo is a JSON file plus an image, and replacing a .jpg with a .webp also
// deletes the old one). Partial saves cannot happen.
//
// Lost-update protection: the editor sends back the blob SHA of the file as
// it was when the form opened; the commit refuses if the file has changed
// since. `expect: null` means "must not exist yet" — which is what stops a
// new post from silently overwriting an existing one with the same address.

// ── GitHub ───────────────────────────────────────────────────────────────

const OWNER = "dmitzin-web";
const REPO = "ona";

function githubStore(): ContentStore {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  if (!token) {
    throw new StoreError(
      "Publishing is not connected yet, so content cannot be shown or saved. In Vercel → Settings → Environment Variables, add GITHUB_CONTENT_TOKEN for Production, then redeploy.",
    );
  }
  // A branch other than main is for testing the admin without deploying.
  const branch = process.env.ADMIN_CONTENT_BRANCH || "main";

  async function gh<T>(p: string, init?: RequestInit & { allow404?: boolean }): Promise<T | null> {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}${p}`, {
      ...init,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
      },
    });
    if (res.status === 404 && init?.allow404) return null;
    if (!res.ok) {
      // Status and GitHub's message only — never the request, which carries
      // the token in its headers.
      const msg = await res.text().then((t) => {
        try {
          return (JSON.parse(t) as { message?: string }).message ?? t;
        } catch {
          return t;
        }
      });
      const err = new StoreError(`GitHub ${res.status}: ${msg.slice(0, 200)}`);
      (err as StoreError & { status?: number }).status = res.status;
      throw err;
    }
    return (await res.json()) as T;
  }

  type Entry = { name: string; path: string; sha: string; type: string };
  type FileBody = { sha: string; content: string; encoding: string };

  const shaAt = async (p: string, ref: string) =>
    (await gh<FileBody>(`/contents/${encodeURI(p)}?ref=${ref}`, { allow404: true }))?.sha ?? null;

  // READ AT A COMMIT, NEVER AT A BRANCH NAME. GitHub serves API responses
  // with `cache-control: max-age=60, s-maxage=60`, and a contents URL keyed
  // on the branch name is the same URL before and after a save. Testing
  // against the real repo, a read straight after a commit came back with the
  // old file — which would have shown stale content in the admin and turned
  // every quick second edit into a false "changed by someone else".
  // So: resolve the branch to its head commit once (with a cache-buster on
  // the one mutable lookup), then address everything by that SHA. A commit
  // SHA names immutable content, so no cache can make it wrong.
  const headSha = async () =>
    (await gh<{ object: { sha: string } }>(
      `/git/ref/heads/${branch}?_=${Date.now()}${Math.random().toString(36).slice(2)}`,
    ))!.object.sha;

  const store: ContentStore = {
    kind: "github",
    async list(dir) {
      assertSafePath(`${dir}/`);
      const head = await headSha();
      const entries =
        (await gh<Entry[]>(`/contents/${encodeURI(dir)}?ref=${head}`, { allow404: true })) ?? [];
      const files = entries.filter((e) => e.type === "file" && e.name.endsWith(".json"));
      return Promise.all(
        files.map(async (e) => {
          const blob = await gh<FileBody>(`/git/blobs/${e.sha}`);
          return { path: e.path, sha: e.sha, text: Buffer.from(blob!.content, "base64").toString("utf8") };
        }),
      );
    },
    async read(file) {
      assertSafePath(file);
      const body = await gh<FileBody>(`/contents/${encodeURI(file)}?ref=${await headSha()}`, { allow404: true });
      if (!body) return null;
      return { path: file, sha: body.sha, text: Buffer.from(body.content, "base64").toString("utf8") };
    },
    async commit(c) {
      checkCommit(c);
      // Two attempts: the ref update is a compare-and-swap, and if anything
      // else lands on the branch between reading it and moving it (a code
      // push, the other editor), GitHub refuses and we rebuild on top.
      for (let attempt = 0; attempt < 2; attempt++) {
        const head = await headSha();
        const baseTree = (await gh<{ tree: { sha: string } }>(`/git/commits/${head}`))!.tree.sha;

        for (const [p, want] of Object.entries(c.expect)) {
          if ((await shaAt(p, head)) !== want) throw new ConflictError(conflictMessage(want));
        }

        const tree = [
          ...(await Promise.all(
            c.put.map(async (f) => {
              const buf = typeof f.content === "string" ? Buffer.from(f.content, "utf8") : f.content;
              const blob = await gh<{ sha: string }>(`/git/blobs`, {
                method: "POST",
                body: JSON.stringify({ content: buf.toString("base64"), encoding: "base64" }),
              });
              return { path: f.path, mode: "100644", type: "blob", sha: blob!.sha };
            }),
          )),
          ...c.remove.map((p) => ({ path: p, mode: "100644", type: "blob", sha: null })),
        ];
        const newTree = await gh<{ sha: string }>(`/git/trees`, {
          method: "POST",
          body: JSON.stringify({ base_tree: baseTree, tree }),
        });
        const commit = await gh<{ sha: string }>(`/git/commits`, {
          method: "POST",
          body: JSON.stringify({ message: c.message, tree: newTree!.sha, parents: [head] }),
        });
        try {
          await gh(`/git/refs/heads/${branch}`, {
            method: "PATCH",
            body: JSON.stringify({ sha: commit!.sha, force: false }),
          });
          return;
        } catch (e) {
          const status = (e as { status?: number }).status;
          if (status === 422 && attempt === 0) continue;
          throw e;
        }
      }
    },
  };
  return store;
}

export { ConflictError, StoreError } from "./store-core";
export type { Commit, ContentStore, StoredFile } from "./store-core";

export async function getStore(): Promise<ContentStore> {
  // `process.env.NODE_ENV` is inlined at build time, so in a production
  // build this condition is the constant `false` and the bundler drops the
  // import entirely — the local store and its untraceable paths never reach
  // a deployed function. Production is always GitHub.
  if (process.env.NODE_ENV !== "production" && process.env.ADMIN_STORAGE !== "github") {
    return (await import("./store-local")).localStore;
  }
  return githubStore();
}
