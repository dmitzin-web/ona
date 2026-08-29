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
  // THE dark block. After the inversion the site is white end to end,
  // and a page with no dark surface has no rhythm — everything reads at
  // the same volume. This is the one deep-teal band per page, and it
  // lands at the close, where the ask is. Do not add a second one above
  // it: the block works because of the white that precedes it.
  //
  // Coral on the phone button, teal nowhere near it. The call is the
  // only "act now" on the page and it must not compete with the ground
  // it sits on.
  return (
    <section className="relative bg-brand text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-7">
          <p className="eyebrow text-warm-gray-deep">Get in touch</p>
          <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end lg:justify-end">
          <PhoneLink className="inline-flex items-center justify-center gap-3 rounded-[2px] bg-coral px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-coral-deep">
            <PhoneIcon className="h-4 w-4 stroke-current" />
            {site.phoneDisplay}
          </PhoneLink>
          <EmailLink className="inline-flex items-center justify-center gap-3 rounded-[2px] border border-white/35 px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-white transition hover:border-white">
            {site.email}
          </EmailLink>
        </div>
      </div>
    </section>
  );
}
