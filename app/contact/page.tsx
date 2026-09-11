import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PhoneIcon } from "@/components/icons/ServiceIcons";
import { EmailLink, PhoneLink } from "@/components/contact/ContactLinks";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import contactContent from "@/content/pages/contact.json";
import { fillPlaceholdersDeep } from "@/lib/placeholders";

// Every piece of copy on this page lives in content/pages/contact.json and is
// edited through the admin (/admin → Contact page). {phone}, {email} … are
// filled from Company details. The phone number, email and address shown
// here come straight from Company details; the map embed is fixed.
const t = fillPlaceholdersDeep(contactContent);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: t.seo.breadcrumb, href: "/contact" },
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

          <div className="mt-14 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 md:grid-cols-2">
            <PhoneLink className="group block bg-charcoal p-10 text-ivory transition hover:bg-charcoal-soft">
              <p className="eyebrow text-warm-gray-soft">{t.phoneCard.eyebrow}</p>
              <p className="mt-6 flex items-center gap-4 whitespace-nowrap text-3xl font-light tracking-tight sm:text-4xl">
                <PhoneIcon className="h-8 w-8 stroke-current" />
                {site.phoneDisplay}
              </p>
              <p className="mt-6 text-sm text-ivory/80">{t.phoneCard.note}</p>
            </PhoneLink>

            <EmailLink className="group block bg-charcoal p-10 transition hover:bg-charcoal-soft">
              <p className="eyebrow text-ivory/72">{t.emailCard.eyebrow}</p>
              <p className="mt-6 text-2xl font-light tracking-tight text-ivory break-words">
                {site.email}
              </p>
              <p className="mt-6 text-sm text-ivory/80">{t.emailCard.note}</p>
            </EmailLink>
          </div>

          <div className="mt-20 border-t border-ivory/10 pt-16">
            <h2 className="text-ivory text-3xl font-light tracking-tight sm:text-4xl">
              {t.afterCall.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ivory/80">
              {t.afterCall.body}
            </p>
            <ol className="mt-10 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 md:grid-cols-4">
              {t.afterCall.steps.map((s, i) => (
                <li key={i} className="bg-charcoal p-8">
                  <p className="eyebrow text-ivory/72">
                    {t.afterCall.stepLabel} {i + 1}
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

          <div className="mt-20 border-t border-ivory/10 pt-16">
            <h2 className="text-ivory text-3xl font-light tracking-tight sm:text-4xl">
              {t.hq.title}
            </h2>
            <div className="mt-10 grid gap-12 md:grid-cols-3">
              <div>
                <h3 className="eyebrow text-ivory/72">{t.hq.addressLabel}</h3>
                <address className="mt-5 not-italic text-base leading-relaxed text-ivory/95">
                  {site.name}
                  <br />
                  {site.address.locality}, {site.address.region}
                  <br />
                  {site.address.countryName}
                </address>
              </div>
              <div>
                <h3 className="eyebrow text-ivory/72">{t.hq.hoursLabel}</h3>
                <dl className="mt-5 space-y-3 text-base leading-relaxed text-ivory/95">
                  {/* The first row (emergency dispatch) is set in bold. */}
                  {t.hq.hours.map((h, i) => (
                    <div key={i}>
                      <dt className="text-sm text-ivory/72">{h.label}</dt>
                      <dd className={i === 0 ? "font-medium" : undefined}>
                        {h.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h3 className="eyebrow text-ivory/72">{t.hq.areaLabel}</h3>
                <p className="mt-5 text-base leading-relaxed text-ivory/95">
                  {t.hq.areaText}
                </p>
              </div>
            </div>

            {/* Google Maps embed via the official /maps/embed endpoint.
                This is the iframe-friendly one — unlike the plain
                ?output=embed endpoint it does NOT send X-Frame-Options,
                so it frames cleanly with no API key. The `pb` payload
                centers a city-level view on the Vancouver, WA coords. */}
            <div className="mt-12 overflow-hidden border border-ivory/10">
              <iframe
                title={t.hq.mapTitle}
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d44000!2d-122.6615!3d45.6387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="380"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${site.geo.latitude},${site.geo.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[14px] text-ivory/90 underline-offset-4 transition hover:text-ivory hover:underline"
            >
              {t.hq.mapLink}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: t.seo.breadcrumb, url: "/contact" },
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
