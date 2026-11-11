import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { areaProfiles } from "@/lib/areas";
import { fillPlaceholdersDeep } from "@/lib/placeholders";
import content from "@/content/pages/new.json";
import { Doors, ProofTabs } from "@/components/new/Doors";
import { DemoCase, DemoCrew, DemoRibbon } from "@/components/new/DemoProof";

// /new — a short homepage that shapes itself to the visitor's situation:
// four ways in, the request made in place (two clicks to sent), and the
// proof — a job, the team, answers — only when someone asks for it.
// noindex: it repeats the homepage's subject while it is on trial.
// Every word is in content/pages/new.json (/admin → New homepage), except
// the demo job and team, which are placeholders in components/new/DemoProof.
const t = fillPlaceholdersDeep(content);

export const metadata: Metadata = buildMetadata({
  title: t.seo.title,
  description: t.seo.description,
  path: "/new",
  noindex: true,
});

const tel = `tel:${site.phone}`;

export default function NewHomePage() {
  return (
    <>
      <DemoRibbon />
      <section className="bg-brand text-charcoal">
        <div className="mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1fr)] gap-8 px-5 pt-8 pb-10 lg:min-h-[calc(100vh-var(--chrome-h,120px))] lg:grid-cols-[1.1fr_.9fr] lg:gap-14 lg:px-10 lg:py-0">
          <div className="flex min-w-0 flex-col justify-center lg:py-14">
            <h1 className="text-[clamp(38px,5.4vw,72px)] font-semibold leading-[1] tracking-[-0.035em]">
              <span>{t.hero.titleLead}</span> <span className="block text-warm-gray-deep">{t.hero.titleRest}</span>
            </h1>
            <p className="mt-4 text-[17px] text-warm-gray-deep">{t.hero.where}</p>
            <a href={tel} className="mt-6 inline-flex h-14 w-fit items-center gap-3 rounded-[2px] bg-coral px-6 text-[18px] font-bold text-charcoal hover:bg-coral-deep">
              <span>{t.hero.call}</span><span className="font-semibold">{site.phoneDisplay}</span>
            </a>
            <Doors
              hero={t.hero}
              doors={t.doors}
              panel={t.panel}
              done={t.done}
              phone={site.phone}
              phoneDisplay={site.phoneDisplay}
              email={site.email}
              cities={areaProfiles.map((a) => ({ name: a.name, zips: a.zips }))}
            />
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-warm-gray-deep">
              <li><a href="https://secure.lni.wa.gov/verify/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{t.hero.proofReg}</a></li>
              <li>{t.hero.proofIicrc}</li>
            </ul>
          </div>
          <div className="relative -mx-5 hidden lg:mx-0 lg:-mr-10 lg:block">
            <Image src="/photos/demo/hero-restoration.webp" alt="Technician taking a moisture reading on a wall" fill priority sizes="45vw" className="object-cover object-[78%_center]" />
          </div>
        </div>
      </section>

      <ProofTabs tabs={t.proof.tabs} job={<DemoCase />} team={<DemoCrew />} faq={t.faq.items} />

      {/* Call stays one tap away on phones, whatever is open above. */}
      <div className="h-24 lg:hidden" />
      <a href={tel} className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 flex h-14 items-center justify-center gap-2 rounded-[6px] bg-coral text-[18px] font-bold text-charcoal shadow-[0_14px_40px_-12px_rgba(0,0,0,.45)] lg:hidden">
        <span>{t.hero.call}</span><span className="font-semibold">{site.phoneDisplay}</span>
      </a>
    </>
  );
}
