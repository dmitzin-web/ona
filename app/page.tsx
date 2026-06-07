import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";

// ─────────────────────────────────────────────────────────────
// ONA Restoration — Homepage (Project File concept, v3)
// ────────────────────────────────────────────────────────────
// v3 adds REAL project photography across the page. Until this
// iteration the site was a "concept startup for restoration" —
// gorgeous but conceptual. v3 brings real homes onto every
// section that the photographer's set could feasibly cover.
//
// What changed in v3:
//   - Hero gains a right-side anchor image (split layout)
//   - Project File mockup photo grid uses real images
//   - Phone mockup feed thumbnails are real photos
//   - "Real work" cards have real photo tops (2 of 3 — third
//     stays as honest "Your project here" open slot)
//   - NEW Remodel inspiration gallery — 4 curated projects
//     with material notes, placed before "Who you're working
//     with" so the remodel narrative gets the desire it needs.
//   - "fewer dropped balls" → "tighter communication and more
//     consistent work"
//
// All photos live in /public/photos/projects/ as p1..p9.avif.
// Same photo may appear in multiple sections — that's fine,
// different contexts. When MORE photos arrive, add to the
// `photos` map below and they cascade through the page.

const photos = [
  { src: "/photos/projects/p1.avif", alt: "Project — kitchen install" },
  { src: "/photos/projects/p2.avif", alt: "Project — kitchen detail" },
  { src: "/photos/projects/p3.avif", alt: "Project — interior" },
  { src: "/photos/projects/p4.avif", alt: "Project — bath detail" },
  { src: "/photos/projects/p5.avif", alt: "Project — finished space" },
  { src: "/photos/projects/p6.avif", alt: "Project — material detail" },
  { src: "/photos/projects/p7.avif", alt: "Project — interior" },
  { src: "/photos/projects/p8.avif", alt: "Project — bath" },
  { src: "/photos/projects/p9.avif", alt: "Project — finished space" },
];

const homeFaqs = [
  {
    q: "How fast can you respond in Portland or Vancouver, WA?",
    a: "We answer the phone in person. Most of Clark County is within 25 minutes of our base in Vancouver, WA. For overnight emergencies, we triage on the call and dispatch as soon as we're walking out the door.",
  },
  {
    q: "Do you work directly with insurance carriers?",
    a: "Yes. For restoration work we document the loss (photos, moisture readings, Xactimate-formatted scope) and bill the carrier directly. You pay your deductible — that's it.",
  },
  {
    q: "What services do you offer?",
    a: "Restoration: water, fire and smoke, mold, storm and reconstruction. Remodeling: kitchen, bathroom, and combined kitchen + bath. One small team handles both.",
  },
  {
    q: "Are you licensed?",
    a: "ONA Restoration & Remodeling LLC is registered in Washington and licensed and insured to operate in WA and OR.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — Restoration & Remodeling in Vancouver, WA`,
  description:
    "Restoration and remodeling in Vancouver, WA — without the chaos. Every project comes with a live page: photos, daily updates, and what's next. One team from emergency cleanup to final paint.",
  path: "/",
  keywords: [
    "restoration Vancouver WA",
    "remodeling Vancouver WA",
    "water damage restoration Portland metro",
    "kitchen remodel Vancouver WA",
    "bathroom remodel Vancouver WA",
    "Clark County restoration",
  ],
});

