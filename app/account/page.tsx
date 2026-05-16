import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VvonWordmark } from "@/components/vvon/VvonWordmark";
import { buildMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { DeleteAccountForm } from "./DeleteAccountForm";
import { DeleteClaimButton } from "@/components/vvon/DeleteClaimButton";

export const metadata: Metadata = buildMetadata({
  title: "Your account",
  description: "Manage your Vvon account, view your claims, or delete your account.",
  path: "/account",
  noindex: true,
});

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/account");
  }

  // Surface a small dashboard: count of claims + most recent ones, so the
  // user has somewhere to land between upload and delete.
  const { data: claims, count } = await supabase
    .from("claims")
    .select("id, claim_type, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(10);

  const email = user.email ?? "(no email)";

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Account", href: "/account" },
        ]}
      />
      <section className="bg-ivory">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
          <p className="eyebrow text-charcoal/60">Your account</p>
          <h1 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            Account & data.
          </h1>

          <div className="mt-12 border border-line-light bg-ivory p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-charcoal/55">Signed in as</p>
                <p className="mt-2 text-lg font-medium tracking-tight">{email}</p>
              </div>
              <a
                href="/auth/signout"
                className="inline-flex items-center gap-2 border border-charcoal/30 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.22em] text-charcoal transition hover:border-charcoal"
              >
                Sign out
              </a>
            </div>
          </div>

          <div className="mt-10 border border-line-light bg-ivory p-8">
            <p className="eyebrow text-charcoal/55">
              <VvonWordmark tone="dark" /> claims
            </p>
            <p className="mt-2 text-3xl font-light tracking-tight">
              {count ?? 0}{" "}
              <span className="text-charcoal/60">total</span>
            </p>
            {claims && claims.length > 0 ? (
              <ul className="mt-6 space-y-px overflow-hidden border border-line-light bg-line-light">
                {claims.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-3 bg-ivory p-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-charcoal">
                        {c.claim_type[0].toUpperCase() + c.claim_type.slice(1)} claim
                      </p>
                      <p className="text-xs text-charcoal/55">
                        {new Date(c.created_at).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                        {" · "}
                        {c.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-5">
                      <Link
                        href={`/vvon/report/${c.id}`}
                        className="eyebrow text-charcoal/70 transition hover:text-charcoal"
                      >
                        Open report →
                      </Link>
                      <DeleteClaimButton claimId={c.id} size="sm" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-charcoal/60">
                You haven&apos;t analyzed any claims yet.{" "}
                <Link
                  href="/vvon/upload"
                  className="underline hover:text-charcoal"
                >
                  Start one →
                </Link>
              </p>
            )}
          </div>

          <div className="mt-16 border-t border-charcoal/15 pt-12">
            <DeleteAccountForm email={email} />
          </div>
        </div>
      </section>
    </>
  );
}
