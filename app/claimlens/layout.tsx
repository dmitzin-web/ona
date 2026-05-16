import Link from "next/link";
import { HeaderAuth } from "@/components/HeaderAuth";
import { ClaimLensWordmark } from "@/components/claimlens/ClaimLensWordmark";

// Product-area layout. Wraps every /claimlens/* route. Renders a thin
// auth/context strip directly under the global Header so the sign-in
// state and the product wordmark live where the product lives — not in
// the global navigation of the restoration company's marketing site.
//
// The strip is intentionally minimal: a wordmark on the left, a Sign in
// link or email + Sign out on the right. No background blur, no shadow.
// It reads as part of the page content, not a second navbar.
export default function ClaimLensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-line-light bg-ivory-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-10">
          <Link
            href="/claimlens"
            className="flex items-center gap-3 text-charcoal transition hover:opacity-80"
          >
            <span className="text-base font-medium tracking-tight">
              <ClaimLensWordmark tone="dark" />
            </span>
            <span className="hidden eyebrow text-charcoal/55 sm:inline">
              · AI claim review
            </span>
          </Link>
          <HeaderAuth tone="light" />
        </div>
      </div>
      {children}
    </>
  );
}
