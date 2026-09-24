// ──────────────────────────────────────────────────────────────
// What clients said
// ──────────────────────────────────────────────────────────────
// Until today the reviews in content/reviews.json only ever left
// the building as schema.org markup (lib/jsonld.ts) — Google could
// read them, a visitor could not. This is the visible half.
//
// It renders NOTHING while the list is empty, which is its most
// important property: an empty testimonials band with a "coming
// soon" line is worse than no band at all, and a placeholder quote
// is the one thing that can get a Google Business Profile pulled.
// See lib/reviews.ts for the rules on what may go in the list.
//
// Dates and the star row are computed from the review record, so
// they are not editable in the visual editor — only the words are.

import type { Review } from "@/lib/reviews";

export type ReviewsCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  ratingLabel: string;
  note: string;
};

const monthYear = (iso: string) => {
  const d = new Date(iso + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
};

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          aria-hidden
          className={n <= rating ? "text-gold" : "text-line"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function Reviews({ copy, reviews }: { copy: ReviewsCopy; reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="border-t border-line bg-charcoal">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-warm-gray">{copy.eyebrow}</p>
            <h2 className="mt-6 max-w-2xl text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-ivory md:text-[44px]">
              {copy.title}
            </h2>
          </div>
          <p className="max-w-sm text-[14px] text-warm-gray">{copy.intro}</p>
        </div>

        <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <figure key={i} className="flex flex-col gap-5 bg-charcoal p-7">
              <Stars
                rating={r.rating}
                label={copy.ratingLabel.replace("{n}", String(r.rating))}
              />
              <blockquote className="text-[17px] leading-relaxed text-ivory">
                {r.reviewBody}
              </blockquote>
              <figcaption className="mt-auto text-[11px] uppercase tracking-[0.18em] text-warm-gray">
                {[r.author, r.location, r.service, monthYear(r.datePublished)]
                  .filter(Boolean)
                  .join(" · ")}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 text-[13px] text-warm-gray">{copy.note}</p>
      </div>
    </section>
  );
}
