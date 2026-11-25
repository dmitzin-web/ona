import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/jsonld";
import { fillPlaceholdersDeep } from "@/lib/placeholders";
import content from "@/content/pages/new.json";
import { Deductible, Sentence } from "@/components/new/Sentence";

// The homepage: one screen, one action. "A person answers.", a sentence the
// visitor can change to say what happened, Call and Text a photo, and the
// two checkable facts. No menu above the fold, no photos we don't own, no
// sample reviews. Below it: what to do while waiting, the insurer's
// estimate, what it costs, and short answers (also sent as FAQPage data).
// The site footer stays — its links to services and cities matter for search.
// Every word is in content/pages/new.json (/admin → Homepage).
const t = fillPlaceholdersDeep(content);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/",
});

const tel = `tel:${site.phone}`;

// The site strip + header are marked data-chrome="top" in app/layout.tsx;
// this page hides them so the one action has the screen to itself.
const pageCss =
  "body:has([data-page=home]) [data-chrome=top]{display:none}" +
  "@keyframes ona-roll{from{opacity:0;transform:translateY(.3em)}to{opacity:1;transform:none}}" +
  ".ona-roll{display:inline-block;animation:ona-roll .28s cubic-bezier(.2,.9,.3,1.2)}" +
  "@media (prefers-reduced-motion:reduce){.ona-roll{animation:none}}" +
  // the pinned phone Call bar must not cover the end of the site footer
  "@media (max-width:767px){body:has([data-page=home]) [data-chrome=foot] footer{padding-bottom:96px}}";

