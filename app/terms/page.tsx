import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { draftBanner, legalUpdated, termsPage, termsSections } from "@/lib/legal";

export const metadata: Metadata = buildMetadata({
  title: termsPage.seoTitle,
  description: termsPage.seoDescription,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title={termsPage.heading}
      eyebrow={termsPage.eyebrow}
      updated={legalUpdated}
      banner={draftBanner}
      sections={termsSections}
      breadcrumb={[
        { name: "Home", href: "/" },
        { name: termsPage.breadcrumb, href: "/terms" },
      ]}
    />
  );
}
