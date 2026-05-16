import { claimLens } from "@/lib/claimlens/config";

// Small typographic helper so the ™ never renders at body font-size and
// the wordmark stays consistent in nav, hero, footer, and report headers.
export function ClaimLensWordmark({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark" | "gold";
}) {
  const toneClass =
    tone === "dark"
      ? "text-charcoal"
      : tone === "gold"
        ? "text-gold"
        : "text-ivory";
  return (
    <span className={`${toneClass} ${className}`}>
      {claimLens.name}
      <sup className="ml-0.5 text-[0.55em] font-light tracking-normal">
        {claimLens.symbol}
      </sup>
    </span>
  );
}
