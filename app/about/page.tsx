import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ValuesGrid } from "@/components/ValuesGrid";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: `About ${site.name} — Vancouver, WA Restoration Specialists`,
  description: `${site.name} is an IICRC-certified restoration contractor based in Vancouver, WA, serving the Portland metro since ${site.founded}. Locally owned, licensed in WA and OR.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">About</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            We restore more than properties. We restore trust.
          </h1>
          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="space-y-6 text-lg leading-relaxed text-charcoal/80">
                <p>
                  {site.name} is a locally owned restoration contractor based
                  in Vancouver, Washington, serving homeowners, property
                  managers and business owners across the Portland metro since{" "}
                  {site.founded}.
                </p>
                <p>
                  Restoration is one of the few trades you call when you're
                  already having the worst day of the month. Our job is to make
                  the next hour easier, the next week predictable, and the
                  final walkthrough drama-free. We do that by running every job
                  to the IICRC S500 / S520 standards, documenting everything to
                  the level your insurance adjuster expects, and keeping you in
                  the loop with one point of contact from emergency call to keys
                  back.
                </p>
                <p>
                  We're certified, licensed, bonded and insured in both
                  Washington and Oregon — which matters in this metro because
                  half our calls are on one side of the Columbia and half are
                  on the other.
                </p>
              </div>
            </div>
            <aside className="lg:col-span-5">
              <div className="border border-line-light p-8">
                <p className="eyebrow text-charcoal/60">Credentials</p>
                <ul className="mt-6 space-y-3 text-base text-charcoal/85">
                  {site.certifications.map((c) => (
                    <li
                      key={c}
                      className="border-t border-line-light pt-3 first:border-t-0 first:pt-0"
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

      <ValuesGrid tone="dark" />

      <CTA />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />
    </>
  );
}
