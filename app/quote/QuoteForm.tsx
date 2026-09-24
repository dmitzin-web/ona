"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitQuote, type QuoteFormState } from "./actions";
import { plausibleEvent } from "@/lib/analytics";

// The form's words come from content/pages/quote.json (admin → Quote
// request page), passed in by the page with placeholders already filled.
// The damage-type codes (water, fire …) are what the server checks
// (actions.ts) and stay here; only their labels are editable. The hidden
// anti-spam field is not copy and stays as it is.
//
// ── Why three steps ───────────────────────────────────────────
// Same fields, same payload, same server action — shown three at a
// time instead of eleven at once. A person who has just found water
// in their basement abandons a long form; they will answer "what
// happened" and keep going.
//
// Every input stays mounted the whole time, so nothing typed on step
// one is lost and the submit posts the complete form. That also means
// no `required` on the inputs that can be off-screen at submit time —
// a hidden required field makes the browser refuse to submit with
// nothing focusable to point at. Steps one and two are checked here
// on "Next"; the server re-checks everything regardless (actions.ts),
// and if it comes back with an error we jump to the step it belongs to.
type Copy = (typeof import("@/content/pages/quote.json"))["form"];

const initial: QuoteFormState = {};

// Which step each server-side error lives on, so an error never lands
// on a hidden field.
const STEP_OF: Record<string, number> = {
  damageType: 0,
  description: 0,
  name: 2,
  phone: 2,
  email: 2,
  phoneOrEmail: 2,
  consent: 2,
};

const DAMAGE_CODES = ["water", "fire", "mold", "storm", "other"] as const;

