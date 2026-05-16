"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { PhoneLink } from "./contact/ContactLinks";
import { PhoneIcon } from "./icons/ServiceIcons";

// Primary navigation. Two kinds of entries:
//   - `link` (default): renders an <a> via next/link, target href required
//   - `action: "ask-ona"`: renders a button that opens the Ask ONA drawer
//     via the global "askona:open" window event. Used to put Ask ONA in
//     the nav stream rather than competing with Get a quote / phone CTAs.
//
// The mobile burger + drawer use a native <details>/<summary> pair so the
// toggle is a pure HTML behavior — no useState, no useEffect, no waiting on
// hydration. lg:hidden keeps it off desktop.

type NavItem =
  | { href: string; label: string; accent?: boolean; action?: never }
  | { action: "ask-ona"; label: string };

const nav: NavItem[] = [
  { href: "/services", label: "Services" },
  { href: "/vvon", label: "Vvon", accent: true },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { action: "ask-ona", label: "✦ Ask ONA" },
];

function openAskOna() {
  window.dispatchEvent(new Event("askona:open"));
}

export function Header() {
  const pathname = usePathname() ?? "/";

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal-mute bg-charcoal/95 text-ivory backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <Logo variant="horizontal" tone="light" />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9 eyebrow text-ivory/80">
            {nav.map((item, i) => {
              if ("action" in item) {
                return (
                  <li key="ask-ona">
                    <button
                      type="button"
                      onClick={openAskOna}
                      className="eyebrow text-gold-soft transition hover:text-gold"
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
                    className={`transition-colors ${
                      item.accent
                        ? active
                          ? "text-gold"
                          : "text-gold-soft hover:text-gold"
                        : active
                          ? "text-ivory"
                          : "hover:text-ivory"
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
          <Link
            href="/quote"
            className="hidden border border-ivory/30 px-4 py-2 text-sm font-medium text-ivory transition hover:border-ivory sm:inline-flex"
          >
            Get a quote
          </Link>
          <PhoneLink className="inline-flex items-center gap-2 border border-ivory bg-ivory px-4 py-2 text-sm font-medium text-charcoal transition hover:bg-transparent hover:text-ivory">
            <PhoneIcon />
            <span className="hidden sm:inline">{site.phoneDisplay}</span>
            <span className="sm:hidden">Call</span>
          </PhoneLink>

          {/* Burger — only renders below lg. */}
          <details className="group relative lg:hidden">
            <summary
              aria-label="Toggle menu"
              aria-controls="mobile-nav"
              className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center border border-ivory/30 text-ivory transition hover:border-ivory [&::-webkit-details-marker]:hidden"
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span className="absolute left-0 top-0 block h-px w-5 bg-current transition-transform duration-200 group-open:translate-y-[6px] group-open:rotate-45" />
                <span className="absolute left-0 top-[6px] block h-px w-5 bg-current transition-opacity duration-200 group-open:opacity-0" />
                <span className="absolute left-0 top-[12px] block h-px w-5 bg-current transition-transform duration-200 group-open:-translate-y-[6px] group-open:-rotate-45" />
              </span>
            </summary>

            <nav
              id="mobile-nav"
              aria-label="Mobile primary"
              className="fixed inset-x-0 top-[81px] z-40 max-h-[calc(100vh-81px)] overflow-y-auto border-t border-charcoal-mute bg-charcoal/95 backdrop-blur"
            >
              <ul className="mx-auto max-w-7xl px-6 py-2">
                {nav.map((item, i) => {
                  if ("action" in item) {
                    return (
                      <li
                        key="ask-ona-mobile"
                        className="border-b border-charcoal-mute last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={openAskOna}
                          className="flex w-full items-center justify-between py-4 text-base font-medium tracking-tight text-gold-soft transition"
                        >
                          <span>{item.label}</span>
                          <span aria-hidden="true" className="text-ivory/40">
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
                      className="border-b border-charcoal-mute last:border-b-0"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between py-4 text-base font-medium tracking-tight transition ${
                          item.accent
                            ? active
                              ? "text-gold"
                              : "text-gold-soft"
                            : active
                              ? "text-ivory"
                              : "text-ivory/80"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span aria-hidden="true" className="text-ivory/40">
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
                <li className="pt-3 pb-5">
                  <Link
                    href="/quote"
                    className="inline-flex w-full items-center justify-center border border-ivory/30 px-4 py-3 text-sm font-medium uppercase tracking-[0.22em] text-ivory transition hover:border-ivory"
                  >
                    Get a quote
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
