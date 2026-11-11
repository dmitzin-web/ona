"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { understand, safety, type Hazard, type Intent, type Understood } from "@/lib/intake/understand";
import { fillVarsDeep } from "@/lib/placeholders";
import { Logo } from "@/components/Logo";
import type newContent from "@/content/pages/new.json";

// The intake on /new: one screen to describe it (words, photos, or a voice
// message), opened with the situation already chosen. Opens over the page from anywhere
// via openIntake(); reads what the visitor says with lib/intake/understand,
// always runs the safety check first, asks at most one question, then takes
// a time, an address and a phone number and sends it to /api/start-project
// (the same endpoint as the /start-project form). If sending fails, the
// visitor's e-mail app opens with everything filled in, so the lead never dies.
// Every word comes from content/pages/new.json → intake.

export type IntakeCopy = (typeof newContent)["intake"];
type Mode = "method" | "talk" | "show" | "type" | "text" | "shutoff" | "docs" | "schedule";
export type OpenDetail = { mode: Mode; hint?: Intent | ""; text?: string };

export function openIntake(detail: OpenDetail) {
  window.dispatchEvent(new CustomEvent<OpenDetail>("ona:intake", { detail }));
}

type Screen = "tell" | "talk" | "photo" | "thinking" | "hazard" | "result" | "shutoff" | "contact" | "sent" | "failed";
type Photo = { url: string; name: string };

/* ── small pieces ── */
const Btn = ({ children, onClick, kind = "ghost", href }: { children: React.ReactNode; onClick?: () => void; kind?: "pri" | "ghost" | "call" | "warn"; href?: string }) => {
  const cls =
    "inline-flex min-h-[52px] flex-1 basis-44 items-center justify-center gap-2 rounded-[2px] px-5 text-[16px] font-bold transition-colors " +
    (kind === "pri"
      ? "bg-brand text-charcoal hover:bg-brand-2"
      : kind === "call"
        ? "bg-coral text-charcoal hover:bg-coral-deep"
        : kind === "warn"
          ? "bg-coral-bright text-ivory"
          : "border border-charcoal-mute hover:border-ivory");
  return href ? (
    <a href={href} className={cls}>{children}</a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>{children}</button>
  );
};

