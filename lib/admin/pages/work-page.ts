import { PLACEHOLDERS } from "../fields";
import type { SectionDef } from "../sections";

// /work/<project> — the "Project File" page a client gets for their job.
// Only the fixed wording around a project lives here. The projects
// themselves (today: the one illustrative sample, NE Hazel Dell) are data
// in app/work/[slug]/page.tsx, and the timeline widget's own labels live
// in components/project/ProjectScrubber.tsx.
export const WORK_PAGE: SectionDef = {
  id: "work-page",
  label: "Client project page template",
  file: "content/pages/work-page.json",
  description: `The fixed text on every project page (/work/…) — the page a client follows their job on. The project details themselves are not edited here. ${PLACEHOLDERS} Also filled in per project: {title}, {kind} (Restoration or Remodel), {area}, {service}, {date}, {day}, {days} and {adjuster}.`,
  kind: "single",
  schema: [
    { kind: "object", key: "seo", label: "Search result", hint: "Project pages are always hidden from Google; this is what a browser tab or a shared link shows.", fields: [
      { kind: "text", key: "sampleTitle", label: "Title of the sample project", required: true, hint: "{title} is the project's title." },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 2, hint: "Uses {kind}, {area}, {service}, {day} and {days}." },
      { kind: "text", key: "notFoundTitle", label: "Title when the project doesn't exist", required: true },
    ] },
    { kind: "text", key: "backLink", label: "Link back to the homepage", required: true },
    { kind: "object", key: "sampleBanner", label: "Sample notice (sample project only)", hint: "Keep this on the sample: the data is illustrative, and a sample must never pass for a real client's job.", fields: [
      { kind: "text", key: "badge", label: "Badge", required: true },
      { kind: "textarea", key: "text", label: "Notice", required: true, rows: 3 },
    ] },
    { kind: "object", key: "header", label: "Under the project title", fields: [
      { kind: "text", key: "opened", label: "Opened date", required: true, hint: "{date} is the day the project opened." },
      { kind: "text", key: "progress", label: "Progress", required: true, hint: "{day} is today's day, {days} the estimated total." },
      { kind: "text", key: "adjuster", label: "Adjuster", required: true, hint: "{adjuster} is the insurance company. Hidden when there is none." },
    ] },
    { kind: "object", key: "totals", label: "Totals under the timeline", fields: [
      { kind: "text", key: "scopeLabel", label: "Approved scope — label", required: true },
      { kind: "text", key: "scopeNote", label: "Approved scope — note", required: true, hint: "Never offer to waive, cover or absorb a deductible (RCW 48.30.230). “Homeowner pays deductible only” is fine." },
      { kind: "text", key: "photosLabel", label: "Photo record — label", required: true, hint: "The number of photos comes from the project." },
      { kind: "text", key: "photosNote", label: "Photo record — note", required: true },
      { kind: "text", key: "docsLabel", label: "Documents — label", required: true, hint: "The list of documents comes from the project." },
    ] },
    { kind: "object", key: "closing", label: "Closing “Want a page like this?”", fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 2 },
      { kind: "text", key: "ctaCall", label: "Call button", required: true },
      { kind: "text", key: "ctaSecondary", label: "Second button", required: true },
    ] },
  ],
};
