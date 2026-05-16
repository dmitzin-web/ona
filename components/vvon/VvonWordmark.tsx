import { vvon } from "@/lib/vvon/config";

// Small typographic helper so the ™ never renders at body font-size and
// the wordmark stays consistent in nav, hero, footer, and report headers.
export function VvonWordmark({
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
      {vvon.name}
      <sup className="ml-0.5 text-[0.55em] font-light tracking-normal">
        {vvon.symbol}
      </sup>
    </span>
  );
}
