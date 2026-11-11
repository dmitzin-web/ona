"use client";

import { useEffect, useRef, useState } from "react";
import { openIntake, type OpenDetail } from "./Intake";

// The small interactive parts of /new. Words arrive as props from the page
// (content/pages/new.json); what each button opens is fixed here.

export function Act({ open, className, children, label }: { open: OpenDetail; className?: string; children: React.ReactNode; label?: string }) {
  return (
    <button type="button" aria-label={label} className={className} onClick={() => openIntake(open)}>
      {children}
    </button>
  );
}

const Mic = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><rect x="9" y="2.5" width="6" height="11.5" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5" /></svg>
);

/** The secondary way in: a sentence, or a voice message. The three big actions above it are the main ones. */
export function Composer({ t }: { t: { orLabel: string; label: string; placeholder: string; voice: string; enterHint: string; send: string } }) {
  const [v, setV] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);
  const submit = () => {
    const text = v.trim();
    if (!text) { ta.current?.focus(); return; }
    openIntake({ mode: "text", text });
    setV("");
  };
  return (
    <form className="mt-6" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <label htmlFor="new-composer" className="text-[14px] font-semibold text-warm-gray-deep">{t.orLabel}</label>
      <span className="sr-only">{t.label}</span>
      <div className="mt-2 flex items-end gap-2 rounded-[2px] border border-warm-gray-deep/40 bg-brand-2 p-2 focus-within:border-charcoal">
        <textarea
          id="new-composer"
          ref={ta}
          rows={1}
          value={v}
          placeholder={t.placeholder}
          onChange={(e) => { setV(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`; }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          className="block min-h-[44px] min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-[16px] leading-snug text-charcoal outline-none placeholder:text-warm-gray-deep"
        />
        <button type="button" aria-label={t.voice} onClick={() => openIntake({ mode: "talk" })} className="inline-flex h-11 flex-none items-center gap-1.5 rounded-[2px] px-3 text-[14px] font-semibold text-charcoal hover:bg-brand"><Mic /><span className="hidden sm:inline">{t.voice}</span></button>
        <button type="submit" className="inline-flex h-11 flex-none items-center rounded-[2px] bg-charcoal px-4 text-[14px] font-bold text-brand">{t.send}</button>
      </div>
    </form>
  );
}

/** Shown only between 9 pm and 6 am in the visitor's own time — after hours a call is the fastest help. */
export function NightNote({ lead, text, phone, phoneDisplay }: { lead: string; text: string; phone: string; phoneDisplay: string }) {
  const [night, setNight] = useState(false);
  useEffect(() => { const h = new Date().getHours(); setNight(h >= 21 || h < 6); }, []);
  if (!night) return null;
  return (
    <p className="mt-4 border-l-[3px] border-coral bg-brand-2 px-4 py-3 text-[15px] leading-snug">
      <b>{lead}</b> <span>{text}</span> <a href={`tel:${phone}`} className="font-bold underline">{phoneDisplay}</a>
    </p>
  );
}

export function ZipCheck({ cities, t }: {
  cities: { name: string; zips: string[] }[];
  t: { label: string; placeholder: string; button: string; yesBefore: string; yesAfter: string; notListed: string; outside: string; invalid: string };
}) {
  const [zip, setZip] = useState("");
  const [out, setOut] = useState<{ kind: "yes" | "no" | "out" | "bad"; city?: string } | null>(null);
  const check = () => {
    const z = zip.trim();
    if (!/^\d{5}$/.test(z)) return setOut({ kind: "bad" });
    const c = cities.find((x) => x.zips.includes(z));
    if (c) return setOut({ kind: "yes", city: c.name });
    setOut({ kind: /^9[78]/.test(z) ? "no" : "out" });
  };
  return (
    <>
      <form className="mt-6 flex max-w-[400px] gap-2" onSubmit={(e) => { e.preventDefault(); check(); }}>
        <label htmlFor="new-zip" className="sr-only">{t.label}</label>
        <input id="new-zip" inputMode="numeric" maxLength={5} autoComplete="postal-code" value={zip} onChange={(e) => setZip(e.target.value)} placeholder={t.placeholder}
          className="h-14 min-w-0 flex-1 rounded-[2px] border border-charcoal-mute bg-charcoal px-4 text-[18px] font-semibold text-ivory outline-none focus:border-teal" />
        <button type="submit" className="h-14 rounded-[2px] bg-brand px-6 font-bold text-charcoal">{t.button}</button>
      </form>
      <p className="mt-3 min-h-[28px] text-[17px]" aria-live="polite">
        {out?.kind === "yes" && <><b className="text-teal">{t.yesBefore} {out.city}</b> <span>{t.yesAfter}</span></>}
        {out?.kind === "no" && <><span>{zip.trim()}</span> <span>{t.notListed}</span></>}
        {out?.kind === "out" && <span>{t.outside}</span>}
        {out?.kind === "bad" && <span>{t.invalid}</span>}
      </p>
    </>
  );
}

/** What a restoration job actually involves, one tab per kind of loss. Steps come from content/services.json — the same copy as the service pages. */
export function ProcessTabs({ jobs, more }: { jobs: { slug: string; name: string; steps: { step: string; text: string }[] }[]; more: string }) {
  const [i, setI] = useState(0);
  const job = jobs[i];
  return (
    <div className="mt-8">
      <div role="tablist" className="flex flex-wrap gap-2">
        {jobs.map((j, k) => (
          <button key={j.slug} role="tab" type="button" aria-selected={k === i} onClick={() => setI(k)}
            className={`h-11 rounded-full px-5 text-[15px] font-bold ${k === i ? "bg-charcoal text-ivory" : "border border-warm-gray-deep/50 text-charcoal hover:border-charcoal"}`}>
            {j.name}
          </button>
        ))}
      </div>
      <ol role="tabpanel" className="mt-6 grid gap-px overflow-hidden rounded-[2px] bg-warm-gray/40 sm:grid-cols-2 lg:grid-cols-3">
        {job.steps.map((s) => (
          <li key={s.step} className="bg-ivory p-5 lg:p-6">
            <b className="block text-[18px] text-charcoal">{s.step}</b>
            <span className="mt-2 block leading-relaxed text-warm-gray-deep">{s.text}</span>
          </li>
        ))}
      </ol>
      <a href={`/services/${job.slug}`} className="mt-5 inline-block font-semibold text-charcoal underline underline-offset-4">{more} {job.name}</a>
    </div>
  );
}
