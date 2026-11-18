import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { fillPlaceholdersDeep } from "@/lib/placeholders";
import content from "@/content/pages/new.json";
import { Deductible, Sentence } from "@/components/new/Sentence";

// /new — one screen, one action. "A person answers.", a sentence the
// visitor can change to say what happened, Call and Text a photo, and the
// two checkable facts. Nothing else above the fold: no menu, no photos we
// don't own, no sample reviews. Below it, only what helps while waiting and
// what it costs. noindex while it is on trial.
// Every word is in content/pages/new.json (/admin → New homepage).
const t = fillPlaceholdersDeep(content);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/new",
  noindex: true,
});

const tel = `tel:${site.phone}`;

// The site header, strip and footer are marked data-chrome in app/layout.tsx;
// this page hides them so the one action has the screen to itself.
const pageCss =
  "body:has([data-page=new]) [data-chrome]{display:none}" +
  "@keyframes ona-roll{from{opacity:0;transform:translateY(.3em)}to{opacity:1;transform:none}}" +
  ".ona-roll{display:inline-block;animation:ona-roll .28s cubic-bezier(.2,.9,.3,1.2)}" +
  "@media (prefers-reduced-motion:reduce){.ona-roll{animation:none}}";

export default function NewHomePage() {
  return (
    <div data-page="new">
      <style>{pageCss}</style>

      {/* ── the one screen ── */}
      <section className="flex min-h-[100svh] flex-col bg-brand text-charcoal">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 pt-5 lg:px-10">
          <a href="/" aria-label={site.name} className="flex flex-col leading-none text-charcoal">
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

      <footer className="bg-charcoal py-7 pb-28 text-[14px] text-warm-gray md:pb-7">
        <div className="mx-auto flex max-w-[1180px] flex-wrap gap-x-6 gap-y-1 px-5 lg:px-10">
          <span>{t.foot.legal}</span>
          <a href="https://secure.lni.wa.gov/verify/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{t.hero.reg}</a>
          <span>{t.foot.area}</span>
          <a href={tel} className="underline underline-offset-2">{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`} className="underline underline-offset-2">{site.email}</a>
        </div>
      </footer>

      {/* phones: call is one tap away after the first screen */}
      <a href={tel} className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 flex h-14 items-center justify-center rounded-[12px] bg-coral text-[17px] font-bold text-charcoal shadow-[0_14px_34px_-14px_rgba(0,0,0,.5)] md:hidden">
        <span>{t.hero.callShort}</span>&nbsp;<span className="font-medium">{site.phoneDisplay}</span>
      </a>
    </div>
  );
}
