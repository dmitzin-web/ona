// The on-disk format of the site's editable content, and nothing else.
//
// content/posts/<slug>.json  — blog posts
// content/work/<slug>.json   — the remodeling gallery
//
// No filesystem and no network in here, on purpose: the build (lib/posts.ts,
// lib/work.ts) and the admin (lib/admin/*) both need to read and write this
// format, and the admin runs in a serverless function where the content
// folder is not on disk. One codec, two callers.
//
// The shape is the one Keystatic wrote when it was the admin (blocks as
// { discriminant, value }, the HowTo as a checkbox-keyed conditional, empty
// dates omitted). It stayed when Keystatic left, so every existing file is
// still valid and a save produces a minimal diff. Keep serialisation
// byte-stable: 2-space JSON, raw UTF-8, keys in the order written below.

// ── Posts ────────────────────────────────────────────────────────────────

export const POST_CATEGORIES = [
  "Water",
  "Fire",
  "Mold",
  "Storm",
  "Insurance",
  "Remodeling",
] as const;

export type PostSection =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "ordered"; items: string[] }
  | { kind: "callout"; text: string };

export type SectionKind = PostSection["kind"];
export const SECTION_KINDS: SectionKind[] = ["p", "h2", "h3", "list", "ordered", "callout"];
export const isListKind = (k: SectionKind): k is "list" | "ordered" =>
  k === "list" || k === "ordered";

export type Post = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: (typeof POST_CATEGORIES)[number];
  readingMinutes: number;
  publishedAt: string; // ISO date
  updatedAt?: string;
  author: { name: string; title: string };
  sections: PostSection[];
  faqs?: { q: string; a: string }[];
  // If the post is structured as a step-by-step guide, populate this to emit
  // schema.org/HowTo JSON-LD.
  howTo?: { name: string; description: string; steps: { name: string; text: string }[] };
};

type Block = { discriminant: SectionKind; value: string | string[] };
type PostFile = {
  title: string;
  description: string;
  excerpt: string;
  category: Post["category"];
  readingMinutes: number;
  publishedAt: string;
  updatedAt?: string | null;
  author: { name: string; title: string };
  sections: Block[];
  faqs?: { q: string; a: string }[];
  howTo?: { discriminant: boolean; value?: Post["howTo"] | null };
};

export function parsePost(slug: string, text: string): Post {
  const f = JSON.parse(text) as PostFile;
  return {
    slug,
    title: f.title,
    description: f.description,
    excerpt: f.excerpt,
    category: f.category,
    readingMinutes: f.readingMinutes,
    publishedAt: f.publishedAt,
    // Absent rather than null / []: the post page tests `post.faqs && …`,
    // and an empty array is truthy — it would render an empty FAQ block
    // and emit empty FAQ structured data.
    ...(f.updatedAt ? { updatedAt: f.updatedAt } : {}),
    author: f.author,
    sections: f.sections.map((b) =>
      isListKind(b.discriminant)
        ? { kind: b.discriminant, items: b.value as string[] }
        : ({ kind: b.discriminant, text: b.value as string } as PostSection),
    ),
    ...(f.faqs?.length ? { faqs: f.faqs } : {}),
    ...(f.howTo?.discriminant && f.howTo.value ? { howTo: f.howTo.value } : {}),
  };
}

export function serializePost(p: Post): string {
  const file: PostFile = {
    title: p.title,
    description: p.description,
    excerpt: p.excerpt,
    category: p.category,
    readingMinutes: p.readingMinutes,
    publishedAt: p.publishedAt,
    ...(p.updatedAt ? { updatedAt: p.updatedAt } : {}),
    author: { name: p.author.name, title: p.author.title },
    sections: p.sections.map((s) => ({
      discriminant: s.kind,
      value: "items" in s ? s.items : s.text,
    })),
    faqs: p.faqs ?? [],
    howTo: p.howTo ? { discriminant: true, value: p.howTo } : { discriminant: false },
  };
  return JSON.stringify(file, null, 2) + "\n";
}

// ── Remodeling gallery ───────────────────────────────────────────────────

export type WorkItem = {
  slug: string;
  title: string;
  roomType: string;
  image: string; // public path, e.g. /photos/projects/<slug>/image.avif
  imageAlt: string;
  notes: string;
  order: number;
};

export function parseWork(slug: string, text: string): WorkItem {
  const f = JSON.parse(text) as Omit<WorkItem, "slug">;
  return { slug, ...f };
}

export function serializeWork(w: WorkItem): string {
  const file = {
    title: w.title,
    roomType: w.roomType,
    image: w.image,
    imageAlt: w.imageAlt,
    notes: w.notes,
    order: w.order,
  };
  return JSON.stringify(file, null, 2) + "\n";
}

// ── Paths and slugs ──────────────────────────────────────────────────────

export const POSTS_DIR = "content/posts";
export const WORK_DIR = "content/work";
export const WORK_IMAGE_DIR = "public/photos/projects";

// Lowercase words joined by single hyphens. Also the only thing standing
// between a form field and a file path, so it is strict on purpose.
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
