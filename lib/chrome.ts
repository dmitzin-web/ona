import content from "@/content/chrome.json";
import { fillVarsDeep } from "./placeholders";
import { site } from "./site";

// Copy for the site-wide chrome and the shared blocks (header, footer,
// status strip, closing CTA, FAQ block, assistant window, default metadata,
// share images). Edited through the admin (/admin → Header, footer & shared
// blocks); schema in lib/admin/pages/chrome.ts.
//
// A static JSON import: the header and the assistant are client components.
// Company placeholders ({name}, {phone} …) and {tagline} are filled here.
// {year}, {status}, {minutes} and {author} are left in place and filled
// where the value is known (see `fill`).
export const chrome = fillVarsDeep(content, { tagline: site.tagline });

// Fills a runtime variable, e.g. fill(chrome.footer.copyright, { year: "2026" }).
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
