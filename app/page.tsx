import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { restorationServices } from "@/lib/services";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/jsonld";
import homeContent from "@/content/pages/home.json";
import { fillPlaceholdersDeep } from "@/lib/placeholders";

// ─────────────────────────────────────────────────────────────
// Ona Restoration — Homepage (Project File concept, v3)
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

// Every piece of copy on this page lives in content/pages/home.json and is
// edited through the admin (/admin → Homepage). {phone}, {name} … are filled
// from Company details. The sample project inside the "live project page"
// demo below is an illustration of the product, not copy, and stays here.
const t = fillPlaceholdersDeep(homeContent);
const photo = (name: string) => photos[Number(name.slice(1)) - 1];

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/",
  keywords: t.seo.keywords,
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
              {/* The eyebrow that used to sit here read "24/7 emergency
                  response · Vancouver, WA + Portland metro" — word for
                  word what the sticky status strip now says about 60px
                  above it, with a second pulsing dot beside it. Removed
                  rather than reworded: the fact is still on screen, the
                  H1 gets to start at the top of the hero, and the site
                  is back to one animation. */}
              <h1 className="text-[40px] font-semibold leading-[1.04] tracking-[-0.025em] text-ivory md:text-[64px]">
                {t.hero.titleLead}{" "}
                <span className="text-ivory/85">
                  {t.hero.titleRest}
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-ivory/85 md:text-[18px]">
                {t.hero.body}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center justify-center rounded-[2px] bg-coral px-7 py-3.5 text-[14px] font-medium text-white transition hover:bg-coral-deep"
                >
                  {t.hero.ctaCall}
                </a>
                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center rounded-[2px] border border-ivory px-7 py-3.5 text-[14px] font-medium text-ivory transition hover:bg-brand hover:text-charcoal"
                >
                  {t.hero.ctaSecondary}
                </Link>
              </div>
            </div>

            {/* Anchor image + signature Project File overlay.
                The overlay is what makes this image specifically
                Ona — not "any interior shot." It tells the viewer
                "this is your live project page on day 7." */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-ivory/10 shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_70px_-30px_rgba(0,0,0,0.25)]">
              <Image
                src={photos[0].src}
                alt={t.hero.imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/15 bg-charcoal/80 p-4 text-ivory shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5">
                <div className="flex items-center gap-2">
                  <span className="ona-pulse h-1.5 w-1.5 rounded-full bg-gold" />
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ivory/80">
                    {t.hero.overlayEyebrow}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <div className="text-[14px] font-medium">
                    {t.hero.overlayStatus}
                  </div>
                  <div className="text-[12px] text-ivory/80">
                    {t.hero.overlayNote}
                  </div>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-[2px] bg-charcoal/15">
                  <div
                    className="h-1 rounded-[2px] bg-gold"
                    style={{ width: "50%" }}
                  />
                </div>
              </div>
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
          <p className="eyebrow text-ivory/85">
            {t.projectFile.eyebrow}
          </p>
          <h2 className="mt-6 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[44px]">
            {t.projectFile.title}
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ivory/85 md:text-[18px]">
            {t.projectFile.body}
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
              <div className="ml-3 rounded-md border border-ivory/10 bg-charcoal px-3 py-1 text-[12px] text-ivory/85">
                onarestore.com/work/sample
              </div>
              <div className="ml-auto rounded-[2px] bg-gold/20 px-2.5 py-1 text-[11px] font-medium text-gold">
                SAMPLE
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow text-ivory/85">
                    Project · Water mitigation
                  </p>
                  <h3 className="mt-3 text-[24px] font-semibold leading-tight tracking-tight text-ivory md:text-[28px]">
                    NE Hazel Dell — kitchen leak rebuild
                  </h3>
                  <p className="mt-2 text-[13px] text-ivory/85">
                    Opened July 29 · Day 7 of 14 · Adjuster: Liberty Mutual
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 self-start rounded-[2px] border border-gold/40 bg-gold/5 px-3 py-1.5 text-[12px] text-gold">
                  <span className="ona-pulse h-1.5 w-1.5 rounded-full bg-gold" />
                  3 new updates today
                </div>
              </div>

              {/* Phase progress bar */}
              <div className="mt-8 rounded-xl border border-ivory/10 bg-charcoal-soft p-5">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[12px]">
                  <span className="text-ivory/85">Day 7 of est. 14</span>
                  <span className="font-medium text-ivory">
                    50% complete · on schedule
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-[2px] bg-charcoal/10">
                  <div
                    className="h-2 rounded-[2px] bg-gold"
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
                            : "text-ivory/85"
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
                  <p className="eyebrow text-ivory/85">
                    Daily updates
                  </p>
                  <div className="mt-5 space-y-5">
                    {[
                      {
                        day: "Day 1",
                        ts: "July 29 · 8:42a",
                        title: "Initial moisture mapping",
                        body: "Identified 6.2 m² of saturated subfloor. Containment set, dehumidifiers placed.",
                        photos: 12,
                        author: "Ona tech",
                      },
                      {
                        day: "Day 3",
                        ts: "July 31 · 11:05a",
                        title: "Adjuster walkthrough — approved",
                        body: 'Scope agreed: lower cabinets, subfloor, drywall to 18". Insurer photos uploaded.',
                        photos: 38,
                        author: "Ona tech + adjuster",
                      },
                      {
                        day: "Day 5",
                        ts: "August 2 · 4:18p",
                        title: "Drying complete",
                        body: "All readings below threshold. Demo scheduled for Day 6.",
                        photos: 18,
                        author: "Ona tech",
                      },
                      {
                        day: "Day 7",
                        ts: "Today · 9:14a",
                        title: "Rebuild started",
                        body: "Subfloor and drywall in. Cabinets arriving Day 9. On schedule — kitchen usable again by Day 14.",
                        photos: 24,
                        author: "Ona tech",
                        isNow: true,
                      },
                    ].map((entry) => (
                      <div
                        key={entry.day}
                        className="grid cursor-pointer gap-3 border-t border-ivory/10 pt-4 transition hover:bg-charcoal-soft/40 sm:grid-cols-[80px_1fr]"
                      >
                        <div>
                          <div className="text-[12px] uppercase tracking-[0.18em] text-ivory/85">
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
                          <div className="mt-1 text-[14px] leading-relaxed text-ivory/85">
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
                    <div className="eyebrow text-ivory/85">
                      Approved scope
                    </div>
                    <div className="mt-2 text-[24px] font-semibold tabular-nums text-ivory">
                      $14,820
                    </div>
                    <div className="mt-1 text-[12px] text-ivory/85">
                      Billed directly to insurer.
                    </div>
                  </div>

                  <div>
                    <div className="eyebrow text-ivory/85">
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
                                  : "text-ivory/85"
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
                    <div className="eyebrow text-ivory/85">Photos</div>
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
                    <div className="mt-3 text-[12px] text-ivory/85">
                      142 photos · uploaded daily
                    </div>
                  </div>

                  <div>
                    <div className="eyebrow text-ivory/85">
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
                    <div className="eyebrow text-ivory/85">
                      Recent activity
                    </div>
                    <ul className="mt-3 space-y-2 text-[12px] text-ivory/85">
                      <li className="flex gap-2">
                        <span className="mt-1 inline-block h-1 w-1 flex-none rounded-full bg-gold" />
                        <span>
                          <span className="text-ivory">Ona tech</span>{" "}
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

          {/* Phone mockup w/ real photos.
              Hidden on mobile: the visitor is already on their phone, so a
              phone-inside-a-phone mockup is pure redundant length there.
              Kept on md+ where it usefully previews the mobile experience. */}
          <div className="mt-12 hidden items-center gap-10 md:grid md:grid-cols-[1fr_auto] md:gap-16">
            <div className="max-w-lg">
              <p className="eyebrow text-ivory/85">
                On your phone too
              </p>
              <h3 className="mt-4 text-[24px] font-semibold leading-tight tracking-tight text-ivory md:text-[30px]">
                Daily updates in your pocket.
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ivory/85">
                Photos uploaded the day they&apos;re taken. Adjuster
                approvals as they come in. A small text when something
                needs your attention. No app to install — it&apos;s just
                a link.
              </p>
            </div>

            <div className="mx-auto w-[260px] flex-none rounded-[36px] border border-ivory/10 bg-charcoal p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] sm:w-[280px]">
              <div className="overflow-hidden rounded-[28px] bg-charcoal">
                <div className="flex h-6 items-center justify-center bg-charcoal">
                  <span className="h-1 w-12 rounded-[2px] bg-charcoal/15" />
                </div>
                <div className="space-y-4 px-4 pb-5">
                  <div className="flex items-center justify-between text-[10px] text-ivory/85">
                    <span>Ona</span>
                    <span>9:41</span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ivory/85">
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
                  <div className="h-1.5 w-full rounded-[2px] bg-charcoal/10">
                    <div
                      className="h-1.5 rounded-[2px] bg-gold"
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
                        meta: "Mon · scope signed off",
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
                          <div className="truncate text-[10px] text-ivory/85">
                            {feed.meta}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full rounded-[2px] bg-gold py-2 text-center text-[11px] font-medium text-white">
                    Call Ona
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

      {/* ─── 2. WHAT WE DO (emotional split) ──────────────────
          Restoration urgent + stabilizing. Remodel inspiring +
          craftsmanship. */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <p className="eyebrow text-ivory/85">{t.whatWeDo.eyebrow}</p>
          <h2 className="mt-6 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[44px]">
            {t.whatWeDo.title}
          </h2>

          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {/* Display order (v4): Restoration → Mold → Remodeling. Restoration
                leads because it drives the actual phone calls; remodeling is
                the longer-consideration line. Source order stays the same,
                only the CSS `order` values move. */}
            <div className="order-1">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="ona-pulse h-2 w-2 rounded-full bg-gold" />
                  <p className="eyebrow text-ivory/85">{t.whatWeDo.restoration.label}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-gold">
                  {t.whatWeDo.restoration.badge}
                </span>
              </div>
              <p className="mt-4 text-[18px] leading-relaxed text-ivory">
                {t.whatWeDo.restoration.body}
              </p>

              <ul className="mt-8 grid gap-3 text-[15px] text-ivory/85">
                {restorationServices.map((s) => (
                  <li key={s.slug} className="border-t border-ivory/10 pt-3">
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
                <p className="eyebrow text-ivory/85">{t.whatWeDo.restoration.stepsTitle}</p>
                <ol className="mt-3 space-y-2 text-[13px] text-ivory/85">
                  {t.whatWeDo.restoration.steps.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="font-medium text-ivory">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Mold — its own pillar (IICRC S520), pulled out of the
                restoration list above. */}
            <div className="order-2 md:border-l md:border-ivory/10 md:pl-10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  <p className="eyebrow text-ivory/85">{t.whatWeDo.mold.label}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-ivory/85">
                  {t.whatWeDo.mold.badge}
                </span>
              </div>
              <p className="mt-4 text-[18px] leading-relaxed text-ivory">
                {t.whatWeDo.mold.body}
              </p>

              <ul className="mt-8 grid gap-3 text-[15px] text-ivory/85">
                {t.whatWeDo.mold.links.map((label) => (
                  <li key={label} className="border-t border-ivory/10 pt-3">
                    <Link
                      href="/services/mold-removal"
                      className="flex items-center justify-between transition hover:text-ivory"
                    >
                      <span>{label}</span>
                      <span className="text-warm-gray-soft">→</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-xl border border-ivory/10 bg-charcoal-soft p-5">
                <p className="eyebrow text-ivory/85">
                  {t.whatWeDo.mold.stepsTitle}
                </p>
                <ol className="mt-3 space-y-2 text-[13px] text-ivory/85">
                  {t.whatWeDo.mold.steps.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="font-medium text-ivory">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="order-3 md:border-l md:border-ivory/10 md:pl-10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-gold-deep" />
                  <p className="eyebrow text-ivory/85">{t.whatWeDo.remodel.label}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-ivory/85">
                  {t.whatWeDo.remodel.badge}
                </span>
              </div>
              <p className="mt-4 text-[18px] leading-relaxed text-ivory">
                {t.whatWeDo.remodel.body}
              </p>

              <ul className="mt-8 grid gap-3 text-[15px] text-ivory/85">
                {t.whatWeDo.remodel.links.map((l) => (
                  <li key={l.label} className="border-t border-ivory/10 pt-3">
                    <Link
                      href={l.href}
                      className="flex items-center justify-between transition hover:text-ivory"
                    >
                      <span>{l.label}</span>
                      <span className="text-warm-gray-soft">→</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-xl border border-ivory/10 bg-charcoal-soft p-5">
                <p className="eyebrow text-ivory/85">{t.whatWeDo.remodel.stepsTitle}</p>
                <ol className="mt-3 space-y-2 text-[13px] text-ivory/85">
                  {t.whatWeDo.remodel.steps.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="font-medium text-ivory">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
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
      {/* Cut by about two thirds. This used to be a six-row status panel
          with its own header bar, a pulsing "on schedule" chip and a
          rounded-2xl card — a second dashboard, immediately after the
          Live Project Page had already made the same argument at full
          size. The reader arrives here already convinced and starts to
          tire; a block that repeats a won argument costs attention rather
          than earning it.

          Four figures, no panel, no chrome. The Live Project Page above
          is the software moment on this page and it should be the only
          one. Do not grow this back into a table. */}
      <section className="border-t border-line bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow text-warm-gray">{t.data.eyebrow}</p>
            <h2 className="mt-5 text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] text-ivory md:text-[32px]">
              {t.data.title}
            </h2>
          </div>

          <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.data.stats.map((s) => (
              <div key={s.label} className="border-t border-line pt-5">
                <dd className="font-mono text-[26px] leading-none tracking-tight text-ivory tabular-nums md:text-[30px]">
                  {s.value}
                </dd>
                <dt className="mt-3 text-[14px] leading-snug text-warm-gray">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── 1B. REASSURANCE STRIP ────────────────────────────
          Four concrete operational promises. */}
      <section className="border-t border-ivory/10 bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.reassurance.map((item) => (
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
                  <div className="mt-1 text-[13px] text-ivory/85">
                    {item.hint}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. HOW WE CHARGE (visual phases) ─────────────────
          Restoration: assertion list. Remodel: phase cards. */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <p className="eyebrow text-ivory/85">{t.pricing.eyebrow}</p>
          <h2 className="mt-6 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[44px]">
            {t.pricing.title}
          </h2>

          <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="eyebrow text-ivory/85">{t.pricing.restoration.label}</p>
              <p className="mt-4 text-[17px] leading-relaxed text-ivory">
                {t.pricing.restoration.body}
              </p>
              <ul className="mt-6 space-y-3 text-[14px] text-ivory/85">
                {t.pricing.restoration.bullets.map((line) => (
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
              <p className="eyebrow text-ivory/85">{t.pricing.remodel.label}</p>
              <p className="mt-4 text-[17px] leading-relaxed text-ivory">
                {t.pricing.remodel.body}
              </p>

              {/* One timeline, not two widgets. This was a bordered
                  panel with a dot-and-checkmark scrubber, followed by
                  three more bordered cards repeating the same three
                  phases and the same three percentages — a payment
                  schedule rendered as an app, on a page that already has
                  one large software moment. A remodel is paid in three
                  parts; that is a line, not an interface. */}
              <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-3">
                {t.pricing.remodel.phases.map((phase) => (
                  <li key={phase.name} className="border-t border-line pt-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="eyebrow text-warm-gray">
                        {phase.name}
                      </span>
                      <span className="font-mono text-[22px] leading-none tabular-nums text-ivory">
                        {phase.pct}
                      </span>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-warm-gray">
                      {phase.body}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-[13px] text-warm-gray">
                {t.pricing.remodel.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4B. REMODEL GALLERY ──────────────────────────────
          Full-bleed. This was four 4:5 cards in a four-column grid
          inside the 7xl container — each photo about 300px wide,
          wrapped in a bordered, rounded panel. Four thumbnails in a
          row read as a table; the page needed to stop being a
          document and start being a house, and the only way a photo
          does that is at size. The images now run the width of the
          viewport, the headings stay in the container.

          The captions also had to go. They read "Family of four · 8
          weeks · quartz + oak shaker", "Aging-in-place · 5 weeks ·
          porcelain field", "Load-bearing wall removed · reframed for
          two beams" — durations, household compositions, materials
          and structural work invented and attached to real
          photographs, one of which is a powder room labelled as a
          primary bath. Same rule as components/RemodelingGallery.tsx:
          every word must be visible in its own frame. */}
      <section className="border-t border-line bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 pt-24 md:pt-32 lg:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-warm-gray">{t.gallery.eyebrow}</p>
              <h2 className="mt-6 max-w-3xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[44px]">
                {t.gallery.title}
              </h2>
            </div>
            <p className="max-w-sm text-[14px] text-warm-gray">
              {t.gallery.intro}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {t.gallery.cards.map((c, i) => ({ ...c, photo: photo(c.photo) })).map((card, i) => (
            <article key={i} className="bg-charcoal">
              <div className="relative aspect-[3/2] bg-charcoal-soft">
                <Image
                  src={card.photo.src}
                  alt={card.photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="px-6 py-5">
                <div className="eyebrow text-warm-gray">{card.kind}</div>
                <div className="mt-2 text-[14px] leading-relaxed text-ivory">
                  {card.meta}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-12 md:pb-32 lg:px-10">
          <Link
            href="/services/remodeling"
            className="inline-flex items-center gap-2 text-[14px] text-ivory underline-offset-4 hover:underline"
          >
            {t.gallery.linkText}
            <span aria-hidden>→</span>
          </Link>
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
            src={photo(t.band.photo).src}
            alt={t.band.imageAlt}
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
              <p className="eyebrow text-ivory/85">
                {t.team.eyebrow}
              </p>
              <h2 className="mt-6 text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[40px]">
                {t.team.title}
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-ivory/85">
                {t.team.lead}
              </p>
            </div>

            <div className="text-[17px] leading-relaxed text-ivory">
              <p>
                {t.team.body}
              </p>

              <div className="mt-8 rounded-xl border border-ivory/10 bg-charcoal p-5">
                <p className="eyebrow text-ivory/85">
                  {t.team.stepsTitle}
                </p>
                <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                  {t.team.steps.map((step, i) => ({ ...step, n: String(i + 1) })).map((step) => (
                    <li key={step.n} className="flex gap-3 text-[13px]">
                      <span className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-charcoal text-[11px] font-semibold text-ivory">
                        {step.n}
                      </span>
                      <div>
                        <div className="font-medium text-ivory">
                          {step.title}
                        </div>
                        <div className="text-ivory/85">{step.body}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <p className="mt-8 text-[14px] text-ivory/85">
                {t.team.note}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center justify-center rounded-[2px] bg-coral px-6 py-3 text-[14px] font-medium text-white transition hover:bg-coral-deep"
                >
                  {site.phoneDisplay}
                </a>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-[2px] border border-ivory px-6 py-3 text-[14px] font-medium text-ivory transition hover:bg-brand hover:text-charcoal"
                >
                  {t.team.ctaSecondary}
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
              <p className="eyebrow text-ivory/85">{t.realWork.eyebrow}</p>
              <h2 className="mt-6 max-w-2xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[40px]">
                {t.realWork.title}
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-[14px] text-ivory underline-offset-4 hover:underline"
            >
              {t.realWork.linkText}
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {t.realWork.cards
              .map((c) => ({
                kind: c.kind,
                title: c.title,
                meta: c.meta,
                photo: c.photo === "none" ? null : photo(c.photo),
                signal: c.signalLabel ? { live: c.signalLive, label: c.signalLabel } : null,
              }))
              .map((card, i) => (
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
                        "wherever you see this chip, Ona is
                        running an organized project." */}
                    {card.signal ? (
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-[2px] border border-white/15 bg-charcoal/80 px-3 py-1.5 text-[11px] text-ivory backdrop-blur-md">
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
                    <span className="rounded-[2px] border border-dashed border-ivory/25 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-ivory/85">
                      {t.realWork.emptyLabel}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-3 p-5">
                  <div className="eyebrow text-ivory/85">
                    {card.kind}
                  </div>
                  <div className="text-[18px] font-semibold leading-tight tracking-tight text-ivory">
                    {card.title}
                  </div>
                  <div className="text-[13px] text-ivory/85">
                    {card.meta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. CLOSING CTA — dark, cohesive finale ───────────
          Previously this flipped to ivory as a "rhythm break,"
          but it read as a single orphaned light panel between the
          dark "Real work" section and the dark footer. Kept in the
          page's charcoal family (charcoal-soft) so the bottom of
          the page stays one continuous tone. The gold phone button
          is the only accent. */}
      <section className="border-t border-ivory/10 bg-charcoal-soft text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-20">
            <div>
              <p className="eyebrow text-ivory/85">{t.closing.eyebrow}</p>
              <h2 className="mt-6 max-w-2xl text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-ivory md:text-[56px]">
                {t.closing.title}
              </h2>
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ivory/85">
                {t.closing.body}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex items-center justify-center rounded-[2px] bg-coral px-7 py-3.5 text-[14px] font-medium text-white transition hover:bg-coral-deep"
                >
                  {t.closing.ctaCall}
                </a>
                <Link
                  href="/start-project"
                  className="inline-flex items-center justify-center rounded-[2px] border border-ivory px-7 py-3.5 text-[14px] font-medium text-ivory transition hover:bg-brand hover:text-charcoal"
                >
                  {t.closing.ctaSecondary}
                </Link>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-6 border-t border-ivory/10 pt-8 text-[13px] md:border-l md:border-t-0 md:pl-10 md:pt-0">
              {t.closing.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-ivory/70">
                    {f.label}
                  </dt>
                  <dd className="mt-2 text-ivory">{f.value}</dd>
                  <dd className="mt-1 text-ivory/70">{f.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* FAQ JSON-LD — invisible, kept for SEO continuity */}
      <JsonLd data={faqJsonLd(t.faqs)} />
    </>
  );
}
