import Link from "next/link";
import { site } from "@/lib/site";

// ─────────────────────────────────────────────────────────────
// Footer — Project File concept, warmth pass
// ────────────────────────────────────────────────────────────
// Light footer with calm rhythm:
//   - Brand + tagline
//   - Three checked one-liners (human reassurance)
//   - 3-col operational facts: Call / Service area / Hours
//   - Credentials row — actual WA L&I number with verify link,
//     OR CCB / IICRC placeholders ready to be swapped
//   - Quick nav: All services / Service areas / Field notes
//   - Legal row
//
// Lives in the warm production palette (ivory + charcoal + gold).

export function Footer() {
  return (
    <footer className="border-t border-line-light bg-ivory text-charcoal">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        {/* Row 1 — brand + one-line promise */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-tight text-charcoal"
          >
            {site.name}
          </Link>
          <p className="text-[13px] text-warm-gray-deep">
            Restoration &amp; remodeling. One team, from damage to rebuild.
          </p>
        </div>

        {/* Row 2 — human reassurance */}
        <div className="mt-6 grid gap-3 border-t border-line-light pt-6 sm:grid-cols-3">
          {[
            "Same person from first call to final walkthrough",
            "Phone answered in person — day or night",
            "Project File live from day one — every job",
          ].map((line) => (
            <div
              key={line}
              className="flex items-start gap-2.5 text-[13px] text-warm-gray-deep"
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full border border-gold text-[9px] font-semibold text-gold"
              >
                ✓
              </span>
              <span className="text-charcoal">{line}</span>
            </div>
          ))}
        </div>

        {/* Row 3 — operational facts */}
        <div className="mt-8 grid gap-6 border-t border-line-light pt-8 text-[13px] text-warm-gray-deep sm:grid-cols-3">
          <div>
            <div className="text-charcoal">Call</div>
            <a
              href={`tel:${site.phone}`}
              className="mt-1 block transition hover:text-charcoal"
            >
              {site.phoneDisplay}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 block transition hover:text-charcoal"
            >
              {site.email}
            </a>
          </div>
          <div>
            <div className="text-charcoal">Service area</div>
            <div className="mt-1">
              {site.address.locality}, {site.address.region}
            </div>
            <div className="mt-1">Clark County · Portland metro</div>
            <div className="mt-1">25-min response across Clark County</div>
          </div>
          <div>
            <div className="text-charcoal">Hours</div>
            <div className="mt-1">
              <span className="text-charcoal">Restoration</span> — 24 hours,
              every day
            </div>
            <div className="mt-1">
              <span className="text-charcoal">Remodel</span> — Mon–Fri, 8a–5p
            </div>
          </div>
        </div>

        {/* Row 4 — credentials. WA L&I issued and verifiable;
            OR CCB / IICRC still pending. Replace `pending` with
            actual numbers as they issue. Do not invent. */}
        <dl className="mt-8 grid gap-6 border-t border-line-light pt-8 text-[12px] text-warm-gray-deep sm:grid-cols-3">
          <div>
            <dt className="eyebrow text-warm-gray-deep">WA L&amp;I</dt>
            <dd className="mt-1 font-mono">
              <a
                href="https://secure.lni.wa.gov/verify/"
                rel="noopener"
                target="_blank"
                className="text-charcoal underline-offset-2 transition hover:underline"
              >
                ONARER*748K8
              </a>
            </dd>
            <dd className="mt-1 text-[11px]">Verify at lni.wa.gov</dd>
          </div>
          <div>
            <dt className="eyebrow text-warm-gray-deep">OR CCB</dt>
            <dd className="mt-1 font-mono">pending</dd>
          </div>
          <div>
            <dt className="eyebrow text-warm-gray-deep">IICRC</dt>
            <dd className="mt-1 font-mono">pending</dd>
          </div>
        </dl>

        {/* Row 5 — quick nav */}
        <div className="mt-6 flex flex-col gap-3 border-t border-line-light pt-6 text-[13px] sm:flex-row sm:gap-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-charcoal transition hover:text-gold-deep"
          >
            All services
            <span aria-hidden className="text-warm-gray">
              →
            </span>
          </Link>
          <Link
            href="/areas"
            className="inline-flex items-center gap-1.5 text-charcoal transition hover:text-gold-deep"
          >
            Service areas
            <span aria-hidden className="text-warm-gray">
              →
            </span>
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-charcoal transition hover:text-gold-deep"
          >
            Field notes
            <span aria-hidden className="text-warm-gray">
              →
            </span>
          </Link>
        </div>

        {/* Row 6 — legal */}
        <div className="mt-6 flex flex-col gap-3 border-t border-line-light pt-6 text-[12px] text-warm-gray-deep sm:flex-row sm:items-center sm:justify-between">
          <div>
            {site.legalName} · {site.address.locality}, {site.address.region} ·
            Licensed and insured.
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="transition hover:text-charcoal"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition hover:text-charcoal"
            >
              Terms
            </Link>
            <span>© {new Date().getFullYear()} {site.name}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
