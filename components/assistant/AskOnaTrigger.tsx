"use client";

// Small button used in the global header (and anywhere else) to open
// the Ask ONA drawer. Communicates with <AskOna> via a window event so
// no React context is required — the drawer can sit at the bottom of
// the layout tree while triggers can be anywhere above it.

export function AskOnaTrigger({
  variant = "header",
}: {
  variant?: "header" | "inline";
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Pass the button as the event target so AskOna can restore focus
    // to it after the drawer closes.
    window.dispatchEvent(
      new CustomEvent("askona:open", { detail: { trigger: e.currentTarget } }),
    );
    // Also dispatch a plain event for the simple listener path.
    window.dispatchEvent(new Event("askona:open"));
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 border border-charcoal/30 px-4 py-2 text-sm font-medium text-charcoal transition hover:border-charcoal"
      >
        <span aria-hidden="true">✦</span>
        Ask ONA
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Open Ask ONA assistant"
      className="hidden items-center gap-2 border border-ivory/30 px-4 py-2 text-sm font-medium text-ivory transition hover:border-ivory sm:inline-flex"
    >
      <span aria-hidden="true" className="text-gold-soft">
        ✦
      </span>
      Ask ONA
    </button>
  );
}
