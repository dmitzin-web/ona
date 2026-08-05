import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon, serviceIcons } from "@/components/icons/ServiceIcons";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

// Spokane wildfire deployment — a deliberately DIFFERENT template from the
// standard city × service page. Spokane is ~340 miles from HQ; we are NOT
// local there. Using the local template ("20-min dispatch", "our
// neighborhoods") on this URL would be a false local-presence claim and
// carries GBP + WA OIC risk under out-of-state storm-chaser rules. This
// page frames ONA as a Washington-licensed mobile deployment responding to
// a specific event — honest, and defensible.
//
// Do NOT "unify" this back into the shared template. Deviations are
// intentional. See /Users/dmitryzinovyev/Downloads/spokane-wa-fire-page.md
// for the source spec.
//
// TODO before large paid-traffic push: swap `site.phoneDisplay` for a
// dedicated 509 call-tracker to separate Spokane conversions from the
// (360) company line.

const SPOKANE_FAQ = [
  {
    q: "Can you start before the fire investigation is complete?",
    a: "Yes — emergency board-up and stabilization can begin right away. We coordinate around any investigation or re-entry restrictions.",
  },
  {
    q: "Will smoke odor really come out?",
    a: "In most cases, yes. It depends on soot type and how deep it penetrated — our assessment tells you exactly what can be cleaned versus what needs replacement.",
  },
  {
    q: "Do you handle the rebuild too?",
    a: "Yes — from stabilization through full insurance-billed reconstruction, you approve each phase.",
  },
  {
    q: "Are you licensed in Washington?",
    a: `Yes — ${site.legalName}, WA Contractor Registration ONARER*748K8, insured and IICRC-certified. Verify us on the L&I website.`,
  },
  {
    q: "My property isn't accessible yet — can you still help?",
    a: "Call us now. We'll log your property and respond the moment re-entry is allowed.",
  },
];

const COMMON_LOSSES = [
  "Emergency board-up & roof tarping — secure the structure, keep weather and looters out",
  "Smoke & soot cleaning and structural cleaning",
  "Odor removal — thermal fogging, hydroxyl, encapsulation",
  "Contents inventory & cleaning",
  "Insulation, drywall & framing removal where cleaning won't hold",
  "Full insurance-billed reconstruction",
];

const LOSS_TYPES = [
  "Total loss and partial structural fire — where the structure itself burned",
  "Exterior & heat exposure — siding, roofing, and window damage from radiant heat and embers",
  "Wildfire smoke & soot only — homes that didn't burn but are full of acidic soot and odor",
  "Ash and particulate infiltration through HVAC, attics, and crawlspaces",
];

const PROCESS = [
  {
    step: "Emergency response & board-up",
    text: "First 24 hours — stabilize the structure, tarp the roof, board openings, and stop secondary damage.",
  },
  {
    step: "Damage & contents assessment",
    text: "Photo and Matterport documentation of every affected surface and item — the record your carrier needs.",
  },
  {
    step: "Water & debris removal",
    text: "Fire-fighting water and burned debris out before soot etches deeper and odor sets.",
  },
  {
    step: "Soot & residue cleaning",
    text: "HEPA vacuuming, wet cleaning, and surface-appropriate methods for each material.",
  },
  {
    step: "Odor removal",
    text: "Thermal fogging, hydroxyl, or encapsulation — the right combination for the smoke type and structure.",
  },
  {
    step: "Reconstruction",
    text: "Insulation, drywall, framing, finishes — one team from stabilization through the final walkthrough.",
  },
];

const AREAS_SERVED = [
  "Spokane",
  "Spokane Valley",
  "Airway Heights",
  "Medical Lake",
  "Cheney",
  "Deer Park",
];

