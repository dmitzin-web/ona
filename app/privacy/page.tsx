import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import {
  vvonPrivacySections,
  draftBanner,
  legalUpdated,
  privacySections,
} from "@/lib/legal";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How ONA Restoration and Vvon collect, use and protect the information you share with us.",
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
      secondaryHeading="Vvon product-specific privacy"
      secondarySections={vvonPrivacySections}
      breadcrumb={[
        { name: "Home", href: "/" },
        { name: "Privacy", href: "/privacy" },
      ]}
    />
  );
}
