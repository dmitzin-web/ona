import { vvon } from "@/lib/vvon/config";

// Re-rendered on every Vvon surface — landing, upload, report. The
// disclaimer string lives in lib/vvon/config.ts and is the canonical
// version. Do not paraphrase per the project brief.
export function VvonDisclaimer({
  tone = "dark",
  compact = false,
}: {
  tone?: "light" | "dark";
  compact?: boolean;
} = {}) {
  const dark = tone === "dark";
  return (
    <div
      className={`border-l-2 ${
        dark ? "border-gold/60 bg-charcoal text-ivory/70" : "border-gold/60 bg-ivory text-charcoal/70"
      } px-5 ${compact ? "py-3" : "py-4"}`}
    >
      <p className={`eyebrow ${dark ? "text-gold-soft" : "text-gold-deep"}`}>
        Important
      </p>
      <p className={`mt-2 ${compact ? "text-xs" : "text-sm"} leading-relaxed`}>
        {vvon.disclaimer}
      </p>
    </div>
  );
}
