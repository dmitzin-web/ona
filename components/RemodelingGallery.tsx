// Completed-work gallery for /services/remodeling.
//
// This used to be eight Pexels stock photos, each honestly labeled
// "Reference" with a footnote saying the imagery was generic. The
// labeling was the right call at the time, but for a remodeling page a
// portfolio is half the sale, and "here is the kind of thing we could
// do" loses to any competitor showing an actual kitchen.
//
// These nine are Ona's own finish work, from /public/photos/projects/ —
// the same set the homepage grid and the Spokane page use.
//
// RULE FOR WHOEVER EDITS THIS NEXT: every word in `notes` must be
// visible in its photo. Form and fixtures only — waterfall island,
// apron-front sink, chimney hood, freestanding tub, floor-mounted
// filler, large-format floor tile. NO materials, species, brands,
// dimensions, timelines, budgets, cities or client names, because none
// of that can be verified from an image and inventing it is exactly the
// failure this gallery was rebuilt to fix. The photos are also not nine
// separate projects — several are two views of one room — so nothing
// here claims a project count.

import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "./icons/ServiceIcons";

type Project = {
  image: string;
  imageAlt: string;
  roomType: string;
  title: string;
  notes: string;
};

const projects: Project[] = [
  {
    image: "/photos/projects/p7.avif",
    imageAlt:
      "Kitchen with full-height shaker cabinetry, waterfall-edge island, three globe pendants and a chimney hood",
    roomType: "Kitchen",
    title: "Full kitchen",
    notes:
      "Full-height shaker cabinetry · Waterfall-edge island · Built-in wall ovens · Chimney hood · Under-cabinet lighting",
  },
  {
    image: "/photos/projects/p8.avif",
    imageAlt:
      "Kitchen island with waterfall edge and apron-front sink, gas cooktop and chimney hood behind",
    roomType: "Kitchen",
    title: "Island and cooking wall",
    notes:
      "Waterfall-edge island · Apron-front sink · Gas cooktop · Chimney hood · Continuous plank flooring",
  },
  {
    image: "/photos/projects/p9.avif",
    imageAlt:
      "View along a kitchen run through to the living room, with apron-front sink, gooseneck faucet and a fireplace wall beyond",
    roomType: "Kitchen",
    title: "Kitchen through to living",
    notes:
      "Panelled hood surround · Apron-front sink · Gooseneck faucet · Open sightline to the fireplace wall",
  },
  {
    image: "/photos/projects/p1.avif",
    imageAlt:
      "Primary bath double vanity with two undermount basins, paired mirrors and two-globe sconces",
    roomType: "Primary bath",
    title: "Double vanity",
    notes:
      "Shaker vanity run · Two undermount basins · Paired mirrors · Two-globe sconces · Drawer storage",
  },
  {
    image: "/photos/projects/p2.avif",
    imageAlt:
      "Primary bath looking down the vanity run to a freestanding tub, with a glass shower enclosure to the right",
    roomType: "Primary bath",
    title: "Full bath layout",
    notes:
      "Freestanding tub · Glass shower enclosure · Large-format floor tile · Full-length vanity run",
  },
  {
    image: "/photos/projects/p3.avif",
    imageAlt:
      "Freestanding soaking tub beneath a shuttered window with a floor-mounted tub filler",
    roomType: "Primary bath",
    title: "Freestanding tub",
    notes:
      "Freestanding soaking tub · Floor-mounted filler · Window trim and blinds · Painted walls",
  },
  {
    image: "/photos/projects/p5.avif",
    imageAlt:
      "Powder room with dark painted walls, a white shaker vanity and a round mirror",
    roomType: "Powder room",
    title: "Powder room",
    notes:
      "Dark painted walls · Shaker vanity · Round mirror · Large-format floor tile",
  },
  {
    image: "/photos/projects/p6.avif",
    imageAlt:
      "Guest bath with textured wallcovering, white shaker vanity and an oval mirror, opening onto a plank-floored room",
    roomType: "Guest bath",
    title: "Guest bath",
    notes:
      "Textured wallcovering · Shaker vanity · Oval mirror · Doorway trim and hardware",
  },
  {
    image: "/photos/projects/p4.avif",
    imageAlt:
      "Laundry room with upper cabinetry, an open shelf, a utility sink and side-by-side machines",
    roomType: "Laundry",
    title: "Laundry room",
    notes:
      "Upper cabinetry · Open shelf · Utility sink and counter · Side-by-side machines",
  },
];

export function RemodelingGallery() {
  return (
    <section className="border-t border-line bg-charcoal">
      <div className="mx-auto max-w-7xl px-6 pt-24 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-warm-gray">Our work</p>
            <h2 className="mt-6 text-4xl font-light leading-tight tracking-tight text-ivory sm:text-5xl">
              Finish work, photographed as we left it.
            </h2>
            {/* Says what these are and nothing more. No project count, no
                square footage, no timelines — see the rule at the top. */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-warm-gray">
              Kitchens, baths and finish carpentry completed by our own
              crews. Several of these are two views of the same room rather
              than separate projects.
            </p>
          </div>
          <Link
            href="/quote"
            className="eyebrow inline-flex items-center gap-2 text-ivory transition hover:gap-3"
          >
            Start your project
            <ArrowIcon className="h-3 w-3 stroke-current" />
          </Link>
        </div>
      </div>

      {/* Full-bleed, outside the 7xl container. On a remodeling page the
          photographs are the argument — a portfolio at thumbnail size
          reads as a spec sheet, and the reader is here to look at rooms.
          Three across, so nine make three full rows with no orphan. */}
      <ul className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.title + p.image} className="bg-charcoal">
            <article className="flex h-full flex-col">
              <div className="relative aspect-[3/2] overflow-hidden">
                {/* next/image, not a bare <img>: these are local files,
                    so we get AVIF/WebP sizing and no layout shift, and
                    the page stops reaching an external image host. */}
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col px-6 py-6">
                <p className="eyebrow text-warm-gray">{p.roomType}</p>
                <h3 className="mt-3 text-lg font-medium tracking-tight text-ivory">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">
                  {p.notes}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <div className="pb-24" />
    </section>
  );
}
