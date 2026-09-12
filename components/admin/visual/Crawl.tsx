"use client";

import { useRef, useState } from "react";
import { crawlBatch, sitemapPaths } from "@/app/admin/crawl-actions";
import { crawlFindings, type Crawled } from "@/lib/crawl";
import type { Finding, Where } from "@/lib/seo-audit";
import type { SitePage } from "@/lib/seo-pages";
import { useLang } from "./i18n";

// "Check the live site": the admin walks onarestore.com the way a search
// engine would and reports what only a walk can show — a link to a page
// that is gone, a page nothing links to, a redirect that leads to another
// redirect, a page with no heading, a page that takes three seconds.
//
// The crawl runs a dozen pages at a time (app/admin/crawl-actions.ts), so
// it never sits inside one long request and the editor watches it move.
// It reads the LIVE site, which is the published version — unpublished
// changes are not in it, and the screen says so.

const KEY = "ona-admin-crawl-v1";
type Saved = { at: number; pages: Crawled[]; sitemap: string[] };

export function Crawl({
  pages,
  onOpen,
  render,
}: {
  pages: SitePage[];
  onOpen: (where: Where) => void;
  render: (findings: Finding[]) => React.ReactNode;
}) {
  const { t } = useLang();
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  // The last run is kept in this browser, so reopening the screen shows
  // what was found rather than an empty page.
  const [result, setResult] = useState<Saved | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "null") as Saved | null;
    } catch {
      return null;
    }
  });
  const stop = useRef(false);

  async function run() {
    setRunning(true);
    stop.current = false;
    setDone(0);
    try {
      // Everything the admin knows about, plus whatever the sitemap lists
      // that it does not — a page nobody remembers is exactly what a crawl
      // is for.
      const sitemap = await sitemapPaths();
      const queue = [...new Set([...pages.map((p) => p.path), ...sitemap])];
      setTotal(queue.length);
      const out: Crawled[] = [];
      for (let i = 0; i < queue.length && !stop.current; i += 12) {
        const batch = await crawlBatch(queue.slice(i, i + 12));
        out.push(...batch);
        setDone(out.length);
        const partial = { at: Date.now(), pages: out.slice(), sitemap };
        setResult(partial);
      }
      const saved = { at: Date.now(), pages: out, sitemap };
      setResult(saved);
      try {
        localStorage.setItem(KEY, JSON.stringify(saved));
      } catch {}
    } finally {
      setRunning(false);
    }
  }

  const findings = result
    ? crawlFindings(
        result.pages,
        pages.map((p) => ({ path: p.path, label: p.label, noindex: p.noindex })),
        result.sitemap,
      )
    : [];
  const ok = result?.pages.filter((c) => c.status === 200).length ?? 0;
  const slowest = [...(result?.pages ?? [])].sort((a, b) => b.ms - a.ms).slice(0, 5);

  return (
    <section className="space-y-4">
      <div className="rounded-[2px] border border-line p-3">
        <p className="text-[14px] font-semibold">{t.crawlTitle}</p>
        <p className="mt-1 text-[13px] leading-snug text-warm-gray">{t.crawlIntro}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => (running ? (stop.current = true) : void run())}
            className="rounded-full bg-brand px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-brand-2"
          >
            {running ? t.crawlStop : result ? t.crawlAgain : t.crawlRun}
          </button>
          {running && (
            <span className="text-[13px] text-warm-gray">
              {done} / {total}
            </span>
          )}
          {!running && result && (
            <span className="text-[13px] text-warm-gray">
              {ok} {t.crawlOk} · {new Date(result.at).toLocaleString("en-US")}
            </span>
          )}
        </div>
        {running && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-charcoal-soft">
            <div className="h-full rounded-full bg-teal transition-[width]" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
          </div>
        )}
      </div>

      {result && findings.length === 0 && !running && <p className="text-[15px]">{t.crawlClean}</p>}
      {findings.length > 0 && render(findings)}

      {result && !running && (
        <div>
          <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-warm-gray">{t.crawlSlowest}</h3>
          <ul className="divide-y divide-line border-y border-line">
            {slowest.map((c) => (
              <li key={c.path} className="flex items-center gap-2 py-2 text-[13px]">
                <button type="button" className="min-w-0 flex-1 truncate text-left hover:underline" onClick={() => onOpen({ path: c.path, label: c.path, at: null, href: null })}>
                  {c.path}
                </button>
                <span className={c.status === 200 ? "text-warm-gray" : "text-coral-deep"}>{c.error || c.status}</span>
                <span className="w-16 text-right text-warm-gray">{(c.ms / 1000).toFixed(2)}s</span>
                <span className="w-16 text-right text-warm-gray">{Math.round(c.bytes / 1000)} KB</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
