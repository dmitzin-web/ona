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
  const ink = tone === "light" ? "#F5F4F1" : "#141414";

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
          <span
            className="font-display"
            style={{
              fontWeight: 500,
              fontSize: stacked ? "1.5rem" : "1.25rem",
              letterSpacing: "0.18em",
            }}
          >
            ONA
          </span>
          <span
            className="mt-1 font-display"
            style={{
              fontWeight: 300,
              fontSize: "0.55rem",
              letterSpacing: "0.42em",
              opacity: 0.75,
            }}
          >
            RESTORATION
          </span>
        </span>
      </span>
    </Link>
  );
}
