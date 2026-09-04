import Link from "next/link";
import { site } from "@/lib/site";

// ─────────────────────────────────────────────────────────────
// ONA wordmark — built to the brand book.
// ────────────────────────────────────────────────────────────
// THE A IS THE CHEVRON. That is the whole idea of this mark: it is not
// an icon sitting next to a word, it is the third letter of the word,
// a crossbar-less peak in place of the A. Everything below exists to
// make that one substitution invisible.
//
// Which is why the mark only works in capitals. Lowercase "Ona" has no
// A to replace, so the chevron becomes a decoration parked beside a
// word — which is exactly how the previous version looked, and why it
// read as weak. The wordmark therefore stays ONA here even though
// running copy, page titles and metadata say "Ona Restoration": the
// logo is set in caps as a design decision, the name is written
// normally in prose, and About carries the "OH-nuh" pronunciation cue.
// See lib/site.ts.
//
// Geometry, all derived from the type size so the lockup scales as one
// object and never needs a second set of magic numbers:
//   cap height   0.715 × size   (Satoshi's cap height)
//   stem width   0.052 × size   (Satoshi Light's stem at this size)
//   chevron w    1.00  × cap    (the A is as wide as the O — checked
//                                against the brand book artwork; .92
//                                read visibly pinched next to it)
//   apex inset   0.6   × stem   (keeps the point crisp at the top)
//
// The chevron's stroke is DELIBERATELY 8% heavier than the stem it is
// matched to. A diagonal of the same nominal width reads thinner than a
// vertical — type designers compensate the same way — and without it
// the A looks lighter than the O and N beside it.
//
// RESTORATION is Satoshi Light, not the site's mono label stack. The
// mono convention in globals.css governs UI labels; this is the logo,
// and the book sets the descriptor in the same face as the wordmark.
// Its tracking is tuned per variant so the line measures the wordmark.

type Variant = "horizontal" | "stacked" | "mark";
type Tone = "light" | "dark";

// Type size of the wordmark per variant. `horizontal` is the header and
// footer lockup; `stacked` is for larger canvases.
const SIZE: Record<"horizontal" | "stacked", number> = {
  horizontal: 31,
  stacked: 48,
};

// Descriptor size and tracking per variant. The tracking is not a taste
// value — it is solved so RESTORATION measures the wordmark. Measured in
// the browser at these sizes: wordmark 102.7px, descriptor 102.4px.
// If you change SIZE, re-measure both and re-solve.
const SUB_SIZE: Record<"horizontal" | "stacked", number> = {
  horizontal: 9,
  stacked: 13,
};
const SUB_TRACK: Record<"horizontal" | "stacked", number> = {
  horizontal: 0.455,
  stacked: 0.43,
};

const CAP = 0.715;
const STEM = 0.052;
const CHEV_W = 1.0;
const APEX = 0.6;
const DIAGONAL_COMPENSATION = 1.08;

function Chevron({ size, color }: { size: number; color: string }) {
  const cap = size * CAP;
  const stem = size * STEM * DIAGONAL_COMPENSATION;
  const w = cap * CHEV_W;
  return (
    <svg
      width={w}
      height={cap}
      viewBox={`0 0 ${w} ${cap}`}
      fill="none"
      stroke={color}
      strokeWidth={stem}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden="true"
      role="presentation"
      style={{ display: "block" }}
    >
      <path
        d={`M${stem / 2} ${cap - stem / 2} L${w / 2} ${stem * APEX} L${
          w - stem / 2
        } ${cap - stem / 2}`}
      />
    </svg>
  );
}

export function Logo({
  variant = "horizontal",
  tone = "light",
  className = "",
}: {
  variant?: Variant;
  tone?: Tone;
  className?: string;
}) {
  // Tokens, not literals, so the mark inverts with the rest of the
  // palette. Read by role: `light` sits on the page ground, `dark` on
  // inverted surfaces. (`ivory` is ink and `charcoal` is ground since
  // the September 2026 inversion — see globals.css.)
  const ink =
    tone === "light" ? "var(--color-ivory)" : "var(--color-charcoal)";

  if (variant === "mark") {
    return (
      <span
        className={`inline-block ${className}`}
        aria-label={`${site.name} mark`}
        style={{ color: ink }}
      >
        <Chevron size={48} color="currentColor" />
      </span>
    );
  }

  const size = SIZE[variant];
  const track = 0.12;

  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={`inline-flex ${className}`}
      style={{ color: ink }}
    >
      {/* Centred column: the descriptor is optically the same width as
          the wordmark, so centring is what makes the block read as one
          stamp rather than two left-aligned lines. */}
      <span className="inline-flex flex-col items-center">
        <span
          className="font-display inline-flex items-end"
          style={{
            fontWeight: 300,
            fontSize: `${size}px`,
            letterSpacing: `${track}em`,
            lineHeight: CAP,
          }}
        >
          {/* No margin before the chevron. CSS letter-spacing already
              adds a gap AFTER the N, so an explicit margin here would
              double the O→N interval and the substitution would show. */}
          <span style={{ display: "block" }}>ON</span>
          <Chevron size={size} color="currentColor" />
        </span>
        <span
          className="font-display"
          style={{
            fontWeight: 300,
            fontSize: `${SUB_SIZE[variant]}px`,
            letterSpacing: `${SUB_TRACK[variant]}em`,
            // Trailing letter-space would otherwise push the line left
            // of centre by half a tracking unit.
            textIndent: `${SUB_TRACK[variant] * SUB_SIZE[variant]}px`,
            marginTop: variant === "stacked" ? 12 : 6,
            lineHeight: 1,
            opacity: 0.9,
          }}
        >
          RESTORATION
        </span>
      </span>
    </Link>
  );
}
