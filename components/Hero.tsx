import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneLink } from "./contact/ContactLinks";
import { ArrowIcon, PhoneIcon } from "./icons/ServiceIcons";

export type HeroImage = {
  src: string;
  alt: string;
};

export function Hero({ image }: { image?: HeroImage } = {}) {
  return (
    <section className="relative overflow-hidden bg-charcoal text-ivory">
      {image ? (
        <>
          {/* Plain <img> for placeholders + SVG. When raster photography is
              dropped in /public/photos/, swap this back to next/image with
              fill + priority + sizes="100vw". */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/70 to-charcoal"
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,244,241,0.08),transparent_60%)]"
        />
      )}
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-10 lg:pb-32 lg:pt-28">
        <p className="eyebrow text-warm-gray-soft">
          High-end property restoration · Vancouver, WA & Portland Metro
        </p>

        <h1 className="mt-10 max-w-4xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="block">Precision.</span>
          <span className="block">Restoration.</span>
          <span className="block font-medium">Built to Last.</span>
        </h1>

        <p className="mt-10 max-w-xl text-lg leading-relaxed text-ivory/75">
          Specialized in high-end property restoration with integrity,
          craftsmanship, and precision. We restore more than properties —
          we restore trust.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-5">
          <PhoneLink className="inline-flex items-center gap-3 border border-ivory bg-ivory px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:bg-transparent hover:text-ivory">
            <PhoneIcon className="h-4 w-4 stroke-current" />
            Call {site.phoneDisplay}
          </PhoneLink>
          <Link
            href="/services"
            className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory"
          >
            Our Services
            <ArrowIcon className="h-4 w-4 stroke-current" />
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-y-8 border-t border-charcoal-mute pt-10 sm:grid-cols-4 sm:gap-x-8">
          <Stat label="Response target" value="60 min" />
          <Stat label="Dispatch" value="24 / 7" />
          <Stat label="Google rating" value={`${site.rating.value} / 5`} />
          <Stat label="Certifications" value="IICRC" />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-ivory/50">{label}</dt>
      <dd className="mt-3 text-2xl font-light tracking-tight text-ivory">
        {value}
      </dd>
    </div>
  );
}
