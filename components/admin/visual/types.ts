import type { SectionDef } from "@/lib/admin/sections";
import type { Path } from "@/lib/admin/json-path";

export type Draft = Record<string, unknown>;
export type Base = Record<string, { sha: string | null; value: unknown }>;
export type Selection = { sectionId: string; path: Path } | null;
export type PageRef = { path: string; label: string; group: string };

export type EditorProps = {
  sections: SectionDef[];
  latest: Base;
  deployed: Record<string, unknown>;
  connected: boolean;
  storeKind: "local" | "github" | "unconfigured";
  connectError?: string;
  pages: PageRef[];
  previewPaths: Record<string, string>;
  // Blog posts: the SEO check needs their search result and their length,
  // and they are edited in their own editor rather than on the page.
  posts: { slug: string; title: string; description: string; words: number }[];
  photos: string[];
  user: string;
  devBypass: boolean;
  siteUrl: string;
  initialPath: string;
};

// Sections whose text is shared across many pages.
export const SHARED = new Set(["chrome", "site", "services", "areas"]);
export const EVERY_PAGE = new Set(["chrome", "site"]);
