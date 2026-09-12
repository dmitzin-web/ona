import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import content from "@/content/pages/start-project.json";
import { fillPlaceholdersDeep } from "@/lib/placeholders";

// The page itself is a client component (the four-question form), and a
// client component cannot export metadata — so the title and description
// Google reads live here. The words are in
// content/pages/start-project.json → seo, like every other page's.
const t = fillPlaceholdersDeep(content);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/start-project",
});

export default function StartProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
