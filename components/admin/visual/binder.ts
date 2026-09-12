import { getAt, isPrefix, pathKey, type Path } from "@/lib/admin/json-path";
import type { SectionDef } from "@/lib/admin/sections";
import { fillWith, leaves, matcherFor, norm, type Company, type Leaf } from "./model";

// Connects the rendered page in the preview iframe to the content: finds
// which text node, attribute or photo on the page came from which field.
//
// The page is the real, deployed site page — nothing in the site's code
// knows about the editor. Every piece of copy renders from a content field
// as its own text node (React keeps adjacent expressions in separate
// nodes), so matching node text against the field values the page was
// built with identifies almost everything exactly. Template strings
// ("Restoration in {area}") are matched as patterns. When the same text
// appears in several fields (a "Call" button in the hero and in the
// closing block), the field is chosen by its neighbours: the fields of the
// nearest enclosing element that was matched unambiguously.

export type Binding = {
  leaf: Leaf;
  kind: "text" | "attr" | "photo" | "title" | "description";
  node: Text | null;
  el: Element;
  attr?: string;
  vars: Record<string, string>;
  original: string; // what the page showed when it loaded
  lead: string; // whitespace before the text in its node, kept on edit
  tail: string; // …and after it
  trail: string;
};

export const leafKey = (l: { sectionId: string; path: Path }) => `${l.sectionId}:${pathKey(l.path)}`;

type Candidate = { leaf: Leaf; vars: Record<string, string> };

export type Index = {
  exact: Map<string, Leaf[]>;
  patterns: { leaf: Leaf; re: RegExp; vars: string[] }[];
  photos: Map<string, Leaf[]>;
  siteName: string;
};

// Built from the content THIS deployment was built with — what the
// preview shows — not from the latest (possibly still deploying) version.
export function buildIndex(sections: SectionDef[], deployed: Record<string, unknown>, company: Company): Index {
  const exact = new Map<string, Leaf[]>();
  const patterns: Index["patterns"] = [];
  const photos = new Map<string, Leaf[]>();
  for (const s of sections) {
    const value = deployed[s.id];
    if (value === undefined) continue;
    for (const leaf of leaves(s, value)) {
      const raw = getAt(value, leaf.path);
      if (typeof raw !== "string") continue;
      if (leaf.photo) {
        if (!photos.has(raw)) photos.set(raw, []);
        photos.get(raw)!.push(leaf);
        continue;
      }
      const m = matcherFor(fillWith(raw, company));
      if (!m) continue;
      if (m.kind === "exact") {
        if (!exact.has(m.text)) exact.set(m.text, []);
        exact.get(m.text)!.push(leaf);
      } else {
        patterns.push({ leaf, re: m.re, vars: m.vars });
      }
    }
  }
  return { exact, patterns, photos, siteName: company.name };
}

function candidatesFor(index: Index, text: string): Candidate[] {
  const t = norm(text);
  if (!t) return [];
  const ex = index.exact.get(t);
  if (ex) return ex.map((leaf) => ({ leaf, vars: {} }));
  const out: Candidate[] = [];
  for (const p of index.patterns) {
    const m = p.re.exec(t);
    if (m) out.push({ leaf: p.leaf, vars: Object.fromEntries(p.vars.map((v, i) => [v, m[i + 1]])) });
  }
  return out;
}

const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG", "svg"]);
const ATTRS = ["alt", "aria-label", "title", "placeholder"];
// The photo a rendered <img> comes from: next/image wraps it as
// /_next/image?url=%2Fphotos%2F… , plain <img> uses the path itself.
function photoPathOf(img: Element): string | null {
  const raw = img.getAttribute("data-ona-photo") ?? img.getAttribute("src") ?? "";
  const m = /[?&]url=([^&]+)/.exec(raw);
  const path = m ? decodeURIComponent(m[1]) : raw;
  return path.startsWith("/photos/") ? path : null;
}

type Pending = Omit<Binding, "leaf" | "vars" | "trail"> & { cands: Candidate[] };

