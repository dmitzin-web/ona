"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deepEqual, diff, getAt, pathKey, rebase, setAt, type Path } from "@/lib/admin/json-path";
import { loadSections } from "@/app/admin/editor-actions";
import { signOutOfAdmin } from "@/app/admin/actions";
import {
  bindDocument,
  bindingsForLeaf,
  buildIndex,
  EDIT_CSS,
  leafKey,
  renderDraft,
  textNodeAt,
  type Binding,
  type Index,
} from "./binder";
import { companyValues, type Leaf } from "./model";
import { LangProvider, useLang } from "./i18n";
import { Panel } from "./Panel";
import { HistoryDialog, PagePicker, ReviewDialog, SearchDialog } from "./Dialogs";
import { DeployTracker } from "./Deploy";
import { ADMIN_FLAG } from "../EditThisPage";
import type { Base, Draft, EditorProps, Selection } from "./types";

// The visual editor: the real site in a frame, every piece of copy on it
// clickable and editable in place, a panel with the rest of the block
// (lists, photos, text that isn't visible), and one Publish button for
// everything. See binder.ts for how page text is tied to content fields.
//
// Drafts live in this browser (localStorage) until published, so a closed
// tab or a crash loses nothing. Publishing is one commit for all changed
// files, followed live until the new version is on the site.

const DRAFT_KEY = "ona-admin-draft-v1";
const ONBOARD_KEY = "ona-admin-onboarded";
const DEVICES = { desktop: "100%", tablet: "820px", phone: "390px" } as const;
type Device = keyof typeof DEVICES;
type Stored = { savedAt: number; sections: Record<string, { sha: string | null; base: unknown; value: unknown }> };

export function VisualEditor(props: EditorProps) {
  return (
    <LangProvider fieldsRu={props.fieldsRu}>
      <Editor {...props} />
    </LangProvider>
  );
}

