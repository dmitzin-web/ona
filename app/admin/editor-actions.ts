"use server";

import { requireAdmin } from "@/lib/admin/session";
import { ConflictError, getStore, StoreError } from "@/lib/admin/store";
import { blobSha } from "@/lib/admin/store-core";
import { commitMessage } from "@/lib/admin/commit-message";
import { legalFindings, type Finding } from "@/lib/admin/legal-guard";
import { serializeContent, validateBySchema } from "@/lib/admin/schema";
import { findSection, SECTIONS } from "@/lib/admin/sections";
import { diff, rebase, type Change } from "@/lib/admin/json-path";

// Server side of the visual editor (/admin). Like every action in the admin,
// each export is a POST endpoint that can be called without rendering any
// page, so each one starts with requireAdmin().

export type PublishChange = { sectionId: string; sha: string | null; value: unknown };

export type PublishResult =
  | { ok: true; commit: string; shas: Record<string, string> }
  | {
      ok: false;
      errors?: { sectionId: string; messages: string[] }[];
      legal?: { sectionId: string; findings: Finding[] }[];
      conflict?: string[];
      message?: string;
    };

// Strings that are new or different in `after` — the legal guard only reads
// what the editor wrote, not the whole file.
const changedStrings = (before: unknown, after: unknown) =>
  diff(before, after).flatMap((c) => (c.after === undefined ? [] : [c.after]));

function validateSectionValue(sectionId: string, value: unknown, current: unknown): { value?: unknown; errors: string[] } {
  const section = findSection(sectionId)!;
  if (section.kind === "single") {
    const v = validateBySchema(section.schema, value);
    return v.ok ? { value: v.value, errors: [] } : { errors: v.errors };
  }
  // A collection's items are its pages: their addresses (slugs) and order
  // cannot change here — that needs code.
  const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const cur = Array.isArray(current) ? (current as Record<string, unknown>[]) : [];
  if (items.length !== cur.length || items.some((it, i) => it?.slug !== cur[i]?.slug)) {
    return { errors: ["Items cannot be added, removed or reordered here — ask the developer."] };
  }
  const errors: string[] = [];
  const out = items.map((it) => {
    const v = validateBySchema(section.schema, it);
    if (!v.ok) {
      errors.push(...v.errors.map((e) => `${String(it[section.titleKey] ?? it.slug)}: ${e}`));
      return it;
    }
    return { slug: it.slug, ...v.value };
  });
  return errors.length ? { errors } : { value: out, errors: [] };
}

export async function publishChanges(changes: PublishChange[], acknowledged: boolean): Promise<PublishResult> {
  const user = await requireAdmin();
  const sections = changes.map((c) => findSection(c.sectionId));
  if (!changes.length || sections.some((s) => !s)) return { ok: false, message: "Nothing to publish." };

  try {
    const store = await getStore();
    const current = await store.readMany(sections.map((s) => s!.file));

    const conflict = changes.filter((c, i) => (current[i]?.sha ?? null) !== c.sha).map((c) => c.sectionId);
    if (conflict.length) return { ok: false, conflict };

    const errors: { sectionId: string; messages: string[] }[] = [];
    const legal: { sectionId: string; findings: Finding[] }[] = [];
    const put: { path: string; content: string }[] = [];
    const allFindings: Finding[] = [];
    const titles: string[] = [];

    changes.forEach((c, i) => {
      const section = sections[i]!;
      const cur = current[i] ? (JSON.parse(current[i]!.text) as unknown) : null;
      const v = validateSectionValue(c.sectionId, c.value, cur);
      if (v.errors.length) return void errors.push({ sectionId: c.sectionId, messages: v.errors });
      const findings = legalFindings(changedStrings(cur, v.value));
      if (findings.length) {
        legal.push({ sectionId: c.sectionId, findings });
        allFindings.push(...findings);
      }
      put.push({ path: section.file, content: serializeContent(v.value) });
      titles.push(section.label);
    });

    if (errors.length) return { ok: false, errors };
    if (legal.length && !acknowledged) return { ok: false, legal };

    const commit = await store.commit({
      message: commitMessage(`Update ${titles.join(", ")}`, user.name, allFindings),
      put,
      remove: [],
      expect: Object.fromEntries(changes.map((c, i) => [sections[i]!.file, c.sha])),
    });
    return {
      ok: true,
      commit,
      shas: Object.fromEntries(put.map((p, i) => [changes[i].sectionId, blobSha(Buffer.from(p.content, "utf8"))])),
    };
  } catch (err) {
    if (err instanceof ConflictError) return { ok: false, conflict: changes.map((c) => c.sectionId) };
    if (err instanceof StoreError) return { ok: false, message: err.message };
    console.error("[admin] publish failed", err);
    return { ok: false, message: "Could not publish. Try again in a minute; if it keeps failing, tell the developer." };
  }
}

