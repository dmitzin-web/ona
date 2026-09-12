import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { draftBanner, legalUpdated, privacyPage, privacySections } from "@/lib/legal";

export const metadata: Metadata = buildMetadata({
  title: privacyPage.seoTitle,
  description: privacyPage.seoDescription,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title={privacyPage.heading}
      eyebrow={privacyPage.eyebrow}
      updated={legalUpdated}
      banner={draftBanner}
      sections={privacySections}
      breadcrumb={[
        { name: "Home", href: "/" },
        { name: privacyPage.breadcrumb, href: "/privacy" },
      ]}
    />
  );
}
