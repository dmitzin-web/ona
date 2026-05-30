import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceCard } from "@/components/ServiceCard";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons/ServiceIcons";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Restoration & Remodeling Services — Vancouver, WA & Portland, OR",
  description:
    "Full restoration and remodeling services in Vancouver, WA and Portland, OR: water damage, fire & smoke, mold remediation, storm damage, and custom remodeling. 24/7 emergency response, work performed to IICRC standards.",
  path: "/services",
});

export default function ServicesPage() {
  // Restoration services are the four core mitigation/reconstruction
  // offerings. Remodeling lives in the same list (so /services/remodeling
  // works) but renders separately on this page as a featured division.
  const restoration = services.filter((s) => s.slug !== "remodeling");
  const remodeling = services.find((s) => s.slug === "remodeling");

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/60">Our services</p>
          <h1 className="text-ivory mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            Restoration and remodeling, executed with precision.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/75">
            Single-source mitigation, reconstruction, and remodeling across the
            Portland metro. Licensed in WA and OR, working to IICRC standards, available
            24/7.
          </p>

          {/* Restoration grid */}
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <p className="eyebrow text-ivory/60">Restoration</p>
              <p className="text-sm text-ivory/55">
                24/7 emergency response · 60-minute target
              </p>
            </div>
            <div className="mt-6 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
              {restoration.map((s) => (
                <div key={s.slug}>
                  <ServiceCard service={s} />
                </div>
              ))}
            </div>
          </div>

          {/* Remodeling — featured row, separate visual treatment */}
          {remodeling && (
            <div className="mt-16">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <p className="eyebrow text-gold">Remodeling</p>
                <p className="text-sm text-ivory/55">
                  Kitchens · Baths · Additions · Custom millwork
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
                        Built by a restoration crew.
                      </span>
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/75">
                      {remodeling.hero}
                    </p>
                  </div>
                  <div className="flex items-end lg:col-span-4 lg:justify-end">
                    <span className="inline-flex items-center gap-3 eyebrow text-ivory transition group-hover:gap-4">
                      Explore remodeling
                      <ArrowIcon className="h-3 w-3 stroke-current" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Service area — moved here from the global nav */}
          <div className="mt-20 border-t border-ivory/15 pt-12">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="eyebrow text-ivory/60">Service area</p>
                <h2 className="text-ivory mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                  Vancouver, WA and the entire Portland metro.
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/75">
                  Headquartered in Vancouver, WA. Crews staged across the metro
                  so we hit our 60-minute response target through Clark,
                  Multnomah, Washington, and Clackamas counties.
                </p>
              </div>
              <ul className="grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 lg:col-span-7 sm:grid-cols-2">
                {site.serviceArea.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/areas/${a.slug}`}
                      className="block bg-charcoal px-6 py-4 text-sm font-medium tracking-tight text-ivory/85 transition hover:bg-charcoal-soft hover:text-ivory"
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
          { name: "Services", url: "/services" },
        ])}
      />
    </>
  );
}
