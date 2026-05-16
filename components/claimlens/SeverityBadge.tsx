import {
  type Severity,
  type Confidence,
  severityLabel,
  confidenceLabel,
} from "@/lib/claimlens/config";

// Severity → palette. Gold is reserved for critical/high so the eye lands
// there first. Lower severities and "needs documentation" stay neutral.
const severityClass: Record<Severity, string> = {
  critical: "border-gold bg-gold/10 text-gold",
  high: "border-gold-soft bg-gold/5 text-gold-soft",
  medium: "border-warm-gray-soft/60 bg-transparent text-warm-gray-soft",
  low: "border-ivory/20 bg-transparent text-ivory/70",
  "needs-documentation": "border-warm-gray/40 bg-transparent text-warm-gray",
};

// Light-tone variant for use on ivory backgrounds.
const severityClassLight: Record<Severity, string> = {
  critical: "border-gold-deep bg-gold/10 text-gold-deep",
  high: "border-gold-deep/60 bg-gold/5 text-gold-deep",
  medium: "border-charcoal/30 bg-transparent text-charcoal/80",
  low: "border-charcoal/20 bg-transparent text-charcoal/60",
  "needs-documentation": "border-warm-gray-deep/40 bg-transparent text-warm-gray-deep",
};

export function SeverityBadge({
  severity,
  tone = "dark",
}: {
  severity: Severity;
  tone?: "light" | "dark";
}) {
  const cls = tone === "light" ? severityClassLight : severityClass;
  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${cls[severity]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {severityLabel[severity]}
    </span>
  );
}

const confidenceClass: Record<Confidence, string> = {
  confirmed: "text-gold-deep",
  likely: "text-charcoal",
  possible: "text-charcoal/70",
  "needs-verification": "text-warm-gray-deep",
};

export function ConfidenceLabel({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={`eyebrow ${confidenceClass[confidence]}`}
      title={confidenceLabel[confidence]}
    >
      {confidenceLabel[confidence]}
    </span>
  );
}
