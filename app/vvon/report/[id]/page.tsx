import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VvonReportView } from "@/components/vvon/VvonReportView";
import { DeleteClaimButton } from "@/components/vvon/DeleteClaimButton";
import { buildMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import type { ClaimReport } from "@/lib/vvon/config";

export const metadata: Metadata = buildMetadata({
  title: "Your Vvon report",
  description:
    "Your Vvon report — severity-ranked findings, possible missing scope, inconsistencies, questions to ask, and a documentation checklist.",
  path: "/vvon/report",
  noindex: true,
});

// Real claim reports — gated by Supabase Auth, isolated per user via
// Row-Level Security. RLS policies on `claims` + `claim_reports` mean a
// signed-in user can only SELECT rows whose claim.user_id matches their
// auth.uid(). If a malicious user guesses someone else's claim ID they
// get notFound() instead of leakage.

export default async function ClaimReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Basic shape guard — UUIDs are 36 chars. Reject anything wildly off
  // so we don't even hit the DB.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=/vvon/report/${encodeURIComponent(id)}`);
  }

  // RLS does the auth check for us — if the claim isn't theirs, this
  // returns null. We deliberately don't 403; notFound() avoids
  // disclosing whether the claim exists.
  const { data: claim, error: claimErr } = await supabase
    .from("claims")
    .select("id, claim_type, property_state, carrier_name, status, created_at")
    .eq("id", id)
    .maybeSingle();
  if (claimErr || !claim) notFound();

  const { data: reportRow, error: reportErr } = await supabase
    .from("claim_reports")
    .select(
      "snapshot, key_findings, missing_scope, inconsistencies, questions, checklist, source, generated_at",
    )
    .eq("claim_id", id)
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (reportErr || !reportRow) {
    // Claim exists but no report yet — show a pending state. This can
    // happen if the user navigates directly here while analysis is
    // still running (we set status="analyzing" before calling Claude).
    return (
      <>
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Vvon", href: "/vvon" },
            { name: "Report", href: `/vvon/report/${id}` },
          ]}
        />
        <section className="bg-ivory">
          <div className="mx-auto max-w-3xl px-6 py-24 lg:px-10">
            <p className="eyebrow text-charcoal/60">Report pending</p>
            <h1 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
              {claim.status === "analyzing"
                ? "We're still analyzing your claim."
                : claim.status === "error"
                  ? "Analysis didn't finish."
                  : "Report not available yet."}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-charcoal/75">
              {claim.status === "analyzing"
                ? "Refresh this page in a moment. Large PDFs and photo-heavy claims can take up to a minute."
                : "Something went wrong while generating the report. Try uploading the documents again."}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/vvon/upload"
                className="inline-flex items-center gap-3 border border-charcoal bg-charcoal px-6 py-3 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal"
              >
                Run another claim
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Translate DB row → ClaimReport shape expected by the renderer.
  const report: ClaimReport = {
    snapshot: (reportRow.snapshot as ClaimReport["snapshot"]) ?? {
      claimType: claim.claim_type,
      documentsReviewed: 0,
      estimateTotal: null,
      lossDate: null,
      carrier: claim.carrier_name,
      propertyState: claim.property_state,
    },
    keyFindings: (reportRow.key_findings as ClaimReport["keyFindings"]) ?? [],
    missingScope: (reportRow.missing_scope as ClaimReport["missingScope"]) ?? [],
    inconsistencies:
      (reportRow.inconsistencies as ClaimReport["inconsistencies"]) ?? [],
    questionsToAsk:
      (reportRow.questions as ClaimReport["questionsToAsk"]) ?? [],
    documentationChecklist:
      (reportRow.checklist as ClaimReport["documentationChecklist"]) ?? [],
    generatedAt: reportRow.generated_at,
    source: (reportRow.source === "ai" || reportRow.source === "mock"
      ? reportRow.source
      : "ai") as ClaimReport["source"],
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Vvon", href: "/vvon" },
          { name: "Report", href: `/vvon/report/${id}` },
        ]}
      />
      <VvonReportView report={report} isDemo={false} />

      <section className="bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 border-t border-line-light px-6 py-10 lg:px-10">
          <Link
            href="/vvon/upload"
            className="inline-flex items-center gap-2 border border-charcoal px-6 py-3 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:bg-charcoal hover:text-ivory"
          >
            Run another claim
          </Link>
          <DeleteClaimButton
            claimId={id}
            size="md"
            onDeletedHref="/account"
          />
          <Link
            href="/vvon"
            className="text-sm uppercase tracking-[0.22em] text-charcoal/60 transition hover:text-charcoal"
          >
            ← Back to Vvon
          </Link>
        </div>
      </section>
    </>
  );
}
