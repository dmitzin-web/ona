"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

// ─────────────────────────────────────────────────────────────
// Header — Project File concept
// ────────────────────────────────────────────────────────────
// Minimal sticky bar on a light surface. Five nav items, no
// dropdowns. Two CTAs on the right:
//   - Phone (accent green, primary)
//   - Start a project (ink outline, secondary)
// Ask ONA is kept as a quiet nav-stream button — it still
// dispatches the same window event so the existing AskOna
// drawer continues to work, but it doesn't shout.
//
// Mobile: native <details>/<summary> drawer, no JS state.

type NavItem =
  | { href: string; label: string; action?: never }
  | { action: "ask-ona"; label: string; href?: never };

const nav: NavItem[] = [
  { href: "/services", label: "Restoration" },
  { href: "/services/remodeling", label: "Remodeling" },
  { href: "/about", label: "How we work" },
  { href: "/blog", label: "Notes" },
  { href: "/contact", label: "Contact" },
  { action: "ask-ona", label: "✦ Ask ONA" },
];

function openAskOna() {
  window.dispatchEvent(new Event("askona:open"));
}

export function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="sticky top-0 z-40 border-b border-ivory/10 bg-charcoal/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight text-ivory"
        >
          ONA Restoration
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[14px] text-ivory/75">
            {nav.map((item, i) => {
              if ("action" in item) {
                return (
                  <li key="ask-ona">
                    <button
                      type="button"
                      onClick={openAskOna}
                      className="text-gold transition hover:text-gold"
                    >
                      {item.label}
                    </button>
                  </li>
                );
              }
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href ?? `nav-${i}`}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`transition ${
                      active ? "text-ivory" : "hover:text-ivory"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${site.phone}`}
            className="hidden rounded-full bg-gold px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-gold-deep sm:inline-flex"
          >
            {site.phoneDisplay}
          </a>
          <Link
            href="/start-project"
            className="hidden rounded-full border border-ivory px-5 py-2.5 text-[13px] font-medium text-ivory transition hover:bg-ivory hover:text-charcoal sm:inline-flex"
          >
            Start a project
          </Link>

          {/* Mobile burger */}
          <details className="group relative lg:hidden">
            <summary
              aria-label="Toggle menu"
              aria-controls="mobile-nav"
              className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-ivory/10 text-ivory transition hover:border-ivory/40 [&::-webkit-details-marker]:hidden"
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span className="absolute left-0 top-0 block h-px w-5 bg-current transition-transform duration-200 group-open:translate-y-[6px] group-open:rotate-45" />
                <span className="absolute left-0 top-[6px] block h-px w-5 bg-current transition-opacity duration-200 group-open:opacity-0" />
                <span className="absolute left-0 top-[12px] block h-px w-5 bg-current transition-transform duration-200 group-open:-translate-y-[6px] group-open:-rotate-45" />
              </span>
            </summary>

            {/* Mobile drawer — overlays everything below the sticky header
                down to the bottom of the viewport. Solid charcoal, not
                bg-charcoal/95, so neither the page content nor the
                MobileStickyBar bleed through. The peer group-open hides
                the sticky bar via the parent <details>[open] selector
                so the user sees only the drawer's own CTAs. */}
            {/* Mobile drawer.
                IMPORTANT: <nav> can only carry positional classes here.
                <details> hides non-<summary> children via a UA rule that
                sets display:none; if we put `flex` or `grid` directly
                on this element, Tailwind's higher-specificity class
                overrides the UA rule and the drawer stays permanently
                visible (or fails to toggle correctly across browsers).
                Layout / flex column lives on the inner wrapper. */}
            <nav
              id="mobile-nav"
              aria-label="Mobile primary"
              className="fixed inset-x-0 top-[65px] bottom-0 z-50 overflow-y-auto border-t border-ivory/10 bg-charcoal"
            >
              <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-6">
                <ul className="pt-2">
                  {nav.map((item, i) => {
                    if ("action" in item) {
                      return (
                        <li
                          key="ask-ona-mobile"
                          className="border-b border-ivory/10 last:border-b-0"
                        >
                          <button
                            type="button"
                            onClick={openAskOna}
                            className="flex w-full items-center justify-between py-5 text-[16px] font-medium tracking-tight text-gold transition"
                          >
                            <span>{item.label}</span>
                            <span
                              aria-hidden="true"
                              className="text-ivory/75"
                            >
                              →
                            </span>
                          </button>
                        </li>
                      );
                    }
                    const active =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                    return (
                      <li
                        key={item.href ?? `nav-mob-${i}`}
                        className="border-b border-ivory/10 last:border-b-0"
                      >
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center justify-between py-5 text-[16px] font-medium tracking-tight transition ${
                            active ? "text-ivory" : "text-ivory/80"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span
                            aria-hidden="true"
                            className="text-ivory/75"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {/* CTAs anchored to bottom of drawer via mt-auto on
                    the parent flex column. Safe-area-aware padding so
                    the buttons clear the iOS home indicator. */}
                <div
                  className="mt-auto grid gap-3 pt-6"
                  style={{
                    paddingBottom:
                      "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
                  }}
                >
                  <a
                    href={`tel:${site.phone}`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-gold px-4 py-4 text-[14px] font-medium text-white transition active:bg-gold-deep"
                  >
                    Call {site.phoneDisplay}
                  </a>
                  <Link
                    href="/start-project"
                    className="inline-flex w-full items-center justify-center rounded-full border border-ivory px-4 py-4 text-[14px] font-medium text-ivory transition active:bg-ivory active:text-charcoal"
                  >
                    Start a project
                  </Link>
                </div>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
