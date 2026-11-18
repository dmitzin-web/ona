"use client";

import { useState } from "react";

// "My [kitchen] is [flooded]." — the visitor's task in their own words.
// Tapping a word cycles it; the line under it answers with what we do, and
// the text-a-photo link carries the sentence so the first message is
// already written. Words come from content/pages/new.json → hero.
// Drawn for the deep-teal hero (light type on brand).

type State = { word: string; result: string };

export function Sentence({ t, phone, phoneDisplay }: {
  t: { my: string; is: string; places: string[]; states: State[]; tapHint: string; resultLead: string; text: string; textSub: string; call: string; smsLead: string; smsTail: string };
  phone: string;
  phoneDisplay: string;
}) {
  const [p, setP] = useState(0);
  const [s, setS] = useState(0);
  const place = t.places[p] ?? "";
  const state = t.states[s] ?? { word: "", result: "" };
  const next = (n: number, len: number, back: boolean) => (n + (back ? len - 1 : 1)) % len;
  const sms = `sms:${phone}?&body=${encodeURIComponent(`${t.smsLead} ${t.my.toLowerCase()} ${place} ${t.is} ${state.word}. ${t.smsTail} `)}`;

  const slot =
    "inline-flex cursor-pointer items-baseline rounded-[2px] text-[#9FE0D6] underline decoration-[0.07em] underline-offset-[0.12em] transition-colors hover:text-white";

  return (
    <div>
      <p className="text-[clamp(34px,6vw,76px)] font-bold leading-[1.04] tracking-[-0.04em] text-charcoal">
        <span>{t.my}</span>{" "}
        <button
          type="button"
          className={slot}
          aria-label={`${place} — change the room`}
          onClick={(e) => setP((n) => next(n, t.places.length, e.shiftKey))}
        >
          <span key={place} className="ona-roll">{place}</span>
        </button>{" "}
        <span>{t.is}</span>{" "}
        <button
          type="button"
          className={slot}
          aria-label={`${state.word} — change what happened`}
          onClick={(e) => setS((n) => next(n, t.states.length, e.shiftKey))}
        >
          <span key={state.word} className="ona-roll">{state.word}</span>
        </button>
        <span>.</span>
      </p>
      <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-warm-gray-deep">{t.tapHint}</p>
      <p className="mt-5 text-[clamp(19px,2vw,24px)] leading-snug text-charcoal" aria-live="polite">
        <span className="text-warm-gray-deep">→</span> <span>{t.resultLead}</span> <b key={state.result} className="ona-roll font-bold text-[#9FE0D6]">{state.result}</b>
      </p>

      <div className="mt-8 grid max-w-[640px] gap-2.5">
        <a href={`tel:${phone}`} className="flex min-h-[72px] items-center justify-between gap-4 rounded-[10px] bg-coral px-6 text-[22px] font-bold text-charcoal transition-colors hover:bg-coral-deep">
          <span>{t.call}</span>
          <span className="text-[17px] font-medium">{phoneDisplay}</span>
        </a>
        <a href={sms} className="flex min-h-[72px] items-center justify-between gap-4 rounded-[10px] border-2 border-charcoal px-6 text-[22px] font-bold text-charcoal transition-colors hover:bg-charcoal hover:text-brand">
          <span>{t.text}</span>
          <span className="text-[17px] font-medium">{t.textSub}</span>
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
