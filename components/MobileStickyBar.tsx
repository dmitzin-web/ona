import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneLink } from "./contact/ContactLinks";
import { PhoneIcon } from "./icons/ServiceIcons";

// Bottom-fixed mobile call-to-action bar. Visible only below the lg
// breakpoint — desktop has the header phone CTA always in view.
//
// Restoration is a phone-first industry: people calling at 3 a.m. with a
// flooded basement convert via tel: tap, not a contact form. Industry data
// suggests a persistent bottom call CTA on mobile lifts call rate 20-40%
// over a top-only header CTA, because the user's thumb is already near
// the bottom of the screen.
//
// Body bottom padding is applied in app/layout.tsx (pb-16 lg:pb-0) so the
// final inch of page content isn't hidden behind this bar.

export function MobileStickyBar() {
  return (
    <div
      aria-label="Mobile call to action"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-charcoal-mute bg-charcoal/95 text-ivory backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Phone number "(360) 823-3196" + "CALL " label is 19 chars at
          tracking-[0.18em] — overflows a 375px viewport split 50/50 and
          wraps to two lines. text-xs + tighter tracking + whitespace-nowrap
          keeps it on one line down to 320px (iPhone SE). */}
      <PhoneLink className="flex items-center justify-center gap-2 bg-ivory py-4 text-xs font-medium uppercase tracking-[0.12em] text-charcoal transition active:bg-ivory-soft sm:text-sm sm:tracking-[0.18em]">
        <PhoneIcon className="h-4 w-4 flex-none stroke-current" />
        <span className="whitespace-nowrap">Call {site.phoneDisplay}</span>
      </PhoneLink>
      <Link
        href="/quote"
        className="flex items-center justify-center gap-2 py-4 text-xs font-medium uppercase tracking-[0.12em] text-ivory transition active:bg-charcoal sm:text-sm sm:tracking-[0.18em]"
      >
        <span className="whitespace-nowrap">Free quote</span>
      </Link>
    </div>
  );
}
