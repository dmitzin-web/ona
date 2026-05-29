// Style-reference gallery for /services/remodeling.
//
// These are NOT photos of completed ONA Restoration & Remodeling LLC projects
// — the company was formed 2026-05-13 and is building its project gallery.
// Each card is explicitly labeled "Reference" to make this clear to visitors
// and to crawler-side trust signals (Google reverse image search will identify
// the images as not original; the labeling sidesteps any misrepresentation
// flag).
//
// When real projects complete, swap the entries in `references` one-by-one:
// replace each `image` URL with a project photo path under /public/photos/,
// flip `label` from "Reference" to "Completed", and the gallery becomes a
// real-projects gallery without further code changes.
//
// Photo source: Pexels CDN. Pexels license allows free commercial use
// without attribution. URL pattern is stable:
//   https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?w=1200
// When real project photos arrive, replace each `image` URL with a path
// under /public/photos/remodel/.

import Link from "next/link";
import { ArrowIcon } from "./icons/ServiceIcons";

type Reference = {
  image: string;
  imageAlt: string;
  roomType: string;
  title: string;
  notes: string;
};

// Helper: Pexels CDN URL. Stable photo IDs are listed below.
const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const references: Reference[] = [
  {
    image: pexels(7166645),
    imageAlt: "Reference: modern kitchen — light cabinetry, quartz countertop, island seating",
    roomType: "Kitchen",
    title: "Full kitchen renovation",
    notes:
      "Quartz waterfall island · Walnut shaker cabinetry · Brass hardware · Induction cooktop · Under-cabinet lighting",
  },
  {
    image: pexels(6957081),
    imageAlt: "Reference: modern bathroom — large-format tile, walk-in shower, contemporary vanity",
    roomType: "Primary bath",
    title: "Curbless wet-room remodel",
    notes:
      "Large-format porcelain tile · Curbless walk-in shower · Double vanity · Heated floor · Integrated steam",
  },
  {
    image: pexels(7174113),
    imageAlt: "Reference: spacious open-concept living room — engineered floors, large windows, neutral palette",
    roomType: "Whole-house",
    title: "Open-concept conversion",
    notes:
      "Load-bearing wall removal · Engineered hardwood throughout · Recessed lighting · Custom built-ins",
  },
  {
    image: pexels(6908565),
    imageAlt: "Reference: kitchen with custom cabinetry and built-in storage details",
    roomType: "Custom millwork",
    title: "Built-in library + study",
    notes:
      "Floor-to-ceiling shelving · Integrated lighting · Panel-ready fronts · Rolling ladder · Hidden cable management",
  },
  {
    image: pexels(7045356),
    imageAlt: "Reference: transitional kitchen — painted shaker, contrast hardware, stone counters",
    roomType: "Kitchen",
    title: "Transitional refresh",
    notes:
      "Painted shaker cabinetry · Matte black hardware · Honed soapstone counters · Apron-front sink · Open shelving",
  },
  {
    image: pexels(6899357),
    imageAlt: "Reference: guest bath — patterned tile, wall-mount fixtures, statement mirror",
    roomType: "Guest bath",
    title: "Compact bath remodel",
    notes:
      "Penny tile floor · Wainscot wall panels · Wall-mount fixtures · Statement mirror · Single-vanity layout",
  },
  {
    image: pexels(8135492),
    imageAlt: "Reference: refined finished interior with chandeliers and natural light",
    roomType: "Addition",
    title: "Second-story addition",
    notes:
      "Gabled roofline match · Siding & trim continuity · Structural engineering · Full-width windows · Permit-led process",
  },
  {
    image: pexels(7173661),
    imageAlt: "Reference: compact kitchen with full appliance package and clean cabinetry",
    roomType: "ADU / garage conversion",
    title: "Detached ADU build-out",
    notes:
      "Studio + kitchenette + bath · Siding match to main house · Separate utilities · Permit-led process",
  },
];

export function RemodelingGallery() {
  return (
    <section className="border-t border-ivory/10 bg-charcoal">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        {/* Section header with explicit disclaimer. This framing is the
            entire point — it signals to visitors and to Google's crawlers
            that the gallery shows style references, not claimed completed
            work. Do not soften this wording when adding real project photos
            below; instead, when a card switches from reference to real,
            flip its individual label badge. */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-ivory/60">Style references</p>
            <h2 className="text-ivory mt-6 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
              The kind of remodel we&apos;re set up to deliver.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/70">
              Reference photos showing the style and finish quality our
              remodeling division targets. Our project gallery launches with
              our first completed remodel — these references will be replaced
              one-by-one with real project photography as work completes.
            </p>
          </div>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 eyebrow text-ivory transition hover:gap-3"
          >
            Start your project
            <ArrowIcon className="h-3 w-3 stroke-current" />
          </Link>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden border border-ivory/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
          {references.map((r) => (
            <li key={r.title} className="bg-charcoal">
              <article className="flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt={r.imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center bg-charcoal/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ivory">
                    Reference
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-ivory/50">{r.roomType}</p>
                  <h3 className="mt-3 text-lg font-medium tracking-tight text-ivory">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                    {r.notes}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-ivory/55">
          Reference photography is generic stock imagery. Each card describes
          the room type, finish targets, and scope our remodeling division
          delivers — not a specific completed project. Real project photos
          replace these as our first remodels finish.
        </p>
      </div>
    </section>
  );
}
