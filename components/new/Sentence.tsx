"use client";

import { useState } from "react";

// "My [kitchen] is [flooded]." — the visitor's task in their own words.
// Tapping a word cycles it ("outdated" turns it into a remodel); the line under it answers with what we do, and
// the text-a-photo link carries the sentence so the first message is
// already written. Words come from content/pages/new.json → hero.
// Drawn for the deep-teal hero (light type on brand).

type State = { word: string; result: string };

export function Sentence({ t, phone, phoneDisplay }: {
  t: { my: string; is: string; places: string[]; states: State[]; pickPlace: string; pickState: string; resultLead: string; text: string; textSub: string; call: string; smsLead: string; smsTail: string };
  phone: string;
  phoneDisplay: string;
}) {
  const [p, setP] = useState(0);
  const [s, setS] = useState(0);
  const place = t.places[p] ?? "";
  const state = t.states[s] ?? { word: "", result: "" };
  const next = (n: number, len: number, back: boolean) => (n + (back ? len - 1 : 1)) % len;
  const sms = `sms:${phone}?&body=${encodeURIComponent(`${t.smsLead} ${t.my.toLowerCase()} ${place} ${t.is} ${state.word}. ${t.smsTail} `)}`;

  // A picker should look like one without a caption: dotted underline and
  // a small caret, like a select. The caret turns on each change.
  const slot =
    "group inline-flex cursor-pointer items-baseline gap-[0.12em] rounded-[4px] text-[#9FE0D6] underline decoration-dotted decoration-[0.06em] underline-offset-[0.14em] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
  const caret = (k: string) => (
    <svg key={k} aria-hidden="true" viewBox="0 0 12 8" className="ona-roll h-[0.26em] w-[0.38em] translate-y-[-0.12em] fill-current opacity-80"><path d="M1 1h10L6 7z" /></svg>
  );

  return (
    <div>
      <p className="text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.1] tracking-[-0.035em] text-charcoal">
        <span>{t.my}</span>{" "}
        <button type="button" className={slot} aria-label={`${place} — ${t.pickPlace}`} onClick={(e) => setP((n) => next(n, t.places.length, e.shiftKey))}>
          <span key={place} className="ona-roll">{place}</span>{caret(`c${p}`)}
        </button>{" "}
        <span>{t.is}</span>{" "}
        <button type="button" className={slot} aria-label={`${state.word} — ${t.pickState}`} onClick={(e) => setS((n) => next(n, t.states.length, e.shiftKey))}>
          <span key={state.word} className="ona-roll">{state.word}</span>{caret(`s${s}`)}
        </button>
        <span>.</span>
      </p>
      <p className="mt-3 text-[clamp(18px,1.8vw,22px)] leading-snug text-charcoal" aria-live="polite">
        <span className="text-warm-gray-deep">→</span> <span>{t.resultLead}</span> <b key={state.result} className="ona-roll font-bold text-[#9FE0D6]">{state.result}</b>
      </p>

      <div className="mt-6 grid gap-2.5">
        <a href={`tel:${phone}`} className="flex min-h-[68px] items-center justify-between gap-4 rounded-[10px] bg-coral px-5 text-[21px] font-bold text-charcoal transition-colors hover:bg-coral-deep">
          <span>{t.call}</span>
          <span className="whitespace-nowrap text-[16px] font-medium">{phoneDisplay}</span>
        </a>
        <a href={sms} className="flex min-h-[68px] items-center justify-between gap-4 rounded-[10px] border-2 border-charcoal px-5 text-[21px] font-bold text-charcoal transition-colors hover:bg-charcoal hover:text-brand">
          <span className="whitespace-nowrap">{t.text}</span>
          <span className="hidden text-[16px] font-medium sm:inline">{t.textSub}</span>
        </a>
      </div>
    </div>
  );
}

/** The deductible, by example: type yours, the last line follows. Labels from content/pages/new.json → cost. */
export function Deductible({ t }: { t: { deductible: string; example: string; covered: string; insurer: string; you: string } }) {
  const [v, setV] = useState("1000");
  const n = Math.max(0, Math.round(Number(v) || 0));
  const row = "flex items-baseline justify-between gap-4 border-b border-white/20 py-4";
  return (
    <div>
      <div className={row}>
        <label htmlFor="ona-ded" className="text-[18px]"><span>{t.deductible}</span> <span className="ml-1 rounded-[2px] bg-[#FFE9A8] px-1.5 py-0.5 align-middle text-[11px] font-semibold uppercase tracking-wide text-[#4A3A00]">{t.example}</span></label>
        <span className="text-[24px] font-bold">$<input id="ona-ded" type="number" inputMode="numeric" min={0} step={100} value={v} onChange={(e) => setV(e.target.value)} className="w-[120px] border-b-2 border-[#9CC9C2] bg-transparent text-right font-bold text-white outline-none focus:border-white" /></span>
      </div>
      <div className={row}><span className="text-[18px]">{t.covered}</span><b className="text-[20px]">{t.insurer}</b></div>
      <div className="flex items-baseline justify-between gap-4 py-4"><span className="text-[22px]">{t.you}</span><b className="text-[clamp(40px,5vw,64px)] tracking-[-0.04em] text-white">${n.toLocaleString("en-US")}</b></div>
    </div>
  );
}
