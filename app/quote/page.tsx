import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
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
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import quoteContent from "@/content/pages/quote.json";
import { fillPlaceholdersDeep, fillVarsDeep } from "@/lib/placeholders";

// Every piece of copy on this page — the form's labels and error messages
// included — lives in content/pages/quote.json and is edited through the
// admin (/admin → Quote request page). {phone} and {email} are filled from
// Company details. The form gets its words as props, so the page's other
// copy never ships to the browser.
const t = fillPlaceholdersDeep(quoteContent);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/quote",
});

export default function QuotePage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: t.breadcrumb.home, href: "/" },
          { name: t.breadcrumb.current, href: "/quote" },
        ]}
      />
      <section className="bg-charcoal">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10">
          <aside className="lg:col-span-4">
            <p className="eyebrow text-ivory/72">{t.intro.eyebrow}</p>
            <h1 className="text-ivory mt-6 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
              {t.intro.title}
            </h1>
            <p className="mt-8 text-base leading-relaxed text-ivory/85">
              {t.intro.body}
            </p>

            <div className="mt-10 space-y-4 border-t border-ivory/15 pt-8">
              <PhoneLink className="flex items-center gap-3 text-base font-medium text-ivory hover:text-ivory/80">
                <PhoneIcon className="h-5 w-5 stroke-current" />
                {t.intro.phoneLine}
              </PhoneLink>
              <SmsLink className="flex items-center gap-3 text-base font-medium text-ivory hover:text-ivory/80">
                <span aria-hidden="true">✆</span> {t.intro.smsLine}
              </SmsLink>
              <EmailLink className="flex items-center gap-3 text-base font-medium text-ivory hover:text-ivory/80">
                <span aria-hidden="true">@</span> {site.email}
              </EmailLink>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="border border-ivory/15 bg-charcoal p-8 lg:p-10">
              <QuoteForm t={t.form} />
            </div>
          </div>
        </div>
      </section>

      {/* What to include */}
      <section className="border-t border-ivory/10 bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/72">{t.include.eyebrow}</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {t.include.title}
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 md:grid-cols-2 lg:grid-cols-5">
            {t.include.items.map((item, i) => (
              <li key={i} className="bg-charcoal p-8">
                <p className="eyebrow text-ivory/72">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-ivory mt-4 text-lg font-medium tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/80">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What happens next */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/72">{t.next.eyebrow}</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {t.next.title}
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 md:grid-cols-4">
            {t.next.steps.map((s, i) => (
              <li key={i} className="bg-charcoal p-8">
                <p className="eyebrow text-ivory/72">
                  {fillVarsDeep(t.next.stepLabel, { n: String(i + 1) })}
                </p>
                <h3 className="text-ivory mt-4 text-lg font-medium tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/80">
                  {s.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Response times */}
      <section className="border-t border-ivory/10 bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-warm-gray-soft">{t.responseTimes.eyebrow}</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {t.responseTimes.title}
          </h2>
          <dl className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
            {t.responseTimes.items.map((r, i) => (
              <div key={i}>
                <dt className="eyebrow text-ivory/70">{r.label}</dt>
                <dd className="mt-4 text-3xl font-light tracking-tight">
                  {r.value}
                </dd>
                <p className="mt-3 text-xs leading-relaxed text-ivory/70">
                  {r.note}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FAQ items={t.faqs} title={t.faqTitle} />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t.breadcrumb.home, url: "/" },
            { name: t.breadcrumb.currentForGoogle, url: "/quote" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: `${site.url}/quote`,
            mainEntity: { "@id": `${site.url}/#business` },
          },
          faqJsonLd(t.faqs),
        ]}
      />
    </>
  );
}