export function Intake({ copy, phone, email }: { copy: IntakeCopy; phone: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("tell");
  const [hint, setHint] = useState<Intent | "">("");
  const [text, setText] = useState("");
  const [draft, setDraft] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [res, setRes] = useState<Understood | null>(null);
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [asked, setAsked] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState({ time: "", addr: "", name: "", phone: "" });
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [listenErr, setListenErr] = useState("");
  const [interim, setInterim] = useState("");
  const rec = useRef<{ stop: () => void; abort: () => void } | null>(null);
  const fileCam = useRef<HTMLInputElement>(null);
  const fileLib = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const tel = `tel:${phone}`;
  const t = copy;

  const stopListening = useCallback(() => {
    try { rec.current?.abort(); } catch {}
    rec.current = null;
  }, []);

  const go = useCallback((s: Screen) => {
    if (s !== "talk") stopListening();
    setScreen(s);
    requestAnimationFrame(() => body.current?.scrollTo(0, 0));
  }, [stopListening]);

  const think = useCallback((said: string, h: Intent | "") => {
    setText(said);
    setAsked({});
    go("thinking");
    window.setTimeout(() => {
      setRes(understand(said, h));
      const hz = safety(said);
      setHazards(hz);
      go(hz.length ? "hazard" : "result");
    }, 900);
  }, [go]);

  const startTalk = useCallback(() => {
    setInterim(""); setDraft(""); setListenErr("");
    go("talk");
    const W = window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const SR = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    if (!SR) { setListenErr(t.talk.unsupported); return; }
    const r = new SR();
    r.lang = "en-US"; r.interimResults = true; r.continuous = true;
    let final = "";
    r.onresult = (e: any) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
        else live += e.results[i][0].transcript;
      }
      setDraft(final.trim()); setInterim(live);
    };
    r.onerror = (e: any) => setListenErr(e.error === "not-allowed" || e.error === "service-not-allowed" ? t.talk.blocked : t.talk.unsupported);
    try { r.start(); rec.current = r; } catch { setListenErr(t.talk.unsupported); }
  }, [go, t.talk]);

  /* open from anywhere on the page */
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<OpenDetail>).detail;
      setOpen(true); setHint(d.hint ?? ""); setRes(null); setHazards([]); setErr(""); setStep(1);
      document.documentElement.style.overflow = "hidden";
      if (d.mode === "talk") startTalk();
      else if (d.mode === "show") go("photo");
      else if (d.mode === "type" || d.mode === "method") { setDraft(""); setText(""); go("tell"); }
      else if (d.mode === "text" && d.text) think(d.text, d.hint ?? "");
      else if (d.mode === "shutoff") { setText(""); setRes(understand("water still running", "water")); go("shutoff"); }
      else if (d.mode === "docs") { setDraft(""); setText(""); go("tell"); }
      else if (d.mode === "schedule") { setRes(understand("", d.hint ?? "")); setStep(1); go("contact"); }
      else go("tell");
    };
    window.addEventListener("ona:intake", on);
    return () => window.removeEventListener("ona:intake", on);
  }, [go, startTalk, think]);

  const close = useCallback(() => {
    stopListening(); setOpen(false); document.documentElement.style.overflow = "";
    photos.forEach((p) => URL.revokeObjectURL(p.url)); setPhotos([]); setText(""); setContact({ time: "", addr: "", name: "", phone: "" });
  }, [photos, stopListening]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, close]);

  if (!open) return null;

  const addPhotos = (list: FileList | null) => {
    if (!list) return;
    setPhotos((p) => [...p, ...Array.from(list).map((f) => ({ url: URL.createObjectURL(f), name: f.name }))]);
  };

  const intent: Intent = res?.intent ?? (hint || "unsure");
  const urgent = screen !== "hazard" && (intent === "water" || intent === "fire");
  const tone = screen === "hazard" ? "bg-[#170c07] text-charcoal" : urgent ? "bg-brand text-charcoal" : "bg-charcoal text-ivory";
  const sub = screen === "hazard" || urgent ? "text-warm-gray-deep" : "text-warm-gray";
  const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-[clamp(34px,6vw,56px)] font-semibold leading-[1.02] tracking-[-0.03em]">{children}</h2>;
  const Kick = ({ children }: { children: React.ReactNode }) => <p className={`mb-3 text-[15px] font-semibold ${sub}`}>{children}</p>;

  /* ── result card ── */
  const rows: [string, string | null][] = [];
  let question: { q: string; a: [string, () => void][] } | null = null;
  let acts: React.ReactNode = null;
  let alert: { title: string; text?: string } | null = null;
  if (res) {
    const r = res;
    const R = t.rows;
    if (r.intent === "water" || r.intent === "commercial") {
      rows.push([R.source, r.source ?? R.notYet], [R.stopped, r.stopped === "yes" ? R.yes : r.stopped === "no" ? R.no : R.unknown], [R.areas, r.areas ?? R.notYet], [R.started, r.started], [R.property, r.property]);
      if (r.sewage) alert = { title: t.alerts.sewage, text: t.alerts.sewageText };
      if (r.intent === "water" && r.stopped === "unknown" && !asked.running)
        question = { q: t.ask.running, a: [[t.ask.yes, () => { setRes({ ...r, stopped: "no" }); setAsked({ ...asked, running: "yes" }); }], [t.ask.no, () => { setRes({ ...r, stopped: "yes" }); setAsked({ ...asked, running: "no" }); }], [t.ask.notSure, () => { setRes({ ...r, stopped: "no" }); setAsked({ ...asked, running: "unsure" }); }]] };
      else if (r.intent === "water" && r.stopped === "no") {
        alert = { title: t.alerts.shutoff, text: t.alerts.shutoffText };
        acts = <><Btn kind="pri" onClick={() => { setRes({ ...r, stopped: "yes" }); }}>{t.act.turnedOff}</Btn><Btn onClick={() => go("shutoff")}>{t.act.findShutoff}</Btn><Btn kind="call" href={tel}>{t.act.call}</Btn></>;
      }
    } else if (r.intent === "fire") {
      rows.push([R.areas, r.areas ?? R.notYet], [R.started, r.started]);
      if (!r.fireOut && !asked.fire)
        question = { q: t.ask.fireOut, a: [[t.ask.yes, () => { setRes({ ...r, fireOut: true }); setAsked({ ...asked, fire: "out" }); }], [t.ask.no, () => { setHazards(safety("active fire")); go("hazard"); }], [t.ask.notSure, () => { setHazards(safety("active fire")); go("hazard"); }]] };
      else alert = { title: t.alerts.fire };
    } else if (r.intent === "mold") {
      rows.push([R.areas, r.areas ?? R.notYet], [R.observed, r.observed ?? R.notYet], [R.source, r.source]);
      if (!r.source && !asked.leak) question = { q: t.ask.leak, a: [[t.ask.yes, () => setAsked({ ...asked, leak: "yes" })], [t.ask.no, () => setAsked({ ...asked, leak: "no" })], [t.ask.notSure, () => setAsked({ ...asked, leak: "unsure" })]] };
      else alert = { title: t.alerts.mold };
    } else if (r.intent === "insurance") {
      rows.push([R.carrier, r.carrier ?? R.notYet], [R.estimate, r.estimate || asked.est === "yes" ? R.have : null], [R.areas, r.areas]);
      if (!r.estimate && !asked.est) question = { q: t.ask.estimate, a: [[t.ask.yes, () => setAsked({ ...asked, est: "yes" })], [t.ask.no, () => setAsked({ ...asked, est: "no" })], [t.ask.notSure, () => setAsked({ ...asked, est: "unsure" })]] };
      else acts = <><Btn kind="pri" onClick={() => { setStep(1); go("contact"); }}>{t.act.schedule}</Btn><Btn onClick={() => go("photo")}>{t.act.photos}</Btn></>;
    } else if (r.intent === "remodel") {
      rows.push([R.areas, r.areas ?? R.notYet], [R.items, r.items]);
      acts = <><Btn kind="pri" onClick={() => go("photo")}>{t.act.showSpace}</Btn><Btn onClick={startTalk}>{t.act.tellMore}</Btn><Btn onClick={() => { setStep(1); go("contact"); }}>{t.act.planCall}</Btn></>;
    }
    if (photos.length) rows.push([R.photos, String(photos.length)]);
    if (!acts && !question) acts = <><Btn kind="pri" onClick={() => { setStep(1); go("contact"); }}>{t.act.request}</Btn><Btn onClick={() => go("photo")}>{t.act.photos}</Btn><Btn kind="call" href={tel}>{t.act.call}</Btn></>;
  }

  /* ── send ── */
  const send = async () => {
    if (!contact.phone.trim()) { setErr(t.contact.required); return; }
    setSending(true);
    const fields: Record<string, string> = {
      source: "new-homepage-intake",
      intent,
      said: text,
      ...Object.fromEntries(rows.filter(([, v]) => v).map(([k, v]) => [k, v as string])),
      answers: JSON.stringify(asked),
      when: contact.time,
      address: contact.addr,
      name: contact.name,
      phone: contact.phone,
      photosTaken: String(photos.length),
    };
    try {
      const r = await fetch("/api/start-project", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(fields) });
      if (!r.ok) throw new Error(String(r.status));
      go("sent");
    } catch {
      go("failed");
      const bodyText = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");
      window.location.href = `mailto:${email}?subject=${encodeURIComponent("Request from onarestore.com/new")}&body=${encodeURIComponent(bodyText)}`;
    } finally {
      setSending(false);
    }
  };

  const steps = 3;
  const stepLine = fillVarsDeep(t.contact.stepOf, { step: String(step), steps: String(steps) });
  const resTitle = res && res.intent !== "unsure" ? t.result.titles[res.intent] : "";
  const cardTitle = res && res.intent !== "unsure" ? t.result.cards[res.intent] : "";
  const tellTitle = hint && hint !== "unsure" ? t.titles[hint] : t.tell.title;

  return (
    <div role="dialog" aria-modal="true" aria-label={t.tell.title} className={`fixed inset-0 z-[100] flex flex-col ${tone}`}>
      <div className="flex h-16 flex-none items-center justify-between gap-3 border-b border-charcoal-mute/30 px-5">
        <Logo variant="horizontal" tone={screen === "hazard" || urgent ? "dark" : "light"} />
        <span className="flex items-center gap-2">
          <a href={tel} className="inline-flex h-10 items-center rounded-full border border-current px-4 text-[14px] font-semibold whitespace-nowrap">{t.call}</a>
          <button type="button" onClick={close} aria-label={t.close} className="flex h-11 w-11 items-center justify-center text-[28px] leading-none">×</button>
        </span>
      </div>
      <input ref={fileCam} type="file" accept="image/*,video/*" capture="environment" multiple hidden onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
      <input ref={fileLib} type="file" accept="image/*,video/*" multiple hidden onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
      <div ref={body} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-[680px] flex-col px-5 pt-9 pb-16">
          {screen === "tell" && (
            <form onSubmit={(e) => { e.preventDefault(); const said = draft.trim(); if (said || photos.length) think(said || " ", hint); }}>
              <Kick>{t.tell.kicker}</Kick>
              <H2>{tellTitle}</H2>
              <p className={`mt-3 text-[18px] ${sub}`}>{hint === "remodel" ? t.tell.remodelText : t.tell.text}</p>
              <label className="sr-only" htmlFor="ona-tell">{t.tell.label}</label>
              <textarea id="ona-tell" autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} rows={4} placeholder={t.tell.placeholder} className="mt-6 w-full rounded-[2px] border border-charcoal-mute bg-charcoal p-4 text-[18px] text-ivory outline-none placeholder:text-warm-gray focus:border-teal" />
              {photos.length > 0 && (
                <div className="mt-3">
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">{photos.map((p) => <img key={p.url} src={p.url} alt={p.name} className="aspect-square w-full rounded-[2px] object-cover" />)}</div>
                  <p className={`mt-1.5 text-[14px] ${sub}`}>{photos.length} {t.tell.photosReady}</p>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2.5">
                <Btn onClick={() => fileLib.current?.click()}>{t.tell.photos}</Btn>
                <Btn onClick={startTalk}>{t.tell.voice}</Btn>
              </div>
              <div className="mt-3 flex"><button type="submit" className={`inline-flex min-h-[56px] flex-1 items-center justify-center rounded-[2px] px-5 text-[17px] font-bold ${urgent ? "bg-charcoal text-brand" : "bg-brand text-charcoal hover:bg-brand-2"}`}>{t.tell.continue}</button></div>
              {hint !== "remodel" && <a href={tel} className="mt-6 inline-block font-semibold underline">{t.tell.urgent}</a>}
            </form>
          )}

          {screen === "talk" && (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <span className={`flex h-24 w-24 items-center justify-center rounded-full ${listenErr ? "bg-charcoal-soft text-ivory" : "bg-teal text-charcoal animate-pulse"}`}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="9" y="2.5" width="6" height="11.5" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5" /></svg>
              </span>
              <h2 className="mt-6 text-[clamp(30px,5vw,44px)] font-semibold">{listenErr ? "" : t.talk.title}</h2>
              <p className={`mt-2 max-w-md ${sub}`}>{listenErr || t.talk.hint}</p>
              <p className="mt-6 min-h-[80px] max-w-xl text-[22px] font-medium leading-snug">{draft} <span className="opacity-50">{interim}</span></p>
              <div className="mt-6 flex w-full max-w-md flex-wrap gap-2.5">
                {!listenErr && <Btn kind="pri" onClick={() => { stopListening(); const said = `${draft} ${interim}`.trim(); if (said) think(said, hint); else { setDraft(""); go("tell"); } }}>{t.talk.done}</Btn>}
                <Btn onClick={() => { stopListening(); go("tell"); }}>{t.talk.typeInstead}</Btn>
              </div>
            </div>
          )}

          {screen === "photo" && (
            <>
              <H2>{t.photo.title}</H2>
              <p className={`mt-3 text-[18px] ${sub}`}>{photos.length ? `${photos.length} ${t.photo.ready}` : t.photo.hint}</p>
              {photos.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {photos.map((p) => <img key={p.url} src={p.url} alt={p.name} className="aspect-square w-full rounded-[2px] object-cover" />)}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Btn kind={photos.length ? "ghost" : "pri"} onClick={() => fileCam.current?.click()}>{photos.length ? t.photo.more : t.photo.take}</Btn>
                <Btn onClick={() => fileLib.current?.click()}>{t.photo.library}</Btn>
              </div>
              {photos.length > 0 && (
                <form className="mt-6" onSubmit={(e) => { e.preventDefault(); const said = [text, draft].filter(Boolean).join(" ").trim(); think(said || " ", hint); }}>
                  <label htmlFor="ona-note" className="text-[15px] font-semibold">{t.photo.noteLabel}</label>
                  <textarea id="ona-note" value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder={t.photo.notePlaceholder} className="mt-2 w-full rounded-[2px] border border-charcoal-mute bg-charcoal p-4 text-[17px] text-ivory outline-none focus:border-teal" />
                  <div className="mt-4 flex"><button type="submit" className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-[2px] bg-brand px-5 font-bold text-charcoal">{t.photo.continue}</button></div>
                </form>
              )}
            </>
          )}

          {screen === "thinking" && (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <H2>{t.thinking}</H2>
              {text.trim() && <p className={`mt-3 max-w-lg text-[18px] ${sub}`}>“{text}”</p>}
            </div>
          )}

          {screen === "hazard" && (
            <>
              <Kick><span className="text-coral-bright">{t.safety.kicker}</span></Kick>
              <h2 className="text-[clamp(34px,6vw,56px)] font-semibold leading-[1.02] tracking-[-0.03em] text-coral-bright">{hazards.map((h) => h.title).join(" + ")}</h2>
              <ol className="mt-6 list-decimal space-y-3 pl-6 text-[18px] leading-snug">
                {Array.from(new Set(hazards.flatMap((h) => h.steps))).map((s) => <li key={s}>{s}</li>)}
              </ol>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <Btn kind="warn" href="tel:911">{t.safety.call911}</Btn>
                <Btn onClick={() => go("result")}>{t.safety.continue}</Btn>
              </div>
              <p className={`mt-5 text-[14px] ${sub}`}>{t.safety.note}</p>
            </>
          )}

          {screen === "result" && res && (
            res.intent === "unsure" ? (
              <>
                <H2>{t.result.unsureTitle}</H2>
                <p className={`mt-3 text-[18px] ${sub}`}>{t.result.unsureText}</p>
                <div className="mt-6 flex flex-wrap gap-2.5"><Btn kind="pri" onClick={() => { setDraft(text); go("tell"); }}>{t.tell.title}</Btn><Btn onClick={startTalk}>{t.tell.voice}</Btn><Btn onClick={() => go("photo")}>{t.tell.photos}</Btn></div>
              </>
            ) : (
              <>
                <Kick>{t.result.kicker}</Kick>
                <H2>{resTitle}</H2>
                {text.trim() && (
                  <div className={`mt-5 rounded-[2px] p-4 ${urgent ? "bg-brand-2" : "bg-charcoal-soft"}`}>
                    <span className={`block text-[13px] font-semibold ${sub}`}>{t.result.youSaid}</span>
                    <span className="mt-1 block text-[16px]">“{text}”</span>
                    <button type="button" onClick={() => { setDraft(text); go("tell"); }} className="mt-2 text-[14px] font-semibold underline">{t.result.edit}</button>
                  </div>
                )}
                <div className={`mt-5 rounded-[2px] border p-5 ${urgent ? "border-brand-2 bg-brand-2" : "border-charcoal-mute bg-charcoal"}`}>
                  <h3 className="text-[28px] font-semibold tracking-[-0.02em]">{cardTitle}</h3>
                  <dl className="mt-3">
                    {rows.filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-t border-charcoal-mute/40 py-3"><dt className={sub}>{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
                    ))}
                  </dl>
                  {alert && <div className="mt-4 border-l-4 border-coral bg-coral/10 p-4"><b className="block">{alert.title}</b>{alert.text && <p className="mt-1 text-[15px]">{alert.text}</p>}</div>}
                  {question && (
                    <div className="mt-4 rounded-[2px] border border-current p-4">
                      <span className={`block text-[13px] font-semibold ${sub}`}>{t.result.oneThing}</span>
                      <b className="mt-1 block text-[21px]">{question.q}</b>
                      <div className="mt-4 grid grid-cols-3 gap-2">{question.a.map(([l, fn]) => <button key={l} type="button" onClick={fn} className="min-h-[50px] rounded-[2px] border border-charcoal-mute font-bold hover:border-current">{l}</button>)}</div>
                    </div>
                  )}
                  {!question && <div className="mt-5 flex flex-wrap gap-2.5">{acts}</div>}
                </div>
              </>
            )
          )}

          {screen === "shutoff" && (
            <>
              <H2>{t.shutoff.title}</H2>
              <p className={`mt-3 text-[18px] ${sub}`}>{t.shutoff.text}</p>
              <ol className="mt-6 list-decimal space-y-3 pl-6 text-[17px] leading-snug">{t.shutoff.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <Btn kind="pri" onClick={() => { setRes((r) => (r ? { ...r, stopped: "yes" } : understand("water", "water"))); setAsked({ running: "no" }); go("result"); }}>{t.shutoff.done}</Btn>
                <Btn kind="call" href={tel}>{t.shutoff.call}</Btn>
              </div>
            </>
          )}

          {screen === "contact" && (
            <>
              <Kick>{stepLine}</Kick>
              {step === 1 && (
                <>
                  <H2>{t.contact.when}</H2>
                  <p className={`mt-3 text-[18px] ${sub}`}>{t.contact.whenText}</p>
                  <div className="mt-6 grid gap-2">{t.contact.times.map((x) => <button key={x} type="button" onClick={() => { setContact({ ...contact, time: x }); setStep(2); }} className={`min-h-[54px] rounded-[2px] border px-5 text-left text-[17px] font-semibold ${contact.time === x ? "border-current" : "border-charcoal-mute"}`}>{x}</button>)}</div>
                </>
              )}
              {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                  <H2>{t.contact.where}</H2>
                  <p className={`mt-3 text-[18px] ${sub}`}>{t.contact.whereText}</p>
                  <label className="sr-only" htmlFor="ona-addr">{t.contact.where}</label>
                  <input id="ona-addr" autoFocus value={contact.addr} onChange={(e) => setContact({ ...contact, addr: e.target.value })} placeholder={t.contact.wherePlaceholder} autoComplete="street-address" className="mt-6 h-[58px] w-full rounded-[2px] border border-charcoal-mute bg-charcoal px-4 text-[18px] text-ivory outline-none focus:border-teal" />
                  <div className="mt-5 flex"><button type="submit" className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-[2px] bg-brand font-bold text-charcoal">{t.contact.next}</button></div>
                </form>
              )}
              {step === 3 && (
                <form onSubmit={(e) => { e.preventDefault(); void send(); }}>
                  <H2>{t.contact.who}</H2>
                  <p className={`mt-3 text-[18px] ${sub}`}>{t.contact.whoText}</p>
                  <label className="sr-only" htmlFor="ona-name">{t.contact.namePlaceholder}</label>
                  <input id="ona-name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder={t.contact.namePlaceholder} autoComplete="name" className="mt-6 h-[58px] w-full rounded-[2px] border border-charcoal-mute bg-charcoal px-4 text-[18px] text-ivory outline-none focus:border-teal" />
                  <label className="sr-only" htmlFor="ona-phone">{t.contact.phonePlaceholder}</label>
                  <input id="ona-phone" autoFocus type="tel" value={contact.phone} onChange={(e) => { setErr(""); setContact({ ...contact, phone: e.target.value }); }} placeholder={t.contact.phonePlaceholder} autoComplete="tel" className="mt-2.5 h-[58px] w-full rounded-[2px] border border-charcoal-mute bg-charcoal px-4 text-[18px] text-ivory outline-none focus:border-teal" />
                  {err && <p className="mt-2 font-semibold text-coral">{err}</p>}
                  <div className="mt-5 flex"><button type="submit" disabled={sending} className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-[2px] bg-brand font-bold text-charcoal disabled:opacity-60">{sending ? t.contact.sending : t.contact.send}</button></div>
                </form>
              )}
            </>
          )}

          {(screen === "sent" || screen === "failed") && (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <H2>{screen === "sent" ? t.sent.title : t.sent.failTitle}</H2>
              <p className={`mt-3 max-w-md text-[18px] ${sub}`}>{screen === "sent" ? t.sent.text : t.sent.failText}</p>
              <div className="mt-8 flex w-full max-w-md flex-wrap gap-2.5"><Btn kind="call" href={tel}>{t.call}</Btn><Btn onClick={close}>{t.sent.back}</Btn></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