export function bindDocument(doc: Document, index: Index): Binding[] {
  const pending: Pending[] = [];

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
    const parent = n.parentElement;
    if (!parent || parent.closest("script,style,noscript,template,[data-ona-ui]")) continue;
    if (SKIP.has(parent.tagName)) continue;
    const cands = candidatesFor(index, n.data);
    if (!cands.length) continue;
    const m = /^(\s*)[\s\S]*?(\s*)$/.exec(n.data)!;
    pending.push({ kind: "text", node: n, el: parent, original: n.data, lead: m[1], tail: m[2], cands });
  }

  doc.body.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(",")).forEach((el) => {
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (!v) continue;
      const cands = candidatesFor(index, v);
      if (cands.length) pending.push({ kind: "attr", node: null, el, attr: a, original: v, lead: "", tail: "", cands });
    }
  });

  doc.body.querySelectorAll("img").forEach((img) => {
    const path = photoPathOf(img);
    const leavesFor = path ? index.photos.get(path) : undefined;
    if (leavesFor?.length) {
      pending.push({
        kind: "photo",
        node: null,
        el: img,
        original: path!,
        lead: "",
        tail: "",
        cands: leavesFor.map((leaf) => ({ leaf, vars: {} })),
      });
    }
  });

  // Unambiguous matches first; they are the context for the rest.
  const anchors = new Map<Element, Leaf[]>();
  const addAnchor = (el: Element, leaf: Leaf) => {
    for (let a: Element | null = el; a && a !== doc.documentElement; a = a.parentElement) {
      const list = anchors.get(a);
      if (!list) anchors.set(a, [leaf]);
      else if (list.length < 24) list.push(leaf);
    }
  };
  const chosen = new Map<Pending, Candidate>();
  for (const p of pending) {
    if (p.cands.length === 1) {
      chosen.set(p, p.cands[0]);
      addAnchor(p.el, p.cands[0].leaf);
    }
  }
  for (const p of pending) {
    if (chosen.has(p)) continue;
    let pick = p.cands[0];
    for (let a: Element | null = p.el.parentElement; a; a = a.parentElement) {
      const ctx = anchors.get(a);
      if (!ctx) continue;
      let best = -1;
      for (const c of p.cands) {
        for (const l of ctx) {
          let score = c.leaf.sectionId === l.sectionId ? 1000 : 0;
          if (score) {
            const n = Math.min(c.leaf.path.length, l.path.length);
            let i = 0;
            while (i < n && c.leaf.path[i] === l.path[i]) i++;
            score += i;
          }
          if (score > best) {
            best = score;
            pick = c;
          }
        }
      }
      break;
    }
    chosen.set(p, pick);
    addAnchor(p.el, pick.leaf);
  }

  const out: Binding[] = pending.map((p) => {
    const c = chosen.get(p)!;
    return { ...p, leaf: c.leaf, vars: c.vars, trail: c.leaf.trail.slice(-2).join(" · ") };
  });

  // The page's search result: <title> and the meta description.
  const suffix = ` | ${index.siteName}`;
  const title = doc.title.endsWith(suffix) ? doc.title.slice(0, -suffix.length) : doc.title;
  const tc = candidatesFor(index, title);
  if (tc.length) {
    out.push({ kind: "title", node: null, el: doc.head, original: title, lead: "", tail: "", leaf: tc[0].leaf, vars: tc[0].vars, trail: tc[0].leaf.trail.slice(-2).join(" · ") });
  }
  const meta = doc.head.querySelector('meta[name="description"]');
  const dc = meta ? candidatesFor(index, meta.getAttribute("content") ?? "") : [];
  if (meta && dc.length) {
    out.push({ kind: "description", node: null, el: meta, original: meta.getAttribute("content") ?? "", lead: "", tail: "", leaf: dc[0].leaf, vars: dc[0].vars, trail: dc[0].leaf.trail.slice(-2).join(" · ") });
  }

  for (const b of out) if (b.kind === "text" || b.kind === "photo" || b.kind === "attr") b.el.setAttribute("data-ona-b", "");
  return out;
}

