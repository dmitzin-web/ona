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
      {/* ── hero: what we do, and the three ways in ── */}
      <section className="bg-brand text-charcoal">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-5 pt-8 lg:min-h-[calc(100vh-var(--chrome-h,120px))] grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:px-10 lg:pt-0">
          <div className="flex min-w-0 flex-col justify-center lg:py-14">
            <p className="text-[13px] text-warm-gray-deep">{t.hero.eyebrow}</p>
            <h1 className="mt-3 text-[clamp(38px,5.6vw,76px)] font-semibold leading-[1] tracking-[-0.035em]">
              <span>{t.hero.titleLead}</span> <span className="text-warm-gray-deep">{t.hero.titleRest}</span>
            </h1>
            <p className="mt-4 max-w-[560px] text-[clamp(17px,1.8vw,21px)] leading-[1.45] text-warm-gray-deep">{t.hero.lead}</p>
            <NightNote lead={t.hero.nightLead} text={t.hero.nightText} phone={site.phone} phoneDisplay={site.phoneDisplay} />
            <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
              <a href={tel} className="flex min-h-[76px] flex-col justify-center rounded-[2px] bg-coral px-5 py-3 text-charcoal hover:bg-coral-deep">
                <b className="text-[19px] leading-tight">{t.hero.call}</b><span className="text-[14px]">{t.hero.callSub}</span>
              </a>
              <Act open={{ mode: "show", hint: "water" }} className="flex min-h-[76px] flex-col justify-center rounded-[2px] bg-charcoal px-5 py-3 text-left text-ivory hover:bg-charcoal-soft">
                <b className="text-[19px] leading-tight">{t.hero.photos}</b><span className="text-[14px] text-warm-gray">{t.hero.photosSub}</span>
              </Act>
              <Act open={{ mode: "method", hint: "remodel" }} className="flex min-h-[76px] flex-col justify-center rounded-[2px] border border-warm-gray-deep px-5 py-3 text-left hover:border-charcoal">
                <b className="text-[19px] leading-tight">{t.hero.remodel}</b><span className="text-[14px] text-warm-gray-deep">{t.hero.remodelSub}</span>
              </Act>
            </div>
            <Composer t={t.hero} />
            <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[2px] bg-warm-gray-deep/30 text-[15px] font-semibold sm:grid-cols-4">
              <li className="bg-brand-2 px-3.5 py-3">{t.hero.proofTarget}</li>
              <li className="bg-brand-2 px-3.5 py-3">{t.hero.proofAnswers}</li>
              <li className="bg-brand-2 px-3.5 py-3"><a href="https://secure.lni.wa.gov/verify/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{t.hero.proofReg}</a></li>
              <li className="bg-brand-2 px-3.5 py-3">{t.hero.proofIicrc}</li>
            </ul>
            <div className="pb-8 lg:pb-0" />
          </div>
          <div className="relative -mx-5 h-[260px] lg:mx-0 lg:-mr-10 lg:h-auto">
            <Image src={heroPhoto.image} alt={t.hero.photoAlt} fill priority sizes="(min-width:1024px) 48vw, 100vw" className="object-cover" />
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

      {/* ── what happens after you reach us ── */}
      <section className="bg-charcoal-soft py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
          <h2 className="max-w-[760px] text-[clamp(32px,4.4vw,54px)] font-semibold leading-[1.02] tracking-[-0.035em]">{t.how.title}</h2>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.how.steps.map((st, i) => (
              <li key={st.title} className="rounded-[4px] bg-charcoal p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[14px] font-bold text-charcoal">{i + 1}</span>
                <b className="mt-4 block text-[19px]">{st.title}</b>
                <span className="mt-1 block leading-relaxed text-warm-gray">{st.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── the project page, shown big (sample data, labelled as such) ── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 lg:grid-cols-[1fr_1fr] lg:px-10">
          <div>
            <h2 className="text-[clamp(34px,5vw,64px)] font-semibold leading-[1] tracking-[-0.04em]"><span>{t.project.title}</span> <span className="text-teal">{t.project.titleRest}</span></h2>
            <p className="mt-5 max-w-[520px] text-[19px] leading-relaxed text-warm-gray">{t.project.text}</p>
            <Link href="/work/sample" className="mt-7 inline-flex h-13 min-h-[52px] items-center rounded-[2px] bg-brand px-6 font-bold text-charcoal">{t.project.phoneLink}</Link>
          </div>
          <div className="mx-auto w-full max-w-[420px] rounded-[32px] border-[10px] border-ivory bg-charcoal p-6 shadow-[0_40px_80px_-40px_rgba(7,59,58,.6)]">
            <div className="flex items-center justify-between text-[13px] text-warm-gray"><span>{t.project.phoneLabel}</span><b className="rounded-full bg-charcoal-soft px-2 py-0.5 text-brand">{t.project.phoneDay}</b></div>
            <h3 className="mt-3 text-[26px] font-bold">{t.project.phoneTitle}</h3>
            <p className="text-[15px] text-warm-gray">{t.project.phoneStatus}</p>
            <div className="mt-4 grid grid-cols-5 gap-1">{t.project.stages.map((x, i) => <i key={x} className={`h-[6px] rounded ${i === 0 ? "bg-brand" : i === 1 ? "bg-teal" : "bg-charcoal-mute"}`} />)}</div>
            <div className="mt-1.5 grid grid-cols-5 gap-1 text-[11px] text-warm-gray">{t.project.stages.map((x) => <span key={x}>{x}</span>)}</div>
            <div className="mt-4">{t.project.events.map((e) => <div key={e.text} className="flex gap-3 border-t border-charcoal-mute py-3 text-[15px]"><span className="w-12 flex-none text-warm-gray">{e.time}</span><b className="font-semibold">{e.text}</b></div>)}</div>
            <p className="mt-2 text-center text-[12px] text-warm-gray">{t.project.phoneNote}</p>
          </div>
        </div>
      </section>

      {/* ── pick your situation: each card opens the exact next step ── */}
      <section className="bg-charcoal-soft py-16 lg:py-24">
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

      {/* ── do you come to me ── */}
      <section className="py-16 lg:py-24">
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
      <section className="bg-charcoal-soft py-16 lg:py-24">
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
            <Act open={{ mode: "show", hint: "water" }} className="inline-flex h-14 items-center rounded-[2px] bg-charcoal px-6 font-bold text-brand">{t.end.photos}</Act>
            <Act open={{ mode: "method", hint: "remodel" }} className="inline-flex h-14 items-center rounded-[2px] border border-warm-gray-deep px-6 font-bold">{t.end.remodel}</Act>
            <a href={tel} className="inline-flex h-14 items-center rounded-[2px] bg-coral px-6 font-bold">{t.end.call}</a>
          </div>
        </div>
      </section>

      {/* ── always one tap from help (phones) ── */}
      <div className="fixed inset-x-2.5 bottom-[calc(10px+env(safe-area-inset-bottom))] z-40 grid grid-cols-[1.25fr_1fr_1fr] gap-1.5 rounded-[10px] bg-ivory p-1.5 shadow-[0_14px_40px_-12px_rgba(0,0,0,.45)] lg:hidden">
        <a href={tel} className="flex h-[50px] items-center justify-center rounded-[6px] bg-coral font-bold text-charcoal">{t.dock.call}</a>
        <Act open={{ mode: "talk" }} className="h-[50px] rounded-[6px] font-bold text-charcoal">{t.dock.voice}</Act>
        <Act open={{ mode: "show" }} className="h-[50px] rounded-[6px] font-bold text-charcoal">{t.dock.photos}</Act>
      </div>

      <Intake copy={t.intake} phone={site.phone} email={site.email} />
    </>
  );
}
