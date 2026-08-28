import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon, PhoneIcon } from "@/components/icons/ServiceIcons";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

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

const SITUATIONS = [
  {
    tag: "Total or partial loss",
    h: "Your home burned",
    p: "We handle the whole rebuild — debris out, structure back up, finishes in. One crew, one scope, billed to your carrier.",
    detail:
      "Before debris can move, Spokane Clean Air requires an asbestos survey by a certified inspector and a Notice of Intent on file — fees are currently waived. We coordinate that step for you so your permit isn't held up.",
  },
  {
    tag: "Standing, but full of smoke",
    h: "Your home didn't burn",
    p: "Soot from burning houses is not wood smoke. It settles into drywall, insulation, ductwork and contents across a wide radius, and it is the loss carriers most often argue about.",
    detail:
      "Don't run your HVAC until it's been checked — it pushes soot back through the house. Document everything before you clean, because cleaning destroys the evidence your claim needs.",
  },
  {
    tag: "No access yet",
    h: "You can't get in yet",
    p: "Call anyway. We'll log your property, put you in the queue, and be ready to walk the scope the day re-entry opens.",
    detail:
      "No charge and no commitment for the assessment. If we think a Spokane crew can get to you faster, we'll tell you that too.",
  },
];

const WE_HANDLE = [
  "Debris removal and demolition, permit-ready",
  "Emergency board-up and roof tarping",
  "Smoke, soot and structural cleaning",
  "HVAC and duct decontamination",
  "Odor removal — after the soot is physically out, not instead of it",
  "Contents inventory, cleaning and loss documentation",
  "Insulation, drywall and framing replacement",
  "Full reconstruction through final walkthrough",
];

// The trust block. Every line is a direct hit on what the out-of-state
// chasers do, and all of it is verifiable.
const WHY_US = [
  {
    h: "You pay your deductible. Nothing more.",
    p: "Anyone offering to cover or waive it is proposing insurance fraud — it means billing your carrier more than you actually pay. That's a felony in Washington. Several companies working Spokane right now are offering exactly that.",
  },
  {
    h: "We never ask for Assignment of Benefits",
    p: "An AOB signs your claim over to the contractor, who then deals with your insurer and collects without your approval. Washington's Insurance Commissioner tried to ban post-loss AOBs this year and the bill died in committee — so they're still legal here, and still being used. We don't ask for one.",
  },
  {
    h: "Itemized written scope before anything starts",
    p: "Complete bid, line by line, no large deposit up front. Washington's itemization law specifically exempts post-fire emergency work. We follow it anyway.",
  },
  {
    h: "Seven days to cancel, in writing",
    p: "California requires this on disaster repair contracts. Washington doesn't require it of anyone. You get it from us regardless.",
  },
  {
    h: "Washington-registered, and you can check in 30 seconds",
    p: "ONARER*748K8 at lni.wa.gov. Do the same for every company that knocks on your door — L&I warns specifically about contractors who show up unsolicited after a fire. We don't door-knock and we don't leave cards at damaged properties.",
  },
  {
    h: "Every job gets a live project page",
    p: "Photos, daily updates, moisture and cleaning logs, receipts, every scope change — on a link you can send straight to your adjuster. Nothing gets quietly revised, because there's nowhere to hide it.",
  },
];

const PROCESS = [
  {
    n: "01",
    h: "Call or send photos",
    p: "We answer in person. Photos by text or email get you a real answer the same day.",
  },
  {
    n: "02",
    h: "We walk the property",
    p: "Free assessment. Full photo and Matterport documentation of every affected surface and item.",
  },
  {
    n: "03",
    h: "Itemized scope to your carrier",
    p: "Written in the format adjusters work in, with the readings and images that support every line.",
  },
  {
    n: "04",
    h: "Stabilize and clean",
    p: "Debris out, soot off, HVAC decontaminated, odor treated after the residue is physically gone.",
  },
  {
    n: "05",
    h: "Rebuild",
    p: "Framing, insulation, drywall, finishes. You approve each phase and watch it on your project page.",
  },
];

