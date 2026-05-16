import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { FAQ } from "@/components/FAQ";
import { VvonHero } from "@/components/vvon/VvonHero";
import { VvonHowItWorks } from "@/components/vvon/VvonHowItWorks";
import { VvonFeatureGrid } from "@/components/vvon/VvonFeatureGrid";
import { VvonCategories } from "@/components/vvon/VvonCategories";
import { VvonCTA } from "@/components/vvon/VvonCTA";
import { VvonDisclaimer } from "@/components/vvon/VvonDisclaimer";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { faqs, vvon } from "@/lib/vvon/config";

export const metadata: Metadata = buildMetadata({
  title: "Vvon — AI Insurance Estimate Review",
  description:
    "Vvon is an AI-assisted reality check for property insurance estimates. Upload your claim documents and get a structured report on possible missing scope, inconsistencies, and documentation gaps.",
  path: "/vvon",
  image: "/vvon/opengraph-image",
  keywords: [
    "insurance estimate review",
    "claim document analysis",
    "missing scope insurance",
    "supplement estimate review",
    "AI claim review",
    "Xactimate review",
    "property damage claim",
  ],
});

export default function VvonLandingPage() {
  return (
    <>
      <VvonHero />

      {/* Problem statement */}
      <section className="border-b border-line-light bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-charcoal/60">The problem</p>
              <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                Most policyholders don&apos;t know what&apos;s missing.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-lg leading-relaxed text-charcoal/80">
                Carrier estimates are dense. They use abbreviations,
                depreciation tables, and line-item logic that the average
                homeowner — and even a lot of contractors — never see in any
                other context. Important scope can quietly go missing without
                anyone noticing until it&apos;s too late to negotiate.
              </p>
              <p className="mt-5 text-base leading-relaxed text-charcoal/75">
                Things that commonly fall off an estimate include:
              </p>
              <ul className="mt-6 grid gap-x-8 gap-y-2 text-sm text-charcoal/80 sm:grid-cols-2">
                {[
                  "Flooring continuity across rooms",
                  "Baseboard detach/reset and repainting",
                  "Insulation, drywall, texture, paint blending",
                  "Mitigation charges (extraction, drying)",
                  "Mold remediation scope",
                  "HVAC cleaning",
                  "Pack-out / contents handling",
                  "Code-related work where applicable",
                  "Supervision, protection, final cleaning",
                  "Quantity differences and waste factors",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <VvonDisclaimer tone="light" compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      <VvonHowItWorks />
      <VvonFeatureGrid />
      <VvonCategories />

      <FAQ items={faqs.map((f) => ({ q: f.q, a: f.a }))} />

      <VvonCTA />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Vvon", url: "/vvon" },
          ]),
          faqJsonLd(faqs.map((f) => ({ q: f.q, a: f.a }))),
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: `${vvon.name}${vvon.symbol}`,
            applicationCategory: "BusinessApplication",
            description: vvon.shortDescription,
            disclaimer: vvon.disclaimer,
          },
        ]}
      />
    </>
  );
}
