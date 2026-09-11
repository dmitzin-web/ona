import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { getStore } from "@/lib/admin/store";
import { signOutOfAdmin } from "../actions";

// Everything behind sign-in. This check guards the pages; the server
// actions in ../actions.ts each run their own, because an action can be
// called without this layout ever rendering.

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const devBypass = user.email === "dev@localhost";
  let storeKind: string;
  try {
    storeKind = getStore().kind;
  } catch {
    storeKind = "unconfigured";
  }

  return (
    <>
      <header className="border-b border-line bg-charcoal">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/admin" className="text-[15px] font-semibold text-ivory">
            Ona <span className="font-normal text-warm-gray">· Content admin</span>
          </Link>
          <div className="flex items-center gap-4 text-[13px]">
            {storeKind !== "github" && (
              <span className="rounded-[2px] bg-charcoal-mute px-2 py-0.5 font-mono text-[11px] text-ivory">
                {storeKind === "local" ? "LOCAL FILES — not the live site" : "NOT CONNECTED"}
              </span>
            )}
            <a href="/" target="_blank" rel="noopener" className="text-teal hover:underline">
              View site ↗
            </a>
            <span className="text-warm-gray">{user.name}</span>
            {!devBypass && (
              <form action={signOutOfAdmin}>
                <button type="submit" className="text-ivory hover:underline">
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </>
  );
}
