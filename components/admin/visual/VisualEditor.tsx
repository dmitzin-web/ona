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
import { companyValues, emptyLike, fieldsAlong, listAncestor, type Leaf } from "./model";
import { LangProvider, useLang } from "./i18n";
import { Panel } from "./Panel";
import { HistoryDialog, PagePicker, ReviewDialog, SearchDialog } from "./Dialogs";
import { DeployTracker } from "./Deploy";
import { AskBar } from "./AskBar";
import { ContextMenu, type MenuItem } from "./ContextMenu";
import { askEditor } from "@/app/admin/ai-actions";
import { ADMIN_FLAG } from "../EditThisPage";
import { roleOfColor, themeCss, type Theme } from "@/lib/theme";
import { askPhotoField, photoPreviewUrl, PhotoLibrary } from "../ImageField";
import { SHARED as SHARED_NOTE, type Base, type Draft, type EditorProps, type Selection } from "./types";

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
    <LangProvider>
      <PhotoLibrary photos={props.photos}>
        <Editor {...props} />
      </PhotoLibrary>
    </LangProvider>
  );
}

function Editor(props: EditorProps) {
  const { sections, deployed, siteUrl } = props;
  const { t, lang, field: tr, trail: trTrail } = useLang();
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
  const [menu, setMenu] = useState<{ x: number; y: number; b: Binding | null; role?: keyof Theme | null } | null>(null);
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
  // Read inside frame listeners, which are wired once per page load.
  const hintText = useRef(t.hoverText);
  const hintPhoto = useRef(t.hoverPhoto);
  hintText.current = t.hoverText;
  hintPhoto.current = t.hoverPhoto;

  const rawOf = useCallback((leaf: Leaf) => getAt(draftRef.current[leaf.sectionId], leaf.path), []);

  const paint = useCallback(() => {
    const d = doc();
    if (!d) return;
    renderDraft(
      d,
      bindingsRef.current,
      rawOf,
      companyValues((draftRef.current.site ?? {}) as Record<string, unknown>, siteUrl),
      index.siteName,
      editing.current?.el ?? null,
      photoPreviewUrl,
    );
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

  // Colours and corner rounding: rewrite the page's own theme stylesheet,
  // so a colour change is visible everywhere on the page at once.
  useEffect(() => {
    const d = doc();
    const t = draft.theme as Theme | undefined;
    if (!d || !t) return;
    let el = d.getElementById("ona-theme");
    if (!el) {
      // The page ships without the tag while every colour is the default.
      el = d.createElement("style");
      el.id = "ona-theme";
      el.setAttribute("data-ona-ui", "");
      d.head.appendChild(el);
    }
    const css = themeCss(t);
    if (el.textContent !== css) {
      // Chromium keeps the OLD colour on elements that have a CSS
      // transition when a custom property changes, until something else
      // invalidates them. Turning transitions off for a frame makes the
      // whole page pick the new colour up at once.
      const freeze = d.createElement("style");
      freeze.setAttribute("data-ona-ui", "");
      freeze.textContent = "*{transition:none !important}";
      d.head.appendChild(freeze);
      el.textContent = css;
      d.body.getBoundingClientRect();
      requestAnimationFrame(() => freeze.remove());
    }
    observer.current?.takeRecords();
  }, [draft.theme, bindVersion]);
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
        // On a photo the photo itself is what was pointed at, not its
        // description, which shares the same element.
        (el.tagName === "IMG" ? bs.find((b) => b.el === el && b.kind === "photo") : undefined) ??
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
        // What you can do here, in two words — not the field's name.
        tag.textContent = b.kind === "photo" ? hintPhoto.current : hintText.current;
        tag.style.display = "block";
        tag.style.left = `${Math.max(4, r.left)}px`;
        tag.style.top = `${r.top > 26 ? r.top - 22 : r.bottom + 4}px`;
      },
      true,
    );
    // Right-click, or a long press on a phone: everything that can be
    // done to whatever is under the pointer.
    const openMenu = (b: Binding, clientX: number, clientY: number) => {
      const box = frameRef.current!.getBoundingClientRect();
      select({ sectionId: b.leaf.sectionId, path: b.leaf.path });
      setMenu({ x: box.left + clientX, y: box.top + clientY, b });
    };
    d.addEventListener(
      "contextmenu",
      (e) => {
        if (modeRef.current !== "edit") return;
        e.preventDefault();
        const b = bindingAt(e);
        if (b) return openMenu(b, e.clientX, e.clientY);
        // Not on any text or photo: whatever background was clicked, and
        // the things that apply to the whole page.
        const box = frameRef.current!.getBoundingClientRect();
        setSelection(null);
        setMenu({ x: box.left + e.clientX, y: box.top + e.clientY, b: null, role: backgroundRoleAt(e.target as Element) });
      },
      true,
    );
    // The colour the page actually painted here, matched to the colour
    // role it came from.
    const backgroundRoleAt = (start: Element | null): keyof Theme | null => {
      for (let el: Element | null = start; el && el !== d.documentElement; el = el.parentElement) {
        const role = roleOfColor(w.getComputedStyle(el).backgroundColor, draftRef.current.theme as Theme);
        if (role) return role;
      }
      return "ground";
    };

    let press: ReturnType<typeof setTimeout> | undefined;
    d.addEventListener(
      "touchstart",
      (e) => {
        if (modeRef.current !== "edit") return;
        const touch = e.touches[0];
        const b = bindingAt({ target: e.target, clientX: touch.clientX, clientY: touch.clientY } as unknown as MouseEvent);
        if (!b) return;
        press = setTimeout(() => openMenu(b, touch.clientX, touch.clientY), 500);
      },
      true,
    );
    for (const ev of ["touchend", "touchmove", "touchcancel"]) d.addEventListener(ev, () => clearTimeout(press), true);
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

  // Everything that can be done to one thing on the page, in plain words.
  function menuItems(b: Binding): MenuItem[] {
    const { sectionId, path } = b.leaf;
    const section = byId.get(sectionId);
    const items: MenuItem[] = [];
    if (!section) return items;
    const value = draftRef.current[sectionId];
    const field = fieldsAlong(section, path).at(-1);
    const idOf = (p: Path) => `f-${(section.kind === "collection" ? p.slice(1) : p).join("-")}`;
    void tr;

    if (b.kind === "photo") {
      items.push({ label: t.menuReplacePhoto, run: () => askPhotoField(idOf(path), "upload") });
      items.push({ label: t.menuFromLibrary, run: () => askPhotoField(idOf(path), "library") });
      const alt = [...path.slice(0, -1), "imageAlt"];
      if (typeof getAt(value, alt) === "string") {
        items.push({
          label: t.menuPhotoAlt,
          hint: t.menuPhotoAltHint,
          run: () => {
            select({ sectionId, path: alt });
            setTimeout(() => document.getElementById(idOf(alt))?.focus(), 300);
          },
        });
      }
    } else if (b.kind === "text" && canInline(b)) {
      items.push({ label: t.menuEditText, run: () => startInline(b, ...centreOf(b)) });
    } else {
      items.push({
        label: t.menuEditText,
        run: () => {
          select({ sectionId, path });
          setTimeout(() => document.getElementById(idOf(path))?.focus(), 300);
        },
      });
    }

    const list = listAncestor(section, path);
    if (list) {
      const arr = (getAt(value, list.arrayPath) as unknown[]) ?? [];
      const i = list.index;
      const setArr = (next: unknown[]) => {
        setDraft({ ...draftRef.current, [sectionId]: setAt(draftRef.current[sectionId], list.arrayPath, next) }, `list:${Date.now()}`);
        setSelection(null);
      };
      const swap = (j: number) => {
        const next = [...arr];
        [next[i], next[j]] = [next[j], next[i]];
        setArr(next);
      };
      if (i > 0) items.push({ label: t.menuMoveUp, run: () => swap(i - 1) });
      if (i < arr.length - 1) items.push({ label: t.menuMoveDown, run: () => swap(i + 1) });
      items.push({
        label: t.menuAddLike,
        hint: t.menuAfterPublish,
        run: () => setArr([...arr.slice(0, i + 1), emptyLike(list.field.fields), ...arr.slice(i + 1)]),
      });
      items.push({
        label: t.menuDelete,
        hint: t.menuAfterPublish,
        danger: true,
        run: () => confirm(t.menuDeleteConfirm) && setArr(arr.filter((_, k) => k !== i)),
      });
    }

    const href = b.el.closest?.("a[href]")?.getAttribute("href");
    const here = frameRef.current?.contentWindow?.location.pathname;
    if (href?.startsWith("/") && href !== here) items.push({ label: t.menuOpenLink, hint: href, run: () => navigate(href) });

    items.push({ label: t.menuWholeBlock, run: () => (select({ sectionId, path }), setPanelOpen(true)) });
    if (SHARED_NOTE.has(sectionId)) items[items.length - 1].hint = t.shared;
    items.push({ label: t.taskColors, run: () => select({ sectionId: "theme", path: ["ground"] }) });
    return items;
  }

  // Right-click on the background: change that background, or anything
  // that applies to the page as a whole.
  function pageMenuItems(role: keyof Theme | null): MenuItem[] {
    const items: MenuItem[] = [];
    if (role) {
      items.push({
        label: t.menuThisBackground,
        hint: t.menuThisBackgroundHint,
        run: () => select({ sectionId: "theme", path: [role] }),
      });
    }
    items.push({ label: t.taskColors, run: () => select({ sectionId: "theme", path: ["ground"] }) });
    items.push({ label: t.menuPageText, run: () => (setSelection(null), setPanelOpen(true)) });
    items.push({ label: t.searchResult, run: () => (setSelection(null), setPanelOpen(true)) });
    items.push({ label: t.pages, run: () => setDialog("pages") });
    if (history.current.past.length) items.push({ label: t.undo, run: undo });
    return items;
  }

  const centreOf = (b: Binding): [number, number] => {
    const r = b.el.getBoundingClientRect();
    return [r.left + Math.min(30, r.width / 2), r.top + r.height / 2];
  };

  const selectedSection = selection ? byId.get(selection.sectionId) ?? null : null;
  const pageLabel = tr(props.pages.find((p) => p.path === path)?.label ?? path);

  return (
    <div className="fixed inset-0 flex flex-col bg-charcoal-soft text-ivory">
      {/* ── Toolbar ──
          Three things only: which page you are on, the one button that
          puts your work on the site, and a menu for everything else.
          Everything a person does day to day happens on the page itself
          or in the line at the bottom. */}
      <header className="flex h-14 flex-none items-center gap-2 border-b border-line bg-charcoal px-3 sm:gap-3">
        <button
          type="button"
          onClick={() => setDialog("pages")}
          className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[14px] hover:border-teal sm:max-w-[320px]"
          title={path}
        >
          <span aria-hidden className="text-warm-gray">▤</span>
          <span className="truncate">{pageLabel}</span>
          <span aria-hidden className="ml-auto text-warm-gray">▾</span>
        </button>
        <button
          type="button"
          onClick={() => setDialog("search")}
          title={`${t.search} (⌘K)`}
          className="hidden rounded-full border border-line px-3 py-1.5 text-[15px] text-warm-gray hover:border-teal sm:block"
        >
          <span aria-hidden>⌕</span>
          <span className="sr-only">{t.search}</span>
        </button>
        <button
          type="button"
          onClick={undo}
          disabled={!history.current.past.length}
          title={`${t.undo} (⌘Z)`}
          className="hidden rounded-full px-3 py-1.5 text-[16px] hover:bg-charcoal-soft disabled:opacity-25 sm:block"
        >
          ↶<span className="sr-only">{t.undo}</span>
        </button>
        <button
          type="button"
          onClick={() => setDialog("review")}
          disabled={!changeCount}
          className="rounded-full bg-brand px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-brand-2 disabled:bg-charcoal-mute disabled:text-warm-gray"
        >
          {changeCount > 0 ? `${t.publish} · ${changeCount}` : t.publishNothing}
        </button>
        <Menu
          onSearch={() => setDialog("search")}
          onUndo={undo}
          canUndo={history.current.past.length > 0}
          devBypass={props.devBypass}
          user={props.user}
          mode={mode}
          setMode={setMode}
          device={device}
          setDevice={setDevice}
          onHistory={() => setDialog("history")}
        />
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
            {t.restoreTitle} ({new Date(restore.savedAt).toLocaleString("en-US")})
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

      <AskBar
        onAsk={async (request) => {
          const ids = [...new Set(bindingsRef.current.map((b) => b.leaf.sectionId))].slice(0, 6);
          if (!ids.includes("theme")) ids.push("theme");
          const values = Object.fromEntries(ids.map((id) => [id, draftRef.current[id]]));
          const r = await askEditor(request, { sectionIds: ids, page: path, values }).catch(() => null);
          if (!r) return { error: t.deployFailed };
          if (!r.ok) return { error: r.message };
          if (r.edits.length) {
            let next = { ...draftRef.current };
            for (const e of r.edits) next = { ...next, [e.sectionId]: setAt(next[e.sectionId], e.path, e.value) };
            setDraft(next, `ai:${Date.now()}`);
          }
          return r;
        }}
      />

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          title={menu.b ? menu.b.leaf.trail.slice(-2).map(trTrail).join(" › ") : t.menuPageTitle}
          items={menu.b ? menuItems(menu.b) : pageMenuItems(menu.role ?? null)}
          onClose={() => setMenu(null)}
        />
      )}

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

