import { PLACEHOLDERS } from "../fields";
import type { SectionDef } from "../sections";

// /blog: the list page's own copy. Each post's title, category, date and
// excerpt come from the post itself (Blog posts).
export const BLOG_INDEX: SectionDef = {
  id: "blog-index",
  label: "Blog list page (/blog)",
  file: "content/pages/blog-index.json",
  description: `The /blog page's own text. Each article's title, category and excerpt are edited in Blog posts. ${PLACEHOLDERS}`,
  kind: "single",
  schema: [
    { kind: "object", key: "seo", label: "Search result", fields: [
      { kind: "text", key: "title", label: "Title (browser tab & Google)", required: true },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 3 },
      { kind: "text", key: "breadcrumb", label: "Name in the breadcrumb trail", required: true },
      { kind: "text", key: "blogName", label: "Blog name for Google", required: true, hint: "Sent to Google as structured data, not shown on the page." },
    ] },
    { kind: "object", key: "hero", label: "Top of the page", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Headline", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
    ] },
    { kind: "object", key: "list", label: "Article list", fields: [
      { kind: "text", key: "minRead", label: "After the reading time", required: true, hint: "Shown as “Water · 6 min read”. The category and minutes are set on each post." },
      { kind: "text", key: "readMore", label: "Link on each article", required: true },
    ] },
  ],
};
