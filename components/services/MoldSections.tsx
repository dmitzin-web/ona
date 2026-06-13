import { site } from "@/lib/site";
import type { Service } from "@/lib/services";
import { EmailLink, PhoneLink } from "@/components/contact/ContactLinks";
import { PhoneIcon } from "@/components/icons/ServiceIcons";

// Dedicated, premium content for /services/mold-removal. Mold is one of
// ONA's three business lines, so its page gets a stronger, specialist
// treatment than the shared service template. Every claim here is
// operationally true — IICRC S520 methodology, sealed containment with
// HEPA negative air, independent third-party clearance, insurance-grade
// documentation, single-source rebuild. No certifications are asserted
// (the IICRC technician certs are still pending) and there are no
// reviews/stats we can't back. Rendered in app/services/[slug]/page.tsx
// in place of the generic hero/intro/body/process/signs when the slug is
// "mold-removal".

const credibility = [
  "IICRC S520 method",
  "Containment + HEPA negative air",
  "Independent clearance testing",
  "Insurance billed direct",
];

const differentiators = [
  {
    title: "We chase the moisture first",
    body: "We don't touch the growth until we've found what's feeding it — roof leak, supply line, foundation seepage, condensation. Fix the water, and the mold has nowhere to come back to. Skip that step and it returns in weeks.",
  },
  {
    title: "Sealed containment, negative air",
    body: "Poly barriers and negative-pressure HEPA scrubbers keep spores inside the work zone. The rest of your home stays clean while we cut, bag, and haul — not coated in what we just disturbed.",
  },
  {
    title: "We don't grade our own homework",
    body: "On larger losses we bring in an independent Indoor Environmental Professional to test before and after. The clearance that says it's safe comes from a third party, not from us.",
  },
  {
    title: "Built to the S520 standard",
    body: "Assessment, containment, removal, and verification all follow the published IICRC S520 standard for mold remediation — the same reference your adjuster works from.",
  },
  {
    title: "Documentation an adjuster can audit",
    body: "Moisture maps, daily photos, and an Xactimate-formatted scope on every job. We bill the carrier directly where the loss is covered, so you're not fronting the cost.",
  },
  {
    title: "One crew through the rebuild",
    body: "The team that removes the contaminated drywall puts it back. One contract, one point of contact, one clean finish — no handoff to a stranger halfway through.",
  },
];

export function MoldSections({ service }: { service: Service }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-10 lg:pb-24 lg:pt-14">
          <p className="eyebrow text-gold">Mold Remediation · IICRC S520</p>
          <h1 className="text-ivory mt-8 max-w-4xl text-5xl font-light leading-[1.04] tracking-tight sm:text-6xl">
            Mold done right{" "}
            <span className="text-ivory/55">the first time.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/80">
            {service.intro}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <PhoneLink className="inline-flex items-center gap-3 bg-gold px-7 py-4 text-sm font-medium uppercase tracking-[0.18em] text-white transition hover:bg-gold-deep">
              <PhoneIcon className="h-4 w-4 stroke-current" />
              Call {site.phoneDisplay}
            </PhoneLink>
            <EmailLink className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory transition hover:border-ivory">
              Email a photo
            </EmailLink>
          </div>

          {/* Credibility strip */}
          <ul className="mt-12 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal-mute sm:grid-cols-2 lg:grid-cols-4">
            {credibility.map((c) => (
              <li
                key={c}
                className="flex items-center gap-3 bg-charcoal px-5 py-5 text-sm text-ivory/85"
              >
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why mold is different — authority statement */}
      <section className="bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-ivory/60">Why most mold jobs fail</p>
              <h2 className="text-ivory mt-6 text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl">
                Mold is a moisture problem wearing a cleaning problem&apos;s
                disguise.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-ivory/80 lg:col-span-7">
              <p>
                Most &quot;mold removal&quot; is cosmetic — someone wipes the
                surface, sprays bleach, and leaves. The colony living inside the
                drywall and framing survives. The water that grew it is still
                there. Within weeks it&apos;s back, usually worse, and now harder
                to put on an insurance claim.
              </p>
              <p>
                We work the problem in the right order: find and stop the
                moisture, contain the area so spores don&apos;t spread, remove
                what can&apos;t be saved, treat what can, and verify the air is
                clear before anything goes back. That&apos;s the difference
                between mold that&apos;s gone and mold that&apos;s hiding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The method — process timeline */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <p className="eyebrow text-gold">The ONA method</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            Six steps, to the S520 standard.
          </h2>
          <ol className="mt-16 grid gap-px overflow-hidden border border-ivory/15 bg-charcoal-mute sm:grid-cols-2 lg:grid-cols-3">
            {service.process.map((p, i) => (
              <li key={p.step} className="bg-charcoal p-8">
                <p className="text-2xl font-light text-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-lg font-medium tracking-tight text-ivory">
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

      {/* Why ONA — differentiators */}
      <section className="bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <p className="eyebrow text-ivory/60">Why ONA for mold</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            What separates a real remediation from a wipe-down.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 md:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((d) => (
              <div key={d.title} className="bg-charcoal p-8">
                <h3 className="text-lg font-medium tracking-tight text-ivory">
                  {d.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/70">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health + insurance reassurance */}
      <section className="bg-charcoal">
        <div className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
          <div className="border-l-2 border-gold pl-8">
            <p className="eyebrow text-gold">Health &amp; insurance</p>
            <p className="mt-6 text-2xl font-light leading-snug tracking-tight text-ivory sm:text-3xl">
              If someone in the house has asthma, allergies, or a compromised
              immune system, mold isn&apos;t cosmetic — get it scoped.
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/75">
              We handle the insurance side: we document the cause, photograph
              every step, and bill the carrier directly where the loss is
              covered. You deal with one team and your deductible — not a fight
              over what happened.
            </p>
          </div>
        </div>
      </section>

      {/* Warning signs */}
      <section className="bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ivory/60">Warning signs</p>
              <h2 className="text-ivory mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                When to call.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ivory/70">
                Mold doubles fast in Pacific Northwest humidity. The earlier we
                scope it, the smaller the job. If any of these apply, call.
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
  );
}
