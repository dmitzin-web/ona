import type { SectionDef } from "../sections";

// The SEO controls: everything an SEO professional needs to set on a site
// and would otherwise have to ask a developer for — which pages Google may
// index, what each page's canonical address is, where old addresses now
// lead, what robots.txt says, the verification codes, the topics the
// business claims in its structured data — plus the phrase each page is
// meant to be found for, which is what the SEO check measures against.
//
// Everything here changes the live site on the next publish:
//   verification → app/layout.tsx          robots      → app/robots.ts
//   pages        → lib/seo.ts              redirects   → next.config.ts
//   topics       → lib/jsonld.ts           structureUpdated → app/sitemap.ts
export const SEO: SectionDef = {
  id: "seo",
  label: "SEO",
  file: "content/seo.json",
  description:
    "The settings an SEO professional works with: what each page should be found for, which pages Google may index, canonical addresses, redirects, robots.txt, verification codes and the topics in the structured data. None of it is visible on the site.",
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
      kind: "object",
      key: "verification",
      label: "Verification codes",
      hint: "The codes Search Console and Bing Webmaster Tools give you for the “HTML tag” method. Paste the content value only, not the whole tag. Empty means no tag is written.",
      fields: [
        { kind: "text", key: "google", label: "Google Search Console", mono: true },
        { kind: "text", key: "bing", label: "Bing Webmaster Tools", mono: true },
      ],
    },
    {
      kind: "object",
      key: "analytics",
      label: "Measurement",
      hint: "Paste the ID and it is added to every page; empty means nothing is loaded. Plausible (cookieless, already on) is set in Vercel and is not affected. Google Analytics and Tag Manager set cookies in the visitor's browser — the privacy policy has to say so, and the SEO check will remind you until it does.",
      fields: [
        { kind: "text", key: "ga4", label: "Google Analytics 4 — measurement ID", mono: true, hint: "Looks like G-XXXXXXXXXX. Anything else is ignored." },
        { kind: "text", key: "gtm", label: "Google Tag Manager — container ID", mono: true, hint: "Looks like GTM-XXXXXXX. Everything you then put in the container runs on the site, so treat it as the keys to the building." },
      ],
    },
    {
      kind: "object",
      key: "robots",
      label: "robots.txt",
      fields: [
        {
          kind: "strings",
          key: "extraDisallow",
          label: "Also keep crawlers out of (one path per line)",
          hint: "Added to the built-in list: /api/, /_next/, /quote/thanks, /work/, /admin. A path here is a prefix — /campaign covers /campaign/anything.",
        },
        {
          kind: "checkbox",
          key: "allowAiCrawlers",
          label: "Let AI crawlers read the site (ChatGPT, Claude, Perplexity, Gemini…)",
          hint: "On: they may read everything a search engine may. Off: robots.txt tells each of them to stay out — the site then cannot be cited in their answers.",
        },
      ],
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
    {
      kind: "list",
      key: "pages",
      label: "Per-page indexing",
      itemTitle: "Page",
      hint: "Only the pages that need something other than the default. Everything not listed here is indexed, and points at its own address.",
      fields: [
        { kind: "text", key: "path", label: "Page address", required: true, mono: true },
        {
          kind: "checkbox",
          key: "hide",
          label: "Keep this page out of Google",
          hint: "Writes noindex on the page and drops it from the sitemap. The page still works for anyone with the link.",
        },
        {
          kind: "text",
          key: "canonical",
          label: "Counts as a copy of (leave empty for itself)",
          mono: true,
          hint: "The address Google should treat as the original — a path like /services/water-damage. Use it when two pages are near-identical, so the credit lands on one of them.",
        },
      ],
    },
    {
      kind: "list",
      key: "redirects",
      label: "Redirects",
      itemTitle: "Redirect",
      hint: "Old addresses that should lead somewhere else — printed material, a renamed page, a campaign URL. Exact addresses only. The four built-in ones (/remodeling, /mold and everything under them) live in the code and are not listed here.",
      fields: [
        { kind: "text", key: "from", label: "From", required: true, mono: true, hint: "A path on this site, starting with / — for example /water-damage-vancouver" },
        { kind: "text", key: "to", label: "To", required: true, mono: true, hint: "A path on this site, or a full https:// address" },
        {
          kind: "checkbox",
          key: "permanent",
          label: "Permanent",
          hint: "On for a page that has really moved: the browser is sent a 308, which Google treats like a 301 and passes the old page's standing on. Off for something temporary (307).",
        },
      ],
    },
    {
      kind: "strings",
      key: "topics",
      label: "Topics the business claims (one per line)",
      hint: "Sent to Google as the business's areas of knowledge (schema.org knowsAbout). Only things we genuinely do.",
    },
  ],
};
