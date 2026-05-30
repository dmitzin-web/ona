import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { ProjectScrubber, type Phase } from "@/components/project/ProjectScrubber";

// ─────────────────────────────────────────────────────────────
// Project File — public page template
// ─────────────────────────────────────────────────────────────
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
  phases: Phase[];
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
    phases: [
      {
        day: "Day 1",
        dayNumber: 1,
        date: "May 18",
        title: "Initial moisture mapping",
        body: "Crew on site 9:42 AM. Mapped 6.2 m² of saturated subfloor under sink and dishwasher. Containment set, three dehumidifiers placed, six air movers running. Homeowner walkthrough completed; mitigation authorization signed.",
        moisture: [
          { location: "Subfloor (sink)", pct: 32 },
          { location: "Subfloor (DW)", pct: 28 },
          { location: 'Drywall (lower 18")', pct: 24 },
          { location: "Cabinet base", pct: 21 },
        ],
        equipment: [
          "3 × Dri-Eaz LGR 7000XLi dehumidifiers",
          "6 × axial air movers",
          "6 mil containment, kitchen perimeter",
        ],
        photosAdded: 18,
        docsAdded: ["Mitigation authorization (signed)"],
        changeNotes: [
          "Affected area mapped — 6.2 m²",
          "Containment up — rest of the home isolated",
        ],
      },
      {
        day: "Day 2",
        dayNumber: 2,
        date: "May 19",
        title: "Photo + scope upload to insurer",
        body: "Uploaded 38 photos and the Day 1–2 moisture map to the Liberty Mutual claim portal. Requested adjuster site visit for May 20. Overnight readings down 4–6 points across all four locations.",
        moisture: [
          { location: "Subfloor (sink)", pct: 28 },
          { location: "Subfloor (DW)", pct: 23 },
          { location: 'Drywall (lower 18")', pct: 19 },
          { location: "Cabinet base", pct: 17 },
        ],
        equipment: [
          "3 × Dri-Eaz LGR 7000XLi dehumidifiers",
          "6 × axial air movers",
          "6 mil containment, kitchen perimeter",
        ],
        photosAdded: 38,
        docsAdded: [
          "Moisture map (Day 1–2)",
          "Scope of loss to Liberty Mutual",
        ],
        changeNotes: [
          "Claim filed with insurer",
          "Adjuster site visit requested for Day 3",
        ],
      },
      {
        day: "Day 3",
        dayNumber: 3,
        date: "May 20",
        title: "Adjuster walkthrough — scope agreed",
        body: 'Liberty Mutual adjuster on site 1:10 PM. Scope agreed: lower cabinets (4), 8\' × 6\' subfloor, drywall to 18", baseboards. Total approved: $14,820. No coverage disputes. Cabinet drying past hope — replacement confirmed.',
        moisture: [
          { location: "Subfloor (sink)", pct: 24 },
          { location: "Subfloor (DW)", pct: 19 },
          { location: 'Drywall (lower 18")', pct: 16 },
          { location: "Cabinet base", pct: 15 },
        ],
        equipment: [
          "3 × Dri-Eaz LGR 7000XLi dehumidifiers",
          "6 × axial air movers",
          "6 mil containment, kitchen perimeter",
        ],
        photosAdded: 27,
        docsAdded: ["Liberty Mutual adjuster scope (PDF)"],
        changeNotes: [
          "Scope approved — $14,820 billed direct",
          "Cabinet replacement spec confirmed",
        ],
      },
      {
        day: "Day 5",
        dayNumber: 5,
        date: "May 22",
        title: "Drying complete — equipment off",
        body: "All four readings below 16% MC threshold. Equipment removed and logged out at 4:30 PM. Demo scheduled for Day 6. Power-bill reimbursement form filed with the carrier.",
        moisture: [
          { location: "Subfloor (sink)", pct: 15 },
          { location: "Subfloor (DW)", pct: 14 },
          { location: 'Drywall (lower 18")', pct: 12 },
          { location: "Cabinet base", pct: 13 },
        ],
        equipment: ["All drying equipment removed"],
        photosAdded: 14,
        docsAdded: [
          "Daily moisture log (Day 1–5, CSV)",
          "Equipment removal log",
        ],
        changeNotes: [
          "Structure dry — under 16% MC across all readings",
          "Power-bill reimbursement form filed",
        ],
      },
      {
        day: "Day 6",
        dayNumber: 6,
        date: "May 23",
        title: "Demo complete",
        body: 'Lower cabinets (4), 8\' × 6\' subfloor, drywall to 18" and baseboards removed and disposed. Disposal weight logged with the haul-away receipt. Cabinet order placed — 8-day lead time on the Cardinal maple shaker spec.',
        equipment: ["Hand tools only", "Dust containment in place"],
        photosAdded: 22,
        docsAdded: [
          "Demo disposal log",
          "Cabinet spec — Cardinal Maple Shaker (PDF)",
        ],
        changeNotes: [
          "Demo scope complete",
          "Cabinets ordered — arrival ~Day 9",
        ],
      },
      {
        day: "Day 7",
        dayNumber: 7,
        date: "May 24",
        title: "Rebuild started",
        body: 'Subfloor laid and squared 8:00 AM (Marcus + James on site since 7:30 AM). Drywall to 18" hung and taped, first coat of mud on. On schedule for cabinet install Day 9 — kitchen back in full use by Day 14.',
        equipment: [
          "Marcus + James on site since 7:30 AM",
          "Drywall + flooring tools",
        ],
        photosAdded: 23,
        docsAdded: ["Subfloor material receipts (3)"],
        changeNotes: [
          "New subfloor in",
          "Drywall up + first coat of mud",
        ],
      },
      {
        day: "Day 14",
        dayNumber: 14,
        date: "Est. May 31",
        title: "Estimated complete",
        body: "Cabinets installed, flooring laid, paint complete, final walkthrough with homeowner. Project closed in the Project File. Three-year workmanship warranty starts.",
        estimated: true,
        changeNotes: [
          "Final walkthrough scheduled",
          "Kitchen back in full use",
          "3-year workmanship warranty starts",
        ],
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
    // Project File pages are PRIVATE by policy — they carry a homeowner's
    // neighborhood, adjuster, approved claim amount and document labels.
    // ALL of them are noindex/nofollow, real and sample alike: the sample
    // is illustrative (no need to rank fictional data) and real client
    // pages must never appear in search. Access control for real projects
    // is the unguessable slug (treated as a bearer token in the URL) plus
    // this noindex; a hard X-Robots-Tag header in next.config.ts backs it
    // up at the edge. See the projects-map comment for how to add one.
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
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
    <div className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20 lg:px-10">
        <Link
          href="/"
          className="text-[13px] text-ivory/75 underline-offset-4 hover:text-ivory hover:underline"
        >
          ← ONA Restoration
        </Link>

        {/* Sample banner — removed for real projects */}
        {p.isSample ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-ivory/10 bg-charcoal-soft p-4 text-[13px]">
            <span className="mt-0.5 rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-gold">
              Sample
            </span>
            <p className="text-ivory/75">
              This is a sample of what your project page looks like. The
              data is illustrative — no real customer is shown. Real
              client pages are private and shared only with the homeowner
              and adjuster.
            </p>
          </div>
        ) : null}

        {/* Header */}
        <div className="mt-10">
          <p className="eyebrow text-ivory/75">
            {p.kind} · {p.service}
          </p>
          <h1 className="mt-4 text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] text-ivory md:text-[56px]">
            {p.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-ivory/75">
            <span className="flex items-center gap-2 text-ivory">
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

        {/* The wow moment — interactive timeline scrubber.
            Full-width on the page so the scrub feels like the
            page's centerpiece, not a sidebar widget. */}
        <div className="mt-16">
          <ProjectScrubber
            phases={p.phases}
            currentDayNumber={p.currentDay}
          />
        </div>

        {/* Aggregate strip — totals across the whole project.
            Kept compact and below the scrubber so the interactive
            timeline gets the full canvas. */}
        <div className="mt-20 grid gap-10 border-t border-ivory/10 pt-12 md:grid-cols-3 md:gap-12">
          {p.approvedScope ? (
            <div>
              <div className="eyebrow text-ivory/50">Approved scope</div>
              <div className="mt-3 text-[32px] font-semibold tabular-nums leading-none text-ivory">
                {p.approvedScope}
              </div>
              <div className="mt-3 text-[13px] text-ivory/65">
                Billed directly to insurer. Homeowner pays deductible
                only.
              </div>
            </div>
          ) : null}

          <div>
            <div className="eyebrow text-ivory/50">Photo record</div>
            <div className="mt-3 text-[32px] font-semibold tabular-nums leading-none text-ivory">
              {p.photosCount}
            </div>
            <div className="mt-3 text-[13px] text-ivory/65">
              Uploaded daily. Every reading, every change of scope.
            </div>
          </div>

          <div>
            <div className="eyebrow text-ivory/50">Documents on file</div>
            <ul className="mt-3 space-y-2 text-[13px]">
              {p.docs.map((d) => (
                <li
                  key={d.label}
                  className="flex items-start justify-between gap-3 border-t border-ivory/10 pt-2 text-ivory/75"
                >
                  <span className="text-ivory">{d.label}</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wider text-ivory/45">
                    {d.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="mt-20 rounded-2xl border border-ivory/10 bg-charcoal-soft p-8 md:p-12">
          <h2 className="max-w-2xl text-[24px] font-semibold leading-tight tracking-tight text-ivory md:text-[32px]">
            Want a page like this for your project?
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ivory/75">
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
              className="inline-flex items-center justify-center rounded-full border border-ivory px-6 py-3 text-[14px] font-medium text-ivory transition hover:bg-ivory hover:text-charcoal"
            >
              Start a project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
