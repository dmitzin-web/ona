import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ServiceCard } from "@/components/ServiceCard";
import { ValuesGrid } from "@/components/ValuesGrid";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons/ServiceIcons";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";

const homeFaqs = [
  {
    q: "How fast can you respond in Portland or Vancouver, WA?",
    a: "Our 24/7 dispatch targets 60 minutes on-site anywhere in the Portland metro area. We are based in Vancouver, WA and staff overnight crews for emergencies.",
  },
  {
    q: "Do you work directly with insurance carriers?",
    a: "Yes. We document the loss with photos, moisture readings, and an Xactimate-formatted estimate, and we communicate directly with your adjuster from first notice of loss through final invoice.",
  },
  {
    q: "What restoration services do you offer?",
    a: "Water damage restoration, fire and smoke damage restoration, mold remediation, and storm damage repair — including emergency board-up, structural drying, and full reconstruction.",
  },
  {
    q: "Are your technicians certified?",
    a: "Yes. Our crews carry IICRC certifications in Water Damage Restoration (WRT), Applied Structural Drying (ASD), Applied Microbial Remediation (AMRT), and Fire & Smoke Restoration (FSRT). We are licensed, bonded and insured in both Washington and Oregon.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — ${site.tagline}`,
  description: site.shortDescription,
  path: "/",
  keywords: [
    "high-end restoration Vancouver WA",
    "luxury restoration Portland OR",
    "water damage restoration Portland metro",
    "fire damage restoration Portland",
    "mold remediation Vancouver WA",
    "storm damage repair Portland",
    "24/7 emergency restoration Portland metro",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Intro / proof strip */}
      <section className="border-b border-line-light bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-charcoal/60">Who we are</p>
              <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                Restoration, the way it should be done.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-lg leading-relaxed text-charcoal/80">
                ONA Restoration is a specialist contractor for high-end
                residential and commercial property losses across the Portland
                metro. We run every job to IICRC S500 and S520 standards,
                document everything to the level your adjuster expects, and
                rebuild with the craftsmanship the property deserves.
              </p>
              <p className="mt-5 text-lg leading-relaxed text-charcoal/80">
                One contractor. One point of contact. From the first emergency
                call to the final walkthrough.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow text-charcoal/60">Services</p>
              <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                Full-service restoration.
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 eyebrow text-charcoal transition hover:gap-3"
            >
              All services
              <ArrowIcon className="h-3 w-3 stroke-current" />
            </Link>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s) => (
              <div key={s.slug}>
                <ServiceCard service={s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New: Vvon — AI claim review tool */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
          <div className="relative overflow-hidden border border-line-light bg-charcoal text-ivory">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,152,94,0.14),transparent_60%)]"
            />
            <div className="relative grid gap-10 px-8 py-14 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-16">
              <div className="lg:col-span-7">
                <p className="eyebrow text-gold-soft">
                  New · AI claim estimate review
                </p>
                <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                  Not sure if your insurance estimate is complete?{" "}
                  <span className="font-medium text-gold">
                    Run it through Vvon™.
                  </span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/75">
                  Upload your insurance estimate and related documents.
                  Vvon™ helps identify possible missing scope, underpayment
                  signals, and documentation gaps — informational only.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 lg:col-span-5 lg:items-end lg:justify-center">
                <a
                  href="https://vvon.ai"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-3 border border-ivory bg-ivory px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:bg-transparent hover:text-ivory"
                >
                  Try Vvon™
                  <ArrowIcon className="h-4 w-4 stroke-current" />
                </a>
                <a
                  href="https://vvon.ai/upload"
                  target="_blank"
                  rel="noopener"
                  className="text-sm uppercase tracking-[0.22em] text-ivory/60 transition hover:text-ivory"
                >
                  Analyze a claim →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ValuesGrid tone="dark" />

      {/* Process */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-charcoal/60">Process</p>
              <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                From emergency call to keys back.
              </h2>
            </div>
            <ol className="grid gap-12 sm:grid-cols-2 lg:col-span-8">
              {[
                { n: "01", t: "Call", d: "Live answer 24/7. Crew dispatched within minutes." },
                { n: "02", t: "Assess", d: "Moisture mapping, scope, photo documentation." },
                { n: "03", t: "Mitigate", d: "Extraction, drying, containment, antimicrobial." },
                { n: "04", t: "Rebuild", d: "Drywall, flooring, finish carpentry, paint." },
              ].map((step) => (
                <li key={step.n} className="border-t border-charcoal/20 pt-6">
                  <p className="eyebrow text-charcoal/50">{step.n}</p>
                  <p className="mt-4 text-2xl font-light tracking-tight">
                    {step.t}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                    {step.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-warm-gray-soft">Service area</p>
              <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                Vancouver, WA and the Portland metro.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/70">
                Headquartered in Vancouver, WA. Crews staged across the metro
                so we can hit our 60-minute response target through Clark,
                Multnomah, Washington and Clackamas counties.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-px overflow-hidden border border-charcoal-mute bg-charcoal-mute lg:col-span-7 sm:grid-cols-2">
              {site.serviceArea.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/areas/${a.slug}`}
                    className="block bg-charcoal px-6 py-5 text-sm font-medium tracking-tight text-ivory/80 transition hover:bg-charcoal-soft hover:text-ivory"
                  >
                    {a.name}, {a.region}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-charcoal/60">Certifications</p>
              <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                Insurance-grade. Documented.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal/75">
                Restoration is a regulated trade for a reason. We hold the
                IICRC certifications, carry the insurance, and document every
                job to the S500 / S520 standards your adjuster expects.
              </p>
              <p className="mt-6 text-base text-charcoal">
                <span className="font-medium">{site.rating.value} / 5</span>
                <span className="text-charcoal/60">
                  {" "}
                  across {site.rating.count}+ Google reviews
                </span>
              </p>
            </div>
            <ul className="space-y-px overflow-hidden border border-line-light bg-line-light lg:col-span-7">
              {site.certifications.map((c) => (
                <li
                  key={c}
                  className="bg-ivory px-6 py-5 text-base text-charcoal/85"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FAQ items={homeFaqs} />
      <CTA />
      <JsonLd data={faqJsonLd(homeFaqs)} />
    </>
  );
}
