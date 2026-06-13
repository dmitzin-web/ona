import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { JsonLd } from "@/components/JsonLd";
import {
  ArrowIcon,
  PhoneIcon,
  serviceIcons,
} from "@/components/icons/ServiceIcons";
import { EmailLink, PhoneLink } from "@/components/contact/ContactLinks";
import { RemodelingGallery } from "@/components/RemodelingGallery";
import { MoldSections } from "@/components/services/MoldSections";
import { ServiceCardCompact } from "@/components/ServiceCardCompact";
import { findService, services } from "@/lib/services";
import { areaProfiles } from "@/lib/areas";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
  serviceProcessHowToJsonLd,
} from "@/lib/jsonld";
import Link from "next/link";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
    keywords: [
      `${service.shortName} Vancouver WA`,
      `${service.shortName} Portland OR`,
      `${service.shortName} restoration`,
      `emergency ${service.shortName.toLowerCase()}`,
    ],
  });
}

export default async function ServicePage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  const Icon = serviceIcons[service.slug as keyof typeof serviceIcons];
  // Mold is a co-equal business line and gets a dedicated, premium content
  // block in place of the generic hero/intro/body/process/signs. All the
  // shared scaffolding below (breadcrumbs, FAQ, city pages, related, CTA,
  // JSON-LD) still applies.
  const isMold = service.slug === "mold-removal";

  return (
    <>
      <div className="bg-charcoal">
        <Breadcrumbs
          tone="dark"
          items={[
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
            { name: service.shortName, href: `/services/${service.slug}` },
          ]}
        />

        {!isMold && (
        <section className="text-ivory">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-12 lg:px-10 lg:pb-28 lg:pt-16">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-9">
                <p className="eyebrow text-warm-gray-soft">
                  {service.shortName}
                </p>
                <h1 className="text-ivory mt-8 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
                  {service.name}{" "}
                  <span className="block text-ivory/60 sm:text-5xl">
                    in {site.address.locality}, {site.address.region} &
                    Portland Metro.
                  </span>
                </h1>
                <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ivory/75">
                  {service.hero}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <PhoneLink className="inline-flex items-center gap-3 border border-ivory bg-charcoal px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-ivory hover:text-charcoal">
                    <PhoneIcon className="h-4 w-4 stroke-current" />
                    Call {site.phoneDisplay}
                  </PhoneLink>
                  <EmailLink className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory">
                    Email a photo
                  </EmailLink>
                </div>
              </div>
              {Icon && (
                <div className="hidden lg:col-span-3 lg:flex lg:items-start lg:justify-end">
                  <Icon className="h-32 w-32 stroke-current text-warm-gray-soft" />
                </div>
              )}
            </div>
          </div>
        </section>
        )}
      </div>

      {isMold && <MoldSections service={service} />}

      {!isMold && (
        <>
      {/* Intro */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
          <p className="text-xl leading-relaxed text-ivory/85">
            {service.intro}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="space-y-20">
            {service.body.map((b) => (
              <div
                key={b.heading}
                className="grid gap-10 border-t border-ivory/15 pt-12 lg:grid-cols-12"
              >
                <h2 className="text-ivory text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:col-span-4">
                  {b.heading}
                </h2>
                <div className="space-y-5 lg:col-span-8">
                  {b.paragraphs.map((p, i) => (
                    <p key={i} className="text-lg leading-relaxed text-ivory/80">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <p className="eyebrow text-warm-gray-soft">Process</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            How the job runs.
          </h2>
          <ol className="mt-16 grid gap-px overflow-hidden border border-ivory/15 bg-charcoal-mute sm:grid-cols-2 lg:grid-cols-3">
            {service.process.map((p, i) => (
              <li
                key={p.step}
                className="bg-charcoal p-8"
              >
                <p className="eyebrow text-ivory/60">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 text-lg font-medium tracking-tight text-ivory">
                  {p.step.replace(/^\d+\.\s*/, "")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                  {p.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Signs */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ivory/60">Warning signs</p>
              <h2 className="text-ivory mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                When to call.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ivory/70">
                Early action saves money and prevents permanent damage. If any
                of these apply, call us.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {service.signs.map((s) => (
                <li
                  key={s}
                  className="border border-ivory/10 px-5 py-5 text-base text-ivory/85"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Remodeling-specific style-reference gallery. Only renders on
          /services/remodeling because restoration services don't use a
          style gallery (they're emergency, not aesthetic). When real
          project photography arrives, swap the references in the
          RemodelingGallery component for real photos. */}
      {service.slug === "remodeling" && <RemodelingGallery />}

      <FAQ items={service.faqs} title={`${service.shortName} — FAQ`} />

      {/* City × service pages — programmatic local landing pages for
          this specific service across the entire Portland metro. Drives
          buy-intent local SEO (e.g., "water damage restoration beaverton"). */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-ivory/60">
                {service.shortName} by city
              </p>
              <h2 className="text-ivory mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                Local landing pages.
              </h2>
            </div>
            <p className="max-w-md text-sm text-ivory/55">
              Same crew, same documentation. Tap a city for response times,
              local loss patterns, and neighborhood coverage.
            </p>
          </div>
          <ul className="mt-10 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-3">
            {areaProfiles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/services/${service.slug}/${a.slug}`}
                  className="flex items-center justify-between bg-charcoal px-5 py-4 text-sm font-medium text-ivory transition hover:bg-charcoal-soft"
                >
                  <span>
                    {service.shortName} · {a.name}, {a.region}
                  </span>
                  <ArrowIcon className="h-3 w-3 stroke-current opacity-50" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related services */}
      <section className="bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="flex items-end justify-between">
            <p className="eyebrow text-ivory/60">Other services</p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 eyebrow text-ivory"
            >
              All <ArrowIcon className="h-3 w-3 stroke-current" />
            </Link>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-3">
            {services
              .filter((s) => s.slug !== service.slug)
              .map((s) => (
                <div key={s.slug}>
                  <ServiceCardCompact service={s} />
                </div>
              ))}
          </div>
        </div>
      </section>

      <CTA
        title={`Need ${service.shortName.toLowerCase()} now?`}
        subtitle="Live dispatch, 24/7. Specialist on the truck within minutes."
      />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: service.shortName, url: `/services/${service.slug}` },
          ]),
          serviceJsonLd(service.slug)!,
          serviceProcessHowToJsonLd(service.slug)!,
          faqJsonLd(service.faqs),
        ]}
      />
    </>
  );
}

