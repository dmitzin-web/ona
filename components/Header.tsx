"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { site } from "@/lib/site";

// ─────────────────────────────────────────────────────────────
// Header — Project File concept
// ────────────────────────────────────────────────────────────
// Sticky charcoal bar with five nav items, two CTAs on the
// right (gold phone pill + outlined "Start a project"), plus
// the quiet Ask ONA button that dispatches the existing
// askona:open event.
//
// Mobile menu is a React-state-driven drawer. The earlier
// implementation used a native <details> + <summary> for
// JS-free toggling, but that approach was fragile under
// Tailwind (any class with `display: flex` or `display: grid`
// on a child of <details> overrides the UA stylesheet's
// hidden state and breaks the toggle on iOS Safari). The
// state-driven version gives us reliable open/close plus
// body-scroll lock and ESC-to-close as nice-to-haves.

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
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  // Close the mobile drawer on route change. Pathname is a
  // dep on this effect, so navigating to any new URL fires it.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Body-scroll lock + ESC-to-close while the drawer is open.
  // We only touch document/body once on mount-with-open and clean
  // up on close, so multiple drawers (Ask ONA, mobile menu)
  // don't fight each other.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-ivory/10 bg-charcoal/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight text-ivory"
          onClick={closeMenu}
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

          {/* Mobile burger — React-state-driven toggle. */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-nav"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
            className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-ivory/10 text-ivory transition hover:border-ivory/40 lg:hidden"
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Menu"}
            </span>
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 block h-px w-5 bg-current transition-transform duration-200 ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[6px] block h-px w-5 bg-current transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[12px] block h-px w-5 bg-current transition-transform duration-200 ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer — rendered when menuOpen is true. Solid
          bg-charcoal so neither the page content nor the
          MobileStickyBar bleeds through. z-50 keeps it above
          both the sticky header (z-40) and the sticky bar
          (z-30). */}
      {menuOpen ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 top-[65px] bottom-0 z-50 overflow-y-auto bg-charcoal lg:hidden"
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
                        onClick={() => {
                          closeMenu();
                          openAskOna();
                        }}
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
                      onClick={closeMenu}
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
            {/* CTAs anchored to the bottom of the drawer via
                mt-auto. Safe-area-aware padding so the bottom
                button clears the iOS home indicator. */}
            <div
              className="mt-auto grid gap-3 pt-6"
              style={{
                paddingBottom:
                  "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
              }}
            >
              <a
                href={`tel:${site.phone}`}
                onClick={closeMenu}
                className="inline-flex w-full items-center justify-center rounded-full bg-gold px-4 py-4 text-[14px] font-medium text-white transition active:bg-gold-deep"
              >
                Call {site.phoneDisplay}
              </a>
              <Link
                href="/start-project"
                onClick={closeMenu}
                className="inline-flex w-full items-center justify-center rounded-full border border-ivory px-4 py-4 text-[14px] font-medium text-ivory transition active:bg-ivory active:text-charcoal"
              >
                Start a project
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
