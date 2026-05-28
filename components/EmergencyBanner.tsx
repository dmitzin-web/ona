import { site } from "@/lib/site";

// ─────────────────────────────────────────────────────────────
// Live status strip — SaaS status-page convention.
// ────────────────────────────────────────────────────────────
// Narrow strip above the header. Green pulsing dot + a calm
// sentence. The whole point is to convey "open for business
// right now" without the panic energy of a red EMERGENCY bar.
//
// The pulse is the only animation on the entire site. If you
// feel like adding another, push back — the brand promise is
// calm.

export function EmergencyBanner() {
  return (
    <div className="border-b border-line-light bg-ivory-soft">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1.5 px-6 py-2 text-[12px] text-warm-gray-deep sm:flex-row lg:px-10">
        <div className="flex items-center gap-2.5">
          <span className="ona-pulse inline-block h-2 w-2 rounded-full bg-gold" />
          <span>
            <span className="text-charcoal">Available now</span>
            {" · Booking June restoration + remodel · Vancouver, WA + Portland metro"}
          </span>
        </div>
        <a
          href={`tel:${site.phone}`}
          className="text-charcoal underline-offset-4 hover:underline"
        >
          {site.phoneDisplay}
        </a>
      </div>
    </div>
  );
}
