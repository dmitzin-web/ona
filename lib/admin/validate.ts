import {
  isListKind,
  POST_CATEGORIES,
  SECTION_KINDS,
  SLUG_RE,
  type Post,
  type PostSection,
} from "@/lib/content-format";

// Server-side validation of everything the admin forms send. The browser
// form is a convenience; this is the check. Returns a clean object built
// field by field — nothing from the request is spread into the result, so
// an extra key in the payload can never reach a content file.

export type Result<T> = { ok: true; value: T } | { ok: false, errors: string[] };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const isDate = (s: unknown): s is string =>
  typeof s === "string" && DATE_RE.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validatePost(raw: unknown, slugFromUrl?: string): Result<Post> {
  const e: string[] = [];
  const r = (raw ?? {}) as Record<string, unknown>;

  const slug = slugFromUrl ?? str(r.slug);
  if (!SLUG_RE.test(slug) || slug.length > 100)
    e.push("Page address: lowercase letters, numbers and single hyphens only.");

  const title = str(r.title);
  if (!title) e.push("Title is required.");
  if (title.length > 200) e.push("Title is too long (200 characters max).");

  const description = str(r.description);
  if (!description) e.push("Search description is required.");
  if (description.length > 400) e.push("Search description is too long (400 max).");

  const excerpt = str(r.excerpt);
  if (!excerpt) e.push("Excerpt is required.");
  if (excerpt.length > 800) e.push("Excerpt is too long (800 max).");

  const category = str(r.category) as Post["category"];
  if (!POST_CATEGORIES.includes(category)) e.push("Pick a category.");

  const readingMinutes = Number(r.readingMinutes);
  if (!Number.isInteger(readingMinutes) || readingMinutes < 1 || readingMinutes > 120)
    e.push("Reading time must be a whole number of minutes, 1–120.");

  const publishedAt = str(r.publishedAt);
  if (!isDate(publishedAt)) e.push("Published date is required.");
  const updatedAt = str(r.updatedAt);
  if (updatedAt && !isDate(updatedAt)) e.push("Updated date is not a valid date.");

  const a = (r.author ?? {}) as Record<string, unknown>;
  const author = { name: str(a.name), title: str(a.title) };
  if (!author.name) e.push("Author name is required.");

  const sections: PostSection[] = [];
  const rawSections = Array.isArray(r.sections) ? r.sections : [];
  if (rawSections.length === 0) e.push("The post needs at least one block of text.");
  if (rawSections.length > 400) e.push("Too many blocks.");
  rawSections.forEach((b: unknown, i) => {
    const blk = (b ?? {}) as Record<string, unknown>;
    const kind = str(blk.kind) as PostSection["kind"];
    if (!SECTION_KINDS.includes(kind)) return e.push(`Block ${i + 1}: unknown type.`);
    if (isListKind(kind)) {
      const items = (Array.isArray(blk.items) ? blk.items : []).map(str).filter(Boolean);
      if (items.length === 0) return e.push(`Block ${i + 1}: the list is empty.`);
      sections.push({ kind, items });
    } else {
      const text = str(blk.text);
      if (!text) return e.push(`Block ${i + 1}: empty ${kind === "p" ? "paragraph" : "block"}.`);
      sections.push({ kind, text } as PostSection);
    }
  });

  const faqs = (Array.isArray(r.faqs) ? r.faqs : []).map((f: unknown, i) => {
    const x = (f ?? {}) as Record<string, unknown>;
    const q = str(x.q);
    const ans = str(x.a);
    if (!q || !ans) e.push(`FAQ ${i + 1}: both the question and the answer are needed.`);
    return { q, a: ans };
  });

  let howTo: Post["howTo"];
  if (r.howTo) {
    const h = r.howTo as Record<string, unknown>;
    const steps = (Array.isArray(h.steps) ? h.steps : []).map((s: unknown, i) => {
      const x = (s ?? {}) as Record<string, unknown>;
      const step = { name: str(x.name), text: str(x.text) };
      if (!step.name || !step.text) e.push(`Guide step ${i + 1}: both the step and its detail are needed.`);
      return step;
    });
    howTo = { name: str(h.name), description: str(h.description), steps };
    if (!howTo.name || !howTo.description) e.push("Step-by-step guide: name and description are needed.");
    if (steps.length === 0) e.push("Step-by-step guide: add at least one step, or untick it.");
  }

  if (e.length) return { ok: false, errors: e };
  return {
    ok: true,
    value: {
      slug,
      title,
      description,
      excerpt,
      category,
      readingMinutes,
      publishedAt,
      ...(updatedAt ? { updatedAt } : {}),
      author,
      sections,
      ...(faqs.length ? { faqs } : {}),
      ...(howTo ? { howTo } : {}),
    },
  };
}

// ── Gallery ──────────────────────────────────────────────────────────────

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// The declared type is whatever the browser says; the bytes are the truth.
// A file that claims to be a JPEG but starts with "<html" is refused.
export function sniffImage(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  const brand = buf.toString("ascii", 4, 12);
  if (brand === "ftypavif" || brand === "ftypavis") return "image/avif";
  return null;
}

export type WorkFields = { title: string; roomType: string; imageAlt: string; notes: string; order: number };

export function validateWorkFields(fd: FormData): Result<WorkFields> {
  const e: string[] = [];
  const g = (k: string) => str(fd.get(k));
  const v = {
    title: g("title"),
    roomType: g("roomType"),
    imageAlt: g("imageAlt"),
    notes: g("notes"),
    order: Number(g("order") || "100"),
  };
  if (!v.title) e.push("Title is required.");
  if (v.title.length > 120) e.push("Title is too long (120 max).");
  if (!v.roomType) e.push("Room is required.");
  if (!v.imageAlt) e.push("Photo description is required — it is what screen readers and Google read.");
  if (!v.notes) e.push("Caption is required.");
  if (v.notes.length > 300) e.push("Caption is too long (300 max).");
  if (!Number.isInteger(v.order) || v.order < 0 || v.order > 100000) e.push("Position must be a whole number.");
  return e.length ? { ok: false, errors: e } : { ok: true, value: v };
}
