"use client";

import { useState } from "react";
import { safety } from "@/lib/intake/understand";
import { fillVarsDeep } from "@/lib/placeholders";
import type newContent from "@/content/pages/new.json";

// The four ways in on /new. Picking one swaps the list for a short panel in
// the same place; a call-back takes a phone and a ZIP, nothing else is
// required. Two clicks from the page to a sent request. The confirmation
// says the request was received — not that anyone is booked — because a
// visit is only confirmed once a person has called.
// Words: content/pages/new.json (doors, panel, done). The safety steps stay
// in code (lib/intake/understand.ts) so the admin can't soften them.

type C = typeof newContent;
type Door = "happened" | "rebuild" | "remodel" | "existing";
const DOORS: Door[] = ["happened", "rebuild", "remodel", "existing"];

const field =
  "h-14 w-full min-w-0 rounded-[2px] border border-charcoal-mute bg-charcoal px-4 text-[18px] text-ivory outline-none focus:border-teal";

export function Doors({ hero, doors, panel, done, phone, phoneDisplay, email, cities }: {
  hero: C["hero"]; doors: C["doors"]; panel: C["panel"]; done: C["done"];
  phone: string; phoneDisplay: string; email: string;
  cities: { name: string; zips: string[] }[];
}) {
  const [door, setDoor] = useState<Door | null>(null);
  const [form, setForm] = useState(false);
  const [v, setV] = useState({ phone: "", zip: "", note: "", room: "" });
  const [err, setErr] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const tel = `tel:${phone}`;
  const city = /^\d{5}$/.test(v.zip) ? cities.find((c) => c.zips.includes(v.zip))?.name : undefined;
  const hazards = door === "happened" ? safety(v.note) : [];

  const reset = () => { setDoor(null); setForm(false); setV({ phone: "", zip: "", note: "", room: "" }); setErr(""); setState("idle"); };
  const pick = (d: Door) => { setDoor(d); setForm(d !== "happened"); setErr(""); };

  const send = async () => {
    if (v.phone.replace(/\D/g, "").length < 10) return setErr(panel.needPhone);
    if (door !== "existing" && !/^\d{5}$/.test(v.zip.trim())) return setErr(panel.needZip);
    setErr(""); setState("sending");
    const fields: Record<string, string> = {
      source: "new-homepage-doors",
      need: door ?? "",
      phone: v.phone.trim(),
      zip: v.zip.trim(),
      ...(city ? { city } : {}),
      ...(v.room ? { room: v.room } : {}),
      ...(v.note.trim() ? { note: v.note.trim() } : {}),
      ...(hazards.length ? { hazards: hazards.map((h) => h.id).join(",") } : {}),
    };
    try {
      const r = await fetch("/api/start-project", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(fields) });
      if (!r.ok) throw new Error(String(r.status));
      setState("sent");
    } catch {
      setState("failed");
      const body = Object.entries(fields).map(([k, x]) => `${k}: ${x}`).join("\n");
      window.location.href = `mailto:${email}?subject=${encodeURIComponent("Call-back request from onarestore.com/new")}&body=${encodeURIComponent(body)}`;
    }
  };

  /* ── after sending ── */
  if (state === "sent" || state === "failed") {
    const sent = state === "sent";
    const rows: [string, string][] = [
      [done.rows.need, door ? doors[door].title : ""],
      [done.rows.phone, v.phone],
      ...(v.zip ? [[done.rows.zip, city ? `${v.zip} · ${city}` : v.zip] as [string, string]] : []),
      ...(v.room ? [[done.rows.room, v.room] as [string, string]] : []),
      ...(v.note.trim() ? [[done.rows.note, v.note.trim()] as [string, string]] : []),
    ];
    const mail = `mailto:${email}?subject=${encodeURIComponent(`Photos — ${v.phone}`)}`;
    return (
      <div className="mt-8" aria-live="polite">
        <h2 className="text-[clamp(30px,4vw,46px)] font-semibold leading-[1.04] tracking-[-0.03em]">{sent ? done.title : done.failTitle}</h2>
        <p className="mt-3 max-w-[560px] text-[18px] leading-relaxed text-warm-gray-deep">{sent ? (door === "existing" ? done.linkText : done.text) : fillVarsDeep(done.failText, { phone: phoneDisplay })}</p>
        <dl className="mt-6 max-w-[560px] border-t border-warm-gray-deep/30">
          {rows.map(([k, x]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-warm-gray-deep/30 py-3"><dt className="text-warm-gray-deep">{k}</dt><dd className="text-right font-semibold">{x}</dd></div>
          ))}
        </dl>
        {sent && door !== "existing" && (
          <div className="mt-6 max-w-[560px]">
            <a href={mail} className="inline-flex h-14 items-center rounded-[2px] bg-charcoal px-6 text-[17px] font-bold text-brand">{done.photos}</a>
            <p className="mt-2 text-[14px] text-warm-gray-deep">{done.photosText}</p>
          </div>
        )}
        <p className="mt-6 text-[16px]">{fillVarsDeep(done.urgent, { phone: phoneDisplay })}</p>
        <button type="button" onClick={reset} className="mt-4 text-[15px] font-semibold underline underline-offset-4">{done.again}</button>
      </div>
    );
  }

  /* ── the four doors ── */
  if (!door) {
    return (
      <div className="mt-8">
        <h2 className="text-[22px] font-semibold">{hero.ask}</h2>
        <ul className="mt-4 border-t border-warm-gray-deep/30">
          {DOORS.map((d) => (
            <li key={d}>
              <button type="button" onClick={() => pick(d)} className="group flex w-full items-center justify-between gap-4 border-b border-warm-gray-deep/30 py-5 text-left">
                <span>
                  <b className="block text-[clamp(22px,2.6vw,30px)] font-semibold leading-tight tracking-[-0.02em]">{doors[d].title}</b>
                  <span className="mt-1 block text-[16px] text-warm-gray-deep">{doors[d].text}</span>
                </span>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="flex-none transition-transform group-hover:translate-x-1"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  /* ── one panel, in the same place ── */
  const p = panel[door];
  const noteLabel = door === "happened" ? panel.note : panel.noteRebuild;
  const notePh = door === "happened" ? panel.notePlaceholder : panel.noteRebuildPlaceholder;
  return (
    <div className="mt-8">
      <button type="button" onClick={reset} className="text-[15px] font-semibold text-warm-gray-deep underline underline-offset-4">← {hero.back}</button>
      <p className="mt-4 text-[14px] font-semibold uppercase tracking-[0.06em] text-warm-gray-deep">{doors[door].title}</p>
      <h2 className="mt-1 text-[clamp(30px,4vw,46px)] font-semibold leading-[1.04] tracking-[-0.03em]">{p.title}</h2>
      <p className="mt-3 max-w-[560px] text-[18px] leading-relaxed text-warm-gray-deep">{p.text}</p>

      {door === "happened" && !form && (
        <div className="mt-6 grid max-w-[560px] gap-2.5 sm:grid-cols-2">
          <a href={tel} className="flex h-16 items-center justify-center rounded-[2px] bg-coral text-[18px] font-bold text-charcoal hover:bg-coral-deep">{panel.callNow}</a>
          <button type="button" onClick={() => setForm(true)} className="h-16 rounded-[2px] bg-charcoal text-[18px] font-bold text-ivory hover:bg-charcoal-soft">{panel.callMe}</button>
        </div>
      )}

      {form && (
        <form className="mt-6 max-w-[560px]" onSubmit={(e) => { e.preventDefault(); void send(); }} noValidate>
          {door === "remodel" && (
            <fieldset className="mb-4">
              <legend className="text-[15px] font-semibold">{panel.roomLabel}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {panel.rooms.map((r) => (
                  <button key={r} type="button" aria-pressed={v.room === r} onClick={() => setV({ ...v, room: r })}
                    className={`h-12 rounded-full px-5 text-[16px] font-bold ${v.room === r ? "bg-charcoal text-ivory" : "border border-warm-gray-deep"}`}>{r}</button>
                ))}
              </div>
            </fieldset>
          )}
          <div className={`grid gap-2.5 ${door === "existing" ? "" : "grid-cols-[1fr_8.5rem]"}`}>
            <label className="block min-w-0">
              <span className="text-[15px] font-semibold">{panel.phone}</span>
              <input type="tel" autoComplete="tel" autoFocus value={v.phone} onChange={(e) => { setErr(""); setV({ ...v, phone: e.target.value }); }} placeholder={panel.phonePlaceholder} className={`mt-1.5 ${field}`} />
            </label>
            {door !== "existing" && (
              <label className="block min-w-0">
                <span className="text-[15px] font-semibold">{panel.zip}</span>
                <input inputMode="numeric" autoComplete="postal-code" maxLength={5} value={v.zip} onChange={(e) => { setErr(""); setV({ ...v, zip: e.target.value.replace(/\D/g, "") }); }} placeholder={panel.zipPlaceholder} className={`mt-1.5 ${field}`} />
              </label>
            )}
          </div>
          {city && <p className="mt-2 text-[15px]"><b>{city}</b> <span>{panel.inArea}</span></p>}
          {door !== "existing" && door !== "remodel" && (
            <label className="mt-4 block">
              <span className="text-[15px] font-semibold">{noteLabel}</span>
              <textarea rows={2} value={v.note} onChange={(e) => setV({ ...v, note: e.target.value })} placeholder={notePh} className="mt-1.5 w-full rounded-[2px] border border-charcoal-mute bg-charcoal p-4 text-[17px] text-ivory outline-none focus:border-teal" />
            </label>
          )}
          {hazards.length > 0 && (
            <div className="mt-4 border-l-4 border-coral-bright bg-[#170c07] p-4 text-charcoal" role="alert">
              <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-coral-bright">{panel.hazardKicker}</p>
              <b className="mt-1 block text-[20px]">{hazards.map((h) => h.title).join(" + ")}</b>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-[16px]">{Array.from(new Set(hazards.flatMap((h) => h.steps))).map((s) => <li key={s}>{s}</li>)}</ol>
              <a href="tel:911" className="mt-3 inline-flex h-11 items-center rounded-[2px] bg-coral-bright px-5 font-bold text-ivory">{panel.call911}</a>
            </div>
          )}
          {err && <p className="mt-3 font-semibold text-coral-bright" role="alert">{err}</p>}
          <button type="submit" disabled={state === "sending"} className="mt-5 h-16 w-full rounded-[2px] bg-charcoal text-[18px] font-bold text-brand disabled:opacity-60">
            {state === "sending" ? panel.sending : door === "existing" ? panel.sendLink : panel.send}
          </button>
        </form>
      )}
    </div>
  );
}

/** See a real job · Meet your team · Questions — opened in place, nothing auto-opens. */
export function ProofTabs({ tabs, job, team, faq }: {
  tabs: C["proof"]["tabs"];
  job: React.ReactNode; team: React.ReactNode;
  faq: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<"job" | "team" | "faq" | null>(null);
  const keys = ["job", "team", "faq"] as const;
  return (
    <section className="border-b border-charcoal-mute bg-charcoal">
      <div className="mx-auto max-w-[1320px] px-5 lg:px-10">
        <div role="tablist" className="flex gap-1 overflow-x-auto py-4">
          {keys.map((k) => (
            <button key={k} role="tab" type="button" aria-selected={open === k} onClick={() => setOpen(open === k ? null : k)}
              className={`h-12 flex-none rounded-full px-5 text-[16px] font-bold ${open === k ? "bg-brand text-charcoal" : "bg-charcoal-soft text-ivory hover:bg-charcoal-mute"}`}>
              {tabs[k]}
            </button>
          ))}
        </div>
        {open && (
          <div role="tabpanel" className="pb-12 pt-4">
            {open === "job" && job}
            {open === "team" && team}
            {open === "faq" && (
              <div className="max-w-[820px]">
                {faq.map((f) => (
                  <details key={f.q} className="group border-t border-charcoal-mute last:border-b">
                    <summary className="flex cursor-pointer list-none justify-between gap-4 py-5 text-[19px] font-bold">
                      <span>{f.q}</span><span aria-hidden className="text-teal group-open:hidden">+</span><span aria-hidden className="hidden text-teal group-open:inline">–</span>
                    </summary>
                    <p className="mb-5 leading-relaxed text-warm-gray">{f.a}</p>
                  </details>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
