import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons/ServiceIcons";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Service Area — Portland Metro Restoration Coverage",
  description:
    "ONA Restoration covers Vancouver, WA, Portland, OR and the entire Portland metro area. See the cities we serve with 24/7 emergency response.",
  path: "/areas",
});

export default function AreasPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Service Area", href: "/areas" },
        ]}
      />
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">Where we work</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            Vancouver, WA and the entire Portland metro.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-charcoal/75">
            Headquartered in Vancouver, WA. Crews staged across the metro so we
            can hit a 60-minute response target — Salmon Creek to Lake Oswego.
          </p>
          <ul className="mt-16 grid gap-px overflow-hidden border border-line-light bg-line-light sm:grid-cols-2 lg:grid-cols-3">
            {site.serviceArea.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/areas/${a.slug}`}
                  className="group flex items-center justify-between bg-ivory p-7 transition hover:bg-charcoal hover:text-ivory"
                >
                  <div>
                    <p className="text-xl font-medium tracking-tight">
                      {a.name}
                    </p>
                    <p className="mt-1 text-sm text-charcoal/55 group-hover:text-ivory/60">
                      {a.region}
                    </p>
                  </div>
                  <ArrowIcon className="h-4 w-4 stroke-current opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CTA />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Service Area", url: "/areas" },
        ])}
      />
    </>
  );
}
