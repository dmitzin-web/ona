import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneLink } from "./contact/ContactLinks";
import { PhoneIcon } from "./icons/ServiceIcons";

// Mobile-only sticky bottom bar — final restraint pass.
//
// v3.3 → v3.4:
//   - Bar surface lowered to ivory/50 (was /60) — nearly
//     transparent over content
//   - Top border softened to line-light/50
//   - Secondary CTA loses the hard ink-outline border and
//     becomes a soft chip on warm-gray-soft fill; the
//     primary gold pill still anchors visual weight
//   - Shorter overall via py-1.5 + button py-2
//   - One visible button (the gold call CTA) carries the
//     weight; the secondary fades into the bar
//
// The bar should now read as "barely there" — visible when
// needed, invisible when reading content.

export function MobileStickyBar() {
  return (
    <div
      aria-label="Mobile call to action"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ivory/10/50 bg-charcoal/50 px-3 py-1.5 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "calc(0.375rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="grid grid-cols-2 gap-2">
        <PhoneLink className="flex items-center justify-center gap-1.5 rounded-full bg-gold py-2 text-[12px] font-medium text-white transition active:bg-gold-deep">
          <PhoneIcon className="h-3.5 w-3.5 flex-none stroke-current" />
          <span className="whitespace-nowrap">
            Call {site.phoneDisplay}
          </span>
        </PhoneLink>
        <Link
          href="/start-project"
          className="flex items-center justify-center gap-1.5 rounded-full bg-warm-gray-soft/60 py-2 text-[12px] font-medium text-ivory transition active:bg-ivory active:text-charcoal"
        >
          <span className="whitespace-nowrap">Start a project</span>
        </Link>
      </div>
    </div>
  );
}