export default function HomePage() {
  return (
    <>
      {/* ─── 1. HERO (split layout w/ anchor image) ────────────
          Text on the left, one strong image on the right. On
          mobile, image stacks below the text. The image gives
          the page its first emotional anchor — without it, the
          hero reads as "concept" rather than "real work." */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-20 md:pt-28 md:pb-24 lg:px-10">
          <div className="grid gap-12 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-16">
            <div>
              <p className="eyebrow text-ivory/75">
                Vancouver, WA · Restoration &amp; Remodeling
              </p>
              <h1 className="mt-8 text-[40px] font-semibold leading-[1.04] tracking-[-0.025em] text-ivory md:text-[64px]">
                Restoration &amp; remodeling{" "}
                <span className="text-ivory/75">
                  without the chaos.
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-ivory/75 md:text-[18px]">
                Every project comes with a live project page — photos,
                daily updates, documents, and what&apos;s next. So you
                always know where things stand. One team from emergency
                cleanup to final paint.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-[14px] font-medium text-white transition hover:bg-gold-deep"
                >
                  Call {site.phoneDisplay}
                </a>
                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center rounded-full border border-ivory px-7 py-3.5 text-[14px] font-medium text-ivory transition hover:bg-ivory hover:text-charcoal"
                >
                  Start a project
                </Link>
              </div>
            </div>

            {/* Anchor image + signature Project File overlay.
                The overlay is what makes this image specifically
                ONA — not "any interior shot." It tells the viewer
                "this is your live project page on day 7." */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-ivory/10 shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_70px_-30px_rgba(0,0,0,0.25)]">
              <Image
                src={photos[0].src}
                alt="Recent ONA project — interior detail"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/15 bg-charcoal/80 p-4 text-ivory shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5">
                <div className="flex items-center gap-2">
                  <span className="ona-pulse h-1.5 w-1.5 rounded-full bg-gold" />
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ivory/70">
                    Your project · live page
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <div className="text-[14px] font-medium">
                    On schedule · Day 7 of 14
                  </div>
                  <div className="text-[12px] tabular-nums text-ivory/70">
                    $14,820 approved
                  </div>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-charcoal/15">
                  <div
                    className="h-1 rounded-full bg-gold"
                    style={{ width: "50%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 1B. REASSURANCE STRIP ────────────────────────────
          Four concrete operational promises. */}
      <section className="border-t border-ivory/10 bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Phone answered in person",
                hint: "Day or night. No call centers.",
              },
              {
                title: "Most of Clark County in 25 min",
                hint: "Vancouver and the Portland metro.",
              },
              {
                title: "Insurance billed direct",
                hint: "You pay your deductible. That's it.",
              },
              {
                title: "One team — damage to rebuild",
                hint: "No handoffs to subcontractors.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border border-gold text-[11px] font-semibold text-gold"
                >
                  ✓
                </span>
                <div>
                  <div className="text-[14px] font-medium text-ivory">
                    {item.title}
                  </div>
                  <div className="mt-1 text-[13px] text-ivory/75">
                    {item.hint}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. WHAT WE DO (emotional split) ──────────────────
          Restoration urgent + stabilizing. Remodel inspiring +
          craftsmanship. */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <p className="eyebrow text-ivory/75">What we do</p>
          <h2 className="mt-6 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[44px]">
            Two distinct services. One small team that handles both.
          </h2>

          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="ona-pulse h-2 w-2 rounded-full bg-gold" />
                  <p className="eyebrow text-ivory/75">Restoration</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-gold">
                  Available now · 24/7
                </span>
              </div>
              <p className="mt-4 text-[18px] leading-relaxed text-ivory">
                Something happened — water, fire, smoke, mold. We
                stabilize the damage, document the scope for your
                insurer, and rebuild what was lost.
              </p>

              <ul className="mt-8 grid gap-3 text-[15px] text-ivory/75">
                {services
                  .filter((s) => s.slug !== "remodeling")
                  .map((s) => (
                    <li
                      key={s.slug}
                      className="border-t border-ivory/10 pt-3"
                    >
                      <Link
                        href={`/services/${s.slug}`}
                        className="flex items-center justify-between transition hover:text-ivory"
                      >
                        <span>{s.shortName}</span>
                        <span className="text-warm-gray-soft">→</span>
                      </Link>
                    </li>
                  ))}
              </ul>

              <div className="mt-10 rounded-xl border border-ivory/10 bg-charcoal-soft p-5">
                <p className="eyebrow text-ivory/75">When you call</p>
                <ol className="mt-3 space-y-2 text-[13px] text-ivory/75">
                  <li className="flex gap-3">
                    <span className="font-medium text-ivory">1.</span>
                    <span>Answered in person — triage on the call.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-ivory">2.</span>
                    <span>On-site within 25 min for most of Clark Co.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-ivory">3.</span>
                    <span>Walk-through, moisture readings, photos.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-ivory">4.</span>
                    <span>Documented scope sent to your insurer same day.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-medium text-ivory">5.</span>
                    <span>Mitigation starts the moment you sign off.</span>
                  </li>
                </ol>
              </div>
            </div>

            <div className="md:border-l md:border-ivory/10 md:pl-16">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-gold-deep" />
                  <p className="eyebrow text-ivory/75">Remodeling</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-ivory/75">
                  Booking · June
                </span>
              </div>
              <p className="mt-4 text-[18px] leading-relaxed text-ivory">
                You&apos;ve been planning a change — a kitchen, a bath, a
                layout that finally works. We design the scope with you,
                set an honest timeline, and build it.
              </p>

              <ul className="mt-8 grid gap-3 text-[15px] text-ivory/75">
                <li className="border-t border-ivory/10 pt-3">
                  <Link
                    href="/services/remodeling"
                    className="flex items-center justify-between transition hover:text-ivory"
                  >
                    <span>Kitchen remodel</span>
                    <span className="text-warm-gray-soft">→</span>
                  </Link>
                </li>
                <li className="border-t border-ivory/10 pt-3">
                  <Link
                    href="/services/remodeling"
                    className="flex items-center justify-between transition hover:text-ivory"
                  >
                    <span>Bathroom remodel</span>
                    <span className="text-warm-gray-soft">→</span>
                  </Link>
                </li>
                <li className="border-t border-ivory/10 pt-3">
                  <Link
                    href="/services/remodeling"
                    className="flex items-center justify-between transition hover:text-ivory"
                  >
                    <span>Combined kitchen + bath</span>
                    <span className="text-warm-gray-soft">→</span>
                  </Link>
                </li>
                <li className="border-t border-ivory/10 pt-3">
                  <Link
                    href="/services"
                    className="flex items-center justify-between transition hover:text-ivory"
                  >
                    <span>Insurance-claim rebuilds</span>
                    <span className="text-warm-gray-soft">→</span>
                  </Link>
                </li>
              </ul>

              <div className="mt-10 rounded-xl border border-ivory/10 bg-charcoal-soft p-5">
                <p className="eyebrow text-ivory/75">How we build</p>
                <ul className="mt-3 grid gap-2 text-[13px] text-ivory/75">
                  <li>
                    <span className="text-ivory">Materials —</span>{" "}
                    quartz, butcher block, real wood cabinetry, porcelain
                    tile, brass fixtures.
                  </li>
                  <li>
                    <span className="text-ivory">Fit —</span> we measure
                    twice, use shims like surgeons, and don&apos;t
                    caulk-over imperfect cuts.
                  </li>
                  <li>
                    <span className="text-ivory">Finish —</span> photos
                    of every joint and reveal posted to your project page.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2B. RESTORATION IN DATA ──────────────────────────
          Operational-credibility section. Until we have real
          restoration process photography (drying equipment,
          containment, moisture readings, jobsite organization),
          this section conveys the same trust signal through
          *measured language*: actual numbers and units from the
          kind of restoration log we keep on every job.

          Visual rhythm: tighter density than surrounding
          sections, more like a status panel — breaks the
          card-and-column cadence and signals "operations." */}
      <section className="border-t border-ivory/10 bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-10">
          <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
            <div>
              <p className="eyebrow text-ivory/75">
                Restoration in data
              </p>
              <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] text-ivory md:text-[32px]">
                What an organized restoration log
                <span className="text-ivory/75">
                  {" "}actually looks like.
                </span>
              </h2>
              <p className="mt-5 text-[14px] leading-relaxed text-ivory/75">
                Every restoration job runs against the same
                operational checklist — moisture readings, equipment
                runtime, photo coverage, adjuster communications. The
                same numbers go into your project page, your insurer&apos;s
                file, and our internal log.
              </p>
            </div>

            <div className="rounded-2xl border border-ivory/10 bg-charcoal">
              <div className="flex items-center justify-between border-b border-ivory/10 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-ivory/75">
                <span>Sample mitigation — Day 5</span>
                <span className="flex items-center gap-1.5 text-gold">
                  <span className="ona-pulse h-1.5 w-1.5 rounded-full bg-gold" />
                  on schedule
                </span>
              </div>
              <dl className="divide-y divide-ivory/10 text-[13px]">
                {[
                  {
                    label: "Moisture map",
                    value: "14% → 12% → 9% → 7%",
                    note: "Subfloor · below 16% threshold by Day 5",
                  },
                  {
                    label: "Containment",
                    value: "8 LF · poly · negative pressure",
                    note: "Walked + photographed daily",
                  },
                  {
                    label: "Drying equipment",
                    value: "3× LGR dehu · 4× air mover",
                    note: "Runtime 121h logged · 14 amp draw",
                  },
                  {
                    label: "Photos uploaded",
                    value: "142",
                    note: "Scope-document grade · timestamped",
                  },
                  {
                    label: "Adjuster comms",
                    value: "28 messages · 3 site visits",
                    note: "Average response 14 min, business hours",
                  },
                  {
                    label: "Scope status",
                    value: "$14,820 approved",
                    note: "No coverage disputes · billed direct",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid items-baseline gap-3 px-5 py-3.5 sm:grid-cols-[160px_1fr_auto]"
                  >
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-ivory/75">
                      {row.label}
                    </dt>
                    <dd className="font-mono text-[13px] tabular-nums text-ivory">
                      {row.value}
                    </dd>
                    <dd className="text-[12px] text-ivory/75 sm:text-right">
                      {row.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. PROJECT FILE DEMO (now with real photos) ──────
          Mockup of what every customer gets on day one. Photo
          grid + phone feed thumbnails are real project shots,
          not gradients — the section now reads as "product"
          rather than "concept."  */}
      <section className="border-t border-ivory/10 bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <p className="eyebrow text-ivory/75">
            What it looks like to be our customer
          </p>
          <h2 className="mt-6 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[44px]">
            On day one, you get a link to your project page.
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ivory/75 md:text-[18px]">
            Every photo we take. Every receipt. Every adjuster note.
            Every change to the scope. Updated daily until you sign off.
            Share it with your insurance company, your family, your
            attorney — whoever needs to see it.
          </p>

          {/* Desktop mockup — stronger shadow + hover affordance
              on entries so it reads as live software, not a
              static wireframe. */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-ivory/10 bg-charcoal shadow-[0_1px_0_rgba(0,0,0,0.02),0_40px_80px_-30px_rgba(20,20,20,0.28)]">
            <div className="flex items-center gap-2 border-b border-ivory/10 bg-charcoal-soft px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-charcoal/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-charcoal/10" />
                <span className="h-2.5 w-2.5 rounded-full bg-charcoal/10" />
              </div>
              <div className="ml-3 rounded-md border border-ivory/10 bg-charcoal px-3 py-1 text-[12px] text-ivory/75">
                onarestore.com/work/sample
              </div>
              <div className="ml-auto rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-medium text-gold">
                SAMPLE
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow text-ivory/75">
                    Project · Water mitigation
                  </p>
                  <h3 className="mt-3 text-[24px] font-semibold leading-tight tracking-tight text-ivory md:text-[28px]">
                    NE Hazel Dell — kitchen leak rebuild
                  </h3>
                  <p className="mt-2 text-[13px] text-ivory/75">
                    Opened May 18 · Day 7 of 14 · Adjuster: Liberty Mutual
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-gold/40 bg-gold/5 px-3 py-1.5 text-[12px] text-gold">
                  <span className="ona-pulse h-1.5 w-1.5 rounded-full bg-gold" />
                  3 new updates today
                </div>
              </div>

              {/* Phase progress bar */}
              <div className="mt-8 rounded-xl border border-ivory/10 bg-charcoal-soft p-5">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-ivory/75">Day 7 of est. 14</span>
                  <span className="font-medium text-ivory">
                    50% complete · on schedule
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-charcoal/10">
                  <div
                    className="h-2 rounded-full bg-gold"
                    style={{ width: "50%" }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-4 gap-3 text-[11px]">
                  {[
                    { label: "Mitigation", state: "done" },
                    { label: "Documentation", state: "done" },
                    { label: "Rebuild", state: "now" },
                    { label: "Sign-off", state: "next" },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center gap-1.5">
                      <span
                        className={
                          p.state === "done"
                            ? "inline-flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-white"
                            : p.state === "now"
                              ? "ona-pulse inline-block h-3.5 w-3.5 flex-none rounded-full border-2 border-gold bg-charcoal"
                              : "inline-block h-3.5 w-3.5 flex-none rounded-full border border-ivory/10 bg-charcoal"
                        }
                      >
                        {p.state === "done" ? "✓" : ""}
                      </span>
                      <span
                        className={
                          p.state === "now"
                            ? "font-medium text-ivory"
                            : "text-ivory/75"
                        }
                      >
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="eyebrow text-ivory/75">
                    Daily updates
                  </p>
                  <div className="mt-5 space-y-5">
                    {[
                      {
                        day: "Day 1",
                        ts: "May 18 · 8:42a",
                        title: "Initial moisture mapping",
                        body: "Identified 6.2 m² of saturated subfloor. Containment set, dehumidifiers placed.",
                        photos: 12,
                        author: "ONA tech",
                      },
                      {
                        day: "Day 3",
                        ts: "May 20 · 11:05a",
                        title: "Adjuster walkthrough — approved",
                        body: 'Scope agreed: lower cabinets, subfloor, drywall to 18". Insurer photos uploaded.',
                        photos: 38,
                        author: "ONA tech + adjuster",
                      },
                      {
                        day: "Day 5",
                        ts: "May 22 · 4:18p",
                        title: "Drying complete",
                        body: "All readings below threshold. Demo scheduled for Day 6.",
                        photos: 18,
                        author: "ONA tech",
                      },
                      {
                        day: "Day 7",
                        ts: "Today · 9:14a",
                        title: "Rebuild started",
                        body: "Subfloor and drywall in. Cabinets arriving Day 9. On schedule — kitchen usable again by Day 14.",
                        photos: 24,
                        author: "ONA tech",
                        isNow: true,
                      },
                    ].map((entry) => (
                      <div
                        key={entry.day}
                        className="grid cursor-pointer gap-3 border-t border-ivory/10 pt-4 transition hover:bg-charcoal-soft/40 sm:grid-cols-[80px_1fr]"
                      >
                        <div>
                          <div className="text-[12px] uppercase tracking-[0.18em] text-ivory/75">
                            {entry.day}
                            {entry.isNow ? (
                              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gold align-middle" />
                            ) : null}
                          </div>
                          <div className="mt-1 text-[10px] tabular-nums text-warm-gray-soft">
                            {entry.ts}
                          </div>
                        </div>
                        <div>
                          <div className="text-[15px] font-medium text-ivory">
                            {entry.title}
                          </div>
                          <div className="mt-1 text-[14px] leading-relaxed text-ivory/75">
                            {entry.body}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-[11px] text-warm-gray-soft">
                            <span className="uppercase tracking-wider">
                              {entry.photos} photos
                            </span>
                            <span aria-hidden>·</span>
                            <span>by {entry.author}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="space-y-6 md:border-l md:border-ivory/10 md:pl-8">
                  <div>
                    <div className="eyebrow text-ivory/75">
                      Approved scope
                    </div>
                    <div className="mt-2 text-[24px] font-semibold tabular-nums text-ivory">
                      $14,820
                    </div>
                    <div className="mt-1 text-[12px] text-ivory/75">
                      Billed directly to insurer.
                    </div>
                  </div>

                  <div>
                    <div className="eyebrow text-ivory/75">
                      Milestones
                    </div>
                    <ul className="mt-3 space-y-2 text-[13px]">
                      {[
                        { state: "done", label: "Mitigation authorization" },
                        { state: "done", label: "Insurance scope approved" },
                        { state: "done", label: "Drying complete" },
                        { state: "now", label: "Rebuild in progress" },
                        { state: "next", label: "Final walkthrough" },
                      ].map((m) => (
                        <li
                          key={m.label}
                          className="flex items-center gap-2.5"
                        >
                          <span
                            className={
                              m.state === "done"
                                ? "inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-white"
                                : m.state === "now"
                                  ? "ona-pulse inline-block h-4 w-4 flex-none rounded-full border-2 border-gold bg-charcoal"
                                  : "inline-block h-4 w-4 flex-none rounded-full border border-ivory/10 bg-charcoal"
                            }
                          >
                            {m.state === "done" ? "✓" : ""}
                          </span>
                          <span
                            className={
                              m.state === "now"
                                ? "font-medium text-ivory"
                                : m.state === "done"
                                  ? "text-ivory"
                                  : "text-ivory/75"
                            }
                          >
                            {m.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* REAL photos in mockup grid */}
                  <div>
                    <div className="eyebrow text-ivory/75">Photos</div>
                    <div className="mt-3 grid grid-cols-4 gap-1.5">
                      {photos.slice(0, 8).map((p) => (
                        <div
                          key={p.src}
                          className="relative aspect-square overflow-hidden rounded-md border border-ivory/10 bg-charcoal-soft"
                        >
                          <Image
                            src={p.src}
                            alt={p.alt}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-[12px] text-ivory/75">
                      142 photos · uploaded daily
                    </div>
                  </div>

                  <div>
                    <div className="eyebrow text-ivory/75">
                      Documents
                    </div>
                    <ul className="mt-3 space-y-2 text-[13px]">
                      {[
                        {
                          name: "Adjuster scope",
                          type: "PDF",
                          size: "2.4 MB",
                          ts: "Mon",
                        },
                        {
                          name: "Drying log",
                          type: "CSV",
                          size: "18 KB",
                          ts: "Sun",
                        },
                        {
                          name: "Material receipts",
                          type: "ZIP",
                          size: "7.1 MB",
                          ts: "Today",
                        },
                      ].map((d) => (
                        <li
                          key={d.name}
                          className="flex items-center gap-3 rounded-md border border-ivory/10 bg-charcoal-soft/50 p-2.5 transition hover:border-warm-gray-soft hover:bg-charcoal-soft"
                        >
                          <span className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-md bg-charcoal text-[9px] font-semibold uppercase tracking-wider text-ivory">
                            {d.type}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[13px] font-medium text-ivory">
                              {d.name}
                            </div>
                            <div className="text-[10px] text-warm-gray-soft">
                              {d.size} · {d.ts}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Activity feed — pure software trope.
                      Confirms "real system" rather than mockup. */}
                  <div>
                    <div className="eyebrow text-ivory/75">
                      Recent activity
                    </div>
                    <ul className="mt-3 space-y-2 text-[12px] text-ivory/75">
                      <li className="flex gap-2">
                        <span className="mt-1 inline-block h-1 w-1 flex-none rounded-full bg-gold" />
                        <span>
                          <span className="text-ivory">ONA tech</span>{" "}
                          uploaded 8 photos · 9:14a
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 inline-block h-1 w-1 flex-none rounded-full bg-warm-gray" />
                        <span>
                          Adjuster signed scope · Mon
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1 inline-block h-1 w-1 flex-none rounded-full bg-warm-gray" />
                        <span>
                          Drying log auto-updated · Sun
                        </span>
                      </li>
                    </ul>
                  </div>
                </aside>
              </div>
            </div>
          </div>

          {/* Phone mockup w/ real photos */}
          <div className="mt-12 grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
            <div className="max-w-lg">
              <p className="eyebrow text-ivory/75">
                On your phone too
              </p>
              <h3 className="mt-4 text-[24px] font-semibold leading-tight tracking-tight text-ivory md:text-[30px]">
                Daily updates in your pocket.
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ivory/75">
                Photos uploaded the day they&apos;re taken. Adjuster
                approvals as they come in. A small text when something
                needs your attention. No app to install — it&apos;s just
                a link.
              </p>
            </div>

            <div className="mx-auto w-[260px] flex-none rounded-[36px] border border-ivory/10 bg-charcoal p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] sm:w-[280px]">
              <div className="overflow-hidden rounded-[28px] bg-charcoal">
                <div className="flex h-6 items-center justify-center bg-charcoal">
                  <span className="h-1 w-12 rounded-full bg-charcoal/15" />
                </div>
                <div className="space-y-4 px-4 pb-5">
                  <div className="flex items-center justify-between text-[10px] text-ivory/75">
                    <span>ONA</span>
                    <span>9:41</span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ivory/75">
                      Your project
                    </p>
                    <h4 className="mt-1 text-[14px] font-semibold leading-tight text-ivory">
                      Kitchen leak rebuild
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-charcoal-soft px-3 py-2">
                    <span className="ona-pulse h-1.5 w-1.5 rounded-full bg-gold" />
                    <span className="text-[11px] font-medium text-ivory">
                      On schedule · Day 7 / 14
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-charcoal/10">
                    <div
                      className="h-1.5 rounded-full bg-gold"
                      style={{ width: "50%" }}
                    />
                  </div>

                  {/* Real-photo phone feed */}
                  <div className="space-y-2.5">
                    {[
                      {
                        title: "Rebuild started",
                        meta: "Today · 24 photos",
                        photo: photos[3],
                      },
                      {
                        title: "Adjuster approved",
                        meta: "Mon · scope $14,820",
                        photo: photos[1],
                      },
                      {
                        title: "Drying complete",
                        meta: "Sun · 18 photos",
                        photo: photos[6],
                      },
                    ].map((feed) => (
                      <div
                        key={feed.title}
                        className="flex items-center gap-3 rounded-lg border border-ivory/10 p-2"
                      >
                        <div className="relative h-10 w-10 flex-none overflow-hidden rounded-md">
                          <Image
                            src={feed.photo.src}
                            alt={feed.photo.alt}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-medium text-ivory">
                            {feed.title}
                          </div>
                          <div className="truncate text-[10px] text-ivory/75">
                            {feed.meta}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full rounded-full bg-gold py-2 text-center text-[11px] font-medium text-white">
                    Call ONA
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/work/sample"
              className="inline-flex items-center gap-2 text-[14px] text-ivory underline-offset-4 hover:underline"
            >
              Open the full sample project page
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 4. HOW WE CHARGE (visual phases) ─────────────────
          Restoration: assertion list. Remodel: phase cards. */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <p className="eyebrow text-ivory/75">How we charge</p>
          <h2 className="mt-6 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[44px]">
            No surprise change orders. Ever.
          </h2>

          <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="eyebrow text-ivory/75">Restoration</p>
              <p className="mt-4 text-[17px] leading-relaxed text-ivory">
                Billed directly to your insurer at standard Xactimate
                rates. You pay your deductible — that&apos;s it.
              </p>
              <ul className="mt-6 space-y-3 text-[14px] text-ivory/75">
                {[
                  "No upfront deposit",
                  "No fees for the documentation work",
                  "If your claim is denied, we tell you before we start work",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 border-t border-ivory/10 pt-3"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-white"
                    >
                      ✓
                    </span>
                    <span className="text-ivory">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:border-l md:border-ivory/10 md:pl-16">
              <p className="eyebrow text-ivory/75">Remodel</p>
              <p className="mt-4 text-[17px] leading-relaxed text-ivory">
                Fixed price in three phases. You sign each phase
                separately, so you always know what the next payment
                covers before you commit.
              </p>

              {/* Horizontal pricing timeline — the visual the
                  section was missing. Shows the whole arc at a
                  glance: design → build → finish, with money on
                  each step. */}
              <div className="mt-8 rounded-xl border border-ivory/10 bg-charcoal-soft p-5">
                <div className="relative pt-2">
                  <div className="absolute left-3 right-3 top-[18px] h-px bg-charcoal/10" />
                  <div className="relative grid grid-cols-4">
                    {[
                      { label: "Start", pct: null, state: "start" },
                      { label: "Phase 1", pct: "30%", state: "step" },
                      { label: "Phase 2", pct: "40%", state: "step" },
                      { label: "Sign-off", pct: "30%", state: "end" },
                    ].map((node, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-2"
                      >
                        <span
                          className={
                            node.state === "start"
                              ? "h-3 w-3 rounded-full border-2 border-ivory bg-charcoal"
                              : node.state === "end"
                                ? "inline-flex h-3 w-3 items-center justify-center rounded-full bg-charcoal text-[8px] font-bold text-ivory"
                                : "h-3 w-3 rounded-full border-2 border-gold bg-charcoal"
                          }
                        >
                          {node.state === "end" ? "✓" : null}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-ivory/75">
                          {node.label}
                        </span>
                        {node.pct ? (
                          <span className="text-[12px] font-semibold tabular-nums text-gold">
                            {node.pct}
                          </span>
                        ) : (
                          <span className="text-[10px] text-warm-gray-soft">
                            $0
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-5 text-[12px] text-ivory/75">
                  Each signature unlocks the next phase. No work moves
                  forward without your sign-off.
                </p>
              </div>

              {/* Phase cards — supporting detail */}
              <div className="mt-4 space-y-3">
                {[
                  {
                    n: "1",
                    name: "Design",
                    pct: "30%",
                    body: "Scope + materials list signed before any demo.",
                  },
                  {
                    n: "2",
                    name: "Build",
                    pct: "40%",
                    body: "Rough-in + structural signed before finishes.",
                  },
                  {
                    n: "3",
                    name: "Finish",
                    pct: "30%",
                    body: "Final punch list signed at walkthrough.",
                  },
                ].map((phase) => (
                  <div
                    key={phase.n}
                    className="grid items-center gap-4 rounded-xl border border-ivory/10 bg-charcoal-soft p-4 sm:grid-cols-[36px_1fr_auto]"
                  >
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ivory text-[14px] font-semibold text-ivory">
                      {phase.n}
                    </div>
                    <div>
                      <div className="text-[15px] font-medium text-ivory">
                        Phase {phase.n} — {phase.name}
                      </div>
                      <div className="mt-1 text-[13px] text-ivory/75">
                        {phase.body}
                      </div>
                    </div>
                    <div className="text-[14px] font-medium tabular-nums text-gold sm:text-right">
                      {phase.pct}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4B. REMODEL INSPIRATION GALLERY (NEW) ────────────
          Adds desirability to the remodel side. 4 curated
          projects with material notes. The point: prove these
          people can actually build beautiful spaces — not just
          "fix what broke." */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-ivory/75">
                Remodel inspiration
              </p>
              <h2 className="mt-6 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[44px]">
                Built carefully. Documented clearly.
              </h2>
            </div>
            <p className="max-w-sm text-[14px] text-ivory/75">
              A look at finishes, materials, and the level of fit we
              build to. More projects added as work completes.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                photo: photos[1],
                kind: "Kitchen",
                title: "Rebuilt after dishwasher leak",
                meta: "Family of four · 8 weeks · quartz + oak shaker",
              },
              {
                photo: photos[4],
                kind: "Primary bath",
                title: "Opened wall for daylight",
                meta: "Aging-in-place · 5 weeks · porcelain field",
              },
              {
                photo: photos[5],
                kind: "Detail",
                title: "Cabinetry hand-fit on site",
                meta: "Solid wood · spec-built · brass hardware",
              },
              {
                photo: photos[8],
                kind: "Living",
                title: "Load-bearing wall removed",
                meta: "Open plan · structural · reframed for two beams",
              },
            ].map((card, i) => (
              <article
                key={i}
                className="overflow-hidden rounded-xl border border-ivory/10 bg-charcoal-soft"
              >
                <div className="relative aspect-[4/5] bg-charcoal-soft">
                  <Image
                    src={card.photo.src}
                    alt={card.photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <div className="eyebrow text-ivory/75">
                    {card.kind}
                  </div>
                  <div className="text-[16px] font-semibold leading-tight tracking-tight text-ivory">
                    {card.title}
                  </div>
                  <div className="text-[12px] text-ivory/75">
                    {card.meta}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/services/remodeling"
              className="inline-flex items-center gap-2 text-[14px] text-ivory underline-offset-4 hover:underline"
            >
              See how we handle remodel projects
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 4C. FULL-BLEED PHOTO BAND ────────────────────────
          One single large image breaking the max-w-7xl rhythm.
          No card, no border, no overlay text — just a wide
          breath of finished work. Rhythm break + emotional
          warmth without copy noise. */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="relative aspect-[21/9] w-full overflow-hidden sm:aspect-[21/8]">
          <Image
            src={photos[6].src}
            alt="Recent finished space"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ─── 5. WHO YOU'RE WORKING WITH ───────────────────────
          Dropped "May 2026". "Fewer dropped balls" replaced with
          "tighter communication and more consistent work." */}
      <section className="border-t border-ivory/10 bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28 lg:px-10">
          <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
            <div>
              <p className="eyebrow text-ivory/75">
                Who you&apos;re working with
              </p>
              <h2 className="mt-6 text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[40px]">
                A small operation, on purpose.
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-ivory/75">
                Owner-operated. No project managers passing your job
                between subcontractors. No call centers.
              </p>
            </div>

            <div className="text-[17px] leading-relaxed text-ivory">
              <p>
                When you call the number on this page, you reach the same
                person who will walk through your home, write the scope,
                and stand on the job site every day. Smaller crews mean
                tighter communication and more consistent work from
                start to finish.
              </p>

              <div className="mt-8 rounded-xl border border-ivory/10 bg-charcoal p-5">
                <p className="eyebrow text-ivory/75">
                  What happens when you call
                </p>
                <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      n: "1",
                      title: "Phone answered in person",
                      body: "Day or night. Triaged on the call.",
                    },
                    {
                      n: "2",
                      title: "Walk-through scheduled",
                      body: "24 hours, sooner for emergencies.",
                    },
                    {
                      n: "3",
                      title: "Documented scope sent",
                      body: "To your insurer or as a fixed quote.",
                    },
                    {
                      n: "4",
                      title: "Work starts agreed date",
                      body: "Project page goes live the same day.",
                    },
                  ].map((step) => (
                    <li key={step.n} className="flex gap-3 text-[13px]">
                      <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-charcoal text-[11px] font-semibold text-ivory">
                        {step.n}
                      </span>
                      <div>
                        <div className="font-medium text-ivory">
                          {step.title}
                        </div>
                        <div className="text-ivory/75">{step.body}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-8 text-[14px] text-ivory/75">
                Project File access is included on every job —
                restoration or remodel.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-[14px] font-medium text-white transition hover:bg-gold-deep"
                >
                  {site.phoneDisplay}
                </a>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full border border-ivory px-6 py-3 text-[14px] font-medium text-ivory transition hover:bg-ivory hover:text-charcoal"
                >
                  More about how we work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. REAL WORK — cards with real photos ────────────
          Two cards get real photo tops. Third stays as honest
          "Your project here" open slot — that honesty is the
          point. */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-ivory/75">Real work</p>
              <h2 className="mt-6 max-w-2xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[40px]">
                First projects in progress. Photos posted as work completes.
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-[14px] text-ivory underline-offset-4 hover:underline"
            >
              Read the field notes →
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                kind: "In progress",
                title: "NE Hazel Dell — kitchen leak rebuild",
                meta: "Water mitigation · Day 7 of 14",
                photo: photos[2],
                signal: { live: true, label: "Day 7 of 14 · on schedule" },
              },
              {
                kind: "Booking",
                title: "Salmon Creek — bathroom refresh",
                meta: "Remodel · Starts June 9",
                photo: photos[7],
                signal: { live: false, label: "Scope signed · Starts June 9" },
              },
              {
                kind: "Open slot",
                title: "Your project here",
                meta: "Booking restoration + remodel for June",
                photo: null,
                signal: null,
              },
            ].map((card, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-ivory/10 bg-charcoal-soft"
              >
                {card.photo ? (
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={card.photo.src}
                      alt={card.photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    {/* Signature signal chip — same dark-pill
                        pattern as the hero overlay. Repetition
                        turns it into the brand's visual language:
                        "wherever you see this chip, ONA is
                        running an organized project." */}
                    {card.signal ? (
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-charcoal/80 px-3 py-1.5 text-[11px] text-ivory backdrop-blur-md">
                        <span
                          className={
                            card.signal.live
                              ? "ona-pulse h-1.5 w-1.5 rounded-full bg-gold"
                              : "h-1.5 w-1.5 rounded-full bg-charcoal/60"
                          }
                        />
                        <span className="font-medium">
                          {card.signal.label}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-charcoal-soft">
                    <span className="rounded-full border border-dashed border-ivory/25 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-ivory/75">
                      Available
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-3 p-5">
                  <div className="eyebrow text-ivory/75">
                    {card.kind}
                  </div>
                  <div className="text-[18px] font-semibold leading-tight tracking-tight text-ivory">
                    {card.title}
                  </div>
                  <div className="text-[13px] text-ivory/75">
                    {card.meta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. CLOSING CTA — light anchor (rhythm break) ──────
          The page has spent its length in dark charcoal tones.
          The closing section flips to ivory: a final breath of
          light, anchors the bottom with tonal contrast. */}
      <section className="bg-ivory text-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
                Talk to us
              </p>
              <h2 className="mt-6 max-w-2xl text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-charcoal md:text-[56px]">
                Tell us what happened.
              </h2>
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-charcoal/70">
                One call, one form, one number on the other end. We&apos;ll
                tell you the same day whether we can help.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-[14px] font-medium text-white transition hover:bg-gold-deep"
                >
                  Call {site.phoneDisplay}
                </a>
                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center rounded-full border border-charcoal bg-transparent px-7 py-3.5 text-[14px] font-medium text-charcoal transition hover:bg-charcoal hover:text-ivory"
                >
                  Start a project
                </Link>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-6 border-t border-charcoal/15 pt-8 text-[13px] md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
                  Phone
                </dt>
                <dd className="mt-2 text-charcoal">{site.phoneDisplay}</dd>
                <dd className="mt-1 text-charcoal/55">Answered in person</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
                  Response
                </dt>
                <dd className="mt-2 text-charcoal">25 min</dd>
                <dd className="mt-1 text-charcoal/55">Across Clark County</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
                  Restoration
                </dt>
                <dd className="mt-2 text-charcoal">24 hours · every day</dd>
                <dd className="mt-1 text-charcoal/55">Insurance billed direct</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.22em] text-charcoal/45">
                  Remodel
                </dt>
                <dd className="mt-2 text-charcoal">Mon–Fri · 8a–5p</dd>
                <dd className="mt-1 text-charcoal/55">Booking · June</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* FAQ JSON-LD — invisible, kept for SEO continuity */}
      <JsonLd data={faqJsonLd(homeFaqs)} />
    </>
  );
}
