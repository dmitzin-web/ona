import type { Finding, Where } from "./seo-audit";

// Walking the live site the way a search engine does, and saying what it
// finds. The rest of the SEO screen reads the content and works out what
// the site SHOULD be sending; this fetches what it actually sends — status
// codes, redirects, canonicals, headings, and every internal link — and
// reports what only a crawl can see: a link to a page that is gone, a page
// nothing links to, a redirect that leads to another redirect.
//
// Pure. `app/admin/crawl-actions.ts` does the fetching, a batch at a time,
// so a hundred pages never sit inside one request.

export type Crawled = {
  path: string;
  status: number;
  /** Where a 3xx sent us, as a path on this site (or an absolute URL). */
  redirectTo: string;
  /** How long the server took, in milliseconds. */
  ms: number;
  bytes: number;
  title: string;
  description: string;
  canonical: string;
  /** The meta robots line, e.g. "noindex, nofollow". */
  robots: string;
  h1: string[];
  /** Internal links found on the page, as paths. */
  links: string[];
  error: string;
};

const decode = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

const attr = (html: string, re: RegExp) => {
  const m = re.exec(html);
  return m ? decode(m[1]).replace(/\s+/g, " ").trim() : "";
};

/** Assets and API routes are not pages; a crawler that follows them wastes its time. */
const isPage = (path: string) =>
  path.startsWith("/") &&
  !path.startsWith("//") &&
  !/^\/(api|_next|admin)\b/.test(path) &&
  !/\.(png|jpe?g|avif|webp|svg|ico|css|js|txt|xml|pdf|woff2?)$/i.test(path);

/** Everything worth knowing from one page's HTML. */
export function readPage(html: string): Omit<Crawled, "path" | "status" | "redirectTo" | "ms" | "bytes" | "error"> {
  const links = new Set<string>();
  for (const m of html.matchAll(/<a\b[^>]*href="([^"#?]*)(?:[#?][^"]*)?"/gi)) {
    const href = decode(m[1]).trim();
    if (isPage(href)) links.add(href.replace(/\/$/, "") || "/");
  }
  return {
    title: attr(html, /<title>([\s\S]*?)<\/title>/i),
    description: attr(html, /<meta name="description" content="([\s\S]*?)"\s*\/?>/i),
    canonical: attr(html, /<link rel="canonical" href="([^"]*)"/i),
    robots: attr(html, /<meta name="robots" content="([^"]*)"/i),
    h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
      decode(m[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim(),
    ),
    links: [...links],
  };
}

const SLOW_MS = 1500;
const HEAVY_BYTES = 600_000;

const where = (path: string, label?: string): Where => ({ path, label: label ?? path, at: null, href: null });

/**
 * What the crawl found, in the same shape as the content checks so it can
 * be shown in the same cards. `known` is what the admin believes should be
 * on the site (lib/seo-pages.ts), which is how a page that is linked but
 * missing from the sitemap, or hidden yet still linked, is spotted.
 */
