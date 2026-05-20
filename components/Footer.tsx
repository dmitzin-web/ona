import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { Logo } from "./Logo";
import { EmailLink, PhoneLink } from "./contact/ContactLinks";

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 lg:px-10">
        <div className="md:col-span-4">
          <Logo variant="horizontal" tone="light" />
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-ivory/70">
            {site.shortDescription}
          </p>
          <div className="mt-8 space-y-1 text-sm text-ivory/80">
            <PhoneLink className="block text-ivory transition hover:text-warm-gray-soft">
              {site.phoneDisplay}
            </PhoneLink>
            <EmailLink className="block transition hover:text-ivory">
              {site.email}
            </EmailLink>
            <p className="pt-3 text-ivory/60">
              {site.address.locality}, {site.address.region} · Serving the
              Portland metro
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow text-ivory/50">Services</p>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-ivory/80 transition hover:text-ivory"
                >
                  {s.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow text-ivory/50">Service Area</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {site.serviceArea.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/areas/${a.slug}`}
                  className="text-ivory/80 transition hover:text-ivory"
                >
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow text-ivory/50">Company</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link
                href="/about"
                className="text-ivory/80 transition hover:text-ivory"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-ivory/80 transition hover:text-ivory"
              >
                Contact
              </Link>
            </li>
            <li>
              <a
                href="https://vvon.ai"
                target="_blank"
                rel="noopener"
                className="text-gold-soft transition hover:text-gold"
              >
                Vvon™ ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="hairline-dark" />

      <nav
        aria-label="Service by city"
        className="mx-auto max-w-7xl px-6 py-14 lg:px-10"
      >
        <p className="eyebrow text-ivory/50">Service by city</p>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {services.map((s) => (
            <div key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="block text-sm font-medium text-ivory transition hover:text-warm-gray-soft"
              >
                {s.shortName}
              </Link>
              <ul className="mt-3 space-y-2 text-xs">
                {site.serviceArea.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/services/${s.slug}/${a.slug}`}
                      className="text-ivory/65 transition hover:text-ivory"
                    >
                      {a.name}, {a.region}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="hairline-dark" />

      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-7 text-xs text-ivory/50 lg:flex-row lg:items-center lg:px-10">
        <p>
          © {new Date().getFullYear()} {site.legalName} · All rights reserved
        </p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li>
            <Link href="/privacy" className="transition hover:text-ivory">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="transition hover:text-ivory">
              Terms
            </Link>
          </li>
          <li>
            <Link href="/quote" className="transition hover:text-ivory">
              Get a quote
            </Link>
          </li>
        </ul>
        <p className="eyebrow text-ivory/40">
          Licensed · Bonded · Insured · WA & OR
        </p>
      </div>
    </footer>
  );
}
