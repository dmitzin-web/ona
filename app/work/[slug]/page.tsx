import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { site } from "@/lib/site";

// ─────────────────────────────────────────────────────────────
// Project File — public page template
// ────────────────────────────────────────────────────────────
// This is the actual page real customers will see for their
// project. The current implementation ships ONE seeded sample
// at /work/sample, clearly labeled as a sample so it isn't
// mistaken for a delivered project (state contractor licensing
// risk, plus plain honesty).
//
// To add a real project later: extend the `projects` map
// below with a new key — it's then live at /work/<that-key>.
// Eventually this should move to a CMS or Supabase table, but
// a typed in-file map keeps the first projects shipping today.
//
// `sample` is noindex'd so we don't accidentally rank a
// fictional address.

type TimelineEntry = {
  day: string;
  date: string;
  title: string;
  body: string;
};

type Doc = {
  label: string;
  type: string;
};

type Project = {
  isSample: boolean;
  kind: "Restoration" | "Remodel";
  service: string;
  title: string;
  area: string; // neighborhood only — never a full street address
  status: "On schedule" | "Booking" | "Complete";
  openedOn: string;
  estDays: number;
  currentDay: number;
  adjuster?: string;
  approvedScope?: string;
  timeline: TimelineEntry[];
  photosCount: number;
  docs: Doc[];
};

