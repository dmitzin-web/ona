import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PhoneIcon } from "@/components/icons/ServiceIcons";
import {
  EmailLink,
  PhoneLink,
  SmsLink,
} from "@/components/contact/ContactLinks";
import { QuoteForm } from "./QuoteForm";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = buildMetadata({
  title: "Request a Restoration Quote",
  description:
    "Send us a description and photos of the damage. We respond within the hour during business hours, same morning otherwise. Or call (360) 823-3196 24/7 for emergencies.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Get a quote", href: "/quote" },
        ]}
      />
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10">
          <aside className="lg:col-span-4">
            <p className="eyebrow text-charcoal/60">Quote request</p>
            <h1 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
              Tell us what happened.
            </h1>
            <p className="mt-8 text-base leading-relaxed text-charcoal/75">
              Not an emergency? Use the form — we'll come back with a
              preliminary scope and next steps. For active losses please call
              instead.
            </p>

            <div className="mt-10 space-y-4 border-t border-charcoal/15 pt-8">
              <PhoneLink className="flex items-center gap-3 text-base font-medium text-charcoal hover:text-charcoal/70">
                <PhoneIcon className="h-5 w-5 stroke-current" />
                {site.phoneDisplay} · 24/7 dispatch
              </PhoneLink>
              <SmsLink className="flex items-center gap-3 text-base font-medium text-charcoal hover:text-charcoal/70">
                <span aria-hidden="true">✆</span> Text dispatch
              </SmsLink>
              <EmailLink className="flex items-center gap-3 text-base font-medium text-charcoal hover:text-charcoal/70">
                <span aria-hidden="true">@</span> {site.email}
              </EmailLink>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="border border-charcoal/15 bg-ivory p-8 lg:p-10">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Quote", url: "/quote" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: `${site.url}/quote`,
            mainEntity: { "@id": `${site.url}/#business` },
          },
        ]}
      />
    </>
  );
}
