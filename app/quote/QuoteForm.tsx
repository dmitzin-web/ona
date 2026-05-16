"use client";

import { useActionState } from "react";
import { submitQuote, type QuoteFormState } from "./actions";
import { plausibleEvent } from "@/lib/analytics";

const initial: QuoteFormState = {};

export function QuoteForm() {
  const [state, formAction, pending] = useActionState(submitQuote, initial);

  const inputClass =
    "mt-2 block w-full border border-charcoal/20 bg-ivory px-4 py-3 text-base text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none";
  const labelClass = "block text-sm font-medium text-charcoal";
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
            Your name <span className="text-charcoal/40">*</span>
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
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(360) 555-0000"
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
            Email
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
            Property address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            placeholder="Street, City, State, ZIP"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="damageType" className={labelClass}>
          Damage type <span className="text-charcoal/40">*</span>
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
            Select…
          </option>
          <option value="water">Water damage</option>
          <option value="fire">Fire / smoke damage</option>
          <option value="mold">Mold / mildew</option>
          <option value="storm">Storm / wind / tree damage</option>
          <option value="other">Other</option>
        </select>
        {state.errors?.damageType && (
          <p id="damageType-error" className={errorClass}>
            {state.errors.damageType}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          What happened? <span className="text-charcoal/40">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          minLength={10}
          maxLength={4000}
          placeholder="When did it happen? What rooms or systems are affected? Have you spoken with your insurance yet?"
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
          Photos (optional, up to 8)
        </label>
        <input
          id="photos"
          name="photos"
          type="file"
          accept="image/*"
          multiple
          className="mt-2 block w-full text-sm text-charcoal/80 file:mr-4 file:border file:border-charcoal/30 file:bg-ivory file:px-4 file:py-2 file:text-sm file:font-medium file:text-charcoal hover:file:bg-ivory-soft"
        />
        <p className="mt-2 text-xs text-charcoal/60">
          A clear photo of the affected area helps us scope the job before we
          arrive.
        </p>
      </div>

      <div className="flex items-start gap-3 border-t border-charcoal/15 pt-6">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 border-charcoal/30"
          aria-invalid={!!state.errors?.consent}
          aria-describedby={
            state.errors?.consent ? "consent-error" : undefined
          }
        />
        <label htmlFor="consent" className="text-sm leading-relaxed text-charcoal/80">
          I agree to be contacted about my restoration request and acknowledge
          the{" "}
          <a href="/privacy" className="underline hover:text-charcoal">
            privacy policy
          </a>
          .
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
        className={`${plausibleEvent.quoteSubmit} inline-flex w-full items-center justify-center gap-3 border border-charcoal bg-charcoal px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal disabled:opacity-60 sm:w-auto`}
      >
        {pending ? "Sending…" : "Submit request"}
      </button>
    </form>
  );
}