function Menu({
  onSearch,
  onUndo,
  canUndo,
  devBypass,
  user,
  mode,
  setMode,
  device,
  setDevice,
  onHistory,
}: {
  onSearch: () => void;
  onUndo: () => void;
  canUndo: boolean;
  devBypass: boolean;
  user: string;
  mode: "edit" | "browse";
  setMode: (m: "edit" | "browse") => void;
  device: Device;
  setDevice: (d: Device) => void;
  onHistory: () => void;
}) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const row = "block w-full px-3 py-2.5 text-left text-[14px] hover:bg-charcoal-soft";
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full px-3 py-1.5 text-[18px] hover:bg-charcoal-soft"
        aria-label={t.more}
        aria-expanded={open}
      >
        ⋯
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-30 mt-1 w-72 overflow-hidden rounded-[10px] border border-line bg-charcoal py-1 shadow-xl">
            <p className="px-3 py-1.5 text-[12px] text-warm-gray">{user}</p>
            <button type="button" className={`${row} sm:hidden`} onClick={() => (setOpen(false), onSearch())}>
              {t.search}
            </button>
            <button
              type="button"
              className={`${row} sm:hidden disabled:opacity-40`}
              disabled={!canUndo}
              onClick={() => (setOpen(false), onUndo())}
            >
              {t.undo}
            </button>
            <button type="button" className={row} onClick={() => (setOpen(false), onHistory())}>
              {t.history}
            </button>
            <button
              type="button"
              className={row}
              onClick={() => {
                setMode(mode === "edit" ? "browse" : "edit");
                setOpen(false);
              }}
            >
              {mode === "edit" ? t.tryTheSite : t.backToEditing}
            </button>
            <button
              type="button"
              className={row}
              onClick={() => {
                setDevice(device === "phone" ? "desktop" : "phone");
                setOpen(false);
              }}
            >
              {device === "phone" ? t.showOnComputer : t.showOnPhone}
            </button>
            <hr className="my-1 border-line" />
            <a className={row} href="/admin/content">
              {t.allContent}
            </a>
            <a className={row} href="/" target="_blank" rel="noopener">
              onarestore.com ↗
            </a>
            {!devBypass && (
              <form action={signOutOfAdmin}>
                <button type="submit" className={row}>
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
