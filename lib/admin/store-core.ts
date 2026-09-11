import { createHash } from "node:crypto";
import path from "node:path";

// Shared by the GitHub store (lib/admin/store.ts) and the development-only
// local store (lib/admin/store-local.ts). No filesystem access in here —
// see store-local.ts for why that matters.

export type StoredFile = { path: string; sha: string; text: string };

export type Commit = {
  message: string;
  put: { path: string; content: string | Buffer }[];
  remove: string[];
  expect: Record<string, string | null>;
};

export class ConflictError extends Error {}
export class StoreError extends Error {}

export interface ContentStore {
  kind: "local" | "github";
  list(dir: string): Promise<StoredFile[]>;
  read(file: string): Promise<StoredFile | null>;
  commit(c: Commit): Promise<void>;
}

// Git's own blob hash, so the local store's conflict check means exactly
// what GitHub's does.
export function blobSha(buf: Buffer): string {
  return createHash("sha1")
    .update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf]))
    .digest("hex");
}

// Paths come from validated slugs, but the store is the last line: nothing
// may resolve outside content/ and public/photos/.
const ALLOWED_ROOTS = ["content/", "public/photos/"];
export function assertSafePath(p: string) {
  const norm = path.posix.normalize(p);
  if (norm !== p || norm.startsWith("/") || norm.includes("..") || !ALLOWED_ROOTS.some((r) => norm.startsWith(r))) {
    throw new StoreError(`Refusing path outside the content folders: ${p}`);
  }
}

export function checkCommit(c: Commit) {
  [...c.put.map((x) => x.path), ...c.remove, ...Object.keys(c.expect)].forEach(assertSafePath);
}

export function conflictMessage(expected: string | null): string {
  return expected === null
    ? "Something with this address already exists. Pick a different title or address."
    : "This was changed by someone else after you opened it. Reload the page to get the latest version, then make your edit again.";
}
