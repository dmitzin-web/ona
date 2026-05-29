import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon, serviceIcons } from "@/components/icons/ServiceIcons";
import { services, findService } from "@/lib/services";
import { areaProfiles } from "@/lib/areas";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  serviceProcessHowToJsonLd,
} from "@/lib/jsonld";

// Programmatic service × city pages.
//
// URL: /services/<service-slug>/<city-slug>
// Examples:
//   /services/water-damage/beaverton-or
//   /services/fire-damage/portland-or
//   /services/remodeling/vancouver-wa
//
// Why this exists: these pages target buy-intent local queries like
// "water damage restoration beaverton" which convert into phone calls
// at dramatically higher rates than informational blog content. Each
// page incorporates the genuinely unique city data from areaProfiles
// (weather pattern, common losses, drive-time-from-HQ, neighborhoods)
// to avoid being a thin / doorway page that Google deprioritises.
//
// Static generation: all 5 services × 10 cities = 50 pages prebuild
// via generateStaticParams. Zero runtime cost.

type RouteParams = { slug: string; area: string };

export function generateStaticParams(): RouteParams[] {
  return services.flatMap((s) =>
    areaProfiles.map((a) => ({ slug: s.slug, area: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug, area } = await params;
  const service = findService(slug);
  const profile = areaProfiles.find((a) => a.slug === area);
  if (!service || !profile) {
    return { title: "Not found" };
  }
  const cityName = `${profile.name}, ${profile.region}`;
  return buildMetadata({
    title: `${service.name} in ${cityName}`,
    description: `${service.name} in ${cityName} — IICRC-certified, ${profile.driveMinutesFromHQ === 0 ? "based locally" : `${profile.driveMinutesFromHQ}-min dispatch from our Vancouver HQ`}, insurance-grade documentation. Call ${site.phoneDisplay} for 24/7 emergency response.`,
    path: `/services/${service.slug}/${profile.slug}`,
    keywords: [
      `${service.shortName.toLowerCase()} ${profile.name.toLowerCase()}`,
      `${service.name.toLowerCase()} ${profile.name.toLowerCase()}, ${profile.region}`,
      `${service.shortName.toLowerCase()} restoration ${profile.county.toLowerCase()}`,
      `IICRC ${profile.name.toLowerCase()}`,
      `24/7 ${service.shortName.toLowerCase()} ${profile.name.toLowerCase()}`,
    ],
  });
}

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug, area } = await params;
  const service = findService(slug);
  const profile = areaProfiles.find((a) => a.slug === area);
  if (!service || !profile) notFound();

  const cityName = `${profile.name}, ${profile.region}`;
  const Icon = serviceIcons[service.slug as keyof typeof serviceIcons];

  // Surface 2 sibling cities (same service, different city) + 2 sibling
  // services (same city, different service) at the bottom for cross-
  // linking. This builds the internal-link graph Google uses for local
  // topical authority.
  const otherCitiesForService = areaProfiles
    .filter((a) => a.slug !== profile.slug)
    .slice(0, 3);
  const otherServicesForCity = services
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  const responseLine =
    profile.driveMinutesFromHQ === 0
      ? `As our home base, ${profile.name} gets our fastest dispatch — typically under 20 minutes anywhere in ${profile.county}.`
      : `${profile.name} is roughly ${profile.driveMinutesFromHQ} minutes from our Vancouver HQ; we hit a 60-minute on-site target city-wide.`;

  // Localise the service intro by mentioning the city in a natural
  // sentence. We don't string-replace the service.intro because that
  // makes Google's near-duplicate detection trip; we wrap it instead.

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.shortName, href: `/services/${service.slug}` },
          { name: cityName, href: `/services/${service.slug}/${profile.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-ivory">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,244,241,0.06),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pb-24 lg:pt-20">
          <p className="eyebrow text-warm-gray-soft">
            {service.shortName} · {cityName}
          </p>
          <h1 className="text-ivory mt-8 max-w-3xl text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {service.name} in <span className="font-medium">{cityName}</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/75">
            {service.hero}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/70">
            {responseLine}
          </p>

          <div className="mt-12 grid grid-cols-2 gap-y-6 border-t border-ivory/15 pt-8 sm:grid-cols-4 sm:gap-x-8">
            <Stat label="Response target" value="60 min" />
            <Stat label="From HQ" value={profile.driveMinutesFromHQ === 0 ? "Local" : `~${profile.driveMinutesFromHQ} min`} />
            <Stat label="County" value={profile.county} />
            <Stat label="Service" value={service.shortName} />
          </div>
        </div>
      </section>

      {/* Service intro */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              {Icon && <Icon className="h-12 w-12 stroke-current text-ivory" />}
              <p className="eyebrow mt-6 text-ivory/60">About the service</p>
              <h2 className="text-ivory mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                {service.shortName} in {profile.name}.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-lg leading-relaxed text-ivory/80">
                {service.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* City-specific section */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-ivory/60">{profile.name} context</p>
              <h2 className="text-ivory mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                What we see in {profile.name}.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/75">
                {profile.localNote}
              </p>
            </div>
            <div className="lg:col-span-7">
              <h3 className="eyebrow text-ivory/55">
                Local weather &amp; loss pattern
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ivory/80">
                {profile.weatherPattern}
              </p>

              <h3 className="mt-8 eyebrow text-ivory/55">
                Common losses in {profile.county}
              </h3>
              <ul className="mt-3 space-y-3 text-base text-ivory/80">
                {profile.commonLosses.map((loss) => (
                  <li key={loss} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-warm-gray-soft"
                    />
                    <span>{loss}</span>
                  </li>
                ))}
              </ul>

              {profile.neighborhoods.length > 0 && (
                <>
                  <h3 className="mt-8 eyebrow text-ivory/55">
                    Neighborhoods we cover
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-ivory/75">
                    {profile.neighborhoods.join(" · ")}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/60">Process</p>
          <h2 className="text-ivory mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
            How a {service.shortName.toLowerCase()} job runs in {profile.name}.
          </h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {service.process.map((p, i) => (
              <li
                key={p.step}
                className="border-t border-ivory/20 pt-6"
              >
                <p className="eyebrow text-ivory/50">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-ivory mt-3 text-xl font-light tracking-tight">
                  {p.step.replace(/^\d+\.\s*/, "")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                  {p.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ — borrowed from service, but headlined locally */}
      <FAQ
        items={service.faqs}
        title={`${service.shortName} FAQ — ${profile.name}`}
      />

      {/* Cross-linking — same service in other cities */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <p className="eyebrow text-ivory/60">
            {service.shortName} in other Portland-metro cities
          </p>
          <ul className="mt-6 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-3">
            {otherCitiesForService.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/services/${service.slug}/${a.slug}`}
                  className="flex items-center justify-between bg-charcoal px-5 py-4 text-sm font-medium text-ivory transition hover:bg-charcoal-soft"
                >
                  <span>
                    {service.shortName} · {a.name}, {a.region}
                  </span>
                  <ArrowIcon className="h-3 w-3 stroke-current opacity-50" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cross-linking — other services in same city */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <p className="eyebrow text-ivory/60">
            Other services in {profile.name}, {profile.region}
          </p>
          <ul className="mt-6 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-3">
            {otherServicesForCity.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}/${profile.slug}`}
                  className="flex items-center justify-between bg-charcoal px-5 py-4 text-sm font-medium text-ivory transition hover:bg-charcoal-soft"
                >
                  <span>
                    {s.shortName} · {profile.name}
                  </span>
                  <ArrowIcon className="h-3 w-3 stroke-current opacity-50" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
            <Link
              href={`/services/${service.slug}`}
              className="eyebrow text-ivory transition hover:text-ivory/70"
            >
              ← All {service.shortName.toLowerCase()} info
            </Link>
            <Link
              href={`/areas/${profile.slug}`}
              className="eyebrow text-ivory transition hover:text-ivory/70"
            >
              ← All services in {profile.name}
            </Link>
          </div>
        </div>
      </section>

      <CTA
        title={`Need ${service.shortName.toLowerCase()} in ${profile.name} now?`}
        subtitle={`24/7 dispatch with a 60-minute response target across ${profile.county}. Insurance-grade documentation from first call to final invoice.`}
      />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: service.shortName, url: `/services/${service.slug}` },
            {
              name: cityName,
              url: `/services/${service.slug}/${profile.slug}`,
            },
          ]),
          faqJsonLd(service.faqs),
          serviceProcessHowToJsonLd(service.slug),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${site.url}/services/${service.slug}/${profile.slug}#service`,
            serviceType: service.name,
            name: `${service.name} in ${cityName}`,
            description: service.description,
            provider: { "@id": `${site.url}/#business` },
            areaServed: {
              "@type": "City",
              name: `${profile.name}, ${profile.region}`,
              containedInPlace: {
                "@type": "AdministrativeArea",
                name: profile.county,
              },
            },
            url: `${site.url}/services/${service.slug}/${profile.slug}`,
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
