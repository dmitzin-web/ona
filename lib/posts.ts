import fs from "node:fs";
import path from "node:path";
import { parsePost, POSTS_DIR, type Post } from "./content-format";

// Blog post catalog.
//
// Posts are content files in content/posts/<slug>.json, edited through the
// admin at /admin (see lib/admin/). They used to be a 1,800-line array
// literal in this file. The TYPES and the two EXPORTS below are exactly
// what they were, so the blog index, the post pages, the sitemap and the OG
// images did not have to change — only where the data comes from did.
//
// Read at build time. Every consumer is statically generated, so this runs
// during `next build` and never on a request. The file format itself lives
// in lib/content-format.ts, shared with the admin.

export type { Post, PostSection } from "./content-format";

const DIR = path.join(process.cwd(), POSTS_DIR);

function loadPosts(): Post[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      parsePost(f.slice(0, -".json".length), fs.readFileSync(path.join(DIR, f), "utf8")),
    )
    // Newest first, slug as the tie-break so the order is deterministic.
    // The old array had no rule — it was the order posts happened to be
    // typed in — and a directory of files has no order at all. This matters
    // beyond the index page: "More from the field" on each post takes the
    // first three others, and with a date rule a new post from the admin
    // shows up there instead of never appearing.
    .sort((a, b) =>
      a.publishedAt === b.publishedAt
        ? a.slug.localeCompare(b.slug)
        : b.publishedAt.localeCompare(a.publishedAt),
    );
}

export const posts: Post[] = loadPosts();

export const findPost = (slug: string) => posts.find((p) => p.slug === slug);
