import type { SectionDef } from "../sections";

// What the SEO screen in the admin works from: the words each page is meant
// to be found for, and the one date the sitemap gives Google. Everything
// else it reports is derived from the pages themselves (lib/seo/pages.ts).
//
// A target phrase changes nothing on the site — it is what the audit holds
// each page's title, description and heading against, and what the
// assistant is told to write towards.
export const SEO: SectionDef = {
  id: "seo",
  label: "SEO",
  file: "content/seo.json",
  description:
    "What each page should be found for in Google, and the date the sitemap tells Google the pages last changed. Nothing here is visible on the site.",
  kind: "single",
  schema: [
    {
      kind: "text",
      key: "structureUpdated",
      label: "Pages last changed (the date Google is told)",
      required: true,
      mono: true,
      hint: "YYYY-MM-DD. It goes in the sitemap for every page that isn't a blog post. Move it when a page's words really change — bumping it on every small edit teaches Google to ignore the date.",
    },
    {
      kind: "list",
      key: "targets",
      label: "What each page should be found for",
      itemTitle: "Page",
      hint: "One line someone would actually type into Google. City pages and city × service pages don't need one — their words are taken from the city and the service. This changes nothing on the site; it is what the SEO check measures each page against.",
      fields: [
        { kind: "text", key: "path", label: "Page address", required: true, mono: true, hint: "Starts with / — for example /services/water-damage" },
        { kind: "text", key: "query", label: "Words someone would type into Google", required: true },
      ],
    },
  ],
};
