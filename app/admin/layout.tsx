import type { Metadata } from "next";

// The content admin. Renders inside the root layout; the public site's
// chrome steps aside here (Header and AskOna return null on /admin, the
// status strip and footer are hidden by the `.ona-admin` rule in
// globals.css).
//
// force-dynamic: nothing under /admin may be prerendered or cached — every
// page depends on who is signed in and on the latest content in GitHub.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="ona-admin min-h-screen bg-charcoal-soft">{children}</div>;
}
