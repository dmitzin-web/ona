"use client";

import Image from "next/image";
import { useState } from "react";

// DEMO CONTENT on /new, published at the owner's request with a TEST VERSION
// ribbon and a "Sample" tag on every invented item. Replace with real
// photos, reviews and numbers, then delete this file. Demo photos (AI-made, from the
// prototypes) and sample numbers/reviews, to judge the layout before real
// material exists. None of this is Ona's own work or data.

export function DemoRibbon() {
  return (
    <div className="bg-[#ffd84d] px-5 py-2 text-center text-[13px] font-bold text-[#172124]">
      TEST VERSION — demo photos, a sample job and sample reviews. Not real Ona data.
    </div>
  );
}


export function DemoCase() {
  const [pos, setPos] = useState(50);
  return (
    <div>
      <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_.75fr]">
        <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-[4px]">
          <Image src="/photos/demo/water-after.webp" alt="Living room after drying and repair" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <Image src="/photos/demo/water-before.webp" alt="Living room with wet floor, cut drywall and air movers" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 w-[3px] bg-charcoal" style={{ left: `${pos}%` }} />
          <span className="absolute left-3 top-3 rounded-[2px] bg-ivory px-2 py-1 text-[12px] font-bold text-charcoal">Day 1</span>
          <span className="absolute right-3 top-3 rounded-[2px] bg-charcoal px-2 py-1 text-[12px] font-bold text-ivory">Day 19</span>
          <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Before and after" className="absolute inset-x-0 bottom-3 mx-auto w-[60%] accent-[#00776D]" />
        </div>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-teal">Case · Camas, WA<span className="ml-2 rounded-[2px] bg-[#ffd84d] px-1.5 py-0.5 align-middle text-[11px] font-bold uppercase tracking-wide text-[#172124]">Sample</span></p>
          <h2 className="mt-2 text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.04] tracking-[-0.035em]">Supply line burst behind the TV wall.</h2>
          <dl className="mt-6 text-[16px]">
            {[
              ["Found", "Water across 410 sq ft of hardwood, wicking 14\" up the drywall"],
              ["Day 1", "Water extracted, drywall cut at 2 ft, 6 air movers + 2 dehumidifiers"],
              ["Day 4", "Readings at dry standard, equipment out"],
              ["Day 19", "Drywall, trim and paint finished; floor saved"],
              ["Insurance", "Claim documented with 212 photos and daily readings"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 border-t border-charcoal-mute py-3"><dt className="w-24 flex-none font-bold">{k}</dt><dd className="text-warm-gray">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export function DemoCrew() {
  const reviews = [
    ["Our basement flooded at 2 a.m. Someone picked up on the second ring and the truck was here before 3. They showed us every moisture reading.", "Sarah K.", "Vancouver, WA"],
    ["Fire in the kitchen. Ona boarded up the same night, dealt with State Farm directly and rebuilt the whole kitchen. Felt like they'd done it a thousand times.", "Mike & Dana R.", "Battle Ground, WA"],
    ["Black mold behind the shower. They sealed the room off, removed it, tested it and rebuilt the bathroom. Clean, honest, on schedule.", "Priya N.", "Portland, OR"],
  ];
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[4px]">
            <Image src="/photos/demo/crew-demo.webp" alt="Ona crew next to a company van" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <h2 className="mt-6 text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.04] tracking-[-0.035em]">The people who show up.<span className="ml-2 rounded-[2px] bg-[#ffd84d] px-1.5 py-0.5 align-middle text-[11px] font-bold uppercase tracking-wide text-[#172124]">Sample</span></h2>
          <p className="mt-3 max-w-[480px] text-[18px] leading-relaxed text-warm-gray">Our own crew, not subcontractors. Local to Clark County and Portland, on call every night.</p>
        </div>
        <div className="grid content-start gap-3">
          {reviews.map(([q, n, c]) => (
            <figure key={n} className="rounded-[4px] bg-charcoal-soft p-6">
              <div className="text-[18px] text-coral" aria-label="5 out of 5">★★★★★</div>
              <blockquote className="mt-2 text-[17px] leading-relaxed">“{q}”</blockquote>
              <figcaption className="mt-3 text-[14px] text-warm-gray"><b className="text-ivory">{n}</b> · {c}<span className="ml-2 rounded-[2px] bg-[#ffd84d] px-1.5 py-0.5 align-middle text-[11px] font-bold uppercase tracking-wide text-[#172124]">Sample</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