const projects: Record<string, Project> = {
  sample: {
    isSample: true,
    kind: "Restoration",
    service: "Water mitigation",
    title: "NE Hazel Dell — kitchen leak rebuild",
    area: "NE Hazel Dell, Vancouver WA",
    status: "On schedule",
    openedOn: "May 18, 2026",
    estDays: 14,
    currentDay: 7,
    adjuster: "Liberty Mutual",
    approvedScope: "$14,820",
    timeline: [
      {
        day: "Day 1",
        date: "May 18",
        title: "Initial moisture mapping",
        body: "Identified 6.2 m² of saturated subfloor under sink and dishwasher. Containment set, three dehumidifiers placed. Homeowner walkthrough completed; signed mitigation authorization.",
      },
      {
        day: "Day 2",
        date: "May 19",
        title: "Photo + scope upload to insurer",
        body: "Uploaded 38 photos and moisture map to Liberty Mutual claim portal. Requested adjuster site visit for May 20.",
      },
      {
        day: "Day 3",
        date: "May 20",
        title: "Adjuster walkthrough",
        body: 'Scope agreed: lower cabinets (4), subfloor 8\' x 6\', drywall to 18", baseboards. Insurer photos uploaded to file. No coverage disputes.',
      },
      {
        day: "Day 5",
        date: "May 22",
        title: "Drying complete",
        body: "All moisture readings below 16% threshold. Equipment removed. Demo of damaged finishes scheduled for Day 6.",
      },
      {
        day: "Day 6",
        date: "May 23",
        title: "Demo complete",
        body: "Cabinets, subfloor, drywall removed. Disposal logged. Cabinet order placed (8-day lead time on the maple shaker spec).",
      },
      {
        day: "Day 7",
        date: "May 24",
        title: "Rebuild started",
        body: 'New subfloor laid and squared. Drywall to 18" hung and taped, first coat of mud. On schedule for cabinet install Day 9 — kitchen usable again by Day 14.',
      },
    ],
    photosCount: 142,
    docs: [
      { label: "Liberty Mutual adjuster scope", type: "PDF" },
      { label: "Daily moisture log", type: "CSV" },
      { label: "Material receipts (3)", type: "ZIP" },
      { label: "Cabinet spec — Cardinal Maple Shaker", type: "PDF" },
    ],
  },
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects[slug];
  if (!p) return { title: "Project not found" };

  const prefix = p.isSample ? "Sample project — " : "";
  return {
    title: `${prefix}${p.title}`,
    description: `${p.kind} project in ${p.area}. ${p.service}, day ${p.currentDay} of ${p.estDays}.`,
    robots: p.isSample
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const p = projects[slug];
  if (!p) notFound();

  return (
    <div className="bg-ivory text-charcoal">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20 lg:px-10">
        <Link
          href="/"
          className="text-[13px] text-warm-gray-deep underline-offset-4 hover:text-charcoal hover:underline"
        >
          ← ONA Restoration
        </Link>

        {/* Sample banner — removed for real projects */}
        {p.isSample ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-line-light bg-ivory-soft p-4 text-[13px]">
            <span className="mt-0.5 rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-gold-deep">
              Sample
            </span>
            <p className="text-warm-gray-deep">
              This is a sample of what your project page looks like. The
              data is illustrative — no real customer is shown. Real
              client pages are private and shared only with the homeowner
              and adjuster.
            </p>
          </div>
        ) : null}

        {/* Header */}
        <div className="mt-10">
          <p className="eyebrow text-warm-gray-deep">
            {p.kind} · {p.service}
          </p>
          <h1 className="mt-4 text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-charcoal md:text-[56px]">
            {p.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-warm-gray-deep">
            <span className="flex items-center gap-2 text-charcoal">
              <span className="ona-pulse h-2 w-2 rounded-full bg-gold" />
              {p.status}
            </span>
            <span>Opened {p.openedOn}</span>
            <span>
              Day {p.currentDay} of est. {p.estDays}
            </span>
            {p.adjuster ? <span>Adjuster: {p.adjuster}</span> : null}
          </div>
        </div>

        {/* Two columns: timeline + sidebar */}
        <div className="mt-14 grid gap-12 md:grid-cols-[1.6fr_1fr] md:gap-16">
          <section>
            <h2 className="eyebrow text-warm-gray-deep">Daily updates</h2>
            <div className="mt-6 space-y-8">
              {p.timeline.map((entry) => (
                <article
                  key={entry.day}
                  className="grid gap-3 border-t border-line-light pt-6 sm:grid-cols-[110px_1fr] sm:gap-6"
                >
                  <div>
                    <div className="text-[13px] font-medium text-charcoal">
                      {entry.day}
                    </div>
                    <div className="mt-0.5 text-[12px] text-warm-gray-deep">
                      {entry.date}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-medium leading-snug text-charcoal">
                      {entry.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-warm-gray-deep">
                      {entry.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-10 md:border-l md:border-line-light md:pl-12">
            {p.approvedScope ? (
              <div>
                <div className="eyebrow text-warm-gray-deep">Approved scope</div>
                <div className="mt-2 text-[28px] font-semibold tabular-nums text-charcoal">
                  {p.approvedScope}
                </div>
                <div className="mt-2 text-[13px] text-warm-gray-deep">
                  Billed directly to insurer. Homeowner pays deductible
                  only.
                </div>
              </div>
            ) : null}

            <div>
              <div className="eyebrow text-warm-gray-deep">Photos</div>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md border border-line-light bg-ivory-soft"
                  />
                ))}
              </div>
              <div className="mt-3 text-[13px] text-warm-gray-deep">
                {p.photosCount} photos · uploaded daily
              </div>
            </div>

            <div>
              <div className="eyebrow text-warm-gray-deep">Documents</div>
              <ul className="mt-3 space-y-2 text-[14px]">
                {p.docs.map((d) => (
                  <li
                    key={d.label}
                    className="flex items-center justify-between border-t border-line-light pt-2 text-warm-gray-deep"
                  >
                    <span className="text-charcoal">{d.label}</span>
                    <span className="text-[11px] uppercase tracking-wider">
                      {d.type}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Closing CTA */}
        <div className="mt-20 rounded-2xl border border-line-light bg-ivory-soft p-8 md:p-12">
          <h2 className="max-w-2xl text-[24px] font-semibold leading-tight tracking-tight text-charcoal md:text-[32px]">
            Want a page like this for your project?
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-warm-gray-deep">
            Every ONA client gets one — restoration or remodel. Updated
            daily until sign-off.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${site.phone}`}
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-[14px] font-medium text-white transition hover:bg-gold-deep"
            >
              Call {site.phoneDisplay}
            </a>
            <Link
              href="/start-project"
              className="inline-flex items-center justify-center rounded-full border border-charcoal px-6 py-3 text-[14px] font-medium text-charcoal transition hover:bg-charcoal hover:text-ivory"
            >
              Start a project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
