"use client";

import { useState } from "react";
import type { Finding, Report, Where } from "@/lib/seo-audit";
import { targetOf, type SitePage } from "@/lib/seo-pages";
import { useLang } from "./i18n";

// The SEO screen: every page of the site measured against what Google can
// actually show, in the words of someone who has never heard of a meta tag.
//
// It is not a report to read and file away. Every line ends in a button that
// opens the exact field on the exact page, or hands the sentence to the
// assistant — and because it scores the draft, the number at the top moves
// while the editor works, before anything is published.

export function SeoScreen({
  report,
  pages,
  path,
  host,
  onClose,
  onOpen,
  onAsk,
}: {
  report: Report;
  pages: SitePage[];
  path: string;
  host: string;
  onClose: () => void;
  onOpen: (where: Where) => void;
  onAsk: ((finding: Finding, where: Where) => Promise<{ reply: string; count: number } | { error: string }>) | null;
}) {
  const { t } = useLang();
  const here = pages.find((p) => p.path === path) ?? null;
  const mine = report.findings.filter((f) => f.pages.some((w) => w.path === path));
  const toFix = report.findings.filter((f) => f.severity === "fix");
  const toImprove = report.findings.filter((f) => f.severity === "improve");
  const percent = report.total ? Math.round((report.ready / report.total) * 100) : 100;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-charcoal text-ivory">
      <header className="flex flex-none items-center gap-3 border-b border-line px-4 py-3">
        <h2 className="text-[16px] font-semibold">{t.seoTitle}</h2>
        <p className="hidden text-[13px] text-warm-gray sm:block">{t.seoIntro}</p>
        <button type="button" onClick={onClose} className="ml-auto rounded-full px-3 py-1.5 text-[18px] hover:bg-charcoal-soft" aria-label={t.close}>
          ✕
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-8 p-4 pb-24 sm:p-6">
          {/* How the site stands, in one line and one bar. */}
          <section>
            <p className="text-[28px] font-semibold leading-tight">
              {report.ready} <span className="text-warm-gray">/ {report.total}</span>
            </p>
            <p className="text-[15px]">{t.seoReady}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-charcoal-soft">
              <div className="h-full rounded-full bg-teal transition-[width]" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-[13px] text-warm-gray">
              {toFix.length} {t.seoToFix} · {toImprove.length} {t.seoToImprove}
            </p>
          </section>

          {/* The page they are looking at. */}
          {here && (
            <section>
              <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-warm-gray">{t.seoThisPage}</h3>
              <SearchPreview page={here} host={host} />
              <p className="mt-2 text-[13px] text-warm-gray">
                {mine.length === 0 ? t.seoPageClean : `${mine.length} ${t.seoPageIssues}`}
                {targetOf(here) ? ` · ${t.seoFoundFor} “${targetOf(here)}”` : ""}
              </p>
            </section>
          )}

          {[
            { label: t.seoFixFirst, list: toFix },
            { label: t.seoWorthDoing, list: toImprove },
          ].map(({ label, list }) =>
            list.length === 0 ? null : (
              <section key={label}>
                <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-warm-gray">
                  {label} ({list.length})
                </h3>
                <ul className="space-y-2">
                  {list.map((f) => (
                    <li key={f.key}>
                      <FindingCard finding={f} path={path} onOpen={onOpen} onAsk={onAsk} />
                    </li>
                  ))}
                </ul>
              </section>
            ),
          )}

          {report.findings.length === 0 && <p className="text-[15px]">{t.seoNothing}</p>}
        </div>
      </div>
    </div>
  );
}

function FindingCard({
  finding,
  path,
  onOpen,
  onAsk,
}: {
  finding: Finding;
  path: string;
  onOpen: (where: Where) => void;
  onAsk: ((finding: Finding, where: Where) => Promise<{ reply: string; count: number } | { error: string }>) | null;
}) {
  const { t } = useLang();
  const [all, setAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [said, setSaid] = useState<string | null>(null);
  // The page being looked at first: fixing what is in front of you is the
  // one case where the preview updates as you watch.
  const ordered = [...finding.pages].sort((a, b) => Number(b.path === path) - Number(a.path === path));
  const shown = all ? ordered : ordered.slice(0, 4);
  const first = ordered[0];

  return (
    <div className={`rounded-[2px] border p-3 ${finding.severity === "fix" ? "border-coral/40 bg-coral/5" : "border-line"}`}>
      <p className="text-[14px] font-semibold">{finding.what}</p>
      <p className="mt-1 text-[13px] leading-snug text-warm-gray">{finding.why}</p>
      <p className="mt-1 text-[13px] leading-snug">{finding.fix}</p>

      <ul className="mt-2 flex flex-wrap gap-1.5">
        {shown.map((w) => (
          <li key={w.path}>
            <button
              type="button"
              onClick={() => onOpen(w)}
              className={`rounded-full border px-2.5 py-1 text-[12px] hover:border-teal ${
                w.path === path ? "border-teal text-teal" : "border-line text-warm-gray"
              }`}
              title={w.path}
            >
              {w.label}
            </button>
          </li>
        ))}
        {!all && ordered.length > shown.length && (
          <li>
            <button type="button" onClick={() => setAll(true)} className="rounded-full px-2.5 py-1 text-[12px] text-teal hover:underline">
              +{ordered.length - shown.length} {t.seoMorePages}
            </button>
          </li>
        )}
      </ul>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => onOpen(first)} className="text-[13px] font-semibold text-teal hover:underline">
          {t.seoFixIt} →
        </button>
        {finding.ask && onAsk && first.at && (
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setSaid(null);
              const r = await onAsk(finding, first);
              setBusy(false);
              setSaid("error" in r ? r.error : r.count ? `${r.reply} (${r.count} ${t.edits})` : r.reply);
            }}
            className="text-[13px] text-teal hover:underline disabled:opacity-50"
          >
            {busy ? t.aiThinking : t.seoWriteIt}
          </button>
        )}
      </div>
      {said && <p className="mt-2 text-[13px] text-warm-gray">{said}</p>}
    </div>
  );
}

/** A page the way it appears in Google's results. */
export function SearchPreview({ page, host }: { page: SitePage; host: string }) {
  const { t } = useLang();
  return (
    <div className="rounded-[2px] border border-line bg-white p-3">
      <p className="truncate text-[12px] text-[#006621]">
        {host}
        {page.path}
      </p>
      <p className="truncate text-[16px] leading-snug text-[#1a0dab]">{page.title || t.seoNoTitle}</p>
      <p className="line-clamp-2 text-[13px] text-[#4d5156]">{page.description || t.seoNoDescription}</p>
    </div>
  );
}