export function QuoteForm({ t }: { t: Copy }) {
  const [state, formAction, pending] = useActionState(submitQuote, initial);
  const [step, setStep] = useState(0);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const form = useRef<HTMLFormElement>(null);

  // A server error on a step the reader has moved past is invisible
  // otherwise — walk back to the first step that has one.
  useEffect(() => {
    const keys = Object.keys(state.errors ?? {});
    if (keys.length === 0) return;
    const first = Math.min(...keys.map((k) => STEP_OF[k] ?? 2));
    setStep(first);
  }, [state]);

  const errors = { ...localErrors, ...(state.errors ?? {}) } as Record<string, string>;

  const inputClass =
    "mt-2 block w-full border border-ivory/20 bg-charcoal px-4 py-3 text-base text-ivory placeholder:text-ivory/64 focus:border-ivory focus:outline-none";
  const labelClass = "block text-sm font-medium text-ivory";
  const errorClass = "mt-2 text-sm text-red-700";

  function validateStep(n: number) {
    const data = new FormData(form.current!);
    const next: Record<string, string> = {};
    if (n === 0) {
      if (!data.get("damageType")) next.damageType = t.errors.damageType;
      if (String(data.get("description") ?? "").trim().length < 10) {
        next.description = t.errors.description;
      }
    }
    setLocalErrors(next);
    return Object.keys(next).length === 0;
  }

  const stepTitles = [t.stepper.title1, t.stepper.title2, t.stepper.title3];

  return (
    <form ref={form} action={formAction} className="space-y-6">
      {/* Honeypot — hidden from humans, irresistible to bots.
          aria-hidden + tabIndex on the input itself, plus inert on the
          wrapper so AT skip it entirely. */}
      <div
        aria-hidden="true"
        // @ts-expect-error — `inert` is in HTML spec but missing from older
        // React types; works in all evergreen browsers.
        inert=""
        style={{ position: "absolute", left: "-9999px", height: 0, width: 0 }}
      >
        <label>
          Company website
          <input
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
        </label>
      </div>

      <div>
        <div className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 rounded-[2px] ${i <= step ? "bg-gold" : "bg-line"}`}
            />
          ))}
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <p className="eyebrow text-warm-gray">
            {t.stepper.label.replace("{n}", String(step + 1))}
          </p>
          <p className="text-[14px] font-medium text-ivory">{stepTitles[step]}</p>
        </div>
      </div>

      {/* ── Step 1 — what happened ─────────────────────────── */}
      <div hidden={step !== 0} className="space-y-6">
        <fieldset>
          <legend className={labelClass}>
            {t.damageType.label}{" "}
            <span className="text-ivory/64">{t.damageType.mark}</span>
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {DAMAGE_CODES.map((code) => (
              <label
                key={code}
                className="relative flex cursor-pointer items-center gap-2 border border-ivory/20 px-4 py-3 text-[15px] text-ivory transition hover:border-ivory/40 has-[:checked]:border-gold has-[:checked]:bg-gold/5"
              >
                <input
                  type="radio"
                  name="damageType"
                  value={code}
                  className="h-4 w-4 accent-[var(--color-gold)]"
                  onChange={() => setLocalErrors((e) => ({ ...e, damageType: "" }))}
                />
                {t.damageType.options[code]}
              </label>
            ))}
          </div>
          {errors.damageType && (
            <p id="damageType-error" className={errorClass}>
              {errors.damageType}
            </p>
          )}
        </fieldset>

        <div>
          <label htmlFor="description" className={labelClass}>
            {t.description.label}{" "}
            <span className="text-ivory/64">{t.description.mark}</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            minLength={10}
            maxLength={4000}
            placeholder={t.description.placeholder}
            className={`${inputClass} resize-y`}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {errors.description && (
            <p id="description-error" className={errorClass}>
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* ── Step 2 — the property ──────────────────────────── */}
      <div hidden={step !== 1} className="space-y-6">
        <div>
          <label htmlFor="address" className={labelClass}>
            {t.address.label}
          </label>
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            placeholder={t.address.placeholder}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="photos" className={labelClass}>
            {t.photos.label}
          </label>
          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            className="mt-2 block w-full text-sm text-ivory/90 file:mr-4 file:border file:border-ivory/30 file:bg-charcoal file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory hover:file:bg-charcoal-soft"
          />
          <p className="mt-2 text-xs text-warm-gray">{t.photos.help}</p>
        </div>
      </div>

      {/* ── Step 3 — how we reach you ──────────────────────── */}
      <div hidden={step !== 2} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              {t.name.label} <span className="text-ivory/64">{t.name.mark}</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required={step === 2}
              className={inputClass}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className={errorClass}>
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              {t.phone.label} <span className="text-ivory/64">{t.phone.mark}</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t.phone.placeholder}
              className={inputClass}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className={errorClass}>
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            {t.email.label} <span className="text-ivory/64">{t.email.mark}</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className={inputClass}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className={errorClass}>
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3 border-t border-ivory/15 pt-6">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required={step === 2}
            className="mt-1 h-4 w-4 border-ivory/30"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-ivory/90">
            {t.consent.beforeLink}{" "}
            <a href="/privacy" className="underline hover:text-ivory">
              {t.consent.linkText}
            </a>
            {t.consent.afterLink}
          </label>
        </div>
        {errors.consent && (
          <p id="consent-error" className={errorClass}>
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => {
              setLocalErrors({});
              setStep((s) => s - 1);
            }}
            className="text-[14px] text-warm-gray underline-offset-4 hover:text-ivory hover:underline"
          >
            {t.stepper.back}
          </button>
        )}

        {step < 2 ? (
          <button
            type="button"
            onClick={() => {
              if (validateStep(step)) setStep((s) => s + 1);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-gold px-7 py-3.5 text-[14px] font-medium text-white transition hover:bg-gold-deep"
          >
            {t.stepper.next}
            <span aria-hidden>→</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className={`${plausibleEvent.quoteSubmit} inline-flex w-full items-center justify-center gap-3 border border-ivory bg-charcoal px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-ivory disabled:opacity-60 sm:w-auto`}
          >
            {pending ? t.sending : t.submit}
          </button>
        )}
      </div>
    </form>
  );
}
