"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClaimLensReportView } from "@/components/claimlens/ClaimLensReportView";
import { sampleReport } from "@/lib/claimlens/sampleReport";
import type { ClaimReport } from "@/lib/claimlens/config";

// Client hydration so the report can be passed across pages via
// sessionStorage without round-tripping the AI output through the URL.
// If nothing is in session, fall back to the sample report — that's how
// the "View sample report" CTA on the landing page lands here.
export function ReportClient() {
  const [report, setReport] = useState<ClaimReport>(sampleReport);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("claimlens:lastReport");
      if (!raw) return;
      const parsed = JSON.parse(raw) as ClaimReport;
      setReport(parsed);
      setIsDemo(parsed.source === "demo");
    } catch {
      // If parsing fails for any reason, keep the sample report.
    }
  }, []);

  return (
    <>
      {isDemo && (
        <div className="bg-charcoal-soft text-ivory">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm lg:px-10">
            <p className="text-ivory/80">
              <span className="eyebrow mr-3 text-gold-soft">Sample</span>
              You&apos;re viewing a demo report with generic placeholders. No real claim is in scope.
            </p>
            <Link
              href="/claimlens/upload"
              className="underline decoration-gold/60 underline-offset-4 transition hover:text-gold-soft"
            >
              Run your own claim →
            </Link>
          </div>
        </div>
      )}
      <ClaimLensReportView report={report} isDemo={isDemo} />

      <section className="bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 border-t border-line-light px-6 py-10 lg:px-10">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 border border-charcoal px-6 py-3 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:bg-charcoal hover:text-ivory"
          >
            Print / Save as PDF
          </button>
          <Link
            href="/claimlens/upload"
            className="inline-flex items-center gap-2 border border-charcoal/30 px-6 py-3 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:border-charcoal"
          >
            {isDemo ? "Run your own claim" : "Run another claim"}
          </Link>
          <Link
            href="/claimlens"
            className="text-sm uppercase tracking-[0.22em] text-charcoal/60 transition hover:text-charcoal"
          >
            ← Back to ClaimLens
          </Link>
        </div>
      </section>
    </>
  );
}
