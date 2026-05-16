import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import {
  claimLensPrivacySections,
  draftBanner,
  legalUpdated,
  privacySections,
} from "@/lib/legal";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How ONA Restoration and ClaimLens™ collect, use and protect the information you share with us.",
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
      secondaryHeading="ClaimLens™ product-specific privacy"
      secondarySections={claimLensPrivacySections}
      breadcrumb={[
        { name: "Home", href: "/" },
        { name: "Privacy", href: "/privacy" },
      ]}
    />
  );
}
