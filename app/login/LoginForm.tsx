"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { vvon } from "@/lib/vvon/config";

// Login surface. Two paths to the same Supabase session cookie:
//
//   1. Google OAuth (signInWithOAuth) — the user clicks once, Supabase
//      bounces them through Google, then back to /auth/callback with a
//      code that the callback exchanges for a session. No password,
//      no email round-trip.
//
//   2. Magic-link email (signInWithOtp) — Supabase emails a one-tap
//      link. Click → /auth/callback → session.
//
// Both terminate at /auth/callback?code=... so the existing callback
// route handles them identically.

export function LoginForm() {
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/vvon/upload";
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setGoogleSubmitting(true);
    setError(null);

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        // queryParams.prompt=consent forces the Google account-picker every
        // time, which is what users expect on a public-facing login —
        // otherwise the browser silently re-uses whichever Google account
        // happened to be active.
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setGoogleSubmitting(false);
      setError(error.message);
    }
    // No setGoogleSubmitting(false) on success — the browser navigates
    // away to Google's consent screen and this component unmounts.
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-charcoal/15 p-8">
        <p className="eyebrow text-gold-deep">Check your inbox</p>
        <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight sm:text-4xl">
          We sent a magic link to{" "}
          <span className="font-medium">{email}</span>.
        </h2>
        <p className="mt-5 text-base leading-relaxed text-charcoal/75">
          Click the link in the email to finish signing in. The link
          expires in 1 hour and can only be used once. Didn&apos;t see it?
          Check your spam folder, then{" "}
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
            className="underline transition hover:text-charcoal"
          >
            try a different email
          </button>
          .
        </p>
      </div>
    );
  }

  const busy = submitting || googleSubmitting;

  return (
    <div className="space-y-6">
      {/* Google OAuth — primary path */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-3 border border-charcoal/25 bg-ivory px-6 py-3.5 text-sm font-medium text-charcoal transition hover:border-charcoal disabled:cursor-not-allowed disabled:opacity-50"
      >
        <GoogleGlyph className="h-4 w-4" />
        {googleSubmitting ? "Redirecting to Google…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-charcoal/10" aria-hidden="true" />
        <span className="eyebrow text-charcoal/45">or use email</span>
        <span className="h-px flex-1 bg-charcoal/10" aria-hidden="true" />
      </div>

      {/* Magic-link form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal">
            Your email <span className="text-charcoal/40">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 block w-full border border-charcoal/20 bg-ivory px-4 py-3 text-base text-charcoal placeholder:text-charcoal/40 focus:border-charcoal focus:outline-none"
          />
          <p className="mt-2 text-xs text-charcoal/55">
            We&apos;ll email you a one-tap link to sign in. No password needed.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="border border-red-700/40 bg-red-700/5 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-3 border border-charcoal bg-charcoal px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending link…" : "Email me a sign-in link"}
        </button>
      </form>

      <p className="border-t border-charcoal/15 pt-6 text-xs leading-relaxed text-charcoal/55">
        By continuing you acknowledge that {vvon.name}
        {vvon.symbol} provides informational analysis only and does not
        provide legal advice, public adjusting services, or guaranteed
        claim outcomes.
      </p>
    </div>
  );
}

// Google "G" mark — official multi-color SVG (the only style Google's
// brand guidelines permit for the OAuth button). Kept inline because
// it's the only place we use it.
function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.7 1.1 7.9 3l5.7-5.7A20 20 0 1 0 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3a12 12 0 0 1-19-5.5l-6.5 5A20 20 0 0 0 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