// Writes the draft into the page. `skip` is the element being typed into,
// which must not be touched (it would reset the caret).
export function renderDraft(
  doc: Document,
  bindings: Binding[],
  rawOf: (leaf: Leaf) => unknown,
  company: Company,
  siteName: string,
  skip: Element | null,
  localPhoto?: (path: string) => string | undefined,
) {
  for (const b of bindings) {
    const raw = rawOf(b.leaf);
    if (typeof raw !== "string") continue;
    if (b.kind === "photo") {
      const changedPhoto = raw !== b.original;
      if (!b.el.hasAttribute("data-ona-photo")) {
        b.el.setAttribute("data-ona-photo", b.el.getAttribute("src") ?? "");
        b.el.setAttribute("data-ona-srcset", b.el.getAttribute("srcset") ?? "");
      }
      if (changedPhoto) {
        // A photo added a minute ago is not on the site until the deploy
        // finishes, so the preview shows the copy in this browser.
        b.el.setAttribute("src", localPhoto?.(raw) ?? raw);
        b.el.removeAttribute("srcset");
      } else {
        b.el.setAttribute("src", b.el.getAttribute("data-ona-photo") ?? raw);
        const ss = b.el.getAttribute("data-ona-srcset");
        if (ss) b.el.setAttribute("srcset", ss);
      }
      b.el.toggleAttribute("data-ona-changed", changedPhoto);
      continue;
    }
    const filled = fillWith(fillWith(raw, company), b.vars);
    const changed = norm(filled) !== norm(b.original);
    if (b.kind === "text" && b.node) {
      // Never touch what is being typed into: it would reset the caret.
      if (skip && skip.contains(b.node)) continue;
      const next = changed ? `${b.lead}${filled}${b.tail}` : b.original;
      if (b.node.data !== next) b.node.data = next;
      b.el.toggleAttribute("data-ona-changed", changed);
    } else if (b.kind === "attr" && b.attr) {
      b.el.setAttribute(b.attr, changed ? filled : b.original);
    } else if (b.kind === "title") {
      doc.title = `${changed ? filled : b.original} | ${siteName}`;
    } else if (b.kind === "description") {
      b.el.setAttribute("content", changed ? filled : b.original);
    }
  }
}

export const bindingsForLeaf = (bindings: Binding[], sectionId: string, path: Path) =>
  bindings.filter((b) => b.leaf.sectionId === sectionId && pathKey(b.leaf.path) === pathKey(path));

export const bindingsInBlock = (bindings: Binding[], sectionId: string, prefix: Path) =>
  bindings.filter((b) => b.leaf.sectionId === sectionId && isPrefix(prefix, b.leaf.path));

// The text node under a point — for picking one of several fields that
// share an element ("Call " + phone number in one link).
export function textNodeAt(doc: Document, x: number, y: number): Node | null {
  const d = doc as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  if (d.caretPositionFromPoint) return d.caretPositionFromPoint(x, y)?.offsetNode ?? null;
  if (d.caretRangeFromPoint) return d.caretRangeFromPoint(x, y)?.startContainer ?? null;
  return null;
}

export const EDIT_CSS = `
[data-ona-b]{cursor:text}
[data-ona-edit-on] [data-ona-b]:hover{outline:1.5px dashed rgba(12,122,120,.85);outline-offset:3px}
[data-ona-edit-on] img[data-ona-b]{cursor:pointer}
[data-ona-edit-on] img[data-ona-b]:hover{outline:3px dashed rgba(12,122,120,.9);outline-offset:-3px}
[data-ona-sel]{outline:2px solid #0c7a78 !important;outline-offset:3px}
img[data-ona-sel]{outline-offset:-2px !important}
[data-ona-changed]{background-color:rgba(255,205,64,.28);box-shadow:0 0 0 2px rgba(255,205,64,.28)}
img[data-ona-changed]{box-shadow:0 0 0 4px rgba(255,190,40,.9)}
[contenteditable]{outline:2px solid #0c7a78 !important;outline-offset:3px;background-color:rgba(12,122,120,.07);caret-color:#0c7a78;cursor:text}
#ona-tag{position:fixed;z-index:2147483647;pointer-events:none;background:#0c7a78;color:#fff;font:500 11px/1.2 system-ui,sans-serif;padding:3px 6px;border-radius:2px;white-space:nowrap;max-width:60vw;overflow:hidden;text-overflow:ellipsis;display:none}
`;
