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
    "property restoration Vancouver WA",
    "trusted restoration Portland OR",
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
      <Hero
        image={{
          src: "/photos/hero.svg",
          alt: "Property restoration crews dispatching across Vancouver, WA and the Portland metro — ONA Restoration",
        }}
      />

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
                ONA Restoration is a specialist contractor for residential
                and commercial property losses across the Portland metro.
                We run every job to IICRC S500 and S520 standards,
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

      {/* Restoration services — emergency / insurance-driven side of the
          business. Four cards in a 4-column grid (was 5 with remodeling
          mixed in, which buried it). Remodeling now has its own dedicated
          promo block immediately below this section. */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow text-charcoal/60">Restoration</p>
              <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                Emergency restoration, end to end.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/70">
                24/7 dispatch with a 60-minute on-site target. IICRC-certified
                crews, insurance-grade documentation, one contractor from the
                first call to the final walkthrough.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 eyebrow text-charcoal transition hover:gap-3"
            >
              All services
              <ArrowIcon className="h-3 w-3 stroke-current" />
            </Link>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-4">
            {services
              .filter((s) => s.slug !== "remodeling")
              .map((s) => (
                <div key={s.slug}>
                  <ServiceCard service={s} />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Remodeling — co-equal business line, surfaced as a full-width
          dark-contrast promo block. The point: signal that remodeling is
          its own division, not a 5th-place add-on hidden in the services
          grid. */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
          <Link
            href="/services/remodeling"
            className="group relative block overflow-hidden border border-line-light bg-charcoal text-ivory transition hover:border-gold"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(184,152,94,0.16),transparent_60%)]"
            />
            <div className="relative grid gap-10 px-8 py-14 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-16">
              <div className="lg:col-span-7">
                <p className="eyebrow text-gold-soft">
                  Remodeling &amp; reconstruction
                </p>
                <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                  Kitchens, baths, whole-house renovations.{" "}
                  <span className="font-medium text-gold">
                    Built by a restoration crew.
                  </span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/75">
                  Most clients meet us through a loss, then keep us on for the
                  renovation they actually want. Same crew, same insurance-grade
                  documentation discipline, no handoff to a second contractor
                  for the rebuild.
                </p>
              </div>
              <div className="flex items-end lg:col-span-5 lg:justify-end">
                <div className="flex flex-col items-start gap-4 lg:items-end">
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm tracking-wide text-ivory/65">
                    <li>Kitchens</li>
                    <li>·</li>
                    <li>Baths</li>
                    <li>·</li>
                    <li>Whole-house</li>
                    <li>·</li>
                    <li>Additions</li>
                    <li>·</li>
                    <li>Custom millwork</li>
                  </ul>
                  <span className="inline-flex items-center gap-3 border border-ivory bg-ivory px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition group-hover:bg-transparent group-hover:text-ivory">
                    Explore remodeling
                    <ArrowIcon className="h-4 w-4 stroke-current" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Insurance billing explainer — removes the "do I pay first?" friction
          that audit identified as a conversion blocker. Most homeowners with
          a covered loss don't realize the contractor bills the carrier
          directly; making it visible up front converts hesitant calls. */}
      <section className="border-t border-line-light bg-ivory-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-charcoal/60">Insurance billing</p>
              <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                We bill your carrier directly.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal/75">
                Most covered losses cost you only the deductible at the end.
                Here is how the money actually moves.
              </p>
            </div>
            <ol className="lg:col-span-8 grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-2">
              {[
                {
                  step: "1",
                  title: "First notice of loss",
                  text: "You call your carrier (or we help). The claim is opened and an adjuster assigned, usually within 24 hours.",
                },
                {
                  step: "2",
                  title: "Emergency mitigation, authorized on the phone",
                  text: "Most carriers authorize emergency drying/board-up immediately. We start the same day — you do not front the cost.",
                },
                {
                  step: "3",
                  title: "Xactimate scope to the adjuster",
                  text: "We document the loss in the same software the carrier uses. Reduces back-and-forth and underpayment risk.",
                },
                {
                  step: "4",
                  title: "Carrier pays us, you pay your deductible",
                  text: "Final invoice goes to the carrier. You pay only the deductible (typically $1,000–$2,500) at completion.",
                },
              ].map((s) => (
                <li key={s.step} className="bg-ivory p-8">
                  <p className="eyebrow text-charcoal/40">Step {s.step}</p>
                  <h3 className="mt-4 text-lg font-medium tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
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
