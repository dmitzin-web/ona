import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ValuesGrid } from "@/components/ValuesGrid";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: `About ${site.name} — Vancouver, WA Restoration Specialists`,
  description: `${site.name} is an IICRC-certified restoration contractor based in Vancouver, WA, serving the Portland metro since ${site.founded}. Founded by Dmitry Zinovyev. Locally owned, licensed in WA and OR.`,
  path: "/about",
});

const aboutFaqs = [
  {
    q: "Is ONA Restoration a franchise?",
    a: "No. ONA Restoration & Remodeling is a locally-owned, independent contractor based in Vancouver, WA. We are not affiliated with SERVPRO, PuroClean, ServiceMaster, or any other national restoration brand. Every job is run by our own crew, supervised by our founder.",
  },
  {
    q: "What areas do you serve?",
    a: "Vancouver, WA and the entire Portland metro — Clark, Multnomah, Washington and Clackamas counties. Our standard response target is 60 minutes anywhere in this footprint. For locations on the edges (Hillsboro, Lake Oswego, Gresham) we pre-stage trucks during weather emergencies.",
  },
  {
    q: "Are you certified to work with my insurance company?",
    a: "Yes. We document losses in Xactimate format, which is the same estimating system every major carrier uses (State Farm, Allstate, USAA, Farmers, Liberty Mutual, etc.). We can bill the insurer directly so you don't front the cost of mitigation.",
  },
  {
    q: "What does IICRC certified mean and why does it matter?",
    a: "The Institute of Inspection, Cleaning and Restoration Certification (IICRC) is the standards body for the restoration industry. Their S500 (water) and S520 (mold) standards define what proper mitigation actually looks like. We hold WRT (water), ASD (structural drying), AMRT (mold remediation) and FSRT (fire/smoke) certifications and we run every job to those standards — not to whatever the homeowner happens to know.",
  },
  {
    q: "Do you handle both emergency mitigation and the final rebuild?",
    a: "Yes — we run as a single-source contractor. The same team that extracts the water and dries the structure handles drywall, flooring, paint, cabinetry and finish carpentry. One contract, one schedule, one point of contact. This is unusual in the industry; most restoration outfits hand the rebuild off to a separate general contractor.",
  },
  {
    q: "Are you licensed in both Washington and Oregon?",
    a: "Yes. Licensed, bonded and insured for both restoration and reconstruction in WA and OR. Permitting jurisdictions across Clark, Multnomah, Washington and Clackamas counties know us by name.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">About</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            We restore more than properties. We restore trust.
          </h1>
          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="space-y-6 text-lg leading-relaxed text-charcoal/80">
                <p>
                  {site.name} is a locally owned restoration contractor based
                  in Vancouver, Washington, serving homeowners, property
                  managers and business owners across the Portland metro since{" "}
                  {site.founded}.
                </p>
                <p>
                  Restoration is one of the few trades you call when you&apos;re
                  already having the worst day of the month. Our job is to make
                  the next hour easier, the next week predictable, and the
                  final walkthrough drama-free. We do that by running every job
                  to the IICRC S500 / S520 standards, documenting everything to
                  the level your insurance adjuster expects, and keeping you in
                  the loop with one point of contact from emergency call to keys
                  back.
                </p>
                <p>
                  We&apos;re certified, licensed, bonded and insured in both
                  Washington and Oregon — which matters in this metro because
                  half our calls are on one side of the Columbia and half are
                  on the other.
                </p>
              </div>
            </div>
            <aside className="lg:col-span-5">
              <div className="border border-line-light p-8">
                <p className="eyebrow text-charcoal/60">Credentials</p>
                <ul className="mt-6 space-y-3 text-base text-charcoal/85">
                  {site.certifications.map((c) => (
                    <li
                      key={c}
                      className="border-t border-line-light pt-3 first:border-t-0 first:pt-0"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Founder section — DOM anchor for the Person @id used in JSON-LD */}
      <section id="founder" className="border-t border-line-light bg-ivory scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">Founder</p>
          <h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            Founded and led by Dmitry Zinovyev.
          </h2>
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="space-y-6 text-base leading-relaxed text-charcoal/80">
                <p>
                  Dmitry built ONA Restoration &amp; Remodeling after watching
                  the Pacific Northwest restoration market run the same playbook
                  over and over: turn up late, demo aggressively, bill heavily,
                  and disappear before the rebuild is finished. Homeowners
                  deserved better, and the carriers were ready to pay for
                  better — they just needed a contractor on the ground who
                  would deliver insurance-grade documentation, IICRC-spec work,
                  and finish carpentry good enough that the rebuild was
                  invisible.
                </p>
                <p>
                  That&apos;s the company he&apos;s building. Every crew runs
                  the same documentation discipline he runs himself when
                  he&apos;s the one on site at 3 a.m. Every estimate is in
                  Xactimate, line-itemed, and matches the carrier&apos;s own
                  pricing database. Every job has one named point of contact —
                  usually Dmitry himself for the first 24 hours of an
                  emergency loss.
                </p>
                <p>
                  Dmitry is the technical lead on the most complex projects
                  ONA takes — large-loss water, multi-room fires, mold
                  remediation jobs that involve third-party Indoor
                  Environmental Professional clearance, and custom
                  reconstruction. He is also the person who answers the phone
                  if you call after hours. That&apos;s by design.
                </p>
              </div>
            </div>
            <aside className="lg:col-span-4">
              <div className="border border-line-light p-8">
                <p className="eyebrow text-charcoal/60">Contact</p>
                <p className="mt-5 text-sm leading-relaxed text-charcoal/80">
                  For project consultations, partnership, press, or anything
                  that should reach the founder directly:
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-5 block text-base font-medium tracking-tight text-charcoal underline decoration-charcoal/30 underline-offset-4 transition hover:decoration-charcoal break-words"
                >
                  {site.email}
                </a>
                <a
                  href={`tel:${site.phone}`}
                  className="mt-3 block text-base font-medium tracking-tight text-charcoal underline decoration-charcoal/30 underline-offset-4 transition hover:decoration-charcoal"
                >
                  {site.phoneDisplay}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="border-t border-line-light bg-ivory-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">How we work</p>
          <h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            Three things we do differently.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-line-light bg-line-light md:grid-cols-3">
            <div className="bg-ivory p-10">
              <p className="eyebrow text-charcoal/40">01</p>
              <h3 className="mt-4 text-xl font-medium tracking-tight">
                Documentation by default
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
                Thermal imaging, moisture readings, daily progress photos and
                an Xactimate-formatted scope on every job — not just the ones
                that look complicated. It&apos;s the same standard your
                adjuster uses, applied from the first call.
              </p>
            </div>
            <div className="bg-ivory p-10">
              <p className="eyebrow text-charcoal/40">02</p>
              <h3 className="mt-4 text-xl font-medium tracking-tight">
                One contractor, end to end
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
                Mitigation, demolition, structural repair and the final
                finish-carpentry rebuild are all the same crew. No handoffs
                to subcontractors you&apos;ve never met. One contract, one
                point of contact, one final walkthrough.
              </p>
            </div>
            <div className="bg-ivory p-10">
              <p className="eyebrow text-charcoal/40">03</p>
              <h3 className="mt-4 text-xl font-medium tracking-tight">
                Insurance-grade handover
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
                We talk to your adjuster so you don&apos;t have to. Every
                disputed line item is backed by photo and moisture
                documentation captured the first day. We close more claims at
                full scope than the industry average because we make the
                adjuster&apos;s job easier, not harder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* By the numbers — facts that are verifiable on day one. Google rating
          is intentionally omitted until the GBP profile is verified and
          accumulates real reviews; surfacing a fabricated count works
          against verification. Add a fourth stat here once GBP is live. */}
      <section className="border-t border-line-light bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-warm-gray-soft">How we&apos;re set up</p>
          <h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            Locally owned. IICRC-certified. Built for the Pacific Northwest.
          </h2>
          <dl className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-3">
            <Stat
              label="Service area"
              value="10 cities"
              note="Vancouver, WA + Portland metro — Clark, Multnomah, Washington & Clackamas counties"
            />
            <Stat
              label="Certifications"
              value="IICRC"
              note="WRT, ASD, AMRT, FSRT — water, drying, mold, fire & smoke"
            />
            <Stat
              label="Dispatch"
              value="24 / 7 / 365"
              note="Live technician answer — no call-center routing"
            />
          </dl>
        </div>
      </section>

      <ValuesGrid tone="light" />

      <FAQ items={aboutFaqs} title="Questions we hear" />

      <CTA />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: `${site.url}/about`,
            mainEntity: { "@id": `${site.url}/#business` },
          },
          faqJsonLd(aboutFaqs),
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${site.url}/about#founder`,
            name: "Dmitry Zinovyev",
            jobTitle: "Founder",
            email: site.email,
            telephone: site.phone,
            worksFor: { "@id": `${site.url}/#business` },
            url: `${site.url}/about#founder`,
            knowsAbout: [
              "Water damage restoration",
              "Fire and smoke damage restoration",
              "Mold remediation",
              "Insurance claim documentation",
              "Xactimate insurance estimating",
              "IICRC S500 and S520 standards",
            ],
          },
        ]}
      />
    </>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div>
      <dt className="eyebrow text-ivory/55">{label}</dt>
      <dd className="mt-4 text-3xl font-light tracking-tight text-ivory">
        {value}
      </dd>
      <p className="mt-3 text-xs leading-relaxed text-ivory/55">{note}</p>
    </div>
  );
}
