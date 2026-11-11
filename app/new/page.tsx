import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { areaProfiles } from "@/lib/areas";
import { workItems } from "@/lib/work";
import { fillPlaceholdersDeep } from "@/lib/placeholders";
import content from "@/content/pages/new.json";
import { Intake } from "@/components/new/Intake";
import { Act, Composer, NightNote, ZipCheck } from "@/components/new/Bits";

// /new — the use-first homepage, trialled next to the current one before it
// replaces anything. noindex: it repeats the homepage's subject, and two
// pages saying the same thing to Google is a finding in the SEO audit.
// Every word is in content/pages/new.json (/admin → New homepage).
const t = fillPlaceholdersDeep(content);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/new",
  noindex: true,
});

const tel = `tel:${site.phone}`;
const WORK = ["full-kitchen", "freestanding-tub", "kitchen-through-to-living", "double-vanity"]
  .map((s) => workItems.find((w) => w.slug === s))
  .filter((w): w is NonNullable<typeof w> => Boolean(w));
const heroPhoto = workItems.find((w) => w.slug === "kitchen-through-to-living") ?? workItems[0];

const card = "flex flex-col rounded-[4px] border border-charcoal-mute bg-charcoal";
const act =
  "flex w-full items-center justify-between gap-3 rounded-[2px] border border-charcoal-mute px-4 py-3 text-left transition-colors hover:border-teal hover:bg-charcoal-soft";
const actHot = "flex w-full items-center justify-between gap-3 rounded-[2px] bg-coral px-4 py-3 text-left text-charcoal hover:bg-coral-deep";

