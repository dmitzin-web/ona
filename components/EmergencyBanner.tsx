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
    <div className="border-b border-ivory/10 bg-charcoal-soft">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-6 py-2 text-center text-[12px] text-ivory/75 lg:px-10">
        <span className="ona-pulse inline-block h-2 w-2 flex-none rounded-full bg-gold" />
        <span>
          <span className="text-ivory">Available now</span>
          {" · Booking June restoration + remodel · Vancouver, WA + Portland metro"}
        </span>
      </div>
    </div>
  );
}
