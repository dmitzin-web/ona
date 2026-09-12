import type { Field } from "@/lib/admin/schema";
import type { SectionDef } from "@/lib/admin/sections";
import type { Path } from "@/lib/admin/json-path";

// What the visual editor knows about the content: every editable string
// (and photo choice) in every section, where it lives, what the field is
// called, and how to recognise it on a rendered page. Pure — no DOM.

export type Company = Record<string, string>;

// Values the site fills into text at build time (lib/placeholders.ts, plus
// the few page-specific ones that come from Company details).
export function companyValues(site: Record<string, unknown>, url: string): Company {
  const address = (site.address ?? {}) as Record<string, string>;
  return {
    name: String(site.name ?? ""),
    legalName: String(site.legalName ?? ""),
    phone: String(site.phoneDisplay ?? ""),
    email: String(site.email ?? ""),
    url,
    city: address.locality ?? "",
    state: address.region ?? "",
    tagline: String(site.tagline ?? ""),
    founded: String(site.founded ?? ""),
  };
}

export const fillWith = (s: string, values: Record<string, string>) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? values[k] : m));

export const norm = (s: string) => s.replace(/\s+/g, " ").trim();

export type Leaf = {
  sectionId: string;
  path: Path; // from the file's root (collections start with the item index)
  field: Field;
  trail: string[]; // human labels, section first
  photo?: boolean; // a photo picker (select with thumbnails)
};

// Every editable leaf of a section value, in schema order.
export function leaves(section: SectionDef, value: unknown): Leaf[] {
  const out: Leaf[] = [];
  const walk = (fields: Field[], v: unknown, path: Path, trail: string[]) => {
    const obj = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
    for (const f of fields) {
      const p = [...path, f.key];
      const t = [...trail, f.label];
      const x = obj[f.key];
      switch (f.kind) {
        case "text":
        case "textarea":
          out.push({ sectionId: section.id, path: p, field: f, trail: t });
          break;
        case "image":
          out.push({ sectionId: section.id, path: p, field: f, trail: t, photo: true });
          break;
        case "strings":
          (Array.isArray(x) ? x : []).forEach((_, i) =>
            out.push({ sectionId: section.id, path: [...p, i], field: f, trail: [...t, `${i + 1}`] }),
          );
          break;
        case "list":
          (Array.isArray(x) ? x : []).forEach((item, i) =>
            walk(f.fields, item, [...p, i], [...t, `${f.itemTitle ?? "Item"} ${i + 1}`]),
          );
          break;
        case "object":
          walk(f.fields, x, p, t);
          break;
        case "optional":
          if (x) walk(f.fields, x, p, t);
          break;
      }
    }
  };
  if (section.kind === "collection") {
    (Array.isArray(value) ? value : []).forEach((item, i) => {
      const title = String((item as Record<string, unknown>)?.[section.titleKey] ?? i + 1);
      walk(section.schema, item, [i], [section.label, title]);
    });
  } else {
    walk(section.schema, value, [], [section.label]);
  }
  return out;
}

// The schema field (and its parent fields) along a path.
export function fieldsAlong(section: SectionDef, path: Path): Field[] {
  const out: Field[] = [];
  let fields: Field[] | null = section.schema;
  const p = section.kind === "collection" ? path.slice(1) : path;
  for (const k of p) {
    if (typeof k === "number") continue;
    const f: Field | undefined = fields?.find((x) => x.key === k);
    if (!f) break;
    out.push(f);
    fields = f.kind === "object" || f.kind === "list" || f.kind === "optional" ? f.fields : null;
  }
  return out;
}

export function trailOf(section: SectionDef, value: unknown, path: Path): string[] {
  const t: string[] = [section.label];
  let fields: Field[] | null = section.schema;
  let p = path;
  if (section.kind === "collection") {
    const item = Array.isArray(value) ? (value[path[0] as number] as Record<string, unknown>) : null;
    t.push(String(item?.[section.titleKey] ?? Number(path[0]) + 1));
    p = path.slice(1);
  }
  let lastList: Field | null = null;
  for (const k of p) {
    if (typeof k === "number") {
      t.push(lastList?.kind === "list" ? `${lastList.itemTitle ?? "Item"} ${k + 1}` : `${k + 1}`);
      continue;
    }
    const f: Field | undefined = fields?.find((x) => x.key === k);
    if (!f) {
      t.push(String(k));
      break;
    }
    t.push(f.label);
    lastList = f;
    fields = f.kind === "object" || f.kind === "list" || f.kind === "optional" ? f.fields : null;
  }
  return t;
}

// A string with placeholders left after the company values are filled is
// matched as a pattern: "Restoration in {area}, {areaState}" recognises
// "Restoration in Camas, WA" and remembers area=Camas, areaState=WA.
export type Matcher =
  | { kind: "exact"; text: string }
  | { kind: "pattern"; re: RegExp; vars: string[] };

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function matcherFor(filled: string): Matcher | null {
  const text = norm(filled);
  if (!text) return null;
  if (!/\{\w+\}/.test(text)) return { kind: "exact", text };
  const parts = text.split(/\{(\w+)\}/);
  const literal = parts.filter((_, i) => i % 2 === 0).join("").replace(/\s/g, "");
  if (literal.length < 3) return null; // "{service}" alone would match anything
  const vars: string[] = [];
  const src = parts.map((x, i) => (i % 2 ? (vars.push(x), "(.+?)") : escapeRe(x))).join("");
  return { kind: "pattern", re: new RegExp(`^${src}$`), vars };
}
