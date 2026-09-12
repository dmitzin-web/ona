"use server";

import { requireAdmin } from "@/lib/admin/session";
import { site } from "@/lib/site";
import { readPage, type Crawled } from "@/lib/crawl";

// Walking the live site from the server, a handful of pages at a time.
//
// A hundred pages cannot be fetched inside one request without running into
// the platform's time limit, so the browser asks for a batch, shows what
// came back, and asks for the next one. That also means the editor sees
// progress instead of a spinner, and can stop half way.
//
// It only ever fetches this site: every path is resolved against
// `site.url`, and anything that is not a path on it is refused. The admin
// must be signed in — this is a server action, so it checks for itself.

const BATCH = 12;
const TIMEOUT_MS = 10_000;
const UA = "OnaAdminCrawler/1.0 (+https://www.onarestore.com/admin)";

/** A path on this site, or nothing. */
function safePath(raw: string): string | null {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) return null;
  const path = raw.split("#")[0].replace(/\/$/, "") || "/";
  return path.length <= 512 ? path : null;
}

async function one(path: string): Promise<Crawled> {
  const base: Crawled = {
    path,
    status: 0,
    redirectTo: "",
    ms: 0,
    bytes: 0,
    title: "",
    description: "",
    canonical: "",
    robots: "",
    h1: [],
    links: [],
    error: "",
  };
  const started = Date.now();
  try {
    const res = await fetch(`${site.url}${path}`, {
      // Manual: a redirect is something to report, not to follow silently.
      redirect: "manual",
      cache: "no-store",
      headers: { "user-agent": UA, accept: "text/html" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const ms = Date.now() - started;
    if (res.status >= 300 && res.status < 400) {
      const to = res.headers.get("location") ?? "";
      return { ...base, status: res.status, ms, redirectTo: to.startsWith(site.url) ? to.slice(site.url.length) || "/" : to };
    }
    const html = res.headers.get("content-type")?.includes("text/html") ? await res.text() : "";
    return { ...base, status: res.status, ms, bytes: html.length, ...(html ? readPage(html) : {}) };
  } catch (err) {
    return {
      ...base,
      ms: Date.now() - started,
      error: err instanceof Error && err.name === "TimeoutError" ? "no answer in 10s" : "could not be reached",
    };
  }
}

/** Fetches up to a dozen pages, four at a time. */
export async function crawlBatch(paths: string[]): Promise<Crawled[]> {
  await requireAdmin();
  const wanted = paths.map(safePath).filter((p): p is string => !!p).slice(0, BATCH);
  const out: Crawled[] = [];
  for (let i = 0; i < wanted.length; i += 4) {
    out.push(...(await Promise.all(wanted.slice(i, i + 4).map(one))));
  }
  return out;
}

/** The list the site hands Google, as paths. */
export async function sitemapPaths(): Promise<string[]> {
  await requireAdmin();
  try {
    const res = await fetch(`${site.url}/sitemap.xml`, {
      cache: "no-store",
      headers: { "user-agent": UA },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].trim())
      .filter((u) => u.startsWith(site.url))
      .map((u) => u.slice(site.url.length).replace(/\/$/, "") || "/");
  } catch {
    return [];
  }
}
