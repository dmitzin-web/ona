import type { Finding, Where } from "./seo-audit";
import type { SitePage } from "./seo-pages";

// What Google says about the site, as opposed to what the site says about
// itself: how often each page was shown, how often it was clicked, where it
// sat in the results, and for which searches.
//
// Everything here is pure — the fetching lives in
// app/admin/search-console-actions.ts. The rules below are the ones that
// only become possible once there is data: a page people see and never
// click (its title is not earning the click), a search sitting just off the
// first page, two pages turning up for the same search.

/** One row as the Search Analytics API returns it. */
export type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

export type QueryStat = { query: string; clicks: number; impressions: number; position: number };
export type PageStat = {
  path: string;
  clicks: number;
  impressions: number;
  position: number;
  queries: QueryStat[];
};

export type Insights = {
  /** YYYY-MM-DD, inclusive. */
  from: string;
  to: string;
  clicks: number;
  impressions: number;
  position: number;
  pages: PageStat[];
  queries: QueryStat[];
};

const pathOf = (url: string, siteUrl: string) => {
  try {
    const u = new URL(url);
    const bare = u.pathname.replace(/\/$/, "") || "/";
    return url.startsWith(siteUrl) || u.hostname.endsWith(new URL(siteUrl).hostname) ? bare : "";
  } catch {
    return "";
  }
};

const avg = (rows: { position: number; impressions: number }[]) => {
  const seen = rows.reduce((n, r) => n + r.impressions, 0);
  return seen ? rows.reduce((n, r) => n + r.position * r.impressions, 0) / seen : 0;
};

/** The API's two answers (by page, and by page × query) as one picture. */
export function summarise(
  byPage: Row[],
  byPageQuery: Row[],
  siteUrl: string,
  range: { from: string; to: string },
): Insights {
  const queriesFor = new Map<string, QueryStat[]>();
  const allQueries = new Map<string, QueryStat>();
  for (const r of byPageQuery) {
    const path = pathOf(r.keys[0] ?? "", siteUrl);
    const query = r.keys[1] ?? "";
    if (!path || !query) continue;
    const stat: QueryStat = { query, clicks: r.clicks, impressions: r.impressions, position: r.position };
    queriesFor.set(path, [...(queriesFor.get(path) ?? []), stat]);
    const seen = allQueries.get(query);
    allQueries.set(
      query,
      seen
        ? {
            query,
            clicks: seen.clicks + r.clicks,
            impressions: seen.impressions + r.impressions,
            position:
              (seen.position * seen.impressions + r.position * r.impressions) / (seen.impressions + r.impressions || 1),
          }
        : stat,
    );
  }

  const pages: PageStat[] = [];
  for (const r of byPage) {
    const path = pathOf(r.keys[0] ?? "", siteUrl);
    if (!path) continue;
    pages.push({
      path,
      clicks: r.clicks,
      impressions: r.impressions,
      position: r.position,
      queries: (queriesFor.get(path) ?? []).sort((a, b) => b.impressions - a.impressions).slice(0, 10),
    });
  }
  pages.sort((a, b) => b.impressions - a.impressions);

  return {
    from: range.from,
    to: range.to,
    clicks: pages.reduce((n, p) => n + p.clicks, 0),
    impressions: pages.reduce((n, p) => n + p.impressions, 0),
    position: avg(pages),
    pages,
    queries: [...allQueries.values()].sort((a, b) => b.impressions - a.impressions),
  };
}

// Seen this often and never clicked: enough to be a pattern, not a fluke.
const SEEN_ENOUGH = 100;
// A search sitting here is one or two places from the first page.
const CLOSE_FROM = 4.5;
const CLOSE_TO = 15;
const CLOSE_SEEN = 30;

const where = (p: { path: string; label: string }, at: Where["at"]): Where => ({ ...p, at, href: null });

/**
 * What the numbers say to do, tied back to the field that does it. `pages`
 * is the admin's own view of the site, which is how a finding about a page
 * Google shows can open that page's title.
 */
