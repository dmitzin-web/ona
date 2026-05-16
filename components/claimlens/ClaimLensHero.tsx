import Link from "next/link";
import { claimLens } from "@/lib/claimlens/config";
import { ArrowIcon } from "@/components/icons/ServiceIcons";
import { ClaimLensWordmark } from "./ClaimLensWordmark";

export function ClaimLensHero() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,152,94,0.12),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,244,241,0.05),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-10 lg:pb-32 lg:pt-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold-soft">{claimLens.hero.eyebrow}</p>

            <h1 className="mt-10 max-w-3xl text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Find what your insurance
              <span className="block">estimate may be{" "}
                <span className="font-medium text-gold">missing.</span>
              </span>
            </h1>

            <p className="mt-10 max-w-xl text-lg leading-relaxed text-ivory/75">
              {claimLens.hero.subheadline}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-5">
              <Link
                href={claimLens.hero.primaryCta.href}
                className="inline-flex items-center gap-3 border border-ivory bg-ivory px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:bg-transparent hover:text-ivory"
              >
                {claimLens.hero.primaryCta.label}
                <ArrowIcon className="h-4 w-4 stroke-current" />
              </Link>
              <Link
                href={claimLens.hero.secondaryCta.href}
                className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory"
              >
                {claimLens.hero.secondaryCta.label}
              </Link>
              <Link
                href="/claimlens/report"
                className="text-sm uppercase tracking-[0.22em] text-ivory/60 transition hover:text-ivory"
              >
                View sample report →
              </Link>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-y-8 border-t border-charcoal-mute pt-10 sm:grid-cols-4 sm:gap-x-8">
              <Stat label="Documents reviewed" value="Multi-file" />
              <Stat label="Output" value="Structured report" />
              <Stat label="Built for" value="WA · OR · US" />
              <Stat label="Replaces" value="No one — supports you" />
            </div>
          </div>

          {/* Right column — decorative document/AI mock. Kept entirely in
              CSS so we don't ship an image and so it scales with the type. */}
          <div className="relative lg:col-span-5">
            <div className="relative ml-auto max-w-md">
              <div className="absolute -left-6 -top-6 h-full w-full border border-gold/30" aria-hidden="true" />
              <div className="relative border border-charcoal-mute bg-charcoal-soft p-8 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between">
                  <ClaimLensWordmark tone="gold" className="text-base font-medium tracking-tight" />
                  <span className="eyebrow text-ivory/40">Report preview</span>
                </div>
                <p className="mt-6 text-2xl font-light leading-tight text-ivory">
                  Sample analysis — water loss, 5 documents reviewed.
                </p>

                <ul className="mt-8 space-y-4 text-sm">
                  <PreviewRow
                    severity="high"
                    label="Possible quantity mismatch"
                    hint="drywall replacement vs. photo wall area"
                  />
                  <PreviewRow
                    severity="medium"
                    label="Possible missing baseboard paint touch-up"
                    hint="detach/reset without related finish work"
                  />
                  <PreviewRow
                    severity="medium"
                    label="Texture match not on scope"
                    hint="patch on textured wall"
                  />
                  <PreviewRow
                    severity="needs"
                    label="Mitigation invoice — needs documentation"
                    hint="equipment days vs. affected rooms"
                  />
                </ul>

                <p className="mt-8 border-t border-charcoal-mute pt-5 text-xs leading-relaxed text-ivory/50">
                  Findings are tied to specific uploaded documents. Items
                  without evidence are labeled <em>needs verification</em>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-ivory/50">{label}</dt>
      <dd className="mt-3 text-xl font-light tracking-tight text-ivory">
        {value}
      </dd>
    </div>
  );
}

function PreviewRow({
  severity,
  label,
  hint,
}: {
  severity: "high" | "medium" | "needs";
  label: string;
  hint: string;
}) {
  const dotClass =
    severity === "high"
      ? "bg-gold"
      : severity === "medium"
        ? "bg-gold-soft"
        : "bg-warm-gray";
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className={`mt-1.5 h-2 w-2 flex-none rounded-full ${dotClass}`}
      />
      <div>
        <p className="text-ivory">{label}</p>
        <p className="text-xs text-ivory/55">{hint}</p>
      </div>
    </li>
  );
}
