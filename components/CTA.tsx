import { site } from "@/lib/site";
import { EmailLink, PhoneLink } from "./contact/ContactLinks";
import { PhoneIcon } from "./icons/ServiceIcons";

export function CTA({
  title = "Details matter.",
  subtitle = "We restore more than properties. We restore trust. Talk to a restoration specialist now — live, day or night.",
}: {
  title?: string;
  subtitle?: string;
} = {}) {
  return (
    <section className="relative bg-charcoal text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-7">
          <p className="eyebrow text-warm-gray-soft">Get in touch</p>
          <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/70">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end lg:justify-end">
          <PhoneLink className="inline-flex items-center justify-center gap-3 border border-ivory bg-charcoal px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-ivory hover:text-charcoal">
            <PhoneIcon className="h-4 w-4 stroke-current" />
            {site.phoneDisplay}
          </PhoneLink>
          <EmailLink className="inline-flex items-center justify-center gap-3 border border-ivory/30 px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory">
            {site.email}
          </EmailLink>
        </div>
      </div>
    </section>
  );
}
