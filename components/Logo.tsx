import Link from "next/link";
import { site } from "@/lib/site";

type Variant = "horizontal" | "stacked" | "mark";
type Tone = "light" | "dark";

export function Logo({
  variant = "horizontal",
  tone = "light",
  className = "",
}: {
  variant?: Variant;
  tone?: Tone;
  className?: string;
}) {
  // Tokens, not literals, so the mark inverts with the rest of the palette
  // instead of staying frozen at the old charcoal-era hexes. Read by role:
  // `light` is the logo that sits on the page ground, `dark` is the one on
  // inverted surfaces. (See the token block in globals.css — `ivory` is ink
  // and `charcoal` is ground since the September 2026 inversion.)
  const ink =
    tone === "light" ? "var(--color-ivory)" : "var(--color-charcoal)";

  const Mark = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 36"
      fill="none"
      stroke={ink}
      strokeWidth={1.4}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M4 32 L24 4 L44 32" />
    </svg>
  );

  if (variant === "mark") {
    return (
      <div className={`inline-block ${className}`} aria-label={`${site.name} mark`}>
        {Mark}
      </div>
    );
  }

  const stacked = variant === "stacked";

  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <span
        className={stacked ? "flex flex-col items-center gap-2" : "flex items-center gap-3"}
      >
        <span
          className={`block ${stacked ? "h-8 w-10" : "h-6 w-8"}`}
          aria-hidden="true"
        >
          {Mark}
        </span>
        <span className="flex flex-col leading-none" style={{ color: ink }}>
          {/* "Ona", not "ONA", and the tracking had to come down with it.
              All-caps at .24em was elegant but it read as an initialism —
              an American seeing ONA says "oh-en-ay", which turns a
              two-syllable name into a government agency. Title case makes
              it a word.

              Wide tracking undoes that, though: "O n a" spaced out is
              spelled-out again, which is the thing we were fixing. .04em
              is enough air for a light weight without breaking the word
              apart. Weight stays 300 so the mark is still a signature
              rather than another button beside the nav; the size goes up a
              little because lowercase has less presence than caps at the
              same point size. */}
          <span
            className="font-display"
            style={{
              fontWeight: 300,
              fontSize: stacked ? "2.25rem" : "1.9rem",
              letterSpacing: "0.04em",
            }}
          >
            Ona
          </span>
          {/* Mono, like every other small label on the site — this is a
              credential line, not display type.

              Tracking pulled in from .34em and the size from .53rem. With
              "ONA" in caps the two lines were close in width; "Ona" is
              three lowercase letters and measured 49.7px against this
              line's 87.8px, which made the lockup bottom-heavy — the
              descriptor was shouting over the name. Now roughly 61px
              against 72px, so the wordmark leads. */}
          <span
            className="mt-1.5 font-mono"
            style={{
              fontWeight: 400,
              fontSize: "0.5rem",
              letterSpacing: "0.2em",
              opacity: 0.72,
            }}
          >
            RESTORATION
          </span>
        </span>
      </span>
    </Link>
  );
}
