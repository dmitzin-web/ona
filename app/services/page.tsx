import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceCard } from "@/components/ServiceCard";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { services } from "@/lib/services";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Restoration Services in Vancouver, WA & Portland, OR",
  description:
    "Full restoration services in Vancouver, WA and Portland, OR: water damage, fire & smoke, mold remediation, and storm damage. 24/7 emergency response, IICRC-certified crews.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">Our services</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            Full-service restoration, executed with precision.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-charcoal/75">
            Single-source mitigation and reconstruction across the Portland
            metro. IICRC-certified, licensed in WA and OR, available 24/7.
          </p>
          <div className="mt-16 grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-2">
            {services.map((s) => (
              <div key={s.slug}>
                <ServiceCard service={s} />
              </div>
            ))}
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
