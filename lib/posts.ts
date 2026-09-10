import fs from "node:fs";
import path from "node:path";

// Blog post catalog.
//
// Posts are content files in content/posts/<slug>.json, edited through the
// admin at /keystatic (see keystatic.config.ts). They used to be a 1,800-line
// array literal in this file. The TYPES and the two EXPORTS below are exactly
// what they were, so the blog index, the post pages, the sitemap and the OG
// images did not have to change — only where the data comes from did.
//
// Read at build time. Every consumer is statically generated, so this runs
// during `next build` and never on a request.

export type PostSection =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "ordered"; items: string[] }
  | { kind: "callout"; text: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: "Water" | "Fire" | "Mold" | "Storm" | "Insurance" | "Remodeling";
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

// The file format Keystatic writes. Blocks are { discriminant, value }; the
// optional HowTo is a conditional keyed on its checkbox. An empty date is
// omitted entirely rather than written as null — checked against a file
// Keystatic saved itself.
type Block = { discriminant: PostSection["kind"]; value: string | string[] };
type PostFile = Omit<Post, "slug" | "sections" | "faqs" | "howTo" | "updatedAt"> & {
  updatedAt?: string | null;
  sections: Block[];
  faqs: { q: string; a: string }[];
  howTo: { discriminant: boolean; value?: Post["howTo"] | null };
};

const DIR = path.join(process.cwd(), "content/posts");

function toSection(b: Block): PostSection {
  return b.discriminant === "list" || b.discriminant === "ordered"
    ? { kind: b.discriminant, items: b.value as string[] }
    : { kind: b.discriminant, text: b.value as string };
}

function toPost(slug: string, f: PostFile): Post {
  return {
    slug,
    title: f.title,
    description: f.description,
    excerpt: f.excerpt,
    category: f.category,
    readingMinutes: f.readingMinutes,
    publishedAt: f.publishedAt,
    // Normalised back to "absent", not null / []: the post page tests
    // `post.faqs && …`, and an empty array is truthy — it would render an
    // empty FAQ block and emit empty FAQ structured data.
    ...(f.updatedAt ? { updatedAt: f.updatedAt } : {}),
    author: f.author,
    sections: f.sections.map(toSection),
    ...(f.faqs?.length ? { faqs: f.faqs } : {}),
    ...(f.howTo?.discriminant && f.howTo.value ? { howTo: f.howTo.value } : {}),
  };
}

function loadPosts(): Post[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      toPost(
        f.slice(0, -".json".length),
        JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as PostFile,
      ),
    )
    // Newest first, slug as the tie-break so the order is deterministic.
    // The old array had no rule — it was the order posts happened to be
    // typed in — and a directory of files has no order at all. This matters
    // beyond the index page: "Keep reading" on each post takes the first
    // three others, and with a date rule a new post from the admin shows up
    // there instead of never appearing.
    .sort((a, b) =>
      a.publishedAt === b.publishedAt
        ? a.slug.localeCompare(b.slug)
        : b.publishedAt.localeCompare(a.publishedAt),
    );
}

export const posts: Post[] = loadPosts();

export const findPost = (slug: string) => posts.find((p) => p.slug === slug);
