import { PLACEHOLDERS } from "../fields";
import type { SectionDef } from "../sections";

// The fixed words around each city's own details on /areas/<slug>
// (app/areas/[slug]/page.tsx). The city's name, county, population, ZIPs,
// neighborhoods, weather, damage list and local note live in
// content/areas.json (Cities). Search keywords and the place names sent to
// Google as structured data (“Beaverton, OR”, “Washington County, Oregon”)
// stay in code: keywords are no longer written into the page (lib/seo.ts),
// and the place names are identifiers, not copy.
export const AREA_PAGE: SectionDef = {
  id: "area-page",
  label: "City page template",
  file: "content/pages/area-page.json",
  description:
    "The words around each city's own details on the ten city pages (/areas/beaverton-or …). The city's details are in Cities. " +
    "Write {area} for the city (Beaverton), {areaState} for its state code (OR), {areaStateName} for the state (Oregon), {county}, " +
    "{population}, {drive} for the drive time from Vancouver in minutes, {zipCount} for how many ZIP codes it has, {zips} for the ZIP codes themselves, " +
    "{topLosses} for its first three kinds of damage and {weather} for its local weather. " +
    `${PLACEHOLDERS} ({city} and {state} are the company's own — Vancouver, WA — not the page's city.)`,
  kind: "single",
  schema: [
    { kind: "object", key: "seo", label: "Search result", hint: "Response times have to be true.", fields: [
      { kind: "text", key: "title", label: "Title (browser tab & Google)", required: true },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 3 },
      { kind: "text", key: "structuredName", label: "Service name sent to Google (not shown)", required: true },
    ] },
    { kind: "object", key: "breadcrumbs", label: "Breadcrumbs", hint: "The trail of links at the top of the page. Google reads it too.", fields: [
      { kind: "text", key: "home", label: "First link (the homepage)", required: true },
      { kind: "text", key: "areas", label: "Second link (all cities)", required: true },
      { kind: "text", key: "city", label: "Last link (this city)", required: true },
    ] },
    { kind: "object", key: "hero", label: "Top of the page", fields: [
      { kind: "text", key: "eyebrow", label: "Label above the headline", required: true },
      { kind: "text", key: "titleLead", label: "Headline — first line", required: true },
      { kind: "text", key: "titleRest", label: "Headline — second line (lighter)", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3, hint: "Response times have to be true." },
      { kind: "text", key: "ctaCall", label: "Call button", required: true },
      { kind: "text", key: "ctaServices", label: "Second button (all services)", required: true },
    ] },
    { kind: "object", key: "local", label: "Local context", hint: "The local note, weather and damage list are each city's own, in Cities.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "text", key: "weatherLabel", label: "Word before the weather (bold)", required: true },
      { kind: "text", key: "lossesTitle", label: "Line above the damage list", required: true },
    ] },
    { kind: "object", key: "coverage", label: "Neighborhoods and ZIP codes", hint: "The neighborhoods and ZIP codes are each city's own, in Cities.", fields: [
      { kind: "text", key: "eyebrow", label: "Neighborhoods — label", required: true },
      { kind: "text", key: "title", label: "Neighborhoods — heading", required: true },
      { kind: "text", key: "zipsEyebrow", label: "ZIP codes — label", required: true },
      { kind: "text", key: "zipsTitle", label: "ZIP codes — heading", required: true },
    ] },
    { kind: "object", key: "services", label: "Services in this city", hint: "The service cards come from Services and link to the city × service pages.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "note", label: "Line under the cards", required: true, rows: 2 },
    ] },
    { kind: "object", key: "faq", label: "FAQ", hint: "Shown on the page and sent to Google.", fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "items", label: "Questions", itemTitle: "Question", fields: [
        { kind: "text", key: "q", label: "Question", required: true },
        { kind: "textarea", key: "a", label: "Answer", required: true, rows: 3, hint: "On Oregon cities the Oregon answer below replaces this one when it is filled in. {topLosses} is the city's first three kinds of damage; {weather} is its local weather." },
        { kind: "textarea", key: "aOregon", label: "Answer on Oregon cities (optional)", rows: 3, hint: "Leave empty to show the same answer on every city. The Oregon CCB registration is pending: nothing may say we are licensed, registered or bonded in Oregon until the number is issued." },
      ] },
    ] },
    { kind: "object", key: "cta", label: "Closing call-to-action band", fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "subtitle", label: "Line under it", required: true, rows: 2, hint: "Response times have to be true." },
    ] },
  ],
};
