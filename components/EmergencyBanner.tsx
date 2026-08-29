// ─────────────────────────────────────────────────────────────
// Live status strip — the top edge of every page.
// ────────────────────────────────────────────────────────────
// This used to be a mist strip (bg-charcoal-soft) above a
// translucent white header on a white page: three near-whites
// stacked, so the whole chrome dissolved into the content and
// the header had no edge at all.
//
// It is now the deep-teal band. That is deliberate and it is
// the reason the header reads as chrome rather than as the
// first section of the page — a hard dark line at the top of
// the viewport separates the two with no shadow, no weight and
// no extra colour. It is ~32px tall, so it costs almost nothing
// against the per-page deep-teal budget in globals.css.
//
// Sticky lives on the WRAPPER in app/layout.tsx, not here: the
// strip and the header travel together so the dark edge is
// present at every scroll position, not just at the top.
//
// The pulse is the only animation on the site. If you feel like
// adding another, push back — the brand promise is calm.

export function EmergencyBanner() {
  return (
    <div className="promo-strip bg-brand">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-6 py-2 text-center lg:px-10">
        {/* Coral, not teal: on the deep-teal ground a teal dot is
            invisible, and this is the one "we are live" signal. */}
        <span className="ona-pulse inline-block h-[7px] w-[7px] flex-none rounded-full bg-coral-bright" />
        {/* nowrap: the strip is a fixed-height edge, and --chrome-h in
            globals.css depends on it. Wrapping to two lines at a narrow
            width would knock the mobile drawer's offset out. */}
        {/* One claim, nothing else. The strip used to also carry the
            service area and the booking line; three facts in an 11px
            mono row read as a ticker, and the strip's job is to be an
            edge with a single signal on it, not a second nav. The
            service area still appears in the hero copy and the footer.
            "Now booking fall projects" lived only here and is now off
            the site entirely — put it back in a page if it is wanted,
            not in the chrome, where it goes stale by season. */}
        <p className="eyebrow whitespace-nowrap text-white">
          24/7 crew available
        </p>
      </div>
    </div>
  );
}
