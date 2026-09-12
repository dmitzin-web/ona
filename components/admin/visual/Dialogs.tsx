"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SectionDef } from "@/lib/admin/sections";
import { diff, getAt, type Change, type Path } from "@/lib/admin/json-path";
import { validateBySchema } from "@/lib/admin/schema";
import { legalFindings, RULES_RU, type Finding } from "@/lib/admin/legal-guard";
import {
  loadCommitChanges,
  loadHistory,
  publishChanges,
  undoCommit,
  type CommitChanges,
  type HistoryItem,
  type PublishResult,
} from "@/app/admin/editor-actions";
import { fieldsAlong, fillWith, leaves, trailOf, type Company, type Leaf } from "./model";
import { useLang } from "./i18n";
import { photoPreviewUrl } from "../ImageField";
import type { Base, Draft, PageRef } from "./types";

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/30 p-0 sm:p-6" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-label={title}
        className={`flex max-h-full w-full flex-col overflow-hidden bg-charcoal shadow-2xl sm:max-h-[85vh] sm:rounded-[2px] ${wide ? "sm:max-w-3xl" : "sm:max-w-xl"} h-full sm:h-auto`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-[16px] font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="px-2 text-[18px] text-warm-gray" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ── Find text anywhere ────────────────────────────────────────────────────

export function SearchDialog({
  sections,
  draft,
  company,
  onClose,
  onPick,
  pageFor,
}: {
  sections: SectionDef[];
  draft: Draft;
  company: Company;
  onClose: () => void;
  onPick: (leaf: Leaf) => void;
  pageFor: (leaf: Leaf) => string | null;
}) {
  const { t, field: tr, trail: trTrail } = useLang();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const all = useMemo(
    () =>
      sections.flatMap((s) =>
        leaves(s, draft[s.id])
          .filter((l) => !l.photo)
          .map((l) => {
            const raw = String(getAt(draft[s.id], l.path) ?? "");
            return { leaf: l, raw, text: fillWith(raw, company) };
          }),
      ),
    [sections, draft, company],
  );
  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const hits = all.filter((r) => {
      const h = `${r.text} ${r.raw}`.toLowerCase();
      return words.every((w) => h.includes(w));
    });
    const phrase = q.toLowerCase().trim();
    hits.sort((a, b) => Number(b.text.toLowerCase().includes(phrase)) - Number(a.text.toLowerCase().includes(phrase)));
    return hits.slice(0, 50);
  }, [q, all]);

  const mark = (text: string) => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const lower = text.toLowerCase();
    let i = -1;
    for (const w of words) {
      i = lower.indexOf(w);
      if (i >= 0) {
        const start = Math.max(0, i - 40);
        const snippet = (start ? "…" : "") + text.slice(start, i + w.length + 80) + (i + w.length + 80 < text.length ? "…" : "");
        const j = snippet.toLowerCase().indexOf(w);
        return (
          <>
            {snippet.slice(0, j)}
            <mark className="bg-[#ffe58a] text-ivory">{snippet.slice(j, j + w.length)}</mark>
            {snippet.slice(j + w.length)}
          </>
        );
      }
    }
    return text.slice(0, 120);
  };

  return (
    <Modal title={t.search} onClose={onClose} wide>
      <div className="border-b border-line p-3">
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(a + 1, results.length - 1)));
            if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(a - 1, 0)));
            if (e.key === "Enter" && results[active]) onPick(results[active].leaf);
          }}
          placeholder={t.searchHint}
          className="w-full rounded-[2px] border border-line bg-charcoal px-3 py-2.5 text-[16px] outline-none focus:border-teal"
        />
      </div>
      {q && !results.length && <p className="p-4 text-[14px] text-warm-gray">{t.searchEmpty}</p>}
      <ul>
        {results.map((r, i) => (
          <li key={`${r.leaf.sectionId}:${r.leaf.path.join(".")}`}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => onPick(r.leaf)}
              className={`block w-full border-b border-line px-4 py-2.5 text-left ${i === active ? "bg-teal/10" : ""}`}
            >
              <span className="block text-[14px] leading-snug">{mark(r.text)}</span>
              <span className="mt-0.5 block text-[12px] text-warm-gray">
                {r.leaf.trail.map(trTrail).join(" › ")}
                {pageFor(r.leaf) && <span className="ml-2 font-mono">· {pageFor(r.leaf)}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

// ── Page picker ───────────────────────────────────────────────────────────

export function PagePicker({
  pages,
  current,
  onClose,
  onPick,
}: {
  pages: PageRef[];
  current: string;
  onClose: () => void;
  onPick: (path: string) => void;
}) {
  const { t } = useLang();
  const [q, setQ] = useState("");
  const list = pages.filter((p) => `${p.label} ${p.path}`.toLowerCase().includes(q.toLowerCase()));
  const groups = [...new Set(list.map((p) => p.group))];
  return (
    <Modal title={t.pages} onClose={onClose}>
      <div className="border-b border-line p-3">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && list[0] && onPick(list[0].path)}
          placeholder={t.findPage}
          className="w-full rounded-[2px] border border-line bg-charcoal px-3 py-2.5 text-[16px] outline-none focus:border-teal"
        />
      </div>
      {groups.map((g) => (
        <div key={g}>
          <p className="bg-charcoal-soft px-4 py-1.5 text-[12px] font-medium uppercase tracking-wide text-warm-gray">{g}</p>
          <ul>
            {list
              .filter((p) => p.group === g)
              .map((p) => (
                <li key={p.path}>
                  <button
                    type="button"
                    onClick={() => onPick(p.path)}
                    className={`flex w-full items-baseline justify-between gap-3 px-4 py-2 text-left text-[14px] hover:bg-teal/10 ${p.path === current ? "font-semibold text-teal" : ""}`}
                  >
                    <span>{p.label}</span>
                    <span className="truncate font-mono text-[11px] text-warm-gray">{p.path}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </Modal>
  );
}

// ── Review and publish ────────────────────────────────────────────────────

function show(v: unknown, t: ReturnType<typeof useLang>["t"]): React.ReactNode {
  if (v === undefined || v === null || v === "") return <span className="italic text-warm-gray">{t.empty}</span>;
  if (typeof v === "string") return v.length > 400 ? `${v.slice(0, 400)}…` : v;
  if (Array.isArray(v)) return <span className="italic text-warm-gray">{t.listChanged}</span>;
  if (typeof v === "object") return <span className="italic text-warm-gray">{t.listChanged}</span>;
  return String(v);
}

function ChangeRow({
  section,
  value,
  change,
  onUndo,
}: {
  section: SectionDef;
  value: unknown;
  change: Change;
  onUndo?: () => void;
}) {
  const { t, field: tr, trail: trTrail } = useLang();
  const isPhoto = fieldsAlong(section, change.path).at(-1)?.kind === "image";
  const thumb = (v: unknown) =>
    isPhoto && typeof v === "string" && v ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photoPreviewUrl(v) ?? v} alt="" className="h-12 w-20 rounded-[2px] object-cover" />
    ) : (
      show(v, t)
    );
  return (
    <li className="border-b border-line py-2.5 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] text-warm-gray">{trailOf(section, value, change.path).slice(1).map(trTrail).join(" › ")}</p>
        {onUndo && (
          <button type="button" onClick={onUndo} className="flex-none text-[12px] text-teal hover:underline">
            {t.undoChange}
          </button>
        )}
      </div>
      <div className="mt-1 grid gap-1 text-[14px] leading-snug sm:grid-cols-2 sm:gap-3">
        <p className="rounded-[2px] bg-coral/5 px-2 py-1 line-through decoration-coral/40">{thumb(change.before)}</p>
        <p className="rounded-[2px] bg-teal/10 px-2 py-1">{thumb(change.after)}</p>
      </div>
    </li>
  );
}

function validate(section: SectionDef, value: unknown): string[] {
  if (section.kind === "single") {
    const v = validateBySchema(section.schema, value);
    return v.ok ? [] : v.errors;
  }
  return (Array.isArray(value) ? value : []).flatMap((it: Record<string, unknown>) => {
    const v = validateBySchema(section.schema, it);
    return v.ok ? [] : v.errors.map((e) => `${String(it[section.titleKey] ?? it.slug)}: ${e}`);
  });
}

export function ReviewDialog({
  sections,
  changedIds,
  base,
  draft,
  connected,
  onClose,
  onUndoChange,
  onDiscardAll,
  onPublished,
  onConflict,
}: {
  sections: SectionDef[];
  changedIds: string[];
  base: Base;
  draft: Draft;
  connected: boolean;
  onClose: () => void;
  onUndoChange: (sectionId: string, path: Path, before: unknown) => void;
  onDiscardAll: () => void;
  onPublished: (commit: string, ids: string[], sent: Draft) => void;
  onConflict: (ids: string[], message: string) => void;
}) {
  const { t, lang, field: tr, trail: trTrail } = useLang();
  const [ack, setAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const byId = new Map(sections.map((s) => [s.id, s]));

  const rows = changedIds.map((id) => ({ section: byId.get(id)!, changes: diff(base[id].value, draft[id]) }));
  const errors = changedIds.flatMap((id) => validate(byId.get(id)!, draft[id]).map((e) => `${tr(byId.get(id)!.label)}: ${e}`));
  const findings: Finding[] = rows.flatMap((r) => legalFindings(r.changes.map((c) => c.after).filter((x) => typeof x === "string")));

  const publish = async () => {
    setBusy(true);
    setServerErrors([]);
    const sent = Object.fromEntries(changedIds.map((id) => [id, draft[id]]));
    const res: PublishResult = await publishChanges(
      changedIds.map((id) => ({ sectionId: id, sha: base[id].sha, value: draft[id] })),
      ack,
    ).catch((): PublishResult => ({ ok: false, message: "Could not reach the server. Check the connection and try again." }));
    setBusy(false);
    if (res.ok) return onPublished(res.commit, changedIds, sent);
    if (res.conflict?.length) return onConflict(res.conflict, t.conflictMerged);
    const msgs = [
      ...(res.errors ?? []).flatMap((e) => e.messages.map((m) => `${tr(byId.get(e.sectionId)?.label ?? e.sectionId)}: ${m}`)),
      ...(res.message ? [res.message] : []),
    ];
    if (res.legal?.length && !msgs.length) msgs.push(t.legalAck);
    setServerErrors(msgs);
  };

  const blocked = busy || !connected || errors.length > 0 || (findings.length > 0 && !ack);

  return (
    <Modal title={t.reviewTitle} onClose={onClose} wide>
      <div className="space-y-5 p-4">
        <p className="text-[14px] text-warm-gray">{t.reviewIntro}</p>
        {rows.map((r) => (
          <section key={r.section.id}>
            <h3 className="text-[14px] font-semibold">{tr(r.section.label)}</h3>
            <ul>
              {r.changes.map((c) => (
                <ChangeRow
                  key={c.path.join(".")}
                  section={r.section}
                  value={draft[r.section.id]}
                  change={c}
                  onUndo={() => onUndoChange(r.section.id, c.path, c.before)}
                />
              ))}
            </ul>
          </section>
        ))}
        {errors.length > 0 && (
          <div role="alert" className="rounded-[2px] border border-coral/40 bg-coral/5 p-3 text-[14px]">
            <p className="font-semibold text-coral-deep">{t.errorsTitle}</p>
            <ul className="mt-1 list-disc pl-5">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}
        {findings.length > 0 && (
          <div role="alert" className="rounded-[2px] border border-coral/50 bg-coral/5 p-3 text-[14px]">
            <p className="font-semibold text-coral-deep">{t.legalTitle}</p>
            <ul className="mt-2 space-y-2">
              {findings.map((f) => (
                <li key={f.rule + f.excerpt}>
                  <span className="block italic">“{f.excerpt}”</span>
                  <span className="block text-[13px] text-warm-gray">{lang === "ru" ? RULES_RU[f.rule] ?? f.rule : f.rule}</span>
                </li>
              ))}
            </ul>
            <label className="mt-3 flex items-center gap-2 text-[13px] font-medium">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
              {t.legalAck}
            </label>
          </div>
        )}
        {serverErrors.length > 0 && (
          <div role="alert" className="rounded-[2px] border border-coral/40 bg-coral/5 p-3 text-[14px]">
            {serverErrors.map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        )}
      </div>
      <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-line bg-charcoal px-4 py-3">
        <button
          type="button"
          className="text-[13px] text-coral-deep hover:underline"
          onClick={() => confirm(t.discardConfirm) && onDiscardAll()}
        >
          {t.discardAll}
        </button>
        <button
          type="button"
          onClick={publish}
          disabled={blocked}
          className="rounded-[2px] bg-brand px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-brand-2 disabled:opacity-50"
        >
          {busy ? t.publishing : t.publish}
        </button>
      </div>
    </Modal>
  );
}

// ── History ───────────────────────────────────────────────────────────────

function ago(iso: string, t: ReturnType<typeof useLang>["t"], lang: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 90) return t.justNow;
  if (s < 3600) return `${Math.round(s / 60)} ${t.minAgo}`;
  if (s < 86400) return `${Math.round(s / 3600)} ${t.hAgo}`;
  return new Date(iso).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function HistoryDialog({
  sections,
  onClose,
  onUndone,
}: {
  sections: SectionDef[];
  onClose: () => void;
  onUndone: (commit: string) => void;
}) {
  const { t, lang, field: tr, trail: trTrail } = useLang();
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, CommitChanges | { error: string }>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const byId = new Map(sections.map((s) => [s.id, s]));
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    loadHistory().then((r) => ("error" in r ? setError(r.error) : setItems(r.items)));
  }, []);

  const expand = async (sha: string) => {
    setOpen(open === sha ? null : sha);
    if (!detail[sha]) {
      const d = await loadCommitChanges(sha);
      setDetail((x) => ({ ...x, [sha]: d }));
    }
  };

  const undo = async (sha: string) => {
    if (!confirm(t.undoConfirm)) return;
    setBusy(sha);
    const r = await undoCommit(sha);
    setBusy(null);
    if (r.ok) {
      if (r.skipped) alert(`${t.undone}. ${r.skipped} ${t.skipped}.`);
      onUndone(r.commit);
    } else alert(r.message);
  };

  return (
    <Modal title={t.historyTitle} onClose={onClose} wide>
      {error && <p className="p-4 text-[14px] text-coral-deep">{error}</p>}
      {!items && !error && <p className="p-4 text-[14px] text-warm-gray">{t.loading}</p>}
      {items && !items.length && <p className="p-4 text-[14px] text-warm-gray">{t.historyEmpty}</p>}
      <ul>
        {items?.map((h) => {
          const d = detail[h.sha];
          return (
            <li key={h.sha} className="border-b border-line px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] leading-snug">{h.summary}</p>
                  <p className="mt-0.5 text-[12px] text-warm-gray">
                    {ago(h.date, t, lang)} · {h.admin ? h.author : t.developer}
                  </p>
                </div>
                <div className="flex flex-none gap-3 text-[13px]">
                  <button type="button" className="text-teal hover:underline" onClick={() => expand(h.sha)}>
                    {t.showChanges}
                  </button>
                  <button
                    type="button"
                    className="text-coral-deep hover:underline disabled:opacity-40"
                    disabled={busy !== null}
                    onClick={() => undo(h.sha)}
                  >
                    {busy === h.sha ? t.loading : t.undoPublished}
                  </button>
                </div>
              </div>
              {open === h.sha && (
                <div className="mt-2">
                  {!d && <p className="text-[13px] text-warm-gray">{t.loading}</p>}
                  {d && "error" in d && <p className="text-[13px] text-coral-deep">{d.error}</p>}
                  {d && !("error" in d) &&
                    d.map((f) => {
                      const s = f.sectionId ? byId.get(f.sectionId) : null;
                      return (
                        <div key={f.file} className="mt-2">
                          <p className="text-[13px] font-semibold">{s ? tr(s.label) : f.file}</p>
                          {s ? (
                            <ul>
                              {f.changes.slice(0, 60).map((c) => (
                                <ChangeRow key={c.path.join(".")} section={s} value={undefined} change={c} />
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[12px] text-warm-gray">{f.changes.length}</p>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