export default function HomePage() {
  return (
    <div data-page="home">
      <style>{pageCss}</style>

      {/* ── the one screen ── */}
      <section className="flex min-h-[100svh] flex-col bg-brand text-charcoal">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 pt-5 lg:px-10">
          <a href="#" aria-label={site.name} className="flex flex-col leading-none text-charcoal">
            <span className="flex items-end gap-[2px] text-[24px] font-semibold tracking-[0.16em]" aria-hidden="true">
              ON
              <svg width="18" height="17" viewBox="0 0 17 16" fill="none" stroke="currentColor" strokeWidth="2" className="mb-[1px]"><path d="M1.2 15.4 8.5 1.2l7.3 14.2" /></svg>
            </span>
          </a>
          <a href={tel} className="inline-flex h-11 items-center rounded-full bg-coral px-5 text-[15px] font-bold text-charcoal">{t.hero.callShort}</a>
        </div>

        <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col justify-center px-5 py-10 lg:px-10">
          <p className="flex items-center gap-2.5 text-[15px] font-semibold text-warm-gray-deep">
            <span className="h-2 w-2 rounded-full bg-[#43D39B]" aria-hidden="true" />
            <span>{t.hero.sub}</span>
          </p>
          <h1 className="mt-3 text-[clamp(52px,10vw,132px)] font-bold leading-[0.92] tracking-[-0.055em]">{t.hero.title}</h1>
          <div className="mt-8">
            <Sentence t={t.hero} phone={site.phone} phoneDisplay={site.phoneDisplay} />
          </div>
          <p className="mt-4 text-[16px] text-warm-gray-deep">{t.hero.save}</p>
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-warm-gray-deep">
            <a href="https://secure.lni.wa.gov/verify/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{t.hero.reg}</a>
            <span>{t.hero.iicrc}</span>
          </p>
        </div>

        <a href="#next" className="mx-auto mb-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-warm-gray-deep">{t.hero.next} ↓</a>
      </section>

      {/* ── while you wait ── */}
      <section id="next" className="bg-charcoal py-16 lg:py-24">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-10">
          <h2 className="text-[clamp(34px,5vw,64px)] font-bold leading-none tracking-[-0.04em]">{t.next.title}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-5">
            {t.next.steps.map((st, i) => (
              <li key={st.title} className={`border-t-[3px] pt-5 ${i === 1 ? "border-coral" : "border-ivory"}`}>
                <span className="font-mono text-[13px] text-warm-gray">0{i + 1}</span>
                <h3 className={`mt-3 text-[clamp(24px,2.4vw,32px)] font-bold leading-[1.08] tracking-[-0.025em] ${i === 1 ? "text-coral-deep" : ""}`}>{st.title}</h3>
                <p className="mt-2 text-[17px] text-warm-gray">{st.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-[clamp(20px,2vw,26px)] font-semibold text-brand">{t.next.target}</p>
        </div>
      </section>

      {/* ── the insurer's estimate ── */}
      <section className="bg-brand-2 py-16 text-charcoal lg:py-24">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-10">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#9CC9C2]">{t.estimate.kicker}</p>
          <h2 className="mt-3 max-w-[18ch] text-[clamp(34px,5vw,64px)] font-bold leading-none tracking-[-0.04em]">{t.estimate.title}</h2>
          <p className="mt-5 max-w-[62ch] text-[clamp(17px,1.5vw,20px)] text-warm-gray-deep">{t.estimate.intro}</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            {t.estimate.points.map((pt) => (
              <div key={pt.title} className="border-t-2 border-white/30 pt-4">
                <b className="block text-[19px]">{pt.title}</b>
                <p className="mt-1.5 text-[16px] text-warm-gray-deep">{pt.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-2.5">
            <a href={`sms:${site.phone}?&body=${encodeURIComponent(`${t.estimate.smsBody} `)}`} className="inline-flex h-14 items-center rounded-[10px] bg-coral px-6 text-[17px] font-bold text-charcoal hover:bg-coral-deep">{t.estimate.textIt}</a>
            <a href={`mailto:${site.email}?subject=${encodeURIComponent(t.estimate.emailSubject)}`} className="inline-flex h-14 items-center rounded-[10px] border-2 border-charcoal px-6 text-[17px] font-bold hover:bg-charcoal hover:text-brand">{t.estimate.emailIt}</a>
          </div>
          <p className="mt-5 max-w-[70ch] text-[14px] text-[#9CC9C2]">{t.estimate.fine}</p>
        </div>
      </section>

      {/* ── what it costs you ── */}
      <section className="bg-brand py-16 text-charcoal lg:py-24">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-10">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#9CC9C2]">{t.cost.kicker}</p>
          <h2 className="mt-3 text-[clamp(34px,5vw,64px)] font-bold leading-none tracking-[-0.04em]">{t.cost.title}</h2>
          <div className="mt-10 grid items-end gap-10 md:grid-cols-2 md:gap-16">
            <Deductible t={t.cost} />
            <div>
              <p className="text-[clamp(24px,2.6vw,34px)] font-bold leading-[1.12] tracking-[-0.02em]">{t.cost.line}</p>
              <p className="mt-4 text-[16px] text-warm-gray-deep">{t.cost.find}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── short answers (also FAQPage structured data) ── */}
      <section className="bg-charcoal py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-6 px-5 lg:grid-cols-[.6fr_1.4fr] lg:px-10">
          <h2 className="text-[clamp(32px,4.4vw,54px)] font-bold leading-none tracking-[-0.04em]">{t.faqTitle}</h2>
          <div>
            {t.faqs.map((f) => (
              <details key={f.q} className="group border-t border-charcoal-mute last:border-b">
                <summary className="flex cursor-pointer list-none justify-between gap-4 py-5 text-[19px] font-bold">
                  <span>{f.q}</span><span aria-hidden className="text-teal group-open:hidden">+</span><span aria-hidden className="hidden text-teal group-open:inline">–</span>
                </summary>
                <p className="mb-5 max-w-[680px] leading-relaxed text-warm-gray">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={faqJsonLd(t.faqs)} />

      {/* phones: call is one tap away after the first screen */}
      <a href={tel} className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 flex h-14 items-center justify-center rounded-[12px] bg-coral text-[17px] font-bold text-charcoal shadow-[0_14px_34px_-14px_rgba(0,0,0,.5)] md:hidden">
        <span>{t.hero.callShort}</span>&nbsp;<span className="font-medium">{site.phoneDisplay}</span>
      </a>
    </div>
  );
}
