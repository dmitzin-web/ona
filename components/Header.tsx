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
    <header className="sticky top-0 z-40 border-b border-line-light bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight text-charcoal"
        >
          ONA Restoration
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[14px] text-warm-gray-deep">
            {nav.map((item, i) => {
              if ("action" in item) {
                return (
                  <li key="ask-ona">
                    <button
                      type="button"
                      onClick={openAskOna}
                      className="text-gold transition hover:text-gold-deep"
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
                      active ? "text-charcoal" : "hover:text-charcoal"
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
            className="hidden rounded-full border border-charcoal px-5 py-2.5 text-[13px] font-medium text-charcoal transition hover:bg-charcoal hover:text-ivory sm:inline-flex"
          >
            Start a project
          </Link>

          {/* Mobile burger */}
          <details className="group relative lg:hidden">
            <summary
              aria-label="Toggle menu"
              aria-controls="mobile-nav"
              className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-line-light text-charcoal transition hover:border-charcoal [&::-webkit-details-marker]:hidden"
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
              className="fixed inset-x-0 top-[65px] z-40 max-h-[calc(100vh-65px)] overflow-y-auto border-t border-line-light bg-ivory/95 backdrop-blur"
            >
              <ul className="mx-auto max-w-7xl px-6 py-2">
                {nav.map((item, i) => {
                  if ("action" in item) {
                    return (
                      <li
                        key="ask-ona-mobile"
                        className="border-b border-line-light last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={openAskOna}
                          className="flex w-full items-center justify-between py-4 text-[15px] font-medium tracking-tight text-gold transition"
                        >
                          <span>{item.label}</span>
                          <span aria-hidden="true" className="text-warm-gray-deep">
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
                      className="border-b border-line-light last:border-b-0"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between py-4 text-[15px] font-medium tracking-tight transition ${
                          active ? "text-charcoal" : "text-warm-gray-deep"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span aria-hidden="true" className="text-warm-gray-deep">
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
                <li className="grid gap-2 pt-3 pb-5">
                  <a
                    href={`tel:${site.phone}`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-gold px-4 py-3 text-[13px] font-medium text-white"
                  >
                    Call {site.phoneDisplay}
                  </a>
                  <Link
                    href="/start-project"
                    className="inline-flex w-full items-center justify-center rounded-full border border-charcoal px-4 py-3 text-[13px] font-medium text-charcoal"
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
