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
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-ivory/60">Contact</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            Get in touch with dispatch.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/75">
            Emergency? Pick up the phone — a real technician answers. Not
            urgent? Send a few photos by email and we'll come back with a
            preliminary scope.
          </p>

          <div className="mt-14 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 md:grid-cols-2">
            <PhoneLink className="group block bg-charcoal p-10 text-ivory transition hover:bg-ivory-soft">
              <p className="eyebrow text-warm-gray-soft">24/7 emergency</p>
              <p className="mt-6 flex items-center gap-4 whitespace-nowrap text-3xl font-light tracking-tight sm:text-4xl">
                <PhoneIcon className="h-8 w-8 stroke-current" />
                {site.phoneDisplay}
              </p>
              <p className="mt-6 text-sm text-ivory/70">
                Tap to call. Live answer, day or night.
              </p>
            </PhoneLink>

            <EmailLink className="group block bg-charcoal p-10 transition hover:bg-charcoal-soft">
              <p className="eyebrow text-ivory/60">Email</p>
              <p className="mt-6 text-2xl font-light tracking-tight text-ivory break-words">
                {site.email}
              </p>
              <p className="mt-6 text-sm text-ivory/70">
                Attach photos and your address. We reply within the hour
                during business hours, same morning otherwise.
              </p>
            </EmailLink>
          </div>

          <div className="mt-20 border-t border-ivory/10 pt-16">
            <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
              What happens after you call
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ivory/70">
              For emergencies we run a clean, fast playbook. Most callers are
              on-site with a crew inside the hour.
            </p>
            <ol className="mt-10 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 md:grid-cols-4">
              {[
                {
                  step: "1",
                  title: "Live answer",
                  text: "A real technician picks up — day or night. We confirm your address and the loss in under two minutes.",
                },
                {
                  step: "2",
                  title: "Dispatch",
                  text: "Closest available crew is on the road within minutes. We text you the technician's name and ETA.",
                },
                {
                  step: "3",
                  title: "On-site",
                  text: "Target 60 minutes anywhere in the Portland metro. We stop the damage spreading before anything else.",
                },
                {
                  step: "4",
                  title: "Documentation",
                  text: "Photos, moisture readings and Xactimate-formatted scope go to your insurance adjuster the same day.",
                },
              ].map((s) => (
                <li key={s.step} className="bg-charcoal p-8">
                  <p className="eyebrow text-ivory/40">Step {s.step}</p>
                  <h3 className="mt-4 text-lg font-medium tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-20 border-t border-ivory/10 pt-16">
            <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
              Headquarters &amp; hours
            </h2>
            <div className="mt-10 grid gap-12 md:grid-cols-3">
              <div>
                <h3 className="eyebrow text-ivory/60">Headquarters</h3>
                <address className="mt-5 not-italic text-base leading-relaxed text-ivory/85">
                  {site.name}
                  <br />
                  {site.address.locality}, {site.address.region}
                  <br />
                  {site.address.countryName}
                </address>
              </div>
              <div>
                <h3 className="eyebrow text-ivory/60">Hours</h3>
                <dl className="mt-5 space-y-3 text-base leading-relaxed text-ivory/85">
                  <div>
                    <dt className="text-sm text-ivory/60">
                      Emergency dispatch
                    </dt>
                    <dd className="font-medium">24 / 7 / 365</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-ivory/60">Office line</dt>
                    <dd>Mon–Sat, business hours</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-ivory/60">Quote email</dt>
                    <dd>Reply within the hour during business hours</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="eyebrow text-ivory/60">Service area</h3>
                <p className="mt-5 text-base leading-relaxed text-ivory/85">
                  Vancouver, WA and the entire Portland metro — Clark,
                  Multnomah, Washington and Clackamas counties.
                </p>
              </div>
            </div>

            <div className="mt-12 overflow-hidden border border-ivory/10">
              <iframe
                title="ONA Restoration headquarters — Vancouver, WA"
                src={`https://www.google.com/maps?q=${site.geo.latitude},${site.geo.longitude}&z=12&output=embed`}
                width="100%"
                height="380"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
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