function Editor(props: EditorProps) {
  const { sections, deployed, siteUrl } = props;
  const { t, lang, setLang } = useLang();
  const byId = useMemo(() => new Map(sections.map((s) => [s.id, s])), [sections]);

  // ── Content state ────────────────────────────────────────────────────
  const [base, setBase] = useState<Base>(props.latest);
  const [draft, setDraftState] = useState<Draft>(() =>
    Object.fromEntries(Object.entries(props.latest).map(([id, v]) => [id, v.value])),
  );
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const history = useRef<{ past: Draft[]; future: Draft[]; key: string; at: number }>({ past: [], future: [], key: "", at: 0 });

  const setDraft = useCallback((next: Draft, key: string) => {
    const h = history.current;
    const now = Date.now();
    if (key !== h.key || now - h.at > 1200) {
      h.past.push(draftRef.current);
      if (h.past.length > 200) h.past.shift();
    }
    h.future = [];
    h.key = key;
    h.at = now;
    draftRef.current = next;
    setDraftState(next);
  }, []);

  const setLeaf = useCallback(
    (sectionId: string, path: Path, value: unknown) => {
      const d = draftRef.current;
      setDraft({ ...d, [sectionId]: setAt(d[sectionId], path, value) }, `${sectionId}:${pathKey(path)}`);
    },
    [setDraft],
  );

  const undo = useCallback(() => {
    const h = history.current;
    const prev = h.past.pop();
    if (!prev) return;
    h.future.push(draftRef.current);
    h.key = "";
    draftRef.current = prev;
    setDraftState(prev);
  }, []);
  const redo = useCallback(() => {
    const h = history.current;
    const next = h.future.pop();
    if (!next) return;
    h.past.push(draftRef.current);
    h.key = "";
    draftRef.current = next;
    setDraftState(next);
  }, []);

  const changedIds = useMemo(
    () => sections.filter((s) => base[s.id] && !deepEqual(draft[s.id], base[s.id].value)).map((s) => s.id),
    [sections, base, draft],
  );
  const changeCount = useMemo(
    () => changedIds.reduce((n, id) => n + diff(base[id].value, draft[id]).length, 0),
    [changedIds, base, draft],
  );

  const company = useMemo(() => companyValues((draft.site ?? {}) as Record<string, unknown>, siteUrl), [draft.site, siteUrl]);
  const index: Index = useMemo(() => {
    // Match against the version the page was built with AND the latest one
    // (a publish may be live already while this admin page is older).
    const merged = buildIndex(sections, deployed, companyValues((deployed.site ?? {}) as Record<string, unknown>, siteUrl));
    const latest = buildIndex(
      sections,
      Object.fromEntries(Object.entries(props.latest).map(([id, v]) => [id, v.value])),
      companyValues((props.latest.site?.value ?? {}) as Record<string, unknown>, siteUrl),
    );
    for (const [text, ls] of latest.exact) {
      const cur = merged.exact.get(text) ?? [];
      const keys = new Set(cur.map(leafKey));
      merged.exact.set(text, [...cur, ...ls.filter((l) => !keys.has(leafKey(l)))]);
    }
    const pk = new Set(merged.patterns.map((p) => leafKey(p.leaf) + p.re.source));
    merged.patterns.push(...latest.patterns.filter((p) => !pk.has(leafKey(p.leaf) + p.re.source)));
    return merged;
  }, [sections, deployed, props.latest, siteUrl]);

  // ── Drafts survive reloads ───────────────────────────────────────────
  const [restore, setRestore] = useState<Stored | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null") as Stored | null;
      if (s && Object.keys(s.sections).length) setRestore(s);
    } catch {}
    try {
      // Plausible ignores this browser — the admin's own visits (and the
      // preview frame's) are not site traffic.
      localStorage.setItem("plausible_ignore", "true");
      // …and the site shows this browser an "Edit this page" button.
      localStorage.setItem(ADMIN_FLAG, "1");
    } catch {}
  }, []);
  const restoredOrDiscarded = useRef(false);
  useEffect(() => {
    if (restore && !restoredOrDiscarded.current) return; // don't overwrite before the user chooses
    const id = setTimeout(() => {
      try {
        if (!changedIds.length) localStorage.removeItem(DRAFT_KEY);
        else {
          const out: Stored = { savedAt: Date.now(), sections: {} };
          for (const cid of changedIds) out.sections[cid] = { sha: base[cid].sha, base: base[cid].value, value: draft[cid] };
          localStorage.setItem(DRAFT_KEY, JSON.stringify(out));
        }
      } catch {}
    }, 400);
    return () => clearTimeout(id);
  }, [draft, base, changedIds, restore]);

  function applyRestore(s: Stored) {
    let next = { ...draftRef.current };
    let lost = 0;
    for (const [id, v] of Object.entries(s.sections)) {
      if (!base[id]) continue;
      if (v.sha === base[id].sha) next[id] = v.value;
      else {
        const r = rebase(v.base, v.value, base[id].value);
        next[id] = r.value;
        lost += r.conflicts.length;
      }
    }
    restoredOrDiscarded.current = true;
    setRestore(null);
    setDraft(next, "restore");
    if (lost) setNotice(`${t.conflictKept} ${lost}`);
  }

  // ── The frame ────────────────────────────────────────────────────────
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState(props.initialPath);
  const [path, setPath] = useState(props.initialPath);
  const [device, setDevice] = useState<Device>("desktop");
  const [mode, setMode] = useState<"edit" | "browse">("edit");
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const [loading, setLoading] = useState(true);
  const bindingsRef = useRef<Binding[]>([]);
  const [bindVersion, setBindVersion] = useState(0);
  const editing = useRef<{ el: HTMLElement; b: Binding; initial: string } | null>(null);
  const observer = useRef<MutationObserver | null>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const selectionRef = useRef(selection);
  selectionRef.current = selection;
  const pendingReveal = useRef<Leaf | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [dialog, setDialog] = useState<"search" | "review" | "history" | "pages" | null>(null);
  const dialogRef = useRef(dialog);
  dialogRef.current = dialog;
  const [deploy, setDeploy] = useState<{ commit: string; at: number } | null>(null);
  const [onboard, setOnboard] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARD_KEY)) setOnboard(true);
    } catch {}
  }, []);

  const doc = () => frameRef.current?.contentDocument ?? null;

  const rawOf = useCallback((leaf: Leaf) => getAt(draftRef.current[leaf.sectionId], leaf.path), []);

  const paint = useCallback(() => {
    const d = doc();
    if (!d) return;
    renderDraft(d, bindingsRef.current, rawOf, companyValues((draftRef.current.site ?? {}) as Record<string, unknown>, siteUrl), index.siteName, editing.current?.el ?? null);
    observer.current?.takeRecords();
  }, [rawOf, siteUrl, index.siteName]);

  const markSelection = useCallback(() => {
    const d = doc();
    if (!d) return;
    d.querySelectorAll("[data-ona-sel]").forEach((e) => e.removeAttribute("data-ona-sel"));
    const sel = selectionRef.current;
    if (!sel) return;
    for (const b of bindingsForLeaf(bindingsRef.current, sel.sectionId, sel.path)) {
      if (b.kind === "text" || b.kind === "attr" || b.kind === "photo") b.el.setAttribute("data-ona-sel", "");
    }
    observer.current?.takeRecords();
  }, []);

  const rebind = useCallback(() => {
    const d = doc();
    if (!d?.body) return;
    // Put the page back as it was built before matching, then repaint.
    for (const b of bindingsRef.current) {
      if (b.kind === "text" && b.node && b.node.data !== b.original) b.node.data = b.original;
      if (b.kind === "attr" && b.attr) b.el.setAttribute(b.attr, b.original);
    }
    d.querySelectorAll("[data-ona-b]").forEach((e) => e.removeAttribute("data-ona-b"));
    bindingsRef.current = bindDocument(d, index);
    paint();
    markSelection();
    setBindVersion((v) => v + 1);
  }, [index, paint, markSelection]);

  // Repaint whenever the draft changes.
  useEffect(() => {
    paint();
  }, [draft, paint]);
  useEffect(() => {
    markSelection();
  }, [selection, markSelection, bindVersion]);

  const reveal = useCallback((leaf: { sectionId: string; path: Path }) => {
    const b = bindingsForLeaf(bindingsRef.current, leaf.sectionId, leaf.path).find((x) => x.kind !== "title" && x.kind !== "description");
    // "auto", not "smooth": the site sets scroll-behavior: smooth, and a long
    // smooth scroll inside the frame can be interrupted half-way.
    b?.el.scrollIntoView({ block: "center", behavior: "auto" });
    return !!b;
  }, []);

  const select = useCallback((sel: Selection) => {
    setSelection(sel);
    if (sel) setPanelOpen(true);
  }, []);

  // ── Editing in place ─────────────────────────────────────────────────
  const finishInline = useCallback(
    (cancel = false) => {
      const cur = editing.current;
      if (!cur) return;
      editing.current = null;
      const { el, b, initial } = cur;
      const typed = (el.textContent ?? "").replace(/\s+/g, " ").trim();
      el.removeAttribute("contenteditable");
      const value = cancel ? initial : typed;
      // Typing can replace the text node; give the binding a fresh one.
      el.textContent = value;
      const tn = el.firstChild as Text;
      for (const x of bindingsRef.current) if (x.node === b.node || x.el === el) x.node = tn;
      b.node = tn;
      setLeaf(b.leaf.sectionId, b.leaf.path, value);
      requestAnimationFrame(paint);
    },
    [setLeaf, paint],
  );

  const startInline = useCallback(
    (b: Binding, x: number, y: number) => {
      const d = doc();
      if (!d || !b.node || !b.node.parentElement) return;
      const node = b.node;
      // Where the click landed in the text, before anything moves.
      const hit = (d as Document & { caretRangeFromPoint?: (x: number, y: number) => Range | null }).caretRangeFromPoint?.(x, y);
      const offset = hit && hit.startContainer === node ? hit.startOffset : null;
      const parent = node.parentElement!;
      const meaningful = [...parent.childNodes].filter((n) => !(n.nodeType === 8 || (n.nodeType === 3 && !(n as Text).data.trim())));
      let el: HTMLElement;
      if (meaningful.length === 1 && meaningful[0] === node && !parent.matches("a,button,summary,label")) el = parent;
      else {
        const span = d.createElement("span");
        span.setAttribute("data-ona-wrap", "");
        parent.insertBefore(span, node);
        span.appendChild(node);
        el = span;
      }
      const raw = String(rawOf(b.leaf) ?? "");
      const lead = node.data.length - node.data.trimStart().length;
      if (node.data !== raw) node.data = raw;
      el.setAttribute("contenteditable", "plaintext-only");
      if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true");
      editing.current = { el, b, initial: raw };
      observer.current?.takeRecords();
      el.focus();
      const sel = d.getSelection();
      if (sel) {
        const r = d.createRange();
        const at = offset === null ? raw.length : Math.max(0, Math.min(raw.length, offset - lead));
        r.setStart(node, at);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      }
      const onInput = () => {
        const v = (el.textContent ?? "").replace(/\s+/g, " ");
        setLeaf(b.leaf.sectionId, b.leaf.path, v.trim());
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          el.blur();
        } else if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          cleanup();
          finishInline(true);
        }
      };
      const onBlur = () => {
        cleanup();
        finishInline(false);
      };
      const cleanup = () => {
        el.removeEventListener("input", onInput);
        el.removeEventListener("keydown", onKey);
        el.removeEventListener("blur", onBlur);
      };
      el.addEventListener("input", onInput);
      el.addEventListener("keydown", onKey);
      el.addEventListener("blur", onBlur);
    },
    [rawOf, setLeaf, finishInline],
  );

  const canInline = (b: Binding) => {
    if (b.kind !== "text" || !b.node) return false;
    const raw = rawOf(b.leaf);
    return typeof raw === "string" && !/\{\w+\}/.test(raw) && Object.keys(b.vars).length === 0;
  };

  // ── Wiring the frame on every load ───────────────────────────────────
  const wired = useRef<Document | null>(null);
  const onFrameLoad = useCallback(() => {
    const d = doc();
    const w = frameRef.current?.contentWindow;
    if (!d || !w || !d.body || w.location.href === "about:blank") return;
    // The frame can finish loading before this page hydrates (its load
    // event is then missed) — wire each document exactly once.
    if (wired.current === d) return;
    wired.current = d;
    editing.current = null;
    bindingsRef.current = [];
    const tag = d.createElement("div");
    tag.id = "ona-tag";
    tag.setAttribute("data-ona-ui", "");
    // Everything that changes the page's DOM waits for hydration (below).
    const decorate = () => {
      const style = d.createElement("style");
      style.setAttribute("data-ona-ui", "");
      style.textContent = EDIT_CSS;
      d.head.appendChild(style);
      d.body.appendChild(tag);
      d.documentElement.toggleAttribute("data-ona-edit-on", modeRef.current === "edit");
      // Open the page's collapsed content (FAQ answers, the footer's city
      // list) so its text can be clicked — but never the header's menu
      // drawer, which would cover the page.
      if (modeRef.current === "edit")
        d.querySelectorAll("main details, footer details").forEach((x) => ((x as HTMLDetailsElement).open = true));
    };

    const current = w.location.pathname + w.location.search;
    setPath(w.location.pathname);
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("page", current);
      window.history.replaceState(null, "", u);
    } catch {}

    const observe = () => {
      // Client-side navigation (links in Browse mode) and components that
      // render later (menus, drawers) change the page without a load event.
      let timer: ReturnType<typeof setTimeout> | undefined;
      let lastPath = w.location.pathname;
      observer.current?.disconnect();
      observer.current = new MutationObserver(() => {
        if (editing.current) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (w.location.pathname !== lastPath) {
            lastPath = w.location.pathname;
            setPath(lastPath);
            setSelection(null);
            bindingsRef.current = [];
          }
          rebind();
        }, 350);
      });
      observer.current.observe(d.body, { childList: true, subtree: true, characterData: true });
    };

    // Bind only after React has hydrated the page: marking the DOM earlier
    // makes hydration throw it away (and our text nodes with it).
    const hydrated = () => {
      const probe = d.querySelector("footer") ?? d.querySelector("main") ?? d.body.firstElementChild;
      return !!probe && Object.keys(probe).some((k) => k.startsWith("__reactFiber$"));
    };
    const t0 = Date.now();
    const firstBind = () => {
      if (wired.current !== d) return;
      if (!hydrated() && Date.now() - t0 < 4000) return void setTimeout(firstBind, 100);
      setTimeout(() => {
        decorate();
        rebind();
        observe();
        setLoading(false);
        if (pendingReveal.current) {
          const leaf = pendingReveal.current;
          pendingReveal.current = null;
          setTimeout(() => reveal(leaf), 50);
        }
      }, 150);
    };
    firstBind();


    const bindingAt = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest?.("[data-ona-b]");
      if (!el) return null;
      const node = textNodeAt(d, e.clientX, e.clientY);
      const bs = bindingsRef.current;
      return (
        bs.find((b) => b.node && b.node === node) ??
        bs.find((b) => b.el === el && b.kind === "text") ??
        bs.find((b) => b.el === el) ??
        null
      );
    };

    d.addEventListener(
      "click",
      (e) => {
        if (modeRef.current !== "edit" || e.altKey) return;
        const target = e.target as Element;
        if (editing.current?.el.contains(target)) {
          if (target.closest("a,button,summary,label")) e.preventDefault();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const b = bindingAt(e);
        if (!b) {
          setSelection(null);
          return;
        }
        select({ sectionId: b.leaf.sectionId, path: b.leaf.path });
        if (canInline(b)) startInline(b, e.clientX, e.clientY);
      },
      true,
    );
    // Forms on the page must not submit, menus must not steal focus.
    d.addEventListener("submit", (e) => modeRef.current === "edit" && e.preventDefault(), true);
    d.addEventListener(
      "mouseover",
      (e) => {
        if (modeRef.current !== "edit") return;
        const b = bindingAt(e);
        if (!b) return void (tag.style.display = "none");
        const r = b.el.getBoundingClientRect();
        tag.textContent = b.trail;
        tag.style.display = "block";
        tag.style.left = `${Math.max(4, r.left)}px`;
        tag.style.top = `${r.top > 26 ? r.top - 22 : r.bottom + 4}px`;
      },
      true,
    );
    d.addEventListener("scroll", () => (tag.style.display = "none"), true);
    d.addEventListener("keydown", (e) => keysRef.current(e), true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rebind, reveal, select, startInline]);

  useEffect(() => {
    if (frameRef.current?.contentDocument?.readyState === "complete") onFrameLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mode switch: re-style the frame.
  useEffect(() => {
    const d = doc();
    if (!d) return;
    if (mode === "browse") finishInline(false);
    d.documentElement.toggleAttribute("data-ona-edit-on", mode === "edit");
    observer.current?.takeRecords();
  }, [mode, finishInline]);

  const navigate = useCallback((p: string) => {
    finishInline(false);
    setSelection(null);
    setLoading(true);
    bindingsRef.current = [];
    setSrc(p);
    const w = frameRef.current?.contentWindow;
    if (w && frameRef.current?.getAttribute("src") === p) w.location.reload();
  }, [finishInline]);

  // Where a field can be seen: the section's preview page.
  const pageFor = useCallback(
    (leaf: { sectionId: string; path: Path }) => {
      const s = byId.get(leaf.sectionId);
      let p = props.previewPaths[leaf.sectionId];
      if (!s || !p) return null;
      if (s.kind === "collection") {
        const item = (draftRef.current[s.id] as Record<string, unknown>[] | undefined)?.[leaf.path[0] as number];
        p = p.replace("{slug}", String(item?.slug ?? ""));
      }
      return p.replace("{firstPost}", props.posts[0]?.slug ?? "");
    },
    [byId, props.previewPaths, props.posts],
  );

  const goToLeaf = useCallback(
    (leaf: Leaf) => {
      setDialog(null);
      select({ sectionId: leaf.sectionId, path: leaf.path });
      const onPage = bindingsForLeaf(bindingsRef.current, leaf.sectionId, leaf.path).length > 0;
      if (onPage) return void reveal(leaf);
      const p = pageFor(leaf);
      if (p && p !== path) {
        pendingReveal.current = leaf;
        navigate(p);
        setTimeout(() => select({ sectionId: leaf.sectionId, path: leaf.path }), 0);
      }
    },
    [select, reveal, pageFor, path, navigate],
  );

  // ── Keyboard ─────────────────────────────────────────────────────────
  const handleKeys = (e: KeyboardEvent) => {
    const mod = e.metaKey || e.ctrlKey;
    const inField = (e.target as HTMLElement | null)?.closest?.("input,textarea,select,[contenteditable]");
    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setDialog("search");
    } else if (mod && e.key.toLowerCase() === "z" && !inField) {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    } else if (mod && e.key.toLowerCase() === "y" && !inField) {
      e.preventDefault();
      redo();
    } else if (e.key === "Escape") {
      // Keys typed inside the frame never reach the dialogs' own listeners.
      if (dialogRef.current) setDialog(null);
      else if (!inField) setSelection(null);
    }
  };
  const keysRef = useRef(handleKeys);
  keysRef.current = handleKeys;
  useEffect(() => {
    const h = (e: KeyboardEvent) => keysRef.current(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // Leaving with unpublished changes: they are kept in the browser anyway,
  // but say so.
  useEffect(() => {
    if (!changedIds.length) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [changedIds.length]);

  // ── After publishing ─────────────────────────────────────────────────
  const afterPublish = useCallback(
    async (commit: string, ids: string[], sent: Draft) => {
      setDialog(null);
      setDeploy({ commit, at: Date.now() });
      const fresh = await loadSections(ids);
      setBase((b) => ({ ...b, ...Object.fromEntries(fresh.map((f) => [f.id, { sha: f.sha, value: f.value }])) }));
      const cur = draftRef.current;
      const next = { ...cur };
      for (const f of fresh) next[f.id] = deepEqual(cur[f.id], sent[f.id]) ? f.value : rebase(sent[f.id], cur[f.id], f.value).value;
      draftRef.current = next;
      setDraftState(next);
      history.current = { past: [], future: [], key: "", at: 0 };
    },
    [],
  );

  const reloadAll = useCallback(async () => {
    const fresh = await loadSections(sections.map((s) => s.id));
    const oldBase = base;
    setBase(Object.fromEntries(fresh.map((f) => [f.id, { sha: f.sha, value: f.value }])));
    const cur = draftRef.current;
    const next = { ...cur };
    for (const f of fresh) next[f.id] = rebase(oldBase[f.id]?.value, cur[f.id], f.value).value;
    draftRef.current = next;
    setDraftState(next);
  }, [sections, base]);

  const selectedSection = selection ? byId.get(selection.sectionId) ?? null : null;
  const pageLabel = props.pages.find((p) => p.path === path)?.label ?? path;

  return (
    <div className="fixed inset-0 flex flex-col bg-charcoal-soft text-ivory">
      {/* ── Toolbar ── */}
      <header className="flex h-14 flex-none items-center gap-2 border-b border-line bg-charcoal px-3 sm:gap-3">
        <span className="hidden text-[15px] font-semibold sm:inline">
          ONA <span className="font-normal text-warm-gray">· {t.editor}</span>
        </span>
        <button
          type="button"
          onClick={() => setDialog("pages")}
          className="flex min-w-0 max-w-[40vw] items-center gap-1.5 rounded-[2px] border border-line px-2.5 py-1.5 text-[14px] hover:border-teal sm:max-w-[280px]"
          title={path}
        >
          <span className="truncate">{pageLabel}</span>
          <span aria-hidden className="text-warm-gray">▾</span>
        </button>
        <div className="hidden overflow-hidden rounded-[2px] border border-line md:flex" role="group">
          {(["edit", "browse"] as const).map((m) => (
            <button
              key={m}
              type="button"
              title={m === "edit" ? t.editHelp : t.browseHelp}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-[13px] ${mode === m ? "bg-brand text-white" : "hover:bg-charcoal-soft"}`}
            >
              {m === "edit" ? t.edit : t.browse}
            </button>
          ))}
        </div>
        <div className="hidden overflow-hidden rounded-[2px] border border-line lg:flex" role="group">
          {(Object.keys(DEVICES) as Device[]).map((dv) => (
            <button
              key={dv}
              type="button"
              onClick={() => setDevice(dv)}
              title={t[dv]}
              className={`px-2.5 py-1.5 text-[13px] ${device === dv ? "bg-charcoal-mute" : "hover:bg-charcoal-soft"}`}
            >
              {dv === "desktop" ? "▭" : dv === "tablet" ? "▯" : "▮"}
              <span className="sr-only">{t[dv]}</span>
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setDialog("search")}
          className="flex items-center gap-2 rounded-[2px] border border-line px-2.5 py-1.5 text-[13px] text-warm-gray hover:border-teal"
        >
          <span aria-hidden>⌕</span>
          <span className="hidden sm:inline">{t.search}</span>
          <kbd className="hidden rounded-[2px] border border-line px-1 font-mono text-[10px] lg:inline">⌘K</kbd>
        </button>
        <button type="button" onClick={undo} disabled={!history.current.past.length} title={`${t.undo} (⌘Z)`} className="rounded-[2px] px-2 py-1.5 text-[16px] hover:bg-charcoal-soft disabled:opacity-30">
          ↶
        </button>
        <button type="button" onClick={redo} disabled={!history.current.future.length} title={`${t.redo} (⇧⌘Z)`} className="hidden rounded-[2px] px-2 py-1.5 text-[16px] hover:bg-charcoal-soft disabled:opacity-30 sm:block">
          ↷
        </button>
        <button type="button" onClick={() => setDialog("history")} className="hidden rounded-[2px] px-2.5 py-1.5 text-[13px] hover:bg-charcoal-soft md:block">
          {t.history}
        </button>
        <button
          type="button"
          onClick={() => setDialog("review")}
          disabled={!changeCount}
          className="rounded-[2px] bg-brand px-3 py-1.5 text-[14px] font-semibold text-white transition hover:bg-brand-2 disabled:bg-charcoal-mute disabled:text-warm-gray"
        >
          {t.publish}
          {changeCount > 0 && <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-[12px]">{changeCount}</span>}
        </button>
        <button type="button" onClick={() => setLang(lang === "ru" ? "en" : "ru")} className="rounded-[2px] px-2 py-1.5 font-mono text-[12px] hover:bg-charcoal-soft" title="Язык / Language">
          {lang === "ru" ? "EN" : "RU"}
        </button>
        <Menu devBypass={props.devBypass} user={props.user} onHistory={() => setDialog("history")} />
      </header>

      {!props.connected && (
        <p className="flex-none border-b border-coral/30 bg-coral/10 px-4 py-2 text-[13px]">
          {t.notConnected}
          {props.connectError && <span className="block text-warm-gray">{props.connectError}</span>}
        </p>
      )}
      {restore && (
        <div className="flex flex-none flex-wrap items-center gap-3 border-b border-teal/30 bg-teal/10 px-4 py-2 text-[13px]">
          <span>
            {t.restoreTitle} ({new Date(restore.savedAt).toLocaleString(lang === "ru" ? "ru-RU" : "en-US")})
          </span>
          <button type="button" className="font-semibold text-teal hover:underline" onClick={() => applyRestore(restore)}>
            {t.restore}
          </button>
          <button
            type="button"
            className="text-warm-gray hover:underline"
            onClick={() => {
              restoredOrDiscarded.current = true;
              setRestore(null);
              try {
                localStorage.removeItem(DRAFT_KEY);
              } catch {}
            }}
          >
            {t.discard}
          </button>
        </div>
      )}
      {notice && (
        <p className="flex flex-none items-center justify-between gap-3 border-b border-line bg-charcoal px-4 py-2 text-[13px]">
          {notice}
          <button type="button" onClick={() => setNotice(null)} className="text-warm-gray">
            ✕
          </button>
        </p>
      )}

      <div className="relative flex min-h-0 flex-1">
        {/* ── Preview ── */}
        <div className="relative flex min-w-0 flex-1 justify-center overflow-hidden bg-charcoal-mute/60">
          <iframe
            ref={frameRef}
            src={src}
            onLoad={onFrameLoad}
            title={pageLabel}
            className="h-full border-0 bg-white shadow-sm transition-[width]"
            style={{ width: DEVICES[device] }}
          />
          {loading && (
            <p className="absolute left-1/2 top-4 -translate-x-1/2 rounded-[2px] bg-charcoal px-3 py-1.5 text-[13px] shadow">{t.pageLoading}</p>
          )}
          {onboard && (
            <div className="absolute inset-x-3 top-3 z-10 mx-auto max-w-md rounded-[2px] border border-line bg-charcoal p-4 shadow-lg">
              <ol className="list-decimal space-y-1.5 pl-5 text-[14px]">
                <li>{t.onboard1}</li>
                <li>{t.onboard2}</li>
                <li>{t.onboard3}</li>
              </ol>
              <button
                type="button"
                className="mt-3 rounded-[2px] bg-brand px-4 py-1.5 text-[14px] font-semibold text-white"
                onClick={() => {
                  setOnboard(false);
                  try {
                    localStorage.setItem(ONBOARD_KEY, "1");
                  } catch {}
                }}
              >
                {t.gotIt}
              </button>
            </div>
          )}
        </div>

        {/* ── Panel ── */}
        <Panel
          open={panelOpen}
          onOpen={setPanelOpen}
          sections={sections}
          section={selectedSection}
          selection={selection}
          draft={draft}
          base={base}
          bindings={bindingsRef.current}
          bindVersion={bindVersion}
          company={company}
          path={path}
          posts={props.posts}
          onSelect={(sel) => {
            select(sel);
            if (sel) reveal(sel);
          }}
          onChangeBlock={(sectionId, prefix, value) => {
            const d = draftRef.current;
            setDraft({ ...d, [sectionId]: setAt(d[sectionId], prefix, value) }, `${sectionId}:${pathKey(prefix)}:form`);
          }}
          onNavigate={navigate}
          onGoToLeaf={goToLeaf}
        />
      </div>

      {deploy && (
        <DeployTracker
          key={deploy.commit}
          commit={deploy.commit}
          startedAt={deploy.at}
          path={path}
          onClose={() => setDeploy(null)}
          onReload={() => {
            const u = new URL(window.location.href);
            u.searchParams.set("page", path);
            window.location.href = u.toString();
          }}
        />
      )}

      {dialog === "search" && (
        <SearchDialog
          sections={sections}
          draft={draft}
          company={company}
          onClose={() => setDialog(null)}
          onPick={goToLeaf}
          pageFor={pageFor}
        />
      )}
      {dialog === "pages" && (
        <PagePicker
          pages={props.pages}
          current={path}
          onClose={() => setDialog(null)}
          onPick={(p) => {
            setDialog(null);
            navigate(p);
          }}
        />
      )}
      {dialog === "review" && (
        <ReviewDialog
          sections={sections}
          changedIds={changedIds}
          base={base}
          draft={draft}
          connected={props.connected}
          onClose={() => setDialog(null)}
          onUndoChange={(sectionId, p, before) => setLeaf(sectionId, p, before)}
          onDiscardAll={() => {
            const next = { ...draftRef.current };
            for (const id of changedIds) next[id] = base[id].value;
            setDraft(next, "discard");
            setDialog(null);
          }}
          onPublished={afterPublish}
          onConflict={async (ids, message) => {
            const fresh = await loadSections(ids);
            const cur = draftRef.current;
            const next = { ...cur };
            const kept: string[] = [];
            for (const f of fresh) {
              const r = rebase(base[f.id]?.value, cur[f.id], f.value);
              next[f.id] = r.value;
              kept.push(...r.conflicts.map((c) => `${byId.get(f.id)?.label}: ${c.path.join(" › ")}`));
            }
            setBase((b) => ({ ...b, ...Object.fromEntries(fresh.map((f) => [f.id, { sha: f.sha, value: f.value }])) }));
            draftRef.current = next;
            setDraftState(next);
            setNotice(`${message} ${kept.length ? `${t.conflictKept} ${kept.join("; ")}` : ""}`);
          }}
        />
      )}
      {dialog === "history" && (
        <HistoryDialog
          sections={sections}
          onClose={() => setDialog(null)}
          onUndone={(commit) => {
            setDialog(null);
            setDeploy({ commit, at: Date.now() });
            void reloadAll();
          }}
        />
      )}
    </div>
  );
}

function Menu({ devBypass, user, onHistory }: { devBypass: boolean; user: string; onHistory: () => void }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className="rounded-[2px] px-2 py-1.5 text-[16px] hover:bg-charcoal-soft" aria-label="Menu" aria-expanded={open}>
        ⋯
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-30 mt-1 w-64 rounded-[2px] border border-line bg-charcoal py-1 text-[14px] shadow-lg">
            <p className="px-3 py-1.5 text-[12px] text-warm-gray">{user}</p>
            <button type="button" className="block w-full px-3 py-2 text-left hover:bg-charcoal-soft md:hidden" onClick={() => (setOpen(false), onHistory())}>
              {t.history}
            </button>
            <a className="block px-3 py-2 hover:bg-charcoal-soft" href="/admin/content">
              {t.allContent}
            </a>
            <a className="block px-3 py-2 hover:bg-charcoal-soft" href="/admin/content#posts">
              {t.blog}
            </a>
            <a className="block px-3 py-2 hover:bg-charcoal-soft" href="/admin/content#gallery">
              {t.gallery}
            </a>
            <a className="block px-3 py-2 hover:bg-charcoal-soft" href="/" target="_blank" rel="noopener">
              onarestore.com ↗
            </a>
            {!devBypass && (
              <form action={signOutOfAdmin}>
                <button type="submit" className="block w-full px-3 py-2 text-left hover:bg-charcoal-soft">
                  {t.signOut}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
