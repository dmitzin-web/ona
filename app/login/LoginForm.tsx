"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { claimLens } from "@/lib/claimlens/config";

// Magic-link login form. Supabase emails the user a one-tap link that,
// when clicked, hits /auth/callback with a code, the callback exchanges
// the code for a session, and the user comes back to the page they
// originally tried to reach (the ?next= query param).
export function LoginForm() {
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/claimlens/upload";
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // After clicking the email link, Supabase appends ?code=... and
        // sends the user to this URL. Our callback exchanges the code
        // for a session and forwards them to `next`.
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

  return (
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
        disabled={submitting}
        className="inline-flex items-center gap-3 border border-charcoal bg-charcoal px-7 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:bg-transparent hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Sending link…" : "Email me a sign-in link"}
      </button>

      <p className="border-t border-charcoal/15 pt-6 text-xs leading-relaxed text-charcoal/55">
        By continuing you acknowledge that {claimLens.name}
        {claimLens.symbol} provides informational analysis only and does not
        provide legal advice, public adjusting services, or guaranteed
        claim outcomes.
      </p>
    </form>
  );
}