export function SpokaneFireDeployment() {
  const Icon = serviceIcons["fire-damage"];
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Fire & Smoke", href: "/services/fire-damage" },
          {
            name: "Spokane, WA",
            href: "/services/fire-damage/spokane-wa",
          },
        ]}
      />

      {/* Hero — honest deployment framing, no false local claims */}
      <section className="relative overflow-hidden bg-charcoal text-ivory">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,244,241,0.06),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pb-24 lg:pt-20">
          <p className="eyebrow text-warm-gray-soft">
            Fire &amp; Smoke · Spokane, WA
          </p>
          <h1 className="text-ivory mt-8 max-w-3xl text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Fire &amp; Smoke Damage Restoration in{" "}
            <span className="font-medium">Spokane, WA.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/75">
            We&apos;ve deployed a Washington-licensed mobile fire &amp; smoke
            crew to Spokane County in response to the wildfires. Emergency
            board-up, soot cleanup, and full insurance documentation — from
            the first 24 hours through reconstruction.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={`tel:${site.phone}`}
              className="inline-flex items-center gap-3 border border-ivory bg-charcoal px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-ivory hover:text-charcoal"
            >
              Call {site.phoneDisplay}
            </a>
            <Link
              href="/start-project"
              className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory"
            >
              Start a project
            </Link>
            <a
              href={`mailto:${site.email}?subject=Spokane%20wildfire%20response`}
              className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory"
            >
              Email a photo
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-y-6 border-t border-ivory/15 pt-8 sm:grid-cols-4 sm:gap-x-8">
            <Stat label="Status" value="Deployed" />
            <Stat label="Team" value="WA-licensed mobile crew" />
            <Stat label="County" value="Spokane County" />
            <Stat label="Service" value="Wildfire Fire & Smoke" />
          </div>
        </div>
      </section>

      {/* Section 1 — Fire & Smoke in Spokane */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              {Icon && <Icon className="h-12 w-12 stroke-current text-ivory" />}
              <p className="eyebrow mt-6 text-ivory/60">
                Fire &amp; Smoke in Spokane
              </p>
              <h2 className="text-ivory mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                The damage keeps spreading after the fire is out.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-lg leading-relaxed text-ivory/80">
                After the fire department leaves, the damage keeps spreading.
                Soot is acidic and keeps etching metal, glass, and finishes
                within hours — and smoke odor drives deeper into drywall,
                framing, and HVAC the longer it sits. With the Spokane area
                fires, the first priority is stabilizing the property and
                documenting everything before that damage compounds.
                We&apos;re a Washington-licensed crew, on the ground and ready
                to respond across Spokane County.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — What we see in Spokane */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-ivory/60">Spokane context</p>
              <h2 className="text-ivory mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                What we see in Spokane.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/75">
                The Spokane fires are producing a mix of loss types, and each
                needs a different response.
              </p>
            </div>
            <div className="lg:col-span-7">
              <h3 className="eyebrow text-ivory/55">Loss types we see</h3>
              <ul className="mt-3 space-y-3 text-base text-ivory/80">
                {LOSS_TYPES.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-warm-gray-soft"
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-base leading-relaxed text-ivory/75">
                We assess which surfaces can be cleaned and which must be
                replaced — and put it in writing for your insurer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Wildfire & loss pattern (replaces local weather block) */}
      <section className="border-t border-ivory/10 bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-ivory/60">Wildfire pattern</p>
              <h2 className="text-ivory mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                Eastern Washington fires move fast.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-lg leading-relaxed text-ivory/80">
                Eastern Washington summers are hot, dry, and wind-driven,
                which is exactly how these fires moved so fast. Wind-blown
                embers ignite structures well ahead of the main fire line,
                and dense wildfire smoke settles soot into homes across a
                wide radius — not just the burn zone. Corrosive soot means
                the clock matters: cleanable materials become replace-only
                the longer treatment is delayed.
              </p>
              <h3 className="mt-10 eyebrow text-ivory/55">
                Common losses in Spokane County
              </h3>
              <ul className="mt-3 space-y-3 text-base text-ivory/80">
                {COMMON_LOSSES.map((loss) => (
                  <li key={loss} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-warm-gray-soft"
                    />
                    <span>{loss}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Areas we're responding to */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/60">Areas we&apos;re responding to</p>
          <h2 className="text-ivory mt-4 max-w-2xl text-3xl font-light leading-tight tracking-tight sm:text-4xl">
            Serving Spokane County and surrounding communities.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/75">
            {AREAS_SERVED.join(" · ")} · and nearby areas.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/70">
            Property not yet accessible? Call us anyway — we&apos;ll log it
            and respond as soon as authorities allow re-entry.
          </p>
        </div>
      </section>

      {/* Section 6 — Process */}
      <section className="bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/60">Process</p>
          <h2 className="text-ivory mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
            How a fire &amp; smoke job runs in Spokane.
          </h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((p, i) => (
              <li key={p.step} className="border-t border-ivory/20 pt-6">
                <p className="eyebrow text-ivory/50">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-ivory mt-3 text-xl font-light tracking-tight">
                  {p.step}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                  {p.text}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-12 max-w-3xl text-sm leading-relaxed text-ivory/60">
            We document the damage and submit a detailed scope to your
            carrier. Coverage and payment decisions remain with your
            insurance company.
          </p>
        </div>
      </section>

      {/* FAQ — 3 standard + 2 wildfire-specific */}
      <FAQ items={SPOKANE_FAQ} title="Fire & Smoke FAQ — Spokane" />

      {/* Cross-links — parent + how we work; NO metro city siblings */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <p className="eyebrow text-ivory/60">Related</p>
          <ul className="mt-6 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-2">
            <li>
              <Link
                href="/services/fire-damage"
                className="flex items-center justify-between bg-charcoal px-5 py-4 text-sm font-medium text-ivory transition hover:bg-charcoal-soft"
              >
                <span>← Fire &amp; Smoke Damage Restoration</span>
                <ArrowIcon className="h-3 w-3 stroke-current opacity-50" />
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="flex items-center justify-between bg-charcoal px-5 py-4 text-sm font-medium text-ivory transition hover:bg-charcoal-soft"
              >
                <span>How we work</span>
                <ArrowIcon className="h-3 w-3 stroke-current opacity-50" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <CTA
        title="Hit by the Spokane fires? Let's stabilize your property today."
        subtitle={`Call ${site.phoneDisplay} — 24/7. Washington-licensed, insured, IICRC-certified, and deployed to Spokane County.`}
      />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: "Fire & Smoke", url: "/services/fire-damage" },
            {
              name: "Spokane, WA",
              url: "/services/fire-damage/spokane-wa",
            },
          ]),
          faqJsonLd(SPOKANE_FAQ),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${site.url}/services/fire-damage/spokane-wa#service`,
            serviceType: "Fire & Smoke Damage Restoration",
            name: "Fire & Smoke Damage Restoration in Spokane, WA",
            description:
              "Washington-licensed fire, smoke and soot restoration deployed to Spokane County. 24/7 emergency board-up, cleanup and insurance documentation.",
            provider: { "@id": `${site.url}/#business` },
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Spokane County, WA",
            },
            url: `${site.url}/services/fire-damage/spokane-wa`,
          },
        ]}
      />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-ivory/50">{label}</dt>
      <dd className="mt-2 text-xl font-light tracking-tight text-ivory">
        {value}
      </dd>
    </div>
  );
}