const SPOKANE_FAQ = [
  {
    q: "Do you bill my insurance directly?",
    a: "Yes. We document the loss, write the scope in the format your adjuster works in, and bill your carrier. You pay your deductible and nothing beyond it. Coverage decisions stay with your insurer — we don't negotiate your settlement, because that requires a public adjuster licence we don't hold.",
  },
  {
    q: "My house is standing. Is smoke damage really covered?",
    a: "Smoke and ash damage is covered under a standard homeowner policy, and no special dollar cap of the kind you see for mold should apply. It's also the loss type carriers dispute most, which is why we document it heavily before anyone touches a surface.",
  },
  {
    q: "Can I use you instead of the company my insurer suggested?",
    a: "Yes. You have the right to choose your own contractor for any work on your property. Your insurer may recommend someone from a preferred programme, but you're not obliged to use them.",
  },
  {
    q: "Will the smoke smell actually come out?",
    a: "In most cases, yes — but it depends on the soot type and how deep it drove into porous material. We'll tell you what can be cleaned and what has to be replaced before you commit to anything. Be careful with anyone who guarantees odor removal without seeing the structure, or who only fogs.",
  },
  {
    q: "You're based in Vancouver. Why should I hire you?",
    a: `Because Spokane needed more crews than Spokane had. We brought a Washington-licensed fire and smoke team east after the fires. We're registered statewide (${site.legalName}, ONARER*748K8), we're IICRC-certified in fire and smoke restoration, and every commitment on this page is in your contract in writing — including a named local subcontractor for warranty response so you're not waiting on a truck from the coast.`,
  },
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
              {[
                { name: "Home", href: "/" },
                { name: "Services", href: "/services" },
                { name: "Fire & Smoke", href: "/services/fire-damage" },
                {
                  name: "Spokane, WA",
                  href: "/services/fire-damage/spokane-wa",
                },
              ].map((item, i, arr) => {
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
              <p className="eyebrow text-flare-deep">
                Crew on the ground · Spokane County
              </p>
            </div>

            <h1 className="mt-7 max-w-4xl text-[38px] font-semibold leading-[1.03] tracking-[-0.028em] text-day-ink sm:text-[54px] lg:text-[66px]">
              Your home is still yours.
              <span className="block text-day-ink-3">
                Let&apos;s get it back.
              </span>
            </h1>

            {/* One line, not a paragraph. Someone reading this is in a car
                or in temporary housing on a phone — the detail lives further
                down the page, the hero exists to get a call. */}
            <p className="mt-7 max-w-xl text-[19px] leading-snug text-day-ink-2 md:text-[22px]">
              Debris removal, smoke and soot, full rebuild.{" "}
              <span className="text-day-ink">Billed to your insurance.</span>
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-flare px-9 py-5 text-[17px] font-semibold text-white shadow-[0_0_0_1px_rgba(207,63,20,0.25),0_16px_36px_-12px_rgba(207,63,20,0.5)] transition hover:bg-flare-deep sm:text-[18px]"
              >
                <PhoneIcon className="h-5 w-5 stroke-current" />
                Call {site.phoneDisplay}
              </a>
              <a
                href={`mailto:${site.email}?subject=Spokane%20fire%20-%20my%20property`}
                className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-day-ink px-9 py-5 text-[17px] font-semibold text-day-ink transition hover:bg-day-ink hover:text-day sm:text-[18px]"
              >
                Send photos
              </a>
            </div>

            <p className="mt-5 text-[15px] text-day-ink-3">
              Free assessment. No obligation. Answered in person, 24/7.
            </p>

            <dl className="mt-14 grid grid-cols-2 gap-y-7 border-t border-day-line pt-9 sm:grid-cols-4 sm:gap-x-8">
              {[
                { k: "WA registration", v: "ONARER*748K8" },
                { k: "Certification", v: "IICRC fire & smoke" },
                { k: "Insurance", v: "Billed to your carrier" },
                { k: "Your cost", v: "Deductible only" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="eyebrow text-day-ink-3">{s.k}</dt>
                  <dd className="mt-2.5 text-[17px] font-medium tracking-tight text-day-ink">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── TRIAGE — three situations, each a route to the phone ──── */}
      <section className="border-t border-day-line bg-day-2">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <h2 className="max-w-3xl text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[40px]">
            Whichever one you&apos;re dealing with, we handle it.
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden border border-day-line bg-day-line lg:grid-cols-3">
            {SITUATIONS.map((s) => (
              <div
                key={s.h}
                className="relative bg-day p-7 lg:p-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flare/40 to-transparent"
                />
                <p className="eyebrow text-flare-deep">{s.tag}</p>
                <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.015em] text-day-ink">
                  {s.h}
                </h3>
                <p className="mt-3.5 text-[15.5px] leading-relaxed text-day-ink-2">
                  {s.p}
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
              className="inline-flex items-center gap-3 rounded-full bg-flare px-7 py-3.5 text-[14px] font-semibold text-white transition hover:bg-flare-deep"
            >
              <PhoneIcon className="h-4 w-4 stroke-current" />
              Call {site.phoneDisplay}
            </a>
            <span className="text-[14px] text-day-ink-3">
              Not sure which applies? Send photos and we&apos;ll tell you.
            </span>
          </div>
        </div>
      </section>

      {/* ── WHAT WE HANDLE ───────────────────────────────────────── */}
      <section className="bg-day">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-day-ink-3">Scope</p>
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[38px]">
                One crew from debris to final paint.
              </h2>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-day-ink-2">
                No handing you off between a mitigation company, a demo
                company and a builder — with three scopes that don&apos;t
                agree and a claim that stalls between them.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {WE_HANDLE.map((w) => (
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
          <p className="eyebrow text-flare-deep">Before you sign with anyone</p>
          <h2 className="mt-5 max-w-3xl text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[40px]">
            A lot of trucks showed up in Spokane after the fires. Here&apos;s
            how to tell us apart.
          </h2>

          <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {WHY_US.map((w) => (
              <div key={w.h} className="border-l-2 border-flare pl-5">
                <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.01em] text-day-ink">
                  {w.h}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-day-ink-2">
                  {w.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF ────────────────────────────────────────────────────
          The trust block above claims every job gets a live project page.
          This shows one, so the claim isn't just a bullet. The data is a
          labelled sample, not a real customer's file. */}
      <section className="border-t border-day-line bg-day">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-flare-deep">The live project page</p>
              <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[38px]">
                This is what you get a link to on day one.
              </h2>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-day-ink-2">
                It stays live through the rebuild and stays up after we&apos;re
                gone. Send it to your adjuster, your family, your attorney —
                whoever needs to see what was done and when.
              </p>
              <ul className="mt-7 space-y-2.5">
                {[
                  "Every photo, dated and in sequence",
                  "Moisture and cleaning logs",
                  "Every receipt and scope change",
                  "Nothing removed once it's posted",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 text-[15px] text-day-ink-2"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-flare"
                    />
                    <span>{t}</span>
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
                  <span className="ml-auto rounded-full bg-flare/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-flare-deep">
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
                    <span className="inline-flex items-center gap-2 rounded-full border border-flare/35 bg-flare/[0.07] px-3 py-1.5 text-[12px] font-medium text-flare-deep">
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
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-day-line">
                      <div
                        className="h-1.5 rounded-full bg-flare"
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
                Sample page with sample data. Your own is created before we
                start work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────────── */}
      <section className="border-t border-day-line bg-day-2">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="eyebrow text-day-ink-3">How it runs</p>
          <h2 className="mt-5 text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[38px]">
            Five steps, and you see all of them.
          </h2>
          {/* Timeline rather than a numbered list: the rail makes the
              sequence readable at a glance, which a stressed reader on a
              phone will actually take in. The rail is drawn behind the
              markers and hidden below lg, where the steps stack. */}
          <ol className="relative mt-14 grid gap-10 lg:grid-cols-5 lg:gap-6">
            <span
              aria-hidden="true"
              className="absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-px bg-day-line sm:block lg:left-0 lg:top-[19px] lg:h-px lg:w-full"
            />
            {PROCESS.map((p, i) => (
              <li key={p.n} className="relative flex gap-5 lg:flex-col lg:gap-0">
                <span className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-day-line bg-day text-flare-deep">
                  <StepIcon i={i} />
                </span>
                <div className="lg:mt-6">
                  <p className="text-[12px] font-semibold tracking-[0.16em] text-flare-deep">
                    {p.n}
                  </p>
                  <h3 className="mt-2 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-day-ink">
                    {p.h}
                  </h3>
                  <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-day-ink-2">
                    {p.p}
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
          <p className="eyebrow text-day-ink-3">Responding across</p>
          <p className="mt-5 max-w-4xl text-[19px] leading-relaxed text-day-ink-2">
            Spokane · Spokane Valley · Airway Heights · Medical Lake · Cheney ·
            Deer Park · Nine Mile Falls · Mead · and surrounding Spokane County
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="bg-day">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-10 lg:py-24">
          <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-day-ink md:text-[38px]">
            Questions we&apos;re getting from Spokane.
          </h2>
          <dl className="mt-12 divide-y divide-day-line border-y border-day-line">
            {SPOKANE_FAQ.map((f) => (
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
                <p className="eyebrow text-flare-deep">
                  Answered in person · 24/7
                </p>
              </div>
              <h2 className="mt-6 text-[32px] font-semibold leading-[1.06] tracking-[-0.025em] text-day-ink md:text-[46px]">
                Send us photos. We&apos;ll tell you what it takes today.
              </h2>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-day-ink-2">
                Free assessment, itemized written scope, and seven days to
                change your mind after you sign.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-flare px-8 py-4 text-[15px] font-semibold text-white shadow-[0_0_0_1px_rgba(224,78,31,0.25),0_14px_34px_-12px_rgba(224,78,31,0.45)] transition hover:bg-flare-deep"
              >
                <PhoneIcon className="h-4 w-4 stroke-current" />
                Call {site.phoneDisplay}
              </a>
              <a
                href={`mailto:${site.email}?subject=Spokane%20fire%20-%20my%20property`}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-day-ink/30 px-8 py-4 text-[15px] font-medium text-day-ink transition hover:border-day-ink hover:bg-day-ink hover:text-day"
              >
                Email photographs
              </a>
            </div>
          </div>

          {/* RCW 18.27.100(3): registration number in advertising. */}
          <p className="mt-14 border-t border-day-line pt-7 text-[13px] leading-relaxed text-day-ink-3">
            {site.legalName} · Washington contractor registration
            ONARER*748K8 · IICRC-certified in fire &amp; smoke restoration ·
            based in {site.address.locality}, {site.address.region}, working
            statewide. Verify any contractor at lni.wa.gov before you sign.
            Coverage and payment decisions are made by your insurer.
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
                <span>← Fire &amp; smoke damage restoration</span>
                <ArrowIcon className="h-3 w-3 stroke-current opacity-50" />
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="flex items-center justify-between bg-day px-5 py-4 text-[14px] font-medium text-day-ink transition hover:bg-day-2"
              >
                <span>How we work</span>
                <ArrowIcon className="h-3 w-3 stroke-current opacity-50" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

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
            name: "Wildfire Fire & Smoke Damage Restoration — Spokane County, WA",
            description:
              "Washington-licensed fire, smoke and soot restoration and full reconstruction in Spokane County after the August 2026 wildfires. Debris removal, smoke and odor remediation, insurance-billed rebuild.",
            provider: { "@id": `${site.url}/#business` },
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Spokane County, WA",
            },
            url: `${site.url}/services/fire-damage/spokane-wa`,
          },
        ]}
      />

      {/* ── STICKY MOBILE CALL BAR ───────────────────────────────────
          Mobile only. Most of this traffic is a phone, often at night,
          often mid-scroll — the call must never be more than a thumb away.
          `pr-16` keeps the buttons clear of the floating Ask ONA widget,
          which also sits bottom-right. The spacer below reserves the same
          height so the bar never covers the last section. */}
      <div className="h-20 sm:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-day-line bg-day/95 backdrop-blur-sm sm:hidden">
        <div className="flex gap-2 px-4 py-3 pr-16">
          <a
            href={`tel:${site.phone}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-flare px-4 py-3.5 text-[15px] font-semibold text-white"
          >
            <PhoneIcon className="h-4 w-4 stroke-current" />
            Call now
          </a>
          <a
            href={`mailto:${site.email}?subject=Spokane%20fire%20-%20my%20property`}
            className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-day-ink px-4 py-3.5 text-[15px] font-semibold text-day-ink"
          >
            Send photos
          </a>
        </div>
      </div>
    </div>
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
