"use client";

import { useEffect, useState } from "react";
import { searchInsights } from "@/app/admin/search-console-actions";
import { searchFindings, type Insights } from "@/lib/search-console";
import type { Finding, Where } from "@/lib/seo-audit";
import type { SitePage } from "@/lib/seo-pages";
import { useLang } from "./i18n";

// What Google actually did with the site over the last four weeks: how
// often each page was shown, how often it was clicked, where it sat, and
// for which searches — beside the field that changes it.
//
// Everything else in this screen is an opinion about the content. This is
// the only tab with evidence in it, so when the two disagree, this one
// wins.

export function Search({
  pages,
  onOpen,
  render,
}: {
  pages: SitePage[];
  onOpen: (where: Where) => void;
  render: (findings: Finding[]) => React.ReactNode;
}) {
  const { t } = useLang();
  const [state, setState] = useState<{ loading: boolean; insights: Insights | null; error: string; setup: boolean }>({
    loading: true,
    insights: null,
    error: "",
    setup: false,
  });
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void searchInsights()
      .then((r) => {
        if (!alive) return;
        if (r.ok) setState({ loading: false, insights: r.insights, error: "", setup: false });
        else setState({ loading: false, insights: null, error: r.message, setup: !!r.setup });
      })
      .catch(() => alive && setState({ loading: false, insights: null, error: t.deployFailed, setup: false }));
    return () => {
      alive = false;
    };
  }, [t.deployFailed]);

  if (state.loading) return <p className="text-[14px] text-warm-gray">{t.loading}</p>;

  if (!state.insights) {
    return (
      <section className="space-y-3">
        <p className="text-[15px] font-semibold">{state.error}</p>
        {state.setup && (
          <div className="space-y-2 rounded-[2px] border border-line p-3 text-[13px] leading-snug text-warm-gray">
            <p>{t.gscWhy}</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>{t.gscStep1}</li>
              <li>{t.gscStep2}</li>
              <li>{t.gscStep3}</li>
              <li>{t.gscStep4}</li>
            </ol>
            <p>{t.gscSafety}</p>
          </div>
        )}
      </section>
    );
  }

  const i = state.insights;
  const findings = searchFindings(i, pages);
  const ctr = i.impressions ? (i.clicks / i.impressions) * 100 : 0;

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: t.gscImpressions, value: i.impressions.toLocaleString("en-US") },
          { label: t.gscClicks, value: i.clicks.toLocaleString("en-US") },
          { label: t.gscCtr, value: `${ctr.toFixed(1)}%` },
          { label: t.gscPosition, value: i.position ? i.position.toFixed(1) : "—" },
        ].map((box) => (
          <div key={box.label} className="rounded-[2px] border border-line p-3">
            <p className="text-[20px] font-semibold leading-tight">{box.value}</p>
            <p className="text-[12px] text-warm-gray">{box.label}</p>
          </div>
        ))}
      </div>
      <p className="text-[12px] text-warm-gray">
        {t.gscRange} {i.from} → {i.to}
      </p>

      {findings.length > 0 && render(findings)}

      <div>
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-warm-gray">{t.gscTopQueries}</h3>
        <ul className="divide-y divide-line border-y border-line">
          {i.queries.slice(0, 15).map((q) => (
            <li key={q.query} className="flex items-center gap-3 py-2 text-[13px]">
              <span className="min-w-0 flex-1 truncate">{q.query}</span>
              <span className="w-14 text-right text-warm-gray">{q.impressions}</span>
              <span className="w-10 text-right text-warm-gray">{q.clicks}</span>
              <span className="w-12 text-right text-warm-gray">{q.position.toFixed(1)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-1 text-[11px] text-warm-gray">{t.gscColumns}</p>
      </div>

      <div>
        <h3 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-warm-gray">{t.gscPages}</h3>
        <ul className="divide-y divide-line border-y border-line">
          {i.pages.slice(0, 30).map((p) => {
            const known = pages.find((x) => x.path === p.path);
            const isOpen = open === p.path;
            return (
              <li key={p.path}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : p.path)}
                  className="flex w-full items-center gap-3 py-2 text-left text-[13px] hover:bg-charcoal-soft"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{known?.label ?? p.path}</span>
                    <span className="block truncate text-[12px] text-warm-gray">{p.path}</span>
                  </span>
                  <span className="w-14 text-right text-warm-gray">{p.impressions}</span>
                  <span className={`w-10 text-right ${p.clicks === 0 && p.impressions > 99 ? "text-coral-deep" : "text-warm-gray"}`}>
                    {p.clicks}
                  </span>
                  <span className="w-12 text-right text-warm-gray">{p.position.toFixed(1)}</span>
                </button>
                {isOpen && (
                  <div className="space-y-1 pb-3 pl-3">
                    {p.queries.map((q) => (
                      <p key={q.query} className="flex gap-3 text-[12px] text-warm-gray">
                        <span className="min-w-0 flex-1 truncate">{q.query}</span>
                        <span className="w-12 text-right">{q.impressions}</span>
                        <span className="w-8 text-right">{q.clicks}</span>
                        <span className="w-10 text-right">{q.position.toFixed(1)}</span>
                      </p>
                    ))}
                    <button
                      type="button"
                      className="text-[13px] font-semibold text-teal hover:underline"
                      onClick={() => onOpen({ path: p.path, label: known?.label ?? p.path, at: known?.titleAt ?? null, href: known?.editHref ?? null })}
                    >
                      {t.seoOpenPage} →
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
