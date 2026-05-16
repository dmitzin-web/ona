import type { ClaimReport } from "@/lib/claimlens/config";
import { ClaimLensWordmark } from "./ClaimLensWordmark";
import { ClaimLensDisclaimer } from "./ClaimLensDisclaimer";
import { SeverityBadge, ConfidenceLabel } from "./SeverityBadge";

// Renders a full ClaimLens™ report. Used by /claimlens/report (real
// analysis read from sessionStorage) and by the demo path that ships the
// sample report when accessed directly. Pure presentational — receives
// a `ClaimReport` and renders it. No data fetching here.

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ClaimLensReportView({
  report,
  isDemo = false,
}: {
  report: ClaimReport;
  isDemo?: boolean;
}) {
  return (
    <article className="bg-ivory text-charcoal">
      {/* Report masthead */}
      <header className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-gold-soft">
                {isDemo ? "Sample report · demo only" : "ClaimLens™ report"}
              </p>
              <h1 className="mt-4 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                <ClaimLensWordmark tone="light" /> claim analysis
              </h1>
              <p className="mt-3 text-sm text-ivory/60">
                Generated {formatDate(report.generatedAt)} ·{" "}
                {report.source === "ai"
                  ? "AI analysis"
                  : report.source === "mock"
                    ? "Mock analysis (no API key configured)"
                    : "Sample / demo data"}
              </p>
            </div>
            <div className="text-right">
              <p className="eyebrow text-ivory/50">Documents reviewed</p>
              <p className="mt-2 text-3xl font-light tracking-tight">
                {report.snapshot.documentsReviewed}
              </p>
            </div>
          </div>

          {/* Snapshot */}
          <dl className="mt-10 grid grid-cols-2 gap-y-6 border-t border-charcoal-mute pt-8 sm:grid-cols-5 sm:gap-x-8">
            <SnapshotItem label="Claim type" value={report.snapshot.claimType} />
            <SnapshotItem label="Carrier" value={report.snapshot.carrier ?? "Not provided"} />
            <SnapshotItem label="Loss date" value={report.snapshot.lossDate ?? "Not provided"} />
            <SnapshotItem label="Estimate total" value={report.snapshot.estimateTotal ?? "Not detected"} />
            <SnapshotItem label="Property state" value={report.snapshot.propertyState ?? "Not provided"} />
          </dl>
        </div>
      </header>

      {/* Disclaimer at top — also at bottom */}
      <div className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-10">
          <ClaimLensDisclaimer tone="light" />
        </div>
      </div>

      {/* Key findings */}
      <ReportSection
        title="Key findings"
        eyebrow="A. Overview"
        body="A short list of what stood out across the documents you uploaded. Each finding is tied to a severity and a specific document reference."
      >
        {report.keyFindings.length === 0 ? (
          <EmptyState label="No key findings yet — upload more documents for a deeper read." />
        ) : (
          <ul className="grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-2">
            {report.keyFindings.map((f, i) => (
              <li key={i} className="bg-ivory p-6">
                <SeverityBadge severity={f.severity} tone="light" />
                <p className="mt-4 text-lg font-medium leading-tight tracking-tight">
                  {f.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  {f.summary}
                </p>
              </li>
            ))}
          </ul>
        )}
      </ReportSection>

      {/* Missing scope */}
      <ReportSection
        title="Possible missing scope"
        eyebrow="B. Scope review"
        body="Line items or scope elements that may belong on the estimate. Confidence reflects how directly the uploaded documents support each finding."
      >
        {report.missingScope.length === 0 ? (
          <EmptyState label="No scope-gap findings — upload the carrier estimate, contractor estimate, and photos to enable this section." />
        ) : (
          <ul className="space-y-px overflow-hidden border border-line-light bg-line-light">
            {report.missingScope.map((m, i) => (
              <li key={i} className="bg-ivory p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-lg font-medium leading-tight tracking-tight">
                    {m.item}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <SeverityBadge severity={m.severity} tone="light" />
                    <ConfidenceLabel confidence={m.confidence} />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
                  {m.whyItMatters}
                </p>

                <div className="mt-5 grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-2">
                  <ReportField label="Evidence reference" body={m.evidenceReference} />
                  <ReportField label="Evidence needed" body={m.evidenceNeeded} />
                </div>

                <div className="mt-5 border-l-2 border-gold/60 bg-ivory-soft/60 px-5 py-4">
                  <p className="eyebrow text-gold-deep">Question to ask</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal">
                    {m.recommendedQuestion}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ReportSection>

      {/* Inconsistencies */}
      <ReportSection
        title="Estimate inconsistencies"
        eyebrow="C. Cross-checks"
        body="Places where one document appears to conflict with another, or where the line-item logic does not seem to add up against the documented loss."
      >
        {report.inconsistencies.length === 0 ? (
          <EmptyState label="No inconsistencies detected in the documents reviewed." />
        ) : (
          <ul className="grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-2">
            {report.inconsistencies.map((c, i) => (
              <li key={i} className="bg-ivory p-6">
                <SeverityBadge severity={c.severity} tone="light" />
                <p className="mt-4 text-lg font-medium leading-tight tracking-tight">
                  {c.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  {c.detail}
                </p>
              </li>
            ))}
          </ul>
        )}
      </ReportSection>

      {/* Questions */}
      <ReportSection
        title="Questions to ask the carrier"
        eyebrow="D. Conversation prompts"
        body="Professional, non-accusatory questions you can use as a starting point in your next call or email."
      >
        {report.questionsToAsk.length === 0 ? (
          <EmptyState label="No questions generated — review your uploaded documents and try again." />
        ) : (
          <ol className="space-y-px overflow-hidden border border-line-light bg-line-light">
            {report.questionsToAsk.map((q, i) => (
              <li key={i} className="flex gap-6 bg-ivory p-6">
                <span className="eyebrow flex-none text-gold-deep">
                  Q · {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-charcoal/85">{q}</p>
              </li>
            ))}
          </ol>
        )}
      </ReportSection>

      {/* Documentation checklist */}
      <ReportSection
        title="Documentation checklist"
        eyebrow="E. What to gather"
        body="Evidence that typically strengthens a claim file. Bring as much of this as you can to your next conversation."
      >
        {report.documentationChecklist.length === 0 ? (
          <EmptyState label="No checklist items yet." />
        ) : (
          <ul className="grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-2">
            {report.documentationChecklist.map((c, i) => (
              <li key={i} className="bg-ivory p-5">
                <label className="flex items-start gap-3 text-sm text-charcoal/85">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 flex-none border-charcoal/30"
                  />
                  <span>
                    {c.label}
                    {c.hint && (
                      <span className="block text-xs text-charcoal/55">
                        {c.hint}
                      </span>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </ReportSection>

      {/* Footer disclaimer */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <p className="eyebrow text-gold-soft">F. Disclaimer</p>
          <h2 className="mt-4 max-w-3xl text-2xl font-light leading-snug tracking-tight">
            This report is informational only and does not constitute legal
            advice, public adjusting, or a guarantee of payment.
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ivory/70">
            ClaimLens™ surfaces possibilities tied to the documents you
            uploaded. Coverage, settlement amounts, and outcomes depend on the
            terms of your insurance policy, the evidence in your claim file,
            the carrier&apos;s adjustment of that evidence, and applicable
            state law. For representation, negotiation, or legal advice, work
            with a licensed public adjuster or attorney in your state.
          </p>
        </div>
      </section>
    </article>
  );
}

function ReportSection({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <header className="lg:col-span-4">
            <p className="eyebrow text-gold-deep">{eyebrow}</p>
            <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/70">
              {body}
            </p>
          </header>
          <div className="lg:col-span-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

function ReportField({ label, body }: { label: string; body: string }) {
  return (
    <div className="bg-ivory p-4">
      <p className="eyebrow text-charcoal/55">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{body}</p>
    </div>
  );
}

function SnapshotItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-ivory/50">{label}</dt>
      <dd className="mt-2 text-base font-light tracking-tight text-ivory">
        {value}
      </dd>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-charcoal/20 p-6 text-sm text-charcoal/60">
      {label}
    </div>
  );
}
