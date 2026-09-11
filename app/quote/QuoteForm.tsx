"use client";

import { useActionState } from "react";
import { submitQuote, type QuoteFormState } from "./actions";
import { plausibleEvent } from "@/lib/analytics";

// The form's words come from content/pages/quote.json (admin → Quote
// request page), passed in by the page with placeholders already filled.
// The damage-type codes (water, fire …) are what the server checks
// (actions.ts) and stay here; only their labels are editable. The hidden
// anti-spam field is not copy and stays as it is.
type Copy = (typeof import("@/content/pages/quote.json"))["form"];

const initial: QuoteFormState = {};

export function QuoteForm({ t }: { t: Copy }) {
  const [state, formAction, pending] = useActionState(submitQuote, initial);

  const inputClass =
    "mt-2 block w-full border border-ivory/20 bg-charcoal px-4 py-3 text-base text-ivory placeholder:text-ivory/64 focus:border-ivory focus:outline-none";
  const labelClass = "block text-sm font-medium text-ivory";
  const errorClass = "mt-2 text-sm text-red-700";

  return (
    <form action={formAction} className="space-y-6">
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
            required
            className={inputClass}
            aria-invalid={!!state.errors?.name}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
          />
          {state.errors?.name && (
            <p id="name-error" className={errorClass}>
              {state.errors.name}
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
            aria-invalid={!!state.errors?.phone}
            aria-describedby={state.errors?.phone ? "phone-error" : undefined}
          />
          {state.errors?.phone && (
            <p id="phone-error" className={errorClass}>
              {state.errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
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
            aria-invalid={!!state.errors?.email}
            aria-describedby={state.errors?.email ? "email-error" : undefined}
          />
          {state.errors?.email && (
            <p id="email-error" className={errorClass}>
              {state.errors.email}
            </p>
          )}
        </div>
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
      </div>

      <div>
        <label htmlFor="damageType" className={labelClass}>
          {t.damageType.label} <span className="text-ivory/64">{t.damageType.mark}</span>
        </label>
        <select
          id="damageType"
          name="damageType"
          required
          defaultValue=""
          className={inputClass}
          aria-invalid={!!state.errors?.damageType}
          aria-describedby={
            state.errors?.damageType ? "damageType-error" : undefined
          }
        >
          <option value="" disabled>
            {t.damageType.placeholder}
          </option>
          <option value="water">{t.damageType.options.water}</option>
          <option value="fire">{t.damageType.options.fire}</option>
          <option value="mold">{t.damageType.options.mold}</option>
          <option value="storm">{t.damageType.options.storm}</option>
          <option value="other">{t.damageType.options.other}</option>
        </select>
        {state.errors?.damageType && (
          <p id="damageType-error" className={errorClass}>
            {state.errors.damageType}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          {t.description.label} <span className="text-ivory/64">{t.description.mark}</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          minLength={10}
          maxLength={4000}
          placeholder={t.description.placeholder}
          className={`${inputClass} resize-y`}
          aria-invalid={!!state.errors?.description}
          aria-describedby={
            state.errors?.description ? "description-error" : undefined
          }
        />
        {state.errors?.description && (
          <p id="description-error" className={errorClass}>
            {state.errors.description}
          </p>
        )}
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
        <p className="mt-2 text-xs text-ivory/72">
          {t.photos.help}
        </p>
      </div>

      <div className="flex items-start gap-3 border-t border-ivory/15 pt-6">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 border-ivory/30"
          aria-invalid={!!state.errors?.consent}
          aria-describedby={
            state.errors?.consent ? "consent-error" : undefined
          }
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-ivory/90">
          {t.consent.beforeLink}{" "}
          <a href="/privacy" className="underline hover:text-ivory">
            {t.consent.linkText}
          </a>
          {t.consent.afterLink}
        </label>
      </div>
      {state.errors?.consent && (
        <p id="consent-error" className={errorClass}>
          {state.errors.consent}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={`${plausibleEvent.quoteSubmit} inline-flex w-full items-center justify-center gap-3 border border-ivory bg-charcoal px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-ivory disabled:opacity-60 sm:w-auto`}
      >
        {pending ? t.sending : t.submit}
      </button>
    </form>
  );
}
