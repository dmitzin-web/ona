"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

// ─────────────────────────────────────────────────────────────
// Header — Project File concept
// ────────────────────────────────────────────────────────────
// Minimal bar. Nav items, no dropdowns. Two CTAs on the right:
//   - Phone (coral, primary, visible at every width; recoloured to
//     `flare` on wildfire pages by a :has() rule in globals.css)
//   - Start a project (ink outline, secondary, sm and up)
// Ask ONA is kept as a quiet nav-stream button — it still
// dispatches the same window event so the existing AskOna
// drawer continues to work, but it doesn't shout.
//
// STICKY LIVES IN app/layout.tsx, NOT HERE. The header and the
// deep-teal status strip above it are one sticky unit, so the
// dark edge is present at every scroll position. A header that
// stuck on its own was solid white sitting on white content with
// a 10%-opacity hairline — invisible, which is exactly the
// complaint that produced this change.
//
// Mobile: native <details>/<summary> drawer, no JS state.

type NavItem =
  | { href: string; label: string; mobileOnly?: boolean; action?: never }
  | { action: "ask-ona"; label: string; mobileOnly?: never; href?: never };

// Restoration leads: it's the line people search for mid-emergency and the
// one that drives phone calls. Remodeling is a months-long consideration
// purchase and reads fine further down the bar.
// `mobileOnly` keeps an item out of the desktop bar without removing it
// from the site's navigation. Fewer things in the bar makes the wordmark
// read larger; Contact is one tap away in the drawer, in the footer, and
// as the two buttons sitting immediately to the right of this list.
const nav: NavItem[] = [
  { href: "/services", label: "Restoration" },
  { href: "/services/mold-removal", label: "Mold" },
  { href: "/services/remodeling", label: "Remodeling" },
  { href: "/about", label: "How we work" },
  { href: "/blog", label: "Notes" },
  { href: "/contact", label: "Contact", mobileOnly: true },
  { action: "ask-ona", label: "Ask AI" },
];

