// Path-level operations on content JSON. Pure — used by the visual editor
// in the browser and by the server (publish, undo).
//
// A path is the list of keys and indexes from the file's root to a value:
// ["hero", "titleLead"], ["faqs", 2, "a"]. An array whose LENGTH changed is
// treated as one value (items were added or removed — there is no sensible
// per-item merge), otherwise arrays are compared item by item.

export type Path = (string | number)[];
export type Change = { path: Path; before: unknown; after: unknown };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export const samePath = (a: Path, b: Path) => a.length === b.length && a.every((k, i) => k === b[i]);
export const pathKey = (p: Path) => JSON.stringify(p);
export const isPrefix = (prefix: Path, p: Path) => prefix.length <= p.length && prefix.every((k, i) => k === p[i]);

export function getAt(v: unknown, path: Path): unknown {
  let cur = v;
  for (const k of path) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string | number, unknown>)[k];
  }
  return cur;
}

export function setAt<T>(root: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [k, ...rest] = path;
  if (Array.isArray(root)) {
    const next = [...root];
    next[k as number] = setAt(root[k as number], rest, value);
    return next as T;
  }
  const obj: Record<string, unknown> = isObj(root) ? root : {};
  return { ...obj, [k]: setAt(obj[k as string], rest, value) } as T;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    const bb = b as unknown[];
    return a.length === bb.length && a.every((x, i) => deepEqual(x, bb[i]));
  }
  const ka = Object.keys(a as object);
  const kb = Object.keys(b as object);
  return (
    ka.length === kb.length &&
    ka.every((k) => deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]))
  );
}

export function diff(before: unknown, after: unknown, path: Path = []): Change[] {
  if (deepEqual(before, after)) return [];
  if (Array.isArray(before) && Array.isArray(after) && before.length === after.length) {
    return before.flatMap((x, i) => diff(x, after[i], [...path, i]));
  }
  if (isObj(before) && isObj(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].flatMap((k) => diff(before[k], after[k], [...path, k]));
  }
  return [{ path, before, after }];
}

// Re-applies my edits (oldBase → mine) on top of a newer version of the
// file. A path the other side ALSO changed, to something else, is a
// conflict and keeps their value.
export function rebase(oldBase: unknown, mine: unknown, newBase: unknown): { value: unknown; conflicts: Change[] } {
  let value = newBase;
  const conflicts: Change[] = [];
  for (const c of diff(oldBase, mine)) {
    const theirs = getAt(newBase, c.path);
    if (deepEqual(theirs, c.before) || deepEqual(theirs, c.after)) value = setAt(value, c.path, c.after);
    else conflicts.push({ path: c.path, before: theirs, after: c.after });
  }
  return { value, conflicts };
}
