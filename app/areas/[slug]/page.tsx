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
import { areaProfiles, findAreaProfile } from "@/lib/areas";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return areaProfiles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const area = findAreaProfile(slug);
  if (!area) return {};
  return buildMetadata({
    title: `Restoration in ${area.name}, ${area.region} — Water, Fire & Mold`,
    description: `24/7 restoration in ${area.name}, ${area.regionName} (${area.county}). ${area.driveMinutesFromHQ}-minute dispatch from our Vancouver, WA HQ. IICRC-certified, direct insurance billing.`,
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

  const localFaqs = [
    {
      q: `How fast can ONA Restoration reach ${area.name}, ${area.region}?`,
      a: `Our typical dispatch time to ${area.name} is ${area.driveMinutesFromHQ} minutes from our Vancouver, WA headquarters. During regional emergencies we dispatch by severity and prioritize the closest available crew first.`,
    },
    {
      q: `What are the most common restoration calls in ${area.name}?`,
      a: `${area.commonLosses.slice(0, 3).join("; ")}. ${area.weatherPattern}`,
    },
    {
      q: `Which ZIP codes do you cover in ${area.name}?`,
      a: `We cover all of ${area.name} and the surrounding ${area.county}, including ZIP codes ${area.zips.join(", ")}.`,
    },
    {
      q: `Are you licensed to work in ${area.regionName}?`,
      a: `Yes. ONA Restoration is licensed, bonded and insured in both Washington and Oregon. We operate seamlessly across the state line throughout the Portland metro.`,
    },
    {
      q: `Do you handle the insurance claim for ${area.name} customers?`,
      a: `Yes. We document the loss to IICRC and Xactimate standards and coordinate directly with your adjuster from first notice of loss through final payment.`,
    },
  ];

  return (
    <>
      <div className="bg-charcoal">
        <Breadcrumbs
          tone="dark"
          items={[
            { name: "Home", href: "/" },
            { name: "Service Area", href: "/areas" },
            { name: `${area.name}, ${area.region}`, href: `/areas/${area.slug}` },
          ]}
        />
        <section className="text-ivory">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-12 lg:px-10 lg:pb-28 lg:pt-16">
            <p className="eyebrow text-warm-gray-soft">
              {area.county} · {area.regionName}
            </p>
            <h1 className="mt-8 max-w-4xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
              Restoration in {area.name},
              <span className="block text-ivory/60">{area.region}.</span>
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ivory/75">
              {area.driveMinutesFromHQ}-minute dispatch from our Vancouver, WA
              headquarters. Population {area.population}. IICRC-certified crews,
              direct insurance billing, 24/7.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <PhoneLink className="inline-flex items-center gap-3 border border-ivory bg-ivory px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:bg-transparent hover:text-ivory">
                <PhoneIcon className="h-4 w-4 stroke-current" />
                Call {site.phoneDisplay}
              </PhoneLink>
              <Link
                href="/services"
                className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory"
              >
                All services
                <ArrowIcon className="h-4 w-4 stroke-current" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Local context — what makes restoration in this specific city different */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-charcoal/60">Local context</p>
              <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                Why restoration in {area.name} is different.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-charcoal/80 lg:col-span-8">
              <p>{area.localNote}</p>
              <p>
                <strong className="font-medium text-charcoal">Weather:</strong>{" "}
                {area.weatherPattern}
              </p>
              <div>
                <p className="font-medium text-charcoal">
                  Common restoration calls here:
                </p>
                <ul className="mt-3 space-y-2 text-base text-charcoal/75">
                  {area.commonLosses.map((c) => (
                    <li
                      key={c}
                      className="border-l border-charcoal/15 pl-4"
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
      <section className="bg-ivory-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-charcoal/60">Coverage</p>
              <h2 className="mt-6 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                Neighborhoods we work in.
              </h2>
              <ul className="mt-8 space-y-2 text-base text-charcoal/80">
                {area.neighborhoods.map((n) => (
                  <li key={n} className="border-b border-charcoal/10 pb-2">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <p className="eyebrow text-charcoal/60">ZIP codes</p>
              <h2 className="mt-6 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                {area.zips.length} ZIPs · {area.county}.
              </h2>
              <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {area.zips.map((z) => (
                  <li
                    key={z}
                    className="border border-line-light bg-ivory px-3 py-3 text-center text-sm font-medium text-charcoal/85"
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
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <p className="eyebrow text-charcoal/60">Available in {area.name}</p>
          <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            Services we provide here.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s) => (
              <div key={s.slug}>
                <ServiceCard service={s} hrefOverride={`/services/${s.slug}/${area.slug}`} />
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-charcoal/55">
            Each link opens the {area.name}-specific page for that service —
            response time, neighborhoods, and local loss patterns included.
          </p>
        </div>
      </section>

      <FAQ items={localFaqs} title={`FAQ — ${area.name}, ${area.region}`} />
      <CTA
        title={`Emergency in ${area.name}?`}
        subtitle={`Live dispatch, 24/7. Typical on-site time from Vancouver, WA: ${area.driveMinutesFromHQ} minutes.`}
      />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Service Area", url: "/areas" },
            { name: `${area.name}, ${area.region}`, url: `/areas/${area.slug}` },
          ]),
          faqJsonLd(localFaqs),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Restoration services in ${area.name}, ${area.region}`,
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
