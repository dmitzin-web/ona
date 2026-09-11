import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons/ServiceIcons";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import areasIndexContent from "@/content/pages/areas-index.json";
import { fillPlaceholdersDeep } from "@/lib/placeholders";

// The page's own copy lives in content/pages/areas-index.json and is edited
// through the admin (/admin → Service areas page). The city list is Cities
// (content/areas.json).
const t = fillPlaceholdersDeep(areasIndexContent);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/areas",
});

export default function AreasPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: t.seo.breadcrumb, href: "/areas" },
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
          <ul className="mt-16 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
            {site.serviceArea.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/areas/${a.slug}`}
                  className="group flex items-center justify-between bg-charcoal p-7 transition hover:bg-brand hover:text-charcoal"
                >
                  <div>
                    <p className="text-xl font-medium tracking-tight">
                      {a.name}
                    </p>
                    <p className="mt-1 text-sm text-ivory/70 group-hover:text-charcoal/60">
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
          { name: t.seo.breadcrumb, url: "/areas" },
        ])}
      />
    </>
  );
}
