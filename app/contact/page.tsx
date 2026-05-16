import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PhoneIcon } from "@/components/icons/ServiceIcons";
import { EmailLink, PhoneLink } from "@/components/contact/ContactLinks";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: `Contact ${site.name} — 24/7 Restoration Dispatch`,
  description: `Call ${site.phoneDisplay} or email ${site.email}. ONA Restoration dispatches 24/7 across Vancouver, WA and the Portland metro.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">Contact</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            Get in touch with dispatch.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-charcoal/75">
            Emergency? Pick up the phone — a real technician answers. Not
            urgent? Send a few photos by email and we'll come back with a
            preliminary scope.
          </p>

          <div className="mt-14 grid gap-px overflow-hidden border border-line-light bg-line-light md:grid-cols-2">
            <PhoneLink className="group block bg-charcoal p-10 text-ivory transition hover:bg-charcoal-soft">
              <p className="eyebrow text-warm-gray-soft">24/7 emergency</p>
              <p className="mt-6 flex items-center gap-4 text-4xl font-light tracking-tight">
                <PhoneIcon className="h-8 w-8 stroke-current" />
                {site.phoneDisplay}
              </p>
              <p className="mt-6 text-sm text-ivory/70">
                Tap to call. Live answer, day or night.
              </p>
            </PhoneLink>

            <EmailLink className="group block bg-ivory p-10 transition hover:bg-ivory-soft">
              <p className="eyebrow text-charcoal/60">Email</p>
              <p className="mt-6 text-2xl font-light tracking-tight text-charcoal break-words">
                {site.email}
              </p>
              <p className="mt-6 text-sm text-charcoal/70">
                Attach photos and your address. We reply within the hour
                during business hours, same morning otherwise.
              </p>
            </EmailLink>
          </div>

          <div className="mt-16 grid gap-12 border-t border-line-light pt-12 md:grid-cols-3">
            <div>
              <p className="eyebrow text-charcoal/60">Headquarters</p>
              <address className="mt-5 not-italic text-base leading-relaxed text-charcoal/85">
                {site.name}
                <br />
                {site.address.locality}, {site.address.region}
                <br />
                {site.address.countryName}
              </address>
            </div>
            <div>
              <p className="eyebrow text-charcoal/60">Hours</p>
              <p className="mt-5 text-base leading-relaxed text-charcoal/85">
                Emergency dispatch: <span className="font-medium">24 / 7 / 365</span>
                <br />
                Office line: business hours Mon–Sat
              </p>
            </div>
            <div>
              <p className="eyebrow text-charcoal/60">Service area</p>
              <p className="mt-5 text-base leading-relaxed text-charcoal/85">
                Vancouver, WA and the entire Portland metro — Clark, Multnomah,
                Washington and Clackamas counties.
              </p>
            </div>
          </div>
        </div>
      </section>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: `${site.url}/contact`,
            mainEntity: { "@id": `${site.url}/#business` },
          },
        ]}
      />
    </>
  );
}