export function crawlFindings(
  crawled: Crawled[],
  known: { path: string; label: string; noindex: boolean }[],
  sitemap: string[],
): Finding[] {
  const out: Finding[] = [];
  const byPath = new Map(crawled.map((c) => [c.path, c]));
  const labelOf = (p: string) => known.find((k) => k.path === p)?.label ?? p;
  const add = (f: Omit<Finding, "key">) => out.push({ ...f, key: `${f.rule}|${f.pages[0]?.path ?? out.length}` });

  // Pages that answered with something other than 200.
  const broken = crawled.filter((c) => c.status >= 400 || c.error);
  if (broken.length) {
    add({
      rule: "crawl-error",
      severity: "fix",
      what: `${broken.length === 1 ? "A page" : `${broken.length} pages`} did not load.`,
      why: "Whatever links to them — the menu, another page, Google's index — leads visitors to an error.",
      fix: "Open one and see what it says. A page that is genuinely gone should be redirected, not left broken.",
      ask: null,
      pages: broken.map((c) => where(c.path, `${labelOf(c.path)} (${c.error || c.status})`)),
    });
  }

  // A link that lands on a redirect: it works, but every visitor and every
  // crawler pays for the extra hop, and the credit is passed along diluted.
  const redirecting = new Set(crawled.filter((c) => c.status >= 300 && c.status < 400).map((c) => c.path));
  const linksToRedirect = crawled.filter((c) => c.links.some((l) => redirecting.has(l)));
  if (redirecting.size) {
    add({
      rule: "crawl-redirect",
      severity: linksToRedirect.length ? "improve" : "improve",
      what: `${redirecting.size} address${redirecting.size === 1 ? "" : "es"} on the site redirect${redirecting.size === 1 ? "s" : ""} somewhere else.`,
      why: linksToRedirect.length
        ? "Pages on the site link straight at them, so every visit takes two round trips instead of one."
        : "Nothing links to them, so this is only about anyone arriving from outside.",
      fix: "Point the links at the destination instead.",
      ask: null,
      pages: [...redirecting].map((p) => {
        const c = byPath.get(p)!;
        return where(p, `${p} → ${c.redirectTo || "?"}`);
      }),
    });
  }

  // A link to an address that answers with an error — the crawl's whole point.
  const dead = new Map<string, string[]>();
  for (const c of crawled) {
    for (const l of c.links) {
      const target = byPath.get(l);
      if (target && (target.status >= 400 || target.error)) dead.set(l, [...(dead.get(l) ?? []), c.path]);
    }
  }
  for (const [target, from] of dead) {
    add({
      rule: "crawl-broken-link",
      severity: "fix",
      what: `${from.length} page${from.length === 1 ? "" : "s"} link to ${target}, which does not load.`,
      why: "A visitor who clicks it gets an error page, and Google records a broken link on every page carrying it.",
      fix: "Fix the address, or redirect it.",
      ask: null,
      pages: from.map((p) => where(p, labelOf(p))),
    });
  }

  // Pages nothing links to. Google can still reach them through the
  // sitemap, but a page with no links pointing at it is a page the site
  // itself does not vouch for.
  const linked = new Set(crawled.flatMap((c) => c.links));
  const orphans = crawled.filter(
    (c) => c.status === 200 && c.path !== "/" && !linked.has(c.path) && !c.robots.includes("noindex"),
  );
  if (orphans.length) {
    add({
      rule: "crawl-orphan",
      severity: "improve",
      what: `${orphans.length} page${orphans.length === 1 ? " is" : "s are"} not linked from anywhere on the site.`,
      why: "Google follows links to decide what matters. A page only the sitemap knows about starts from nothing.",
      fix: "Link to them from a page that is about the same thing.",
      ask: null,
      pages: orphans.map((c) => where(c.path, labelOf(c.path))),
    });
  }

  // Headings.
  const noH1 = crawled.filter((c) => c.status === 200 && c.h1.length === 0);
  const manyH1 = crawled.filter((c) => c.h1.length > 1);
  if (noH1.length) {
    add({
      rule: "crawl-no-h1",
      severity: "fix",
      what: `${noH1.length} page${noH1.length === 1 ? " has" : "s have"} no main heading.`,
      why: "The big line at the top is what Google reads after the title, and what a screen reader announces first.",
      fix: "Every page needs exactly one — tell the developer if the text is there but the heading is not.",
      ask: null,
      pages: noH1.map((c) => where(c.path, labelOf(c.path))),
    });
  }
  if (manyH1.length) {
    add({
      rule: "crawl-many-h1",
      severity: "improve",
      what: `${manyH1.length} page${manyH1.length === 1 ? " has" : "s have"} more than one main heading.`,
      why: "Two headings of equal weight leave Google to guess which one the page is about.",
      fix: "Keep one; the rest should be section headings.",
      ask: null,
      pages: manyH1.map((c) => where(c.path, `${labelOf(c.path)} (${c.h1.length})`)),
    });
  }

  // What the page says its address is.
  const wrongCanonical = crawled.filter((c) => {
    if (c.status !== 200 || !c.canonical) return false;
    const own = new URL(c.canonical).pathname.replace(/\/$/, "") || "/";
    return own !== c.path;
  });
  if (wrongCanonical.length) {
    add({
      rule: "crawl-canonical",
      severity: "improve",
      what: `${wrongCanonical.length} page${wrongCanonical.length === 1 ? "" : "s"} tell Google the real version is somewhere else.`,
      why: "That is exactly what it means to be a copy — the page itself will not be the one shown.",
      fix: "Intended? Leave it. Otherwise clear it in SEO → Per-page indexing.",
      ask: null,
      pages: wrongCanonical.map((c) => where(c.path, `${labelOf(c.path)} → ${new URL(c.canonical).pathname}`)),
    });
  }

  // Hidden from Google, yet offered to it.
  const inSitemap = new Set(sitemap);
  const noindexed = crawled.filter((c) => c.robots.includes("noindex") && inSitemap.has(c.path));
  if (noindexed.length) {
    add({
      rule: "crawl-noindex-sitemap",
      severity: "fix",
      what: `${noindexed.length} page${noindexed.length === 1 ? " is" : "s are"} in the sitemap and also say “do not index”.`,
      why: "The sitemap invites Google in and the page turns it away. Search Console reports it as an error.",
      fix: "Decide which one is right — the page's setting or its place in the sitemap.",
      ask: null,
      pages: noindexed.map((c) => where(c.path, labelOf(c.path))),
    });
  }

  // Linked, answers fine, and not offered to Google at all.
  const missingFromSitemap = crawled.filter(
    (c) => c.status === 200 && !c.robots.includes("noindex") && !inSitemap.has(c.path) && linked.has(c.path),
  );
  if (sitemap.length && missingFromSitemap.length) {
    add({
      rule: "crawl-missing-sitemap",
      severity: "improve",
      what: `${missingFromSitemap.length} page${missingFromSitemap.length === 1 ? " is" : "s are"} missing from the sitemap.`,
      why: "The sitemap is the list the site hands Google. A page left off it is found later, if at all.",
      fix: "Tell the developer — the sitemap is built from the content, so something is not being listed.",
      ask: null,
      pages: missingFromSitemap.map((c) => where(c.path, labelOf(c.path))),
    });
  }

  // Slow and heavy.
  const slow = crawled.filter((c) => c.ms > SLOW_MS && c.status === 200);
  if (slow.length) {
    add({
      rule: "crawl-slow",
      severity: "improve",
      what: `${slow.length} page${slow.length === 1 ? " took" : "s took"} more than ${SLOW_MS / 1000} seconds to answer.`,
      why: "Speed is a ranking signal, and the slowest pages are the ones people leave before they load.",
      fix: "Worth a look by the developer — measured from this browser, so a slow connection exaggerates it.",
      ask: null,
      pages: slow.map((c) => where(c.path, `${labelOf(c.path)} (${(c.ms / 1000).toFixed(1)}s)`)),
    });
  }
  const heavy = crawled.filter((c) => c.bytes > HEAVY_BYTES);
  if (heavy.length) {
    add({
      rule: "crawl-heavy",
      severity: "improve",
      what: `${heavy.length} page${heavy.length === 1 ? " is" : "s are"} over ${Math.round(HEAVY_BYTES / 1000)} KB of HTML.`,
      why: "A heavy page is slower on a phone, which is where most of this traffic is.",
      fix: "One for the developer.",
      ask: null,
      pages: heavy.map((c) => where(c.path, `${labelOf(c.path)} (${Math.round(c.bytes / 1000)} KB)`)),
    });
  }

  return out.sort((a, b) => Number(b.severity === "fix") - Number(a.severity === "fix") || b.pages.length - a.pages.length);
}
