import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VvonWordmark } from "@/components/vvon/VvonWordmark";
import { LoginForm } from "./LoginForm";
import { buildMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Sign in to Vvon",
  description:
    "Sign in to Vvon to upload claim documents and run an AI-assisted analysis. Magic-link sign-in — no password needed.",
  path: "/login",
  noindex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // If the user is already signed in, send them where they meant to go.
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    const { next } = await searchParams;
    redirect(next ?? "/vvon/upload");
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Sign in", href: "/login" },
        ]}
      />
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10">
          <aside className="lg:col-span-5">
            <p className="eyebrow text-charcoal/60">Sign in</p>
            <h1 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
              Sign in to{" "}
              <span className="font-medium">
                <VvonWordmark tone="dark" />
              </span>
              .
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/75">
              Continue with Google for one-click sign-in, or use a
              magic link sent to your email. No password to remember
              either way. Your claim documents are tied to your account
              and only visible to you.
            </p>

            <ul className="mt-10 space-y-3 border-t border-charcoal/15 pt-8 text-sm text-charcoal/80">
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                <span>Private storage — only you can read your files.</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                <span>Sign in with Google or a one-tap email link.</span>
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                <span>Reports saved to your account for later reference.</span>
              </li>
            </ul>
          </aside>

          <div className="lg:col-span-7">
            <div className="border border-charcoal/15 bg-ivory p-8 lg:p-10">
              <Suspense fallback={<div className="text-sm text-charcoal/60">Loading…</div>}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
