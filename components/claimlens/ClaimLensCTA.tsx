import Link from "next/link";
import { ArrowIcon } from "@/components/icons/ServiceIcons";

export function ClaimLensCTA({
  title = "Run your claim through ClaimLens™.",
  subtitle = "Upload your insurance estimate and related documents. Get a structured report on possible missing scope, inconsistencies, and documentation gaps in minutes.",
}: {
  title?: string;
  subtitle?: string;
} = {}) {
  return (
    <section className="relative bg-charcoal text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(184,152,94,0.08),transparent_60%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-7">
          <p className="eyebrow text-gold-soft">Try it</p>
          <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/70">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5 lg:items-end lg:justify-end">
          <Link
            href="/claimlens/upload"
            className="inline-flex items-center justify-center gap-3 border border-ivory bg-ivory px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:bg-transparent hover:text-ivory"
          >
            Analyze My Claim
            <ArrowIcon className="h-4 w-4 stroke-current" />
          </Link>
          <Link
            href="/claimlens/report"
            className="inline-flex items-center justify-center gap-3 border border-ivory/30 px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory"
          >
            View Sample Report
          </Link>
        </div>
      </div>
    </section>
  );
}
