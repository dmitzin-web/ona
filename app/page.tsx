import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { workItems } from "@/lib/work";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/jsonld";
import { fillPlaceholdersDeep } from "@/lib/placeholders";
import content from "@/content/pages/new.json";
import { Deductible, Sentence } from "@/components/new/Sentence";

// The homepage: one screen, one action. "A person answers.", a sentence the
// visitor can change to say what happened, Call and Text a photo, and the
// two checkable facts, under the site's usual header. No photos we don't own, no
// sample reviews. Below it: what to do while waiting, the insurer's
// estimate and what it costs (one block), our own finished work, and short
// answers (also sent as FAQPage data).
// The site footer stays — its links to services and cities matter for search.
// Every word is in content/pages/new.json (/admin → Homepage).
const t = fillPlaceholdersDeep(content);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/",
});

// Real finished work (content/work) — our own photos only.
const WORK = ["full-kitchen", "full-bath-layout", "kitchen-through-to-living", "double-vanity", "island-and-cooking-wall", "laundry-room"]
  .map((s) => workItems.find((w) => w.slug === s))
  .filter((w): w is NonNullable<typeof w> => Boolean(w));

const pageCss =
  "@keyframes ona-roll{from{opacity:0;transform:translateY(.3em)}to{opacity:1;transform:none}}" +
  ".ona-roll{display:inline-block;animation:ona-roll .28s cubic-bezier(.2,.9,.3,1.2)}" +
  "@media (prefers-reduced-motion:reduce){.ona-roll{animation:none}}";

export default function HomePage() {
  return (
    <div data-page="home">
      <style>{pageCss}</style>

      {/* ── the one screen ── */}
      <section className="flex min-h-[calc(100svh-var(--chrome-h,120px))] flex-col bg-brand text-charcoal">
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
          {/* what it costs you — same block, the other half of the money question */}
          <div className="mt-14 border-t border-white/20 pt-12">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#9CC9C2]">{t.cost.kicker}</p>
            <h3 className="mt-3 text-[clamp(28px,3.6vw,44px)] font-bold leading-none tracking-[-0.035em]">{t.cost.title}</h3>
            <div className="mt-8 grid items-end gap-10 md:grid-cols-2 md:gap-16">
              <Deductible t={t.cost} />
              <div>
                <p className="text-[clamp(24px,2.6vw,34px)] font-bold leading-[1.12] tracking-[-0.02em]">{t.cost.line}</p>
                <p className="mt-4 text-[16px] text-warm-gray-deep">{t.cost.find}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── our work: real finished rooms ── */}
      <section className="bg-charcoal py-16 lg:py-24">
        <div className="mx-auto max-w-[1180px] px-5 lg:px-10">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-teal">{t.work.kicker}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(34px,5vw,64px)] font-bold leading-none tracking-[-0.04em]">{t.work.title}</h2>
            <Link href="/services/remodeling" className="text-[17px] font-semibold text-teal underline underline-offset-4 hover:text-gold-deep">{t.work.remodel} →</Link>
          </div>
          <p className="mt-4 max-w-[60ch] text-[18px] text-warm-gray">{t.work.text}</p>
          <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {WORK.map((w) => (
              <Link key={w.slug} href={`/work/${w.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-charcoal-soft">
                  <Image src={w.image} alt={w.imageAlt} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <span className="mt-2 block text-[15px] font-semibold">{w.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── short answers (also FAQPage structured data) ── */}
      <section className="bg-charcoal-soft py-16 lg:py-24">
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

    </div>
  );
}
