import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { ReportClient } from "./ReportClient";

export const metadata: Metadata = buildMetadata({
  title: "Sample Report — Vvon",
  description:
    "Preview a Vvon claim report. Severity-ranked findings, possible missing scope, inconsistencies, questions to ask, and a documentation checklist.",
  path: "/vvon/report",
  // The "report" page is also used for live reports stored in
  // sessionStorage, so we let search engines index the demo view but the
  // dynamic data never leaves the client.
});

export default function VvonReportPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Vvon", href: "/vvon" },
          { name: "Report", href: "/vvon/report" },
        ]}
      />
      <ReportClient />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Vvon", url: "/vvon" },
          { name: "Report", url: "/vvon/report" },
        ])}
      />
    </>
  );
}