// The latest version of some sections — after a conflict, to merge the
// editor's changes onto what someone else just published.
export async function loadSections(ids: string[]): Promise<{ id: string; sha: string | null; value: unknown }[]> {
  await requireAdmin();
  const sections = ids.map((id) => findSection(id)).filter((s) => !!s);
  const store = await getStore();
  const files = await store.readMany(sections.map((s) => s.file));
  return sections.map((s, i) => ({ id: s.id, sha: files[i]?.sha ?? null, value: files[i] ? JSON.parse(files[i]!.text) : null }));
}

export type HistoryItem = { sha: string; summary: string; date: string; author: string; admin: boolean };

export async function loadHistory(): Promise<{ items: HistoryItem[] } | { error: string }> {
  await requireAdmin();
  try {
    const store = await getStore();
    const items = (await store.history(40)).map((h) => ({
      sha: h.sha,
      summary: h.message.split("\n")[0],
      date: h.date,
      author: h.author,
      admin: /via onarestore\.com\/admin/.test(h.message),
    }));
    return { items };
  } catch (err) {
    return { error: err instanceof StoreError ? err.message : "Could not load the history." };
  }
}

export type CommitChanges = { sectionId: string | null; file: string; changes: Change[] }[];

export async function loadCommitChanges(sha: string): Promise<CommitChanges | { error: string }> {
  await requireAdmin();
  try {
    const store = await getStore();
    const files = await store.commitFiles(sha);
    return files.map((f) => {
      const section = SECTIONS.find((s) => s.file === f.path);
      const parse = (t: string | null) => (t === null ? null : (JSON.parse(t) as unknown));
      return { sectionId: section?.id ?? null, file: f.path, changes: diff(parse(f.before), parse(f.after)) };
    });
  } catch (err) {
    return { error: err instanceof StoreError ? err.message : "Could not load this change." };
  }
}

// Undo one published change: its edits are reversed on top of the current
// version, so anything published after it stays. A value that was edited
// again since is left alone and reported.
export async function undoCommit(
  sha: string,
): Promise<{ ok: true; commit: string; skipped: number } | { ok: false; message: string }> {
  const user = await requireAdmin();
  try {
    const store = await getStore();
    const files = (await store.commitFiles(sha)).filter((f) => SECTIONS.some((s) => s.file === f.path));
    if (!files.length) {
      return { ok: false, message: "This change is not page text (a blog post, gallery photo or code). Undo it from its own editor, or ask the developer." };
    }
    const current = await store.readMany(files.map((f) => f.path));
    let skipped = 0;
    const put: { path: string; content: string }[] = [];
    const expect: Record<string, string | null> = {};
    files.forEach((f, i) => {
      if (f.before === null || f.after === null || !current[i]) return void skipped++;
      const r = rebase(JSON.parse(f.after), JSON.parse(f.before), JSON.parse(current[i]!.text));
      skipped += r.conflicts.length;
      const content = serializeContent(r.value);
      if (content !== current[i]!.text) {
        put.push({ path: f.path, content });
        expect[f.path] = current[i]!.sha;
      }
    });
    if (!put.length) return { ok: false, message: "Nothing to undo — everything in that change has been edited again since." };
    const { summary } = await summaryOf(store, sha);
    const commit = await store.commit({
      message: commitMessage(`Undo: ${summary}`, user.name),
      put,
      remove: [],
      expect,
    });
    return { ok: true, commit, skipped };
  } catch (err) {
    if (err instanceof ConflictError) return { ok: false, message: "Someone published at the same moment. Try again." };
    if (err instanceof StoreError) return { ok: false, message: err.message };
    console.error("[admin] undo failed", err);
    return { ok: false, message: "Could not undo. Try again in a minute; if it keeps failing, tell the developer." };
  }
}

async function summaryOf(store: Awaited<ReturnType<typeof getStore>>, sha: string) {
  const h = (await store.history(60)).find((x) => x.sha === sha);
  return { summary: h ? h.message.split("\n")[0] : sha.slice(0, 7) };
}

export async function deployStatus(sha: string) {
  await requireAdmin();
  try {
    return await (await getStore()).deployStatus(sha);
  } catch {
    return { state: "unknown" as const };
  }
}
