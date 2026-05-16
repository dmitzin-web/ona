"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// Tiny auth UI strip used by the desktop header. Shows "Sign in" when
// logged out, the user's email + a Sign-out link when logged in.
//
// We subscribe to onAuthStateChange so the header updates the instant a
// user signs in or out — no page reload required.
export function HeaderAuth({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Initial load.
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });

    // Live updates.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Suppress flicker before initial getUser() resolves.
  if (!ready) {
    return <span className="inline-block w-20" aria-hidden="true" />;
  }

  const linkClass =
    tone === "dark"
      ? "text-ivory/70 transition hover:text-ivory"
      : "text-charcoal/70 transition hover:text-charcoal";

  if (!email) {
    return (
      <Link href="/login" className={`eyebrow ${linkClass}`}>
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 eyebrow">
      <Link
        href="/account"
        className={linkClass}
        title={email}
      >
        {email.length > 22 ? email.slice(0, 20) + "…" : email}
      </Link>
      <a href="/auth/signout" className={linkClass}>
        Sign out
      </a>
    </div>
  );
}
