import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { ReportClient } from "./ReportClient";

export const metadata: Metadata = buildMetadata({
  title: "Sample Report — ClaimLens™",
  description:
    "Preview a ClaimLens™ claim report. Severity-ranked findings, possible missing scope, inconsistencies, questions to ask, and a documentation checklist.",
  path: "/claimlens/report",
  // The "report" page is also used for live reports stored in
  // sessionStorage, so we let search engines index the demo view but the
  // dynamic data never leaves the client.
});

export default function ClaimLensReportPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "ClaimLens", href: "/claimlens" },
          { name: "Report", href: "/claimlens/report" },
        ]}
      />
      <ReportClient />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "ClaimLens", url: "/claimlens" },
          { name: "Report", url: "/claimlens/report" },
        ])}
      />
    </>
  );
}
