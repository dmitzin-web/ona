import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon, PhoneIcon } from "@/components/icons/ServiceIcons";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { fillPlaceholdersDeep } from "@/lib/placeholders";
import { buildMetadata } from "@/lib/seo";
import spokaneContent from "@/content/pages/spokane-fire.json";

// ─── Spokane wildfire response — landing page ─────────────────────────
// This is a SALES page. It exists to make a homeowner in Spokane County
// pick up the phone. Keep it short, keep the offer above the fold, and
// keep the trust material framed as a weapon against the storm chasers
// who showed up after the fires — not as a list of our own limitations.
//
// Design: white ground, near-black type, one hot red-orange (`flare`) on
// the CTAs and nothing else — see the daylight palette in globals.css.
// This page deliberately leaves the site's charcoal identity: someone who
// has just lost a house should not land on a black page, and dark grounds
// cost reading speed exactly where it hurts most (small type, phone,
// stressed reader). The shared header and footer stay dark and read as
// bands top and bottom. Scoped to wildfire pages only.
//
// ── DO NOT EDIT THESE AWAY. Each is a legal constraint, not a style
//    preference, and none of them cost conversion: ──
//   · RCW 18.27.100(3) — the L&I registration number must appear in
//     advertising. It's in the hero stat row and the footer line.
//   · RCW 18.27.100(4) — we may NOT advertise "bonded and insured" on
//     the strength of the statutorily required bond/insurance alone. So
//     the page never uses that phrase.
//   · RCW 48.30.230 — absorbing a homeowner's deductible requires
//     billing the carrier for more than they pay. False claim; felony
//     above $1,500. Hence "you pay your deductible, nothing more" —
//     which also happens to be a selling point against the chasers.
//   · No response-time promise. We're ~350 miles away; "on site in 60
//     minutes" would be an unsubstantiated claim under FTC rules. We
//     promise a same-day answer instead, which we can actually keep.
//   · No invented casualty or structure figures. The ~850 number is
//     hedged as "damaged or destroyed" because officials never split
//     homes from other structures.
//
// Phase note: the fires (Old Trails / Autumn Lane / Fairview) ignited
// Aug 1 2026 and were contained Aug 19 2026. Copy is written for the
// rebuild-and-smoke-cleanup phase, not for emergency board-up.

// Every piece of copy on this page lives in content/pages/spokane-fire.json
// and is edited through the admin (/admin → Spokane fire deployment page).
// The constraints above are repeated there, in plain English, in the
// section description and in the hints of the fields they apply to — keep
// the two in step (lib/admin/pages/spokane-fire.ts). {phone}, {legalName},
// {city}, {state} are filled from Company details.
//
// Left in code on purpose: the sample "live project page" in the PROOF
// block (a labelled illustration, not copy — like the homepage demo), the
// icons (by position), the step numbers (counted), link targets and styling.
const t = fillPlaceholdersDeep(spokaneContent);

// Metadata for this page, for the route's generateMetadata
// (app/services/[slug]/[area]/page.tsx). No response-time claim in the
// description (we're ~350 miles out; "same-day answer" is what we can keep)
// and no "you pay your deductible only" — see the header.
export const spokaneFireMetadata = () =>
  buildMetadata({
    title: t.seo.title,
    description: t.seo.description,
    path: "/services/fire-damage/spokane-wa",
    keywords: t.seo.keywords,
  });

const MAILTO = `mailto:${site.email}?subject=${encodeURIComponent(t.hero.emailSubject)}`;
const photoSrc = (name: string) => `/photos/projects/${name}.avif`;

// The three commitments that fit on a card. These were paragraphs in the
// trust list below and got skimmed past; as cards they are the first thing
// read in the section and each one is a single sentence a homeowner can
// repeat back to the next contractor who knocks. The depth stays in the
// trust points (t.whyUs.points). Icons go by position.
const GUARANTEES = [
  { icon: "shield" as const, ...t.whyUs.guarantees.first },
  { icon: "doc" as const, ...t.whyUs.guarantees.second },
  { icon: "clock" as const, ...t.whyUs.guarantees.third },
];

