import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/lib/seo";
import {
  claimLensTermsSections,
  draftBanner,
  legalUpdated,
  termsSections,
} from "@/lib/legal";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms that govern use of the ONA Restoration website, our restoration services, and the ClaimLens™ AI claim review product.",
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
      secondaryHeading="ClaimLens™ product-specific terms"
      secondarySections={claimLensTermsSections}
      breadcrumb={[
        { name: "Home", href: "/" },
        { name: "Terms", href: "/terms" },
      ]}
    />
  );
}
