import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { draftBanner, legalUpdated, termsSections } from "@/lib/legal";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern use of the ONA Restoration website and our restoration services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service."
      eyebrow="Legal"
      updated={legalUpdated}
      banner={draftBanner}
      sections={termsSections}
      breadcrumb={[
        { name: "Home", href: "/" },
        { name: "Terms", href: "/terms" },
      ]}
    />
  );
}