function openAskOna() {
  window.dispatchEvent(new Event("askona:open"));
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  // Close the mobile drawer after a selection. The drawer is a native
  // <details>; client-side <Link> navigation doesn't reload the page, so
  // without this the menu stays open until you tap the X. Called on every
  // interactive item inside the drawer.
  function closeMobileMenu() {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
  }

  // Active-nav matching. Mold and Remodeling live under /services/* but
  // are their own top-level pillars, so the "/services" (Restoration) item
  // must NOT light up on those sub-paths — otherwise two items highlight.
  function isActive(href: string) {
    if (href === "/services") {
      return (
        pathname === "/services" ||
        (pathname.startsWith("/services/") &&
          !pathname.startsWith("/services/mold-removal") &&
          !pathname.startsWith("/services/remodeling"))
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    // Solid, not `bg-charcoal/90 backdrop-blur`. Blurring white content
    // through a 90% white bar produces a dirty grey that is neither the
    // page nor the chrome; opaque white under the teal strip is cleaner
    // and makes the strip's edge do all the separating work.
    // `border-line` is a real hairline (#dce7e5) — the old `ivory/10`
    // measured about 1.5% against white and could not be seen at all.
    // The shadow is the one on the site: a sticky bar is a genuine
    // physical layer above the scrolling page, which is the only case
    // the design brief allows a shadow for.
    <header className="border-b border-line bg-charcoal shadow-[0_10px_30px_-26px_rgba(23,33,36,0.65)]">
      {/* Tighter on phones. The strip and the bar are both pinned now, so
          every pixel here is permanently subtracted from the viewport. */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3 md:py-4 lg:px-10">
        <Logo variant="horizontal" tone="light" />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[14px] text-ivory/85">
            {nav.map((item, i) => {
              if (item.mobileOnly) return null;
              if ("action" in item) {
                return (
                  <li key="ask-ona">
                    <button
                      type="button"
                      onClick={openAskOna}
                      className="transition hover:text-ivory"
                    >
                      {item.label}
                    </button>
                  </li>
                );
              }
              const active = isActive(item.href);
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
          {/* The call button is visible at every width, including mobile,
              where it previously collapsed into the burger and left a
              restoration site with no reachable phone number on a phone.
              Below md it shows a pulse dot and "Call"; the full number
              appears once there's room for it.

              gold-deep, not gold: white on `gold` measures 2.73:1, which
              fails WCAG AA (4.5:1) at this size — it did before this button
              was enlarged too. `gold-deep` measures 4.7:1 and still reads as
              the brand accent. Darkening on hover only raises it. */}
          <a
            href={`tel:${site.phone}`}
            aria-label={`Call ${site.phoneDisplay}`}
            className="inline-flex items-center gap-2 rounded-[2px] bg-coral px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-90 md:px-5"
          >
            <span
              aria-hidden="true"
              className="ona-pulse h-1.5 w-1.5 flex-none rounded-full bg-white/90"
            />
            <span className="md:hidden">Call</span>
            <span className="hidden md:inline">{site.phoneDisplay}</span>
          </a>
          <Link
            href="/start-project"
            className="hidden rounded-[2px] border border-ivory px-5 py-2.5 text-[13px] font-medium text-ivory transition hover:bg-brand hover:text-charcoal sm:inline-flex"
          >
            Start a project
          </Link>

          {/* Mobile burger */}
          <details ref={mobileMenuRef} className="group relative lg:hidden">
            <summary
              aria-label="Toggle menu"
              aria-controls="mobile-nav"
              className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-line text-ivory transition hover:border-ivory/45 [&::-webkit-details-marker]:hidden"
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span className="absolute left-0 top-0 block h-px w-5 bg-current transition-transform duration-200 group-open:translate-y-[6px] group-open:rotate-45" />
                <span className="absolute left-0 top-[6px] block h-px w-5 bg-current transition-opacity duration-200 group-open:opacity-0" />
                <span className="absolute left-0 top-[12px] block h-px w-5 bg-current transition-transform duration-200 group-open:-translate-y-[6px] group-open:-rotate-45" />
              </span>
            </summary>

            {/* Drawer. Three CSS-only changes vs. the original —
                no JS, no structural changes, the <details>/<summary>
                toggle is untouched.
                  1. `hidden group-open:block` — visibility is now
                     EXPLICIT, driven by the parent <details open>
                     via the same `group` the burger-line animation
                     already uses. The original relied on the browser
                     hiding non-summary children of a closed <details>,
                     but that UA behavior is unreliable for a
                     `position: fixed` child — in some engines the
                     drawer stayed painted after closing. Explicit
                     hidden→block removes all doubt.
                  2. bg-charcoal/95 backdrop-blur → bg-charcoal:
                     solid, so page text no longer bleeds through.
                  3. max-h-[calc(100vh-65px)] → min-h-[calc(100dvh-65px)]:
                     the drawer fills the screen below the header
                     instead of sizing to its short content.
                  4. The 65px was the header's own height, from when the
                     header was the sticky element. It now sits under the
                     status strip inside a shared sticky wrapper, so the
                     offset is strip + header — published as --chrome-h in
                     globals.css, where the wildfire override that hides
                     the strip also shrinks it back. */}
            <nav
              id="mobile-nav"
              aria-label="Mobile primary"
              className="fixed inset-x-0 top-[var(--chrome-h)] z-40 hidden min-h-[calc(100dvh-var(--chrome-h))] overflow-y-auto border-t border-line bg-charcoal group-open:block"
            >
              <ul className="mx-auto max-w-7xl px-6 py-2">
                {nav.map((item, i) => {
                  if ("action" in item) {
                    return (
                      <li
                        key="ask-ona-mobile"
                        className="border-b border-line last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            closeMobileMenu();
                            openAskOna();
                          }}
                          className="flex w-full items-center justify-between py-4 text-[15px] font-medium tracking-tight text-gold transition"
                        >
                          <span>{item.label}</span>
                          <span aria-hidden="true" className="text-ivory/85">
                            →
                          </span>
                        </button>
                      </li>
                    );
                  }
                  const active = isActive(item.href);
                  return (
                    <li
                      key={item.href ?? `nav-mob-${i}`}
                      className="border-b border-line last:border-b-0"
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between py-4 text-[15px] font-medium tracking-tight transition ${
                          active ? "text-ivory" : "text-ivory/85"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span aria-hidden="true" className="text-ivory/85">
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
                <li className="grid gap-2 pt-3 pb-5">
                  <a
                    href={`tel:${site.phone}`}
                    onClick={closeMobileMenu}
                    className="inline-flex w-full items-center justify-center rounded-[2px] bg-coral px-4 py-3 text-[14px] font-semibold text-white"
                  >
                    Call {site.phoneDisplay}
                  </a>
                  <Link
                    href="/start-project"
                    onClick={closeMobileMenu}
                    className="inline-flex w-full items-center justify-center rounded-[2px] border border-ivory px-4 py-3 text-[13px] font-medium text-ivory"
                  >
                    Start a project
                  </Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