// The trust block (t.whyUs.points). Every line is a direct hit on what the
// out-of-state chasers do, and all of it is verifiable.
//
// Deductible point — was: "Several companies working Spokane right now are
// offering exactly that." Dropped — it's an unsourced assertion about
// identifiable competitors, and it hands them a disparagement claim for no
// gain. The statute and the state's own warning make the point without
// naming anyone, and RCW 48.30.230 does make it a felony above $1,500.

const BREADCRUMB = [
  { name: t.breadcrumb.home, href: "/" },
  { name: t.breadcrumb.services, href: "/services" },
  { name: t.breadcrumb.service, href: "/services/fire-damage" },
  { name: t.breadcrumb.page, href: "/services/fire-damage/spokane-wa" },
];

export function SpokaneFireDeployment() {
  return (
    // text-day-ink-2 on the wrapper matters: <body> carries text-ivory for
    // the rest of the site, so any element here without its own colour
    // class would inherit near-white and vanish on this white ground.
    <div className="wildfire-page bg-day text-day-ink-2">
      {/* ── HERO ─────────────────────────────────────────────────────
          Warm light from the top right, so a page about fire doesn't
          read as a dark basement. */}
      <section className="relative overflow-hidden bg-day">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 46% at 86% 4%, rgba(224,78,31,0.09), transparent 66%), radial-gradient(74% 62% at 98% -8%, rgba(224,78,31,0.05), transparent 72%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <nav aria-label="Breadcrumb" className="pt-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 eyebrow text-day-ink-3">
              {BREADCRUMB.map((item, i, arr) => {
                const isLast = i === arr.length - 1;
                return (
                  <li key={item.href} className="flex items-center gap-2">
                    {isLast ? (
                      <span aria-current="page" className="text-day-ink-2">
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="transition hover:text-day-ink"
                      >
                        {item.name}
                      </Link>
                    )}
                    {!isLast && (
                      <span aria-hidden="true" className="opacity-40">
                        /
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="pb-16 pt-14 lg:pb-24 lg:pt-16">
            <div className="flex items-center gap-2.5">
              <span className="ona-pulse h-2 w-2 rounded-full bg-flare" />
              <p className="eyebrow text-flare-deep">{t.hero.eyebrow}</p>
            </div>

            {/* The literal, searchable words live in the eyebrow above. The
                headline itself is left alone deliberately: it speaks to a
                person about their house rather than announcing a service
                category, and that is the reason it outperforms every
                "Spokane Fire Damage Experts" on the first page of results. */}
            <h1 className="mt-7 max-w-4xl text-[38px] font-semibold leading-[1.03] tracking-[-0.028em] text-day-ink sm:text-[54px] lg:text-[66px]">
              {t.hero.titleLead}
              <span className="block text-day-ink-3">{t.hero.titleRest}</span>
            </h1>

            <p className="mt-7 max-w-xl text-[19px] leading-snug text-day-ink-2 md:text-[22px]">
              {t.hero.bodyLead}{" "}
              <span className="text-day-ink">{t.hero.bodyEmphasis}</span>
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center justify-center gap-3 rounded-[2px] bg-flare px-9 py-5 text-[17px] font-semibold text-white shadow-[0_0_0_1px_rgba(207,63,20,0.25),0_16px_36px_-12px_rgba(207,63,20,0.5)] transition hover:bg-flare-deep sm:text-[18px]"
              >
                <PhoneIcon className="h-5 w-5 stroke-current" />
                {t.hero.ctaCall}
              </a>
              <a
                href={MAILTO}
                className="inline-flex items-center justify-center gap-3 rounded-[2px] border-2 border-day-ink px-9 py-5 text-[17px] font-semibold text-day-ink transition hover:bg-day-ink hover:text-day sm:text-[18px]"
              >
                {t.hero.ctaPhotos}
              </a>
            </div>

            <p className="mt-5 text-[15px] text-day-ink-3">
              {t.hero.note}
            </p>

            {/* Credentials as one compact line, not a four-column stat grid.
                Above the fold the reader needs the headline, the offer and
                the two buttons to breathe; the registration number is a
                reassurance glance, not a data table, and it is repeated in
                full in the footer line where RCW 18.27.100(3) needs it. */}
            <ul className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-day-line pt-7 text-[14px] text-day-ink-2">
              {t.hero.credentials.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 flex-none text-flare"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12.5 4.5 4.5L19 7" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── TRIAGE — three situations, each a route to the phone ──── */}
      <section className="border-t border-day-line bg-day-2">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <h2 className="max-w-3xl text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[40px]">
            {t.triage.title}
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden border border-day-line bg-day-line lg:grid-cols-3">
            {t.triage.situations.map((s) => (
              <div
                key={s.title}
                className="relative bg-day p-7 lg:p-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flare/40 to-transparent"
                />
                <p className="eyebrow text-flare-deep">{s.tag}</p>
                <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.015em] text-day-ink">
                  {s.title}
                </h3>
                <p className="mt-3.5 text-[15.5px] leading-relaxed text-day-ink-2">
                  {s.body}
                </p>
                <p className="mt-4 border-t border-day-line pt-4 text-[14px] leading-relaxed text-day-ink-3">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`tel:${site.phone}`}
              className="inline-flex items-center gap-3 rounded-[2px] bg-flare px-8 py-[18px] text-[17px] font-semibold text-white shadow-[0_14px_32px_-12px_rgba(207,63,20,0.45)] transition hover:bg-flare-deep"
            >
              <PhoneIcon className="h-4 w-4 stroke-current" />
              {t.triage.ctaCall}
            </a>
            <span className="text-[14px] text-day-ink-3">{t.triage.aside}</span>
          </div>
        </div>
      </section>

      {/* ── WHAT IT COSTS ────────────────────────────────────────────
          The money answer was one cell of a stat row in the hero and went
          unread. It is the second question every homeowner has, so it gets
          its own band right after the triage.

          Wording is deliberately not "your cost: deductible only". We
          control what we charge; we do not control what a carrier covers,
          and a homeowner whose claim is partly denied would have been told
          something untrue. "We bill your carrier, the deductible is yours"
          is the same promise minus the part we can't keep. */}
      <section className="border-t border-day-line bg-day">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid overflow-hidden border-2 border-flare/25 bg-flare/[0.04] sm:grid-cols-3">
            {t.cost.cells.map((c, i) => (
              <div
                key={c.label}
                className={
                  i === 0
                    ? "p-7 sm:p-8"
                    : "border-t border-flare/20 p-7 sm:border-l sm:border-t-0 sm:p-8"
                }
              >
                <p className="eyebrow text-flare-deep">{c.label}</p>
                <p className="mt-3.5 text-[27px] font-semibold leading-tight tracking-[-0.02em] text-day-ink">
                  {c.value}
                </p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-day-ink-2">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-day-ink-3">
            {t.cost.note}
          </p>
        </div>
      </section>

      {/* ── THE THREE GATES ──────────────────────────────────────────
          The asbestos survey / Notice of Intent sequence used to be a
          dense paragraph inside a card. Nobody reads regulatory prose in
          this situation, so it's a three-step diagram instead: what has to
          happen, in what order, and who does it. Being the page that
          explains this plainly is also the strongest competence signal
          available — most competitors don't mention it at all. */}
      <section className="border-t border-day-line bg-day">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="eyebrow text-flare-deep">{t.gates.eyebrow}</p>
          <h2 className="mt-5 max-w-3xl text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[38px]">
            {t.gates.title}
          </h2>

          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            <span
              aria-hidden="true"
              className="absolute left-7 top-3 hidden h-[calc(100%-1.5rem)] w-px bg-day-line sm:block md:left-0 md:top-7 md:h-px md:w-full"
            />
            {t.gates.steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-5 md:flex-col md:gap-0">
                <span className="relative z-10 flex h-14 w-14 flex-none items-center justify-center rounded-full border-2 border-flare bg-day text-[20px] font-bold text-flare-deep">
                  {i + 1}
                </span>
                <div className="md:mt-7">
                  <h3 className="text-[20px] font-semibold tracking-[-0.015em] text-day-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-day-ink-2">
                    {s.body}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-[2px] bg-flare/[0.08] px-3 py-1.5 text-[13px] font-semibold text-flare-deep">
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m5 12.5 4.5 4.5L19 7" />
                    </svg>
                    {s.who}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-12 max-w-2xl text-[16px] leading-relaxed text-day-ink-2">
            {t.gates.note}
          </p>
        </div>
      </section>

      {/* ── WHAT WE HANDLE ───────────────────────────────────────── */}
      <section className="border-t border-day-line bg-day-2">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-day-ink-3">{t.scope.eyebrow}</p>
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[38px]">
                {t.scope.title}
              </h2>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-day-ink-2">
                {t.scope.body}
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {t.scope.items.map((w) => (
                <li
                  key={w}
                  className="flex items-start gap-3 border border-day-line bg-day-2 px-5 py-4 text-[15px] leading-snug text-day-ink-2"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-flare"
                  />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FINISH WORK ──────────────────────────────────────────────
          The page had no photography at all, and a rebuild sold entirely in
          prose asks a homeowner to imagine the result. These are our own
          completed finish jobs — NOT Spokane fire work, and the caption says
          so in the same size type as everything else. Do not relabel them:
          passing remodel photos off as fire restoration is exactly the trick
          the rest of this page warns people about.
          Replace with real Spokane before/after as soon as jobs finish. */}
      <section className="border-t border-day-line bg-day">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-day-ink-3">{t.finish.eyebrow}</p>
              <h2 className="mt-5 max-w-2xl text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[38px]">
                {t.finish.title}
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-day-ink-2">
              {t.finish.body}
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {t.finish.photos.map((p) => (
              <div
                key={p.photo}
                className="relative aspect-[3/2] overflow-hidden border border-day-line bg-day-2"
              >
                <Image
                  src={photoSrc(p.photo)}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <p className="mt-5 text-[14px] leading-relaxed text-day-ink-3">
            {t.finish.caption}
          </p>
        </div>
      </section>

      {/* ── WHY US — the trust block, aimed at the chasers ───────── */}
      <section className="relative overflow-hidden border-t border-day-line bg-day-2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(52% 42% at 8% 0%, rgba(224,78,31,0.07), transparent 68%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="eyebrow text-flare-deep">{t.whyUs.eyebrow}</p>
          <h2 className="mt-5 max-w-3xl text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[40px]">
            {t.whyUs.title}
          </h2>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {GUARANTEES.map((g) => (
              <div
                key={g.title}
                className="border border-day-line bg-day p-6 shadow-[0_1px_2px_rgba(10,10,10,.04),0_18px_40px_-30px_rgba(10,10,10,.3)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-flare/[0.08] text-flare-deep">
                  <GuaranteeIcon kind={g.icon} />
                </span>
                <h3 className="mt-5 text-[19px] font-semibold leading-snug tracking-[-0.015em] text-day-ink">
                  {g.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-day-ink-2">
                  {g.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-3">
            {t.whyUs.points.map((w) => (
              <div key={w.title} className="border-l-2 border-flare pl-5">
                <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.01em] text-day-ink">
                  {w.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-day-ink-2">
                  {w.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF ────────────────────────────────────────────────────
          The trust block above claims every job gets a live project page.
          This shows one, so the claim isn't just a bullet. The data is a
          labelled sample, not a real customer's file — an illustration
          rather than copy, so the mockup (and its "Sample" badge, which must
          not be removable) stays here; only the text beside it is in the
          admin. */}
      <section className="border-t border-day-line bg-day">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-flare-deep">{t.proof.eyebrow}</p>
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[38px]">
                {t.proof.title}
              </h2>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-day-ink-2">
                {t.proof.body}
              </p>
              <ul className="mt-7 space-y-2.5">
                {t.proof.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-[15px] text-day-ink-2"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-flare"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="overflow-hidden border border-day-line bg-day shadow-[0_1px_2px_rgba(10,10,10,.04),0_24px_50px_-30px_rgba(10,10,10,.25)]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-day-line bg-day-2 px-4 py-2.5">
                  <span className="flex gap-1.5" aria-hidden="true">
                    <i className="block h-2 w-2 rounded-full bg-day-line" />
                    <i className="block h-2 w-2 rounded-full bg-day-line" />
                    <i className="block h-2 w-2 rounded-full bg-day-line" />
                  </span>
                  <span className="text-[11px] text-day-ink-3">
                    onarestore.com/work/your-project
                  </span>
                  <span className="ml-auto rounded-[2px] bg-flare/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-flare-deep">
                    Sample
                  </span>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow text-day-ink-3">
                        Fire &amp; smoke · rebuild
                      </p>
                      <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.015em] text-day-ink sm:text-[23px]">
                        N Assembly St — smoke &amp; soot, full clean
                      </h3>
                      <p className="mt-1.5 text-[13px] text-day-ink-3">
                        Day 6 of 12 · Adjuster: Pemco
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-[2px] border border-flare/35 bg-flare/[0.07] px-3 py-1.5 text-[12px] font-medium text-flare-deep">
                      <span className="ona-pulse h-1.5 w-1.5 rounded-full bg-flare" />
                      Updated today
                    </span>
                  </div>

                  <div className="mt-6 border border-day-line bg-day-2 p-4">
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span className="text-day-ink-3">Day 6 of est. 12</span>
                      <span className="font-semibold text-day-ink">
                        50% · on schedule
                      </span>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-[2px] bg-day-line">
                      <div
                        className="h-1.5 rounded-[2px] bg-flare"
                        style={{ width: "50%" }}
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
                      {[
                        ["Board-up", "done"],
                        ["Soot removal", "done"],
                        ["HVAC & odor", "now"],
                        ["Rebuild", "next"],
                      ].map(([label, state]) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className={
                              state === "done"
                                ? "inline-flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full bg-flare text-[8px] font-bold text-white"
                                : state === "now"
                                  ? "ona-pulse inline-block h-3.5 w-3.5 flex-none rounded-full border-2 border-flare bg-day"
                                  : "inline-block h-3.5 w-3.5 flex-none rounded-full border border-day-line bg-day"
                            }
                          >
                            {state === "done" ? "✓" : ""}
                          </span>
                          <span
                            className={
                              state === "now"
                                ? "font-semibold text-day-ink"
                                : "text-day-ink-3"
                            }
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <dl className="mt-5 divide-y divide-day-line-soft border-t border-day-line-soft">
                    {[
                      {
                        d: "Day 6 · 9:20a",
                        t: "Ducts cleaned",
                        b: "HVAC decontaminated and sealed. Thermal fog scheduled once framing dries. 22 photos",
                      },
                      {
                        d: "Day 4 · 2:05p",
                        t: "Soot removal complete",
                        b: "Ceilings, walls and cabinetry HEPA-vacuumed and wet-cleaned. Two doors flagged for replacement. 41 photos",
                      },
                      {
                        d: "Day 2 · 11:15a",
                        t: "Adjuster walkthrough — approved",
                        b: "Scope agreed. Insulation and drywall to 24 inches in the kitchen. 18 photos",
                      },
                    ].map((r) => (
                      <div
                        key={r.d}
                        className="grid gap-1 py-3.5 sm:grid-cols-[104px_1fr] sm:gap-4"
                      >
                        <dt className="text-[12px] text-day-ink-3">{r.d}</dt>
                        <dd className="text-[14px] leading-relaxed text-day-ink-2">
                          <span className="font-semibold text-day-ink">
                            {r.t}.
                          </span>{" "}
                          {r.b}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              <p className="mt-3 text-[13px] text-day-ink-3">
                {t.proof.caption}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────────── */}
      <section className="border-t border-day-line bg-day-2">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="eyebrow text-day-ink-3">{t.process.eyebrow}</p>
          <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[38px]">
            {t.process.title}
          </h2>
          {/* Timeline rather than a numbered list: the rail makes the
              sequence readable at a glance, which a stressed reader on a
              phone will actually take in. The number is the marker itself,
              at display size — the step icon rides alongside the heading as
              a secondary cue. A 12px number above a 17px heading, which is
              what this was, is not a timeline anyone reads at a glance. */}
          <ol className="relative mt-14 grid gap-10 lg:grid-cols-5 lg:gap-6">
            <span
              aria-hidden="true"
              className="absolute left-[31px] top-4 hidden h-[calc(100%-2rem)] w-px bg-day-line sm:block lg:left-0 lg:top-8 lg:h-px lg:w-full"
            />
            {t.process.steps.map((p, i) => (
              <li key={p.title} className="relative flex gap-5 lg:flex-col lg:gap-0">
                <span className="relative z-10 flex h-16 w-16 flex-none items-center justify-center rounded-full border-2 border-flare bg-day text-[22px] font-bold tracking-[-0.02em] text-flare-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="lg:mt-7">
                  <h3 className="flex items-center gap-2 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-day-ink">
                    <span className="text-day-ink-3">
                      <StepIcon i={i} />
                    </span>
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-day-ink-2">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── AREAS ───────────────────────────────────────────────── */}
      <section className="border-t border-day-line bg-day-2">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <p className="eyebrow text-day-ink-3">{t.areas.eyebrow}</p>
          <p className="mt-5 max-w-4xl text-[19px] leading-relaxed text-day-ink-2">
            {t.areas.places.join(" · ")}
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="bg-day">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-10 lg:py-24">
          <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[38px]">
            {t.faq.title}
          </h2>
          <dl className="mt-12 divide-y divide-day-line border-y border-day-line">
            {t.faq.faqs.map((f) => (
              <div key={f.q} className="grid gap-3 py-7 lg:grid-cols-12 lg:gap-8">
                <dt className="text-[17px] font-semibold leading-snug text-day-ink lg:col-span-5">
                  {f.q}
                </dt>
                <dd className="text-[15px] leading-relaxed text-day-ink-2 lg:col-span-7">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── CLOSING CTA ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-flare/30 bg-day-2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 0%, rgba(224,78,31,0.08), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2.5">
                <span className="ona-pulse h-2 w-2 rounded-full bg-flare" />
                <p className="eyebrow text-flare-deep">{t.closing.eyebrow}</p>
              </div>
              <h2 className="mt-6 text-[32px] font-semibold leading-[1.06] tracking-[-0.025em] text-day-ink md:text-[46px]">
                {t.closing.title}
              </h2>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-day-ink-2">
                {t.closing.body}
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center justify-center gap-3 rounded-[2px] bg-flare px-9 py-5 text-[17px] font-semibold text-white shadow-[0_0_0_1px_rgba(207,63,20,0.25),0_16px_36px_-12px_rgba(207,63,20,0.5)] transition hover:bg-flare-deep sm:text-[18px]"
              >
                <PhoneIcon className="h-4 w-4 stroke-current" />
                {t.closing.ctaCall}
              </a>
              <a
                href={MAILTO}
                className="inline-flex items-center justify-center gap-3 rounded-[2px] border-2 border-day-ink px-9 py-5 text-[17px] font-semibold text-day-ink transition hover:bg-day-ink hover:text-day sm:text-[18px]"
              >
                {t.closing.ctaEmail}
              </a>
            </div>
          </div>

          {/* RCW 18.27.100(3): registration number in advertising. */}
          <p className="mt-14 border-t border-day-line pt-7 text-[13px] leading-relaxed text-day-ink-3">
            {t.closing.legalLine}
          </p>
        </div>
      </section>

      <section className="bg-day">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <ul className="grid gap-px overflow-hidden border border-day-line bg-day-line sm:grid-cols-2">
            <li>
              <Link
                href="/services/fire-damage"
                className="flex items-center justify-between bg-day px-5 py-4 text-[14px] font-medium text-day-ink transition hover:bg-day-2"
              >
                <span>{t.links.fireService}</span>
                <ArrowIcon className="h-3 w-3 stroke-current opacity-50" />
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="flex items-center justify-between bg-day px-5 py-4 text-[14px] font-medium text-day-ink transition hover:bg-day-2"
              >
                <span>{t.links.about}</span>
                <ArrowIcon className="h-3 w-3 stroke-current opacity-50" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbJsonLd(BREADCRUMB.map((b) => ({ name: b.name, url: b.href }))),
          faqJsonLd(t.faq.faqs),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${site.url}/services/fire-damage/spokane-wa#service`,
            serviceType: t.structuredData.serviceType,
            name: t.structuredData.name,
            description: t.structuredData.description,
            provider: { "@id": `${site.url}/#business` },
            areaServed: {
              "@type": "AdministrativeArea",
              name: t.structuredData.areaServed,
            },
            url: `${site.url}/services/fire-damage/spokane-wa`,
          },
        ]}
      />

      {/* ── STICKY MOBILE CALL BAR ───────────────────────────────────
          Mobile only. Most of this traffic is a phone, often at night,
          often mid-scroll — the call must never be more than a thumb away.
          `pr-16` keeps the buttons clear of the floating Ask Ona widget,
          which also sits bottom-right. The spacer below reserves the same
          height so the bar never covers the last section. */}
      <div className="h-20 sm:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-day-line bg-day/95 backdrop-blur-sm sm:hidden">
        <div className="flex gap-2 px-4 py-3 pr-16">
          <a
            href={`tel:${site.phone}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[2px] bg-flare px-4 py-3.5 text-[15px] font-semibold text-white"
          >
            <PhoneIcon className="h-4 w-4 stroke-current" />
            {t.mobileBar.call}
          </a>
          <a
            href={MAILTO}
            className="inline-flex flex-1 items-center justify-center rounded-[2px] border-2 border-day-ink px-4 py-3.5 text-[15px] font-semibold text-day-ink"
          >
            {t.mobileBar.photos}
          </a>
        </div>
      </div>
    </div>
  );
}

// Icons for the three guarantee cards. Heavier stroke than StepIcon because
// they sit in a 48px well and carry the section on their own.
function GuaranteeIcon({ kind }: { kind: "shield" | "doc" | "clock" }) {
  const common = {
    className: "h-6 w-6",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3.2 19 6v5.6c0 4.2-2.9 7.4-7 9.2-4.1-1.8-7-5-7-9.2V6l7-2.8Z" />
        <path d="m9 12 2.2 2.2L15.4 10" />
      </svg>
    );
  }
  if (kind === "doc") {
    return (
      <svg {...common}>
        <path d="M6.5 3.5h7l4.5 4.5V20a.5.5 0 0 1-.5.5H6.5A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5Z" />
        <path d="M13.5 3.5V8H18" />
        <path d="M9 12.5h6M9 16h4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12.5" r="8" />
      <path d="M12 8v4.5l3 1.8" />
    </svg>
  );
}

// Small stroke icons for the process timeline, drawn to match the weight of
// the site's existing ServiceIcons rather than pulled from an icon set.
function StepIcon({ i }: { i: number }) {
  const common = {
    className: "h-[18px] w-[18px]",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (i) {
    case 0: // call / send photos
      return (
        <svg {...common}>
          <path d="M4.5 5.5a1.5 1.5 0 0 1 1.5-1.5h2l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v2a1.5 1.5 0 0 1-1.5 1.5A14.5 14.5 0 0 1 4.5 5.5Z" />
        </svg>
      );
    case 1: // walk the property
      return (
        <svg {...common}>
          <path d="M3.5 10.5 12 4l8.5 6.5" />
          <path d="M5.5 9.5V19h13V9.5" />
          <path d="M10 19v-5h4v5" />
        </svg>
      );
    case 2: // itemized scope
      return (
        <svg {...common}>
          <path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5Z" />
          <path d="M14 3.5V8h4" />
          <path d="M9 12.5h6M9 16h4" />
        </svg>
      );
    case 3: // stabilize and clean
      return (
        <svg {...common}>
          <path d="M9 3.5h6v4H9z" />
          <path d="M10 7.5 8 12v7.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V12l-2-4.5" />
          <path d="M8 14.5h8" />
        </svg>
      );
    default: // rebuild
      return (
        <svg {...common}>
          <path d="M13.5 4.5 19 10l-2 2-5.5-5.5z" />
          <path d="M11 8.5 4.5 15v4.5H9L15.5 13" />
        </svg>
      );
  }
}