export default function NewHomePage() {
  const s = t.situations;
  return (
    <>
      {/* ── hero: what we do, and a way to start in one sentence ── */}
      <section className="bg-brand text-charcoal">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-5 pt-8 lg:min-h-[calc(100vh-var(--chrome-h,120px))] lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:px-10 lg:pt-0">
          <div className="flex flex-col justify-center lg:py-14">
            <p className="text-[13px] text-warm-gray-deep">{t.hero.eyebrow}</p>
            <h1 className="mt-3 text-[clamp(38px,5.6vw,76px)] font-semibold leading-[1] tracking-[-0.035em]">
              <span>{t.hero.titleLead}</span> <span className="text-teal-bright">{t.hero.titleRest}</span>
            </h1>
            <p className="mt-4 max-w-[560px] text-[clamp(17px,1.8vw,21px)] leading-[1.45] text-warm-gray-deep">{t.hero.lead}</p>
            <NightNote lead={t.hero.nightLead} text={t.hero.nightText} phone={site.phone} phoneDisplay={site.phoneDisplay} />
            <Composer t={t.hero} />
            <div className="mt-3.5 flex flex-wrap gap-2" role="group">
              {(["water", "fire", "mold", "insurance", "remodel", "commercial"] as const).map((k) => (
                <Act key={k} open={{ mode: "method", hint: k }} className="h-10 rounded-full border border-warm-gray-deep px-4 text-[14px] font-semibold hover:border-charcoal">
                  {t.hero.quick[k]}
                </Act>
              ))}
            </div>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 pb-8 text-[13px] text-warm-gray-deep lg:pb-0">
              <li>{t.hero.proofAnswers}</li>
              <li><a href="https://secure.lni.wa.gov/verify/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{t.hero.proofReg}</a></li>
              <li>{t.hero.proofIicrc}</li>
            </ul>
          </div>
          <div className="relative -mx-5 h-[260px] lg:mx-0 lg:-mr-10 lg:h-auto">
            <Image src={heroPhoto.image} alt={t.hero.photoAlt} fill priority sizes="(min-width:1024px) 48vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── pick your situation: each card opens the exact next step ── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
          <h2 className="text-[clamp(32px,4.4vw,54px)] font-semibold leading-[1.02] tracking-[-0.035em]">
            <span>{s.title}</span><br /><span className="text-warm-gray">{s.titleSoft}</span>
          </h2>
          <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <article className={card}><div className="flex flex-1 flex-col p-5">
              <h3 className="text-[26px] font-semibold tracking-[-0.02em]">{s.restore.title}</h3><p className="mt-1 text-warm-gray">{s.restore.text}</p>
              <div className="mt-5 flex flex-col gap-1.5">
                <Act open={{ mode: "shutoff" }} className={act}><b>{s.restore.running}</b><span className="text-[13px] text-warm-gray">{s.restore.runningSub}</span></Act>
                <Act open={{ mode: "show", hint: "water" }} className={act}><b>{s.restore.show}</b><span className="text-[13px] text-warm-gray">{s.restore.showSub}</span></Act>
                <a href={tel} className={actHot}><b>{s.restore.call}</b><span className="text-[13px]">{s.restore.callSub}</span></a>
              </div></div>
            </article>
            <article className={card}><div className="flex flex-1 flex-col p-5">
              <h3 className="text-[26px] font-semibold tracking-[-0.02em]">{s.rebuild.title}</h3><p className="mt-1 text-warm-gray">{s.rebuild.text}</p>
              <div className="mt-5 flex flex-col gap-1.5">
                <Act open={{ mode: "docs", hint: "insurance" }} className={act}><b>{s.rebuild.upload}</b><span className="text-[13px] text-warm-gray">{s.rebuild.uploadSub}</span></Act>
                <Act open={{ mode: "schedule", hint: "insurance" }} className={act}><b>{s.rebuild.schedule}</b><span className="text-[13px] text-warm-gray">{s.rebuild.scheduleSub}</span></Act>
              </div></div>
            </article>
            <article className={card}><div className="flex flex-1 flex-col p-5">
              <h3 className="text-[26px] font-semibold tracking-[-0.02em]">{s.remodel.title}</h3><p className="mt-1 text-warm-gray">{s.remodel.text}</p>
              <div className="mt-5 flex flex-col gap-1.5">
                <Act open={{ mode: "show", hint: "remodel" }} className={act}><b>{s.remodel.show}</b><span className="text-[13px] text-warm-gray">{s.remodel.showSub}</span></Act>
                <Act open={{ mode: "talk", hint: "remodel" }} className={act}><b>{s.remodel.talk}</b><span className="text-[13px] text-warm-gray">{s.remodel.talkSub}</span></Act>
                <Act open={{ mode: "schedule", hint: "remodel" }} className={act}><b>{s.remodel.schedule}</b><span className="text-[13px] text-warm-gray">{s.remodel.scheduleSub}</span></Act>
              </div></div>
            </article>
            <article className={card}><div className="flex flex-1 flex-col p-5">
              <h3 className="text-[26px] font-semibold tracking-[-0.02em]">{s.commercial.title}</h3><p className="mt-1 text-warm-gray">{s.commercial.text}</p>
              <div className="mt-5 flex flex-col gap-1.5">
                <Act open={{ mode: "method", hint: "commercial" }} className={act}><b>{s.commercial.report}</b><span className="text-[13px] text-warm-gray">{s.commercial.reportSub}</span></Act>
                <a href={tel} className={actHot}><b>{s.commercial.call}</b><span className="text-[13px]">{s.commercial.callSub}</span></a>
              </div></div>
            </article>
          </div>
        </div>
      </section>

      {/* ── how it works + the live project page ── */}
      <section className="bg-charcoal-soft py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
          <div>
            <h2 className="text-[clamp(32px,4.4vw,54px)] font-semibold tracking-[-0.035em]">{t.how.title}</h2>
            <ol className="mt-6">
              {t.how.steps.map((st, i) => (
                <li key={st.title} className="relative border-t border-charcoal-mute py-4 pl-12">
                  <span className="absolute left-0 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[14px] font-bold text-charcoal">{i + 1}</span>
                  <b className="block text-[19px]">{st.title}</b>
                  <span className="mt-1 block leading-relaxed text-warm-gray">{st.text}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="mx-auto w-full max-w-[360px] rounded-[28px] border-8 border-ivory bg-charcoal p-5 shadow-[0_30px_60px_-30px_rgba(7,59,58,.5)]">
            <div className="flex items-center justify-between text-[12px] text-warm-gray"><span>{t.how.phoneLabel}</span><b className="rounded-full bg-charcoal-soft px-2 py-0.5 text-brand">{t.how.phoneDay}</b></div>
            <h4 className="mt-3 text-[22px] font-bold">{t.how.phoneTitle}</h4>
            <p className="text-[14px] text-warm-gray">{t.how.phoneStatus}</p>
            <div className="mt-3 grid grid-cols-5 gap-1">{t.how.stages.map((x, i) => <i key={x} className={`h-[5px] rounded ${i === 0 ? "bg-brand" : i === 1 ? "bg-teal" : "bg-charcoal-mute"}`} />)}</div>
            <div className="mt-1.5 grid grid-cols-5 gap-1 text-[10px] text-warm-gray">{t.how.stages.map((x) => <span key={x}>{x}</span>)}</div>
            <div className="mt-3">{t.how.events.map((e) => <div key={e.text} className="flex gap-3 border-t border-charcoal-mute py-2.5 text-[14px]"><span className="w-11 flex-none text-warm-gray">{e.time}</span><b className="font-semibold">{e.text}</b></div>)}</div>
            <Link href="/work/sample" className="mt-2 flex h-11 items-center justify-center rounded-[2px] bg-brand text-[15px] font-bold text-charcoal">{t.how.phoneLink}</Link>
            <p className="mt-2 text-center text-[11px] text-warm-gray">{t.how.phoneNote}</p>
          </div>
        </div>
      </section>

      {/* ── our own finished work ── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-[clamp(32px,4.4vw,54px)] font-semibold tracking-[-0.035em]">{t.work.title}</h2>
            <p className="text-warm-gray">{t.work.text}</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {WORK.map((w) => (
              <Link key={w.slug} href={`/work/${w.slug}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[4px]">
                  <Image src={w.image} alt={w.imageAlt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <span className="mt-2 block font-semibold">{w.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── do you come to me ── */}
      <section className="bg-charcoal-soft py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
          <h2 className="text-[clamp(32px,4.4vw,54px)] font-semibold tracking-[-0.035em]">{t.area.title}</h2>
          <p className="mt-3 text-[18px] text-warm-gray">{t.area.text}</p>
          <ZipCheck cities={areaProfiles.map((a) => ({ name: a.name, zips: a.zips }))} t={t.area} />
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {areaProfiles.map((a) => (
              <li key={a.slug}><Link href={`/areas/${a.slug}`} className="inline-block rounded-full bg-charcoal px-3 py-1.5 text-[14px] font-semibold hover:text-teal">{a.name}</Link></li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── quick answers ── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-6 px-5 lg:grid-cols-[.6fr_1.4fr] lg:px-10">
          <h2 className="text-[clamp(32px,4.4vw,54px)] font-semibold tracking-[-0.035em]">{t.faq.title}</h2>
          <div>
            {t.faq.items.map((f) => (
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

      {/* ── last word ── */}
      <section className="bg-brand py-20 pb-28 text-center text-charcoal lg:pb-24">
        <div className="mx-auto max-w-[1320px] px-5">
          <h2 className="text-[clamp(36px,5.6vw,72px)] font-semibold leading-none tracking-[-0.04em]"><span>{t.end.title}</span><br /><span>{t.end.titleRest}</span></h2>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            <Act open={{ mode: "talk" }} className="inline-flex h-14 items-center rounded-[2px] bg-charcoal px-6 font-bold text-brand">{t.end.talk}</Act>
            <Act open={{ mode: "show" }} className="inline-flex h-14 items-center rounded-[2px] border border-warm-gray-deep px-6 font-bold">{t.end.show}</Act>
            <a href={tel} className="inline-flex h-14 items-center rounded-[2px] bg-coral px-6 font-bold">{t.end.call}</a>
          </div>
        </div>
      </section>

      {/* ── always one tap from help (phones) ── */}
      <div className="fixed inset-x-2.5 bottom-[calc(10px+env(safe-area-inset-bottom))] z-40 grid grid-cols-[1.25fr_1fr_1fr] gap-1.5 rounded-[10px] bg-ivory p-1.5 shadow-[0_14px_40px_-12px_rgba(0,0,0,.45)] lg:hidden">
        <a href={tel} className="flex h-[50px] items-center justify-center rounded-[6px] bg-coral font-bold text-charcoal">{t.dock.call}</a>
        <Act open={{ mode: "talk" }} className="h-[50px] rounded-[6px] font-bold text-charcoal">{t.dock.talk}</Act>
        <Act open={{ mode: "show" }} className="h-[50px] rounded-[6px] font-bold text-charcoal">{t.dock.show}</Act>
      </div>

      <Intake copy={t.intake} phone={site.phone} email={site.email} />
    </>
  );
}
