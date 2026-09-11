import moldContent from "@/content/pages/mold-sections.json";
import { fillPlaceholdersDeep } from "@/lib/placeholders";
import type { Service } from "@/lib/services";
import { EmailLink, PhoneLink } from "@/components/contact/ContactLinks";
import { PhoneIcon } from "@/components/icons/ServiceIcons";

// Dedicated, premium content for /services/mold-removal. Mold is one of
// Ona's three business lines, so its page gets a stronger, specialist
// treatment than the shared service template. Every claim here is
// operationally true — IICRC S520 methodology, sealed containment with
// HEPA negative air, independent third-party clearance, insurance-grade
// documentation, single-source rebuild. Technicians are IICRC-certified
// (WRT/ASD/AMRT/FSRT) and there are no reviews/stats we can't back.
// Rendered in app/services/[slug]/page.tsx
// in place of the generic hero/intro/body/process/signs when the slug is
// "mold-removal".

// Every word here lives in content/pages/mold-sections.json (/admin → Mold
// page — extra sections); {phone} is filled from Company details. The
// introduction, steps and signs are Mold Remediation's own, in
// content/services.json.
const t = fillPlaceholdersDeep(moldContent);

export function MoldSections({ service }: { service: Service }) {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-10 lg:pb-24 lg:pt-14">
          <p className="eyebrow text-gold">{t.hero.eyebrow}</p>
          <h1 className="text-ivory mt-8 max-w-4xl text-5xl font-light leading-[1.04] tracking-tight sm:text-6xl">
            {t.hero.titleLead}{" "}
            <span className="text-ivory/70">{t.hero.titleRest}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/90">
            {service.intro}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <PhoneLink className="inline-flex items-center gap-3 bg-gold px-7 py-4 text-sm font-medium uppercase tracking-[0.18em] text-white transition hover:bg-gold-deep">
              <PhoneIcon className="h-4 w-4 stroke-current" />
              {t.hero.ctaCall}
            </PhoneLink>
            <EmailLink className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory transition hover:border-ivory">
              {t.hero.ctaEmail}
            </EmailLink>
          </div>

          {/* Credibility strip */}
          <ul className="mt-12 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal-mute sm:grid-cols-2 lg:grid-cols-4">
            {t.hero.credibility.map((c) => (
              <li
                key={c}
                className="flex items-center gap-3 bg-charcoal px-5 py-5 text-sm text-ivory/95"
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
              <p className="eyebrow text-ivory/72">{t.why.eyebrow}</p>
              <h2 className="text-ivory mt-6 text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl">
                {t.why.title}
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-ivory/90 lg:col-span-7">
              {t.why.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The method — process timeline */}
      <section className="bg-charcoal text-ivory">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <p className="eyebrow text-gold">{t.method.eyebrow}</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {t.method.title}
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
                <p className="mt-3 text-sm leading-relaxed text-ivory/80">
                  {p.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why Ona — differentiators */}
      <section className="bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <p className="eyebrow text-ivory/72">{t.whyOna.eyebrow}</p>
          <h2 className="text-ivory mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight sm:text-5xl">
            {t.whyOna.title}
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 md:grid-cols-2 lg:grid-cols-3">
            {t.whyOna.items.map((d) => (
              <div key={d.title} className="bg-charcoal p-8">
                <h3 className="text-lg font-medium tracking-tight text-ivory">
                  {d.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/80">
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
            <p className="eyebrow text-gold">{t.health.eyebrow}</p>
            <p className="mt-6 text-2xl font-light leading-snug tracking-tight text-ivory sm:text-3xl">
              {t.health.lead}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/85">
              {t.health.body}
            </p>
          </div>
        </div>
      </section>

      {/* Warning signs */}
      <section className="bg-charcoal-soft">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-ivory/72">{t.signs.eyebrow}</p>
              <h2 className="text-ivory mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                {t.signs.title}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ivory/80">
                {t.signs.body}
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {service.signs.map((s) => (
                <li
                  key={s}
                  className="border border-ivory/10 px-5 py-5 text-base text-ivory/95"
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
