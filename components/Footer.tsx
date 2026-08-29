import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { Logo } from "./Logo";
import { EmailLink, PhoneLink } from "./contact/ContactLinks";

export function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 lg:px-10">
        <div className="md:col-span-4">
          {/* `dark` is the mark for inverted surfaces — the footer is now
              the deep-teal band, so the graphite mark would vanish. */}
          <Logo variant="horizontal" tone="dark" />
          <div className="mt-8 max-w-sm space-y-3 text-sm leading-relaxed text-white/85">
            <p>
              Remodeling, mold, and restoration in Vancouver, WA and the
              Portland metro.
            </p>
            <p>
              Water · Fire · Mold · Storm · Reconstruction · Kitchen &amp;
              Bath remodels.
            </p>
            <p>
              Insurance billed direct · Fixed-scope agreements · 24/7
              emergency dispatch.
            </p>
          </div>
          <div className="mt-8 space-y-1 text-sm text-white/90">
            <PhoneLink className="block text-white transition hover:text-white/70">
              {site.phoneDisplay}
            </PhoneLink>
            <EmailLink className="block transition hover:text-white">
              {site.email}
            </EmailLink>
            <p className="pt-3 text-white/72">
              {site.address.locality}, {site.address.region} · Serving the
              Portland metro
            </p>
          </div>
          {/* License slots — replace `pending` strings with actual IDs as
              they are issued; do not invent or estimate.
              WA L&I: ONARER*748K8 (issued, verifiable at lni.wa.gov)
              IICRC: certified (WRT/ASD/AMRT/FSRT). OR CCB: still pending. */}
          <dl className="mt-6 grid grid-cols-1 gap-1 text-xs text-white/70">
            <div className="flex flex-wrap gap-x-2">
              <dt className="eyebrow text-white/66">WA L&amp;I</dt>
              <dd className="font-mono">
                <a
                  href="https://secure.lni.wa.gov/verify/"
                  rel="noopener"
                  target="_blank"
                  className="text-white/90 underline-offset-2 transition hover:text-white hover:underline"
                >
                  ONARER*748K8
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="eyebrow text-white/66">OR CCB</dt>
              <dd className="font-mono">pending</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="eyebrow text-white/66">IICRC</dt>
              <dd className="font-mono">Certified</dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow text-white/68">Services</p>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-white/90 transition hover:text-white"
                >
                  {s.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow text-white/68">Service Area</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {site.serviceArea.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/areas/${a.slug}`}
                  className="text-white/90 transition hover:text-white"
                >
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow text-white/68">Company</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link
                href="/about"
                className="text-white/90 transition hover:text-white"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-white/90 transition hover:text-white"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="hairline-dark" />

      {/* Service × city mega-section, collapsed by default to keep the footer
          clean. <details> keeps the full 50-link grid in server-rendered HTML
          regardless of open/closed state, so Google crawls and counts every
          link — this is the canonical Google-compliant pattern for hiding
          dense link content from the default visual while preserving SEO. */}
      <details className="group mx-auto max-w-7xl px-6 lg:px-10">
        <summary className="flex cursor-pointer list-none items-center justify-between py-7 [&::-webkit-details-marker]:hidden">
          <span className="eyebrow text-white/68">Service by city</span>
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center text-xl font-light leading-none text-white/72 transition-transform duration-200 group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <nav
          aria-label="Service by city"
          className="pb-12 pt-2"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {services.map((s) => (
              <div key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="block text-sm font-medium text-white transition hover:text-white/70"
                >
                  {s.shortName}
                </Link>
                <ul className="mt-3 space-y-2 text-xs">
                  {site.serviceArea.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/services/${s.slug}/${a.slug}`}
                        className="text-white/76 transition hover:text-white"
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
      </details>

      <div className="hairline-dark" />

      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-7 text-xs text-white/68 lg:flex-row lg:items-center lg:px-10">
        <p>
          © {new Date().getFullYear()} {site.legalName} · All rights reserved
        </p>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
          </li>
          <li>
            <Link href="/quote" className="transition hover:text-white">
              Get a free quote
            </Link>
          </li>
        </ul>
        {/* "Licensed · Bonded · Insured · WA & OR" was here, roughly 300px
            below this same footer's own "OR CCB: pending". Removed, not
            reworded: the credential list at the top of the footer already
            states WA L&I, OR CCB and IICRC accurately and links the L&I
            number to the state's verification page, so this line added no
            information and contradicted it. See lib/site.ts for the two
            statutes involved. */}
      </div>
    </footer>
  );
}
