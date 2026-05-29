import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PhoneIcon } from "@/components/icons/ServiceIcons";
import { PhoneLink } from "@/components/contact/ContactLinks";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Request received",
  description: "Thanks — we'll be in touch shortly.",
  path: "/quote/thanks",
  noindex: true,
});

export default function QuoteThanksPage() {
  return (
    <section className="bg-charcoal">
      <div className="mx-auto max-w-3xl px-6 py-32 text-center lg:px-10">
        <p className="eyebrow text-ivory/60">Quote request received</p>
        <h1 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
          Thanks. We've got it.
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-ivory/75">
          A specialist will be in touch within the hour during business hours,
          same morning otherwise. If this is an active emergency, please call —
          email doesn't wake us up.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <PhoneLink className="inline-flex items-center gap-3 border border-ivory bg-charcoal px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-ivory">
            <PhoneIcon className="h-4 w-4 stroke-current" />
            {site.phoneDisplay}
          </PhoneLink>
          <Link
            href="/"
            className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-charcoal"
          >
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
