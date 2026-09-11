import type { ReactNode } from "react";

// Building blocks for the admin forms. Plain and legible on purpose: the
// people using this are not developers, and every field says what it is
// for in a sentence.

export const inputCls =
  "w-full rounded-[2px] border border-line bg-charcoal px-3 py-2.5 text-[15px] text-ivory outline-none transition focus:border-teal focus:ring-1 focus:ring-teal disabled:bg-charcoal-soft disabled:text-warm-gray";

export function Field({
  label,
  hint,
  htmlFor,
  required,
  children,
  counter,
}: {
  label: string;
  hint?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  counter?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[14px] font-medium text-ivory">
          {label}
          {required && <span className="ml-0.5 text-coral">*</span>}
        </label>
        {counter && <span className="font-mono text-[11px] text-warm-gray">{counter}</span>}
      </div>
      {hint && <p className="text-[13px] leading-snug text-warm-gray">{hint}</p>}
      {children}
    </div>
  );
}

export function Section({ title, hint, children }: { title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[2px] border border-line bg-charcoal p-6">
      <h2 className="text-[17px] font-semibold text-ivory">{title}</h2>
      {hint && <p className="mt-1 text-[13px] text-warm-gray">{hint}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export const btnPrimary =
  "inline-flex items-center justify-center rounded-[2px] bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-brand-2 disabled:opacity-60";
export const btnSecondary =
  "inline-flex items-center justify-center rounded-[2px] border border-line bg-charcoal px-3 py-2 text-[13px] font-medium text-ivory transition hover:border-ivory/40";
export const btnIcon =
  "inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-line bg-charcoal text-[13px] text-ivory transition hover:border-ivory/40 disabled:opacity-30";
export const btnDanger =
  "inline-flex items-center justify-center rounded-[2px] border border-coral/50 px-4 py-2 text-[13px] font-medium text-coral-deep transition hover:bg-coral hover:text-white";

export function Errors({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null; // legal-only stops carry an empty list
  return (
    <div role="alert" className="rounded-[2px] border border-coral/40 bg-coral/5 p-4">
      <p className="text-[14px] font-semibold text-coral-deep">Not published — fix these first:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-ivory">
        {errors.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

// The legal constraints that live in CLAUDE.md, in the words an editor
// needs at the moment of writing.
export function Rules({ kind }: { kind: "post" | "work" }) {
  return (
    <aside className="rounded-[2px] border border-teal/30 bg-teal/5 p-4 text-[13px] leading-relaxed text-ivory">
      <p className="font-semibold">Before you publish</p>
      {kind === "post" ? (
        <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
          <li>Never say we are licensed, registered or bonded in Oregon — that registration is still pending.</li>
          <li>Never write “bonded and insured”. Washington law does not allow it in our advertising.</li>
          <li>Never offer to cover, waive or absorb a customer’s deductible.</li>
          <li>No response-time promises, review counts or project numbers we cannot prove.</li>
        </ul>
      ) : (
        <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
          <li>Our own finished work only — never stock photos, never another contractor’s.</li>
          <li>The caption lists only what you can see in this photo.</li>
          <li>No materials, brands, sizes, timelines, prices, addresses or client names.</li>
        </ul>
      )}
    </aside>
  );
}

// Shown when the server's legal guard stopped a save. The editor reads what
// was caught and why, then either fixes the text or ticks the box and
// publishes again — the acknowledgement is recorded in the commit message.
export function LegalWarning({
  findings,
  ack,
  onAck,
}: {
  findings?: { rule: string; excerpt: string }[];
  ack: boolean;
  onAck: (v: boolean) => void;
}) {
  if (!findings?.length) return null;
  return (
    <div role="alert" className="rounded-[2px] border border-coral/50 bg-coral/5 p-4 text-[14px] text-ivory">
      <p className="font-semibold text-coral-deep">Not published — this text may break our legal rules:</p>
      <ul className="mt-2 space-y-2">
        {findings.map((f) => (
          <li key={f.rule + f.excerpt}>
            <span className="block italic">“{f.excerpt}”</span>
            <span className="block text-[13px] text-warm-gray">{f.rule}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px]">Best: change the wording. If you are sure it is correct:</p>
      <label className="mt-2 flex items-center gap-2 text-[13px] font-medium">
        <input type="checkbox" checked={ack} onChange={(e) => onAck(e.target.checked)} />
        I have read this and want to publish anyway
      </label>
    </div>
  );
}
