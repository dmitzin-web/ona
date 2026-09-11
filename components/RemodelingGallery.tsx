// Completed-work gallery for /services/remodeling.
//
// This used to be eight Pexels stock photos, each honestly labeled
// "Reference" with a footnote saying the imagery was generic. The
// labeling was the right call at the time, but for a remodeling page a
// portfolio is half the sale, and "here is the kind of thing we could
// do" loses to any competitor showing an actual kitchen.
//
// Ona's own finish work. The entries are content files in content/work/,
// edited through the admin at /admin — see lib/work.ts. The images
// live in /public/photos/projects/, the same set the homepage and the
// Spokane page use.
//
// RULE FOR WHOEVER EDITS THE CONTENT: every word in `notes` must be
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
import { workItems } from "@/lib/work";


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
        {workItems.map((p) => (
          <li key={p.slug} className="bg-charcoal">
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
