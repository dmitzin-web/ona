// A small schema language for the admin's generic editor.
//
// Every editable section of the site (site settings, services, cities, page
// copy …) is described once as a list of fields. From that one description
// the admin derives the form (components/admin/SchemaForm.tsx) and the
// server derives validation (validateBySchema below), so a field can never
// be editable in the browser but unchecked on the server, or the reverse.
//
// Pure: no React, no Node APIs. Imported by both sides.

type Base = { key: string; label: string; hint?: string; required?: boolean };

export type Field =
  | (Base & { kind: "text"; max?: number; mono?: boolean })
  | (Base & { kind: "textarea"; max?: number; rows?: number })
  | (Base & { kind: "number"; min?: number; max?: number; integer?: boolean })
  | (Base & { kind: "checkbox" })
  | (Base & { kind: "select"; options: readonly string[] })
  // A photo: the value is a path under /photos (e.g. "/photos/projects/p3.avif").
  // Rendered as a picker over the photo library, with an upload button.
  // `aspect` is the shape of the slot on the page ("3 / 2"), so the picker
  // shows what will actually be visible after the page crops it.
  | (Base & { kind: "image"; allowNone?: boolean; aspect?: string })
  // A colour, as #rrggbb.
  | (Base & { kind: "color" })
  // A list of plain strings, edited one per line.
  | (Base & { kind: "strings"; max?: number })
  // A choice of other pages: the value is a list of slugs from the
  // collection named by `of` ("areas", "services"), ticked off by name.
  // Used for the links between pages — which cities a city page points at,
  // which services sit beside a service.
  | (Base & { kind: "refs"; of: string; max?: number })
  // A repeatable group of fields — FAQs, process steps, body sections.
  | (Base & { kind: "list"; fields: Field[]; itemTitle?: string })
  | (Base & { kind: "object"; fields: Field[] })
  // An object that may be absent entirely (e.g. no Google rating yet).
  | (Base & { kind: "optional"; fields: Field[]; toggleLabel: string });

export type Schema = Field[];

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

// Walks the schema, not the input: the result contains exactly the keys the
// schema declares, in schema order, so nothing from the request that the
// schema does not name can reach a content file — and serialisation order
// is stable, which keeps admin saves as minimal diffs.
export function validateBySchema(
  schema: Schema,
  raw: unknown,
): { ok: true; value: Obj } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const value = walk(schema, raw, "", errors);
  return errors.length ? { ok: false, errors } : { ok: true, value };
}

function walk(fields: Field[], raw: unknown, path: string, errors: string[]): Obj {
  const src = isObj(raw) ? raw : {};
  const out: Obj = {};
  for (const f of fields) {
    const where = path ? `${path} → ${f.label}` : f.label;
    const v = src[f.key];
    switch (f.kind) {
      case "text":
      case "textarea": {
        const s = typeof v === "string" ? v.trim() : "";
        if (f.required && !s) errors.push(`${where} is required.`);
        if (f.max && s.length > f.max) errors.push(`${where} is too long (${f.max} characters max).`);
        out[f.key] = s;
        break;
      }
      case "number": {
        const n = typeof v === "number" ? v : Number(v);
        if (v === "" || v === null || v === undefined || Number.isNaN(n)) {
          errors.push(`${where} must be a number.`);
        } else {
          if (f.integer && !Number.isInteger(n)) errors.push(`${where} must be a whole number.`);
          if (f.min !== undefined && n < f.min) errors.push(`${where} must be at least ${f.min}.`);
          if (f.max !== undefined && n > f.max) errors.push(`${where} must be at most ${f.max}.`);
        }
        out[f.key] = n;
        break;
      }
      case "checkbox":
        out[f.key] = v === true;
        break;
      case "color": {
        const c = typeof v === "string" ? v.trim().toLowerCase() : "";
        if (!/^#[0-9a-f]{6}$/.test(c)) errors.push(`${where}: pick a colour.`);
        out[f.key] = c;
        break;
      }
      case "image": {
        const v2 = typeof v === "string" ? v.trim() : "";
        if (!v2) {
          if (!f.allowNone) errors.push(`${where}: choose a photo.`);
          out[f.key] = "";
          break;
        }
        if (!/^\/photos\/[\w./-]+\.(avif|webp|jpe?g|png)$/i.test(v2) || v2.includes("..")) {
          errors.push(`${where}: that is not a photo from the site's photo library.`);
        }
        out[f.key] = v2;
        break;
      }
      case "select": {
        const s = typeof v === "string" ? v : "";
        if (!f.options.includes(s)) errors.push(`${where}: pick one of ${f.options.join(", ")}.`);
        out[f.key] = s;
        break;
      }
      case "strings": {
        const arr = (Array.isArray(v) ? v : [])
          .map((x) => (typeof x === "string" ? x.trim() : ""))
          .filter(Boolean);
        if (f.required && arr.length === 0) errors.push(`${where} needs at least one item.`);
        if (f.max && arr.length > f.max) errors.push(`${where} has too many items (${f.max} max).`);
        out[f.key] = arr;
        break;
      }
      case "refs": {
        const arr = (Array.isArray(v) ? v : [])
          .map((x) => (typeof x === "string" ? x.trim() : ""))
          .filter((x, i, all) => x && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x) && all.indexOf(x) === i);
        if (f.max && arr.length > f.max) errors.push(`${where}: pick at most ${f.max}.`);
        out[f.key] = arr;
        break;
      }
      case "list": {
        const arr = Array.isArray(v) ? v : [];
        if (f.required && arr.length === 0) errors.push(`${where} needs at least one entry.`);
        out[f.key] = arr.map((item, i) => walk(f.fields, item, `${where} ${i + 1}`, errors));
        break;
      }
      case "object":
        out[f.key] = walk(f.fields, v, where, errors);
        break;
      case "optional":
        out[f.key] = v === null || v === undefined ? null : walk(f.fields, v, where, errors);
        break;
    }
  }
  return out;
}

// A blank value shaped like the schema — for "new item" forms.
export function emptyValue(fields: Field[]): Obj {
  const out: Obj = {};
  for (const f of fields) {
    switch (f.kind) {
      case "text":
      case "textarea":
        out[f.key] = "";
        break;
      case "number":
        out[f.key] = f.min ?? 0;
        break;
      case "checkbox":
        out[f.key] = false;
        break;
      case "select":
        out[f.key] = f.options[0] ?? "";
        break;
      case "image":
        out[f.key] = "";
        break;
      case "color":
        out[f.key] = "#000000";
        break;
      case "strings":
      case "refs":
      case "list":
        out[f.key] = [];
        break;
      case "object":
        out[f.key] = emptyValue(f.fields);
        break;
      case "optional":
        out[f.key] = null;
        break;
    }
  }
  return out;
}

// Stable on-disk form for every schema-driven content file.
export const serializeContent = (v: unknown) => JSON.stringify(v, null, 2) + "\n";
