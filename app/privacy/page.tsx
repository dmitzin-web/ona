import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { draftBanner, legalUpdated, privacySections } from "@/lib/legal";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How ONA Restoration collects, uses, and protects the information you share with us.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy."
      eyebrow="Legal"
      updated={legalUpdated}
      banner={draftBanner}
      sections={privacySections}
      breadcrumb={[
        { name: "Home", href: "/" },
        { name: "Privacy", href: "/privacy" },
      ]}
    />
  );
}
