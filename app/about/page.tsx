import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ValuesGrid } from "@/components/ValuesGrid";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import aboutContent from "@/content/pages/about.json";
import { fillVarsDeep } from "@/lib/placeholders";

// Every piece of copy on this page lives in content/pages/about.json and is
// edited through the admin (/admin → About page). {name} … are filled from
// Company details, {founded} with the year founded. The credentials list is
// Company details → Credentials; the values grid is Company details →
// Company values. The hidden founder section below is not on the site and
// stays in code until SHOW_FOUNDER is switched back on.
const t = fillVarsDeep(aboutContent, { founded: site.founded });

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/about",
});

// The licensing answer is answered straight: Washington yes, Oregon pending.
// An earlier answer said yes to both states while the footer on the same
// page said "OR CCB: pending" — see lib/site.ts.
const aboutFaqs = t.faq.faqs;

// Temporarily hiding the founder's name/section site-wide ("скрой пока").
// Flip back to true to restore the visible Founder section AND its Person
// JSON-LD below in one move. Coupled hides that live in other files when
// this is false: the LocalBusiness `founder` in lib/jsonld.ts, the
// "Founded by …" line in this page's search description (now
// content/pages/about.json → seo.description), and the blog bylines in
// lib/posts.ts — restore those alongside this flag. The founder copy below is
// deliberately not in the admin while it is hidden: text an editor can change
// but nobody can see would only confuse. Move it to about.json when it
// comes back.
const SHOW_FOUNDER = false;

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: t.seo.breadcrumb, href: "/about" },
        ]}
      />
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/72">{t.hero.eyebrow}</p>
          <h1 className="text-ivory mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            {t.hero.title}
          </h1>
          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="space-y-6 text-lg leading-relaxed text-ivory/90">
                {/* Pronunciation cue. Title-casing the wordmark stops most
                    people reading it as an initialism, but someone meeting
                    the name for the first time still needs to be told, and
                    this is the page where they look. Mono because that is
                    the site's register for technical labels. Two syllables,
                    stress on the first — the same vowel that starts
                    "owner", without the r. */}
                <p>
                  {t.hero.intro.beforePronunciation}{" "}
                  <span className="font-mono text-ivory">
                    {t.hero.intro.pronunciation}
                  </span>
                  {t.hero.intro.afterPronunciation}
                </p>
                <p>{t.hero.body}</p>
                {/* The WA registration number is required in advertising
                    (RCW 18.27.100(3)) and links to the state's own lookup.
                    Oregon stays "pending" until the CCB number issues. */}
                <p>
                  {t.hero.registration.beforeNumber}{" "}
                  <a
                    href="https://secure.lni.wa.gov/verify/"
                    rel="noopener"
                    target="_blank"
                    className="underline underline-offset-2"
                  >
                    {t.hero.registration.number}
                  </a>
                  {t.hero.registration.afterNumber}
                </p>
              </div>
            </div>
            <aside className="lg:col-span-5">
              <div className="border border-ivory/10 p-8">
                <p className="eyebrow text-ivory/72">
                  {t.hero.credentialsLabel}
                </p>
                <ul className="mt-6 space-y-3 text-base text-ivory/95">
                  {site.certifications.map((c) => (
                    <li
                      key={c}
                      className="border-t border-ivory/10 pt-3 first:border-t-0 first:pt-0"
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

      {/* Founder section — DOM anchor for the Person @id used in JSON-LD.
          Hidden for now via SHOW_FOUNDER. */}
      {SHOW_FOUNDER && (
      <section id="founder" className="border-t border-ivory/10 bg-charcoal scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/72">Founder</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            Founded and led by Dmitry Zinovyev.
          </h2>
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="space-y-6 text-base leading-relaxed text-ivory/90">
                <p>
                  Dmitry built Ona Restoration &amp; Remodeling after watching
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
                  Ona takes — large-loss water, multi-room fires, mold
                  remediation jobs that involve third-party Indoor
                  Environmental Professional clearance, and custom
                  reconstruction. He is also the person who answers the phone
                  if you call after hours. That&apos;s by design.
                </p>
              </div>
            </div>
            <aside className="lg:col-span-4">
              <div className="border border-ivory/10 p-8">
                <p className="eyebrow text-ivory/72">Contact</p>
                <p className="mt-5 text-sm leading-relaxed text-ivory/90">
                  For project consultations, partnership, press, or anything
                  that should reach the founder directly:
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-5 block text-base font-medium tracking-tight text-ivory underline decoration-ivory/30 underline-offset-4 transition hover:decoration-ivory break-words"
                >
                  {site.email}
                </a>
                <a
                  href={`tel:${site.phone}`}
                  className="mt-3 block text-base font-medium tracking-tight text-ivory underline decoration-ivory/30 underline-offset-4 transition hover:decoration-ivory"
                >
                  {site.phoneDisplay}
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
      )}

      {/* How we work */}
      <section className="border-t border-ivory/10 bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/72">{t.howWeWork.eyebrow}</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {t.howWeWork.title}
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 md:grid-cols-3">
            {t.howWeWork.items.map((item, i) => (
              <div key={i} className="bg-charcoal p-10">
                <p className="eyebrow text-ivory/72">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-ivory mt-4 text-xl font-medium tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/80">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* By the numbers — facts that are verifiable on day one. Google rating
          is intentionally omitted until the GBP profile is verified and
          accumulates real reviews; surfacing a fabricated count works
          against verification. Add a fourth stat here once GBP is live. */}
      <section className="border-t border-ivory/10 bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-warm-gray-soft">{t.setup.eyebrow}</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {t.setup.title}
          </h2>
          <dl className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-3">
            {t.setup.stats.map((st, i) => (
              <Stat key={i} label={st.label} value={st.value} note={st.note} />
            ))}
          </dl>
        </div>
      </section>

      <ValuesGrid tone="light" />

      <FAQ items={aboutFaqs} title={t.faq.title} />

      <CTA />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: t.seo.breadcrumb, url: "/about" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: `${site.url}/about`,
            mainEntity: { "@id": `${site.url}/#business` },
          },
          faqJsonLd(aboutFaqs),
          // Founder Person schema — hidden for now alongside the visible
          // section (SHOW_FOUNDER). Restore by flipping the flag.
          ...(SHOW_FOUNDER
            ? [
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
                    "IICRC S500, S520 and S700 standards",
                  ],
                },
              ]
            : []),
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
      <dt className="eyebrow text-ivory/70">{label}</dt>
      <dd className="mt-4 text-3xl font-light tracking-tight text-ivory">
        {value}
      </dd>
      <p className="mt-3 text-xs leading-relaxed text-ivory/70">{note}</p>
    </div>
  );
}