export function searchFindings(insights: Insights, pages: SitePage[]): Finding[] {
  const out: Finding[] = [];
  const known = (path: string) => pages.find((p) => p.path === path);
  const label = (path: string) => known(path)?.label ?? path;

  // Shown often, never clicked. The page is ranking; the words in the
  // result are not doing their job.
  for (const p of insights.pages) {
    if (p.impressions < SEEN_ENOUGH || p.clicks > 0 || p.position > 20) continue;
    const page = known(p.path);
    out.push({
      key: `gsc-no-clicks|${p.path}`,
      rule: "gsc-no-clicks",
      severity: "fix",
      what: `${label(p.path)} was shown ${p.impressions} times and clicked none.`,
      why: `It is already on Google at position ${p.position.toFixed(1)} — people see it and pick something else. That is the title and the line under it, not the page.`,
      fix: `Rewrite them around what these people are actually searching for: ${p.queries.slice(0, 3).map((q) => `“${q.query}”`).join(", ") || "the searches below"}.`,
      ask: p.queries.length
        ? `This page is shown for searches like ${p.queries.slice(0, 3).map((q) => `"${q.query}"`).join(", ")} but never clicked. Rewrite its title and description to answer those searches directly, under 60 and 160 characters.`
        : null,
      pages: [where({ path: p.path, label: label(p.path) }, page?.titleAt ?? null)],
    });
  }

  // One or two places off the first page. The cheapest wins there are.
  const close = insights.queries
    .filter((q) => q.position >= CLOSE_FROM && q.position <= CLOSE_TO && q.impressions >= CLOSE_SEEN)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 12);
  if (close.length) {
    out.push({
      key: "gsc-close",
      rule: "gsc-close",
      severity: "improve",
      what: `${close.length} search${close.length === 1 ? " is" : "es are"} sitting just off the first page.`,
      why: "Almost nobody looks past the first ten results, so a move of two or three places is the difference between being found and not.",
      fix: `Strengthen the page that answers each one: ${close.slice(0, 4).map((q) => `“${q.query}” (${q.position.toFixed(1)})`).join(", ")}.`,
      ask: null,
      pages: close
        .map((q) => {
          // The page Google shows most often for that search, not the
          // busiest page that happens to mention it.
          const p = insights.pages
            .filter((x) => x.queries.some((y) => y.query === q.query))
            .sort(
              (a, b) =>
                (b.queries.find((y) => y.query === q.query)?.impressions ?? 0) -
                (a.queries.find((y) => y.query === q.query)?.impressions ?? 0),
            )[0];
          return p ? where({ path: p.path, label: `${q.query} — ${q.position.toFixed(1)}` }, known(p.path)?.titleAt ?? null) : null;
        })
        .filter((w): w is Where => !!w),
    });
  }

  // Two pages turning up for the same search — cannibalisation, seen in the
  // data rather than guessed at from the targets.
  const perQuery = new Map<string, string[]>();
  for (const p of insights.pages) {
    for (const q of p.queries) {
      if (q.impressions < 10) continue;
      perQuery.set(q.query, [...(perQuery.get(q.query) ?? []), p.path]);
    }
  }
  for (const [query, paths] of perQuery) {
    if (paths.length < 2) continue;
    out.push({
      key: `gsc-split|${query}`,
      rule: "gsc-split",
      severity: "improve",
      what: `Google shows ${paths.length} different pages for “${query}”.`,
      why: "The searches are split between them, so neither builds up the standing one page would have had.",
      fix: "Decide which page owns that search, and point the other at it — or make them clearly about different things.",
      ask: null,
      pages: paths.map((path) => where({ path, label: label(path) }, known(path)?.titleAt ?? null)),
    });
  }

  // Pages Google has never shown at all.
  const seen = new Set(insights.pages.map((p) => p.path));
  const unseen = pages.filter((p) => !p.noindex && !seen.has(p.path));
  if (unseen.length) {
    out.push({
      key: "gsc-unseen",
      rule: "gsc-unseen",
      severity: "improve",
      what: `${unseen.length} page${unseen.length === 1 ? " was" : "s were"} never shown in a single search.`,
      why: "Either Google has not indexed them, or nobody is searching for what they say. Both are worth knowing which.",
      fix: "Check one in Search Console's URL inspection. If it is indexed, the words on it are the problem, not the crawling.",
      ask: null,
      pages: unseen.slice(0, 40).map((p) => where({ path: p.path, label: p.label }, p.titleAt)),
    });
  }

  return out.sort((a, b) => Number(b.severity === "fix") - Number(a.severity === "fix") || b.pages.length - a.pages.length);
}
