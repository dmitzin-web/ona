import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceCard } from "@/components/ServiceCard";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon, PhoneIcon } from "@/components/icons/ServiceIcons";
import { PhoneLink } from "@/components/contact/ContactLinks";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { areaProfiles, findAreaProfile, type AreaProfile } from "@/lib/areas";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import pageContent from "@/content/pages/area-page.json";
import { fillVarsDeep } from "@/lib/placeholders";

// The words around each city's own details live in
// content/pages/area-page.json (/admin → City page template); {area},
// {county} … are filled per city below. The city's details are
// content/areas.json. Search keywords and the place names in the structured
// data stay here: keywords are no longer written into the page (lib/seo.ts)
// and the place names are identifiers, not copy.
const copy = (area: AreaProfile) =>
  fillVarsDeep(pageContent, {
    area: area.name,
    areaState: area.region,
    areaStateName: area.regionName,
    county: area.county,
    population: area.population,
    drive: String(area.driveMinutesFromHQ),
    zipCount: String(area.zips.length),
    zips: area.zips.join(", "),
    topLosses: area.commonLosses.slice(0, 3).join("; "),
    weather: area.weatherPattern,
  });

export function generateStaticParams() {
  return areaProfiles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const area = findAreaProfile(slug);
  if (!area) return {};
  const t = copy(area);
  return buildMetadata({
    title: t.seo.title,
    description: t.seo.description,
    path: `/areas/${area.slug}`,
    keywords: [
      `restoration ${area.name} ${area.region}`,
      `water damage ${area.name}`,
      `fire damage ${area.name}`,
      `mold remediation ${area.name}`,
      `${area.name} emergency restoration`,
      `${area.county} restoration`,
    ],
  });
}

export default async function AreaPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const area = findAreaProfile(slug);
  if (!area) notFound();

  const t = copy(area);
  // Each question may carry a separate answer for Oregon cities. The
  // licensing one does: the question is per-area, so the answer has to be
  // too — the Oregon CCB registration is pending (see lib/site.ts), and the
  // old single answer said yes for both states.
  const localFaqs = t.faq.items.map((f) => ({
    q: f.q,
    a: area.region === "OR" && f.aOregon ? f.aOregon : f.a,
  }));

  return (
    <>
      <div className="bg-charcoal">
        <Breadcrumbs
          tone="dark"
          items={[
            { name: t.breadcrumbs.home, href: "/" },
            { name: t.breadcrumbs.areas, href: "/areas" },
            { name: t.breadcrumbs.city, href: `/areas/${area.slug}` },
          ]}
        />
        <section className="text-ivory">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-12 lg:px-10 lg:pb-28 lg:pt-16">
            <p className="eyebrow text-warm-gray-soft">
              {t.hero.eyebrow}
            </p>
            <h1 className="text-ivory mt-8 max-w-4xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
              {t.hero.titleLead}
              <span className="block text-ivory/72">{t.hero.titleRest}</span>
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ivory/85">
              {t.hero.body}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <PhoneLink className="inline-flex items-center gap-3 border border-ivory bg-charcoal px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-brand hover:text-charcoal">
                <PhoneIcon className="h-4 w-4 stroke-current" />
                {t.hero.ctaCall}
              </PhoneLink>
              <Link
                href="/services"
                className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory"
              >
                {t.hero.ctaServices}
                <ArrowIcon className="h-4 w-4 stroke-current" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Local context — what makes restoration in this specific city different */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ivory/72">{t.local.eyebrow}</p>
              <h2 className="text-ivory mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                {t.local.title}
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-ivory/90 lg:col-span-8">
              <p>{area.localNote}</p>
              <p>
                <strong className="font-medium text-ivory">{t.local.weatherLabel}</strong>{" "}
                {area.weatherPattern}
              </p>
              <div>
                <p className="font-medium text-ivory">
                  {t.local.lossesTitle}
                </p>
                <ul className="mt-3 space-y-2 text-base text-ivory/85">
                  {area.commonLosses.map((c) => (
                    <li
                      key={c}
                      className="border-l border-ivory/15 pl-4"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods + ZIPs */}
      <section className="bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-ivory/72">{t.coverage.eyebrow}</p>
              <h2 className="text-ivory mt-6 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                {t.coverage.title}
              </h2>
              <ul className="mt-8 space-y-2 text-base text-ivory/90">
                {area.neighborhoods.map((n) => (
                  <li key={n} className="border-b border-ivory/10 pb-2">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <p className="eyebrow text-ivory/72">{t.coverage.zipsEyebrow}</p>
              <h2 className="text-ivory mt-6 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                {t.coverage.zipsTitle}
              </h2>
              <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {area.zips.map((z) => (
                  <li
                    key={z}
                    className="border border-ivory/10 bg-charcoal px-3 py-3 text-center text-sm font-medium text-ivory/95"
                  >
                    {z}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services available — links to programmatic service × city
          landing pages for buy-intent local SEO ("water damage
          restoration <city>"). Falls back to the generic service page
          on hover/click for users who want the full overview. */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <p className="eyebrow text-ivory/72">{t.services.eyebrow}</p>
          <h2 className="text-ivory mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {t.services.title}
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s) => (
              <div key={s.slug}>
                <ServiceCard service={s} hrefOverride={`/services/${s.slug}/${area.slug}`} />
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ivory/70">
            {t.services.note}
          </p>
        </div>
      </section>

      <FAQ items={localFaqs} title={t.faq.title} />
      <CTA title={t.cta.title} subtitle={t.cta.subtitle} />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t.breadcrumbs.home, url: "/" },
            { name: t.breadcrumbs.areas, url: "/areas" },
            { name: t.breadcrumbs.city, url: `/areas/${area.slug}` },
          ]),
          faqJsonLd(localFaqs),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: t.seo.structuredName,
            provider: { "@id": `${site.url}/#business` },
            areaServed: {
              "@type": "City",
              name: `${area.name}, ${area.region}`,
              containedInPlace: {
                "@type": "AdministrativeArea",
                name: `${area.county}, ${area.regionName}`,
              },
            },
            url: `${site.url}/areas/${area.slug}`,
          },
        ]}
      />
    </>
  );
}
