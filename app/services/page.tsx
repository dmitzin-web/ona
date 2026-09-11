import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceCard } from "@/components/ServiceCard";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons/ServiceIcons";
import {
  restorationServices,
  moldService,
  remodelingService,
} from "@/lib/services";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import servicesIndexContent from "@/content/pages/services-index.json";
import { fillPlaceholdersDeep } from "@/lib/placeholders";

// The page's own copy lives in content/pages/services-index.json and is
// edited through the admin (/admin → Services overview page). Service names,
// headline paragraphs and the restoration cards come from Services
// (content/services.json); the city list from Cities.
const t = fillPlaceholdersDeep(servicesIndexContent);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/services",
});

export default function ServicesPage() {
  // Three co-equal business lines. Restoration is the multi-discipline
  // emergency grid (water, fire, storm); Mold and Remodeling each render
  // as their own featured division. All slugs live in the same services
  // array (so /services/<slug> + city pages auto-generate) — see
  // lib/services.ts for the pillar split.
  const restoration = restorationServices;
  const remodeling = remodelingService;
  const mold = moldService;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: t.seo.breadcrumb, href: "/services" },
        ]}
      />
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/72">{t.hero.eyebrow}</p>
          <h1 className="text-ivory mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/85">
            {t.hero.body}
          </p>

          {/* Remodeling — featured row, separate visual treatment */}
          {remodeling && (
            <div className="mt-16">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <p className="eyebrow text-gold">{t.remodeling.eyebrow}</p>
                <p className="text-sm text-ivory/70">
                  {t.remodeling.tagline}
                </p>
              </div>
              <Link
                href={`/services/${remodeling.slug}`}
                className="group mt-6 block border border-ivory/10 bg-charcoal text-ivory transition hover:border-gold"
              >
                <div className="grid gap-8 px-8 py-12 lg:grid-cols-12 lg:px-12 lg:py-14">
                  <div className="lg:col-span-8">
                    <h2 className="text-ivory text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                      {remodeling.shortName}.{" "}
                      <span className="font-medium text-gold">
                        {t.remodeling.accent}
                      </span>
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/85">
                      {remodeling.hero}
                    </p>
                  </div>
                  <div className="flex items-end lg:col-span-4 lg:justify-end">
                    <span className="inline-flex items-center gap-3 eyebrow text-ivory transition group-hover:gap-4">
                      {t.remodeling.linkText}
                      <ArrowIcon className="h-3 w-3 stroke-current" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Mold — featured row, its own pillar (IICRC S520) */}
          {mold && (
            <div className="mt-16">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <p className="eyebrow text-gold">{t.mold.eyebrow}</p>
                <p className="text-sm text-ivory/70">
                  {t.mold.tagline}
                </p>
              </div>
              <Link
                href={`/services/${mold.slug}`}
                className="group mt-6 block border border-ivory/10 bg-charcoal text-ivory transition hover:border-gold"
              >
                <div className="grid gap-8 px-8 py-12 lg:grid-cols-12 lg:px-12 lg:py-14">
                  <div className="lg:col-span-8">
                    <h2 className="text-ivory text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                      {mold.shortName}.{" "}
                      <span className="font-medium text-gold">
                        {t.mold.accent}
                      </span>
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/85">
                      {mold.hero}
                    </p>
                  </div>
                  <div className="flex items-end lg:col-span-4 lg:justify-end">
                    <span className="inline-flex items-center gap-3 eyebrow text-ivory transition group-hover:gap-4">
                      {t.mold.linkText}
                      <ArrowIcon className="h-3 w-3 stroke-current" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Restoration grid */}
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="eyebrow text-ivory/72">{t.restoration.eyebrow}</p>
              <p className="text-sm text-ivory/70">
                {t.restoration.tagline}
              </p>
            </div>
            <div className="mt-6 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
              {restoration.map((s) => (
                <div key={s.slug}>
                  <ServiceCard service={s} />
                </div>
              ))}
            </div>
          </div>

          {/* Service area — moved here from the global nav */}
          <div className="mt-20 border-t border-ivory/15 pt-12">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="eyebrow text-ivory/72">{t.serviceArea.eyebrow}</p>
                <h2 className="text-ivory mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                  {t.serviceArea.title}
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/85">
                  {t.serviceArea.body}
                </p>
              </div>
              <ul className="grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 lg:col-span-7 sm:grid-cols-2">
                {site.serviceArea.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/areas/${a.slug}`}
                      className="block bg-charcoal px-6 py-4 text-sm font-medium tracking-tight text-ivory/95 transition hover:bg-charcoal-soft hover:text-ivory"
                    >
                      {a.name}, {a.region}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <CTA />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: t.seo.breadcrumb, url: "/services" },
        ])}
      />
    </>
  );
}
