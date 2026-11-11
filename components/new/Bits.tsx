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
const Cam = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 8.5h3.5L8.5 6h7l2 2.5H21V19H3z" /><circle cx="12" cy="13" r="3.5" /></svg>
);

export function Composer({ t }: { t: { label: string; placeholder: string; talk: string; photo: string; enterHint: string; send: string } }) {
  const [v, setV] = useState("");
  const ta = useRef<HTMLTextAreaElement>(null);
  const submit = () => {
    const text = v.trim();
    if (!text) { ta.current?.focus(); return; }
    openIntake({ mode: "text", text });
    setV("");
  };
  return (
    <form
      className="mt-6 rounded-[4px] bg-charcoal p-3.5 pb-2.5 text-ivory shadow-[0_24px_60px_-30px_rgba(0,0,0,.6)] focus-within:ring-[3px] focus-within:ring-teal-bright"
      onSubmit={(e) => { e.preventDefault(); submit(); }}
    >
      <label htmlFor="new-composer" className="sr-only">{t.label}</label>
      <textarea
        id="new-composer"
        ref={ta}
        rows={2}
        value={v}
        placeholder={t.placeholder}
        onChange={(e) => { setV(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`; }}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
        className="block min-h-[58px] w-full resize-none bg-transparent px-0.5 pb-2 text-[19px] font-medium leading-snug text-ivory outline-none placeholder:text-warm-gray"
      />
      <div className="flex items-center gap-2 border-t border-charcoal-mute pt-2.5">
        <button type="button" onClick={() => openIntake({ mode: "talk" })} className="inline-flex h-11 items-center gap-2 rounded-[2px] bg-charcoal-soft px-3.5 text-[15px] font-semibold"><Mic />{t.talk}</button>
        <button type="button" onClick={() => openIntake({ mode: "show" })} className="inline-flex h-11 items-center gap-2 rounded-[2px] border border-charcoal-mute px-3.5 text-[15px] font-semibold hover:border-ivory"><Cam />{t.photo}</button>
        <span className="ml-auto hidden text-[13px] text-warm-gray sm:inline">{t.enterHint}</span>
        <button type="submit" className="ml-auto inline-flex h-11 items-center gap-2 rounded-[2px] bg-teal px-4 text-[15px] font-bold text-charcoal hover:bg-gold-deep sm:ml-0">
          {t.send}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
        </button>
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
