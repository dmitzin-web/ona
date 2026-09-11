import { PLACEHOLDERS } from "../fields";
import type { SectionDef } from "../sections";

// The fixed words around the service and city data on
// /services/<service>/<city> (app/services/[slug]/[area]/page.tsx) — 50
// pages from one template. Service copy lives in content/services.json,
// city details in content/areas.json. Search keywords and the place names
// sent to Google as structured data stay in code (see area-page.ts).
// The Spokane wildfire page shares this route; only its search result is
// set here — the page itself is components/services/SpokaneFireDeployment.tsx.
export const SERVICE_AREA_PAGE: SectionDef = {
  id: "service-area-page",
  label: "City × service page template",
  file: "content/pages/service-area-page.json",
  description:
    "The words around the service and city details on the 50 city × service pages (/services/water-damage/beaverton-or …). " +
    "Service copy is in Services, city details in Cities. " +
    "Write {service} for the service's full name (Water Damage Restoration), {serviceShort} for its short name (Water Damage), " +
    "{serviceShortLower} for the short name in lower case (water damage), {area} for the city (Beaverton), {areaState} for its state code (OR), " +
    "{county}, and {drive} for the drive time from Vancouver in minutes. " +
    `${PLACEHOLDERS} ({city} and {state} are the company's own — Vancouver, WA — not the page's city.) ` +
    "Response times must be true for every city this template renders.",
  kind: "single",
  schema: [
    { kind: "object", key: "seo", label: "Search result", fields: [
      { kind: "text", key: "title", label: "Title (browser tab & Google)", required: true },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 3, hint: "Used for every city except our home base." },
      { kind: "textarea", key: "descriptionHome", label: "Description — home base city", required: true, rows: 3, hint: "Used instead for the city we are based in (drive time 0 in Cities)." },
      { kind: "text", key: "structuredName", label: "Service name sent to Google (not shown)", required: true },
    ] },
    { kind: "object", key: "breadcrumbs", label: "Breadcrumbs", hint: "The trail of links at the top of the page. Google reads it too. The third link is the service's short name.", fields: [
      { kind: "text", key: "home", label: "First link (the homepage)", required: true },
      { kind: "text", key: "services", label: "Second link (all services)", required: true },
      { kind: "text", key: "city", label: "Last link (this page)", required: true },
    ] },
    { kind: "object", key: "hero", label: "Top of the page", hint: "The paragraph under the headline is each service's “Headline paragraph” in Services.", fields: [
      { kind: "text", key: "eyebrow", label: "Label above the headline", required: true },
      { kind: "text", key: "titleLead", label: "Headline — first part", required: true },
      { kind: "text", key: "titleCity", label: "Headline — bold part", required: true },
      { kind: "text", key: "titleEnd", label: "Headline — end", required: true },
      { kind: "textarea", key: "response", label: "Response line", required: true, rows: 2, hint: "Used for every city except our home base." },
      { kind: "textarea", key: "responseHome", label: "Response line — home base city", required: true, rows: 2, hint: "Used instead for the city we are based in (drive time 0 in Cities)." },
    ] },
    { kind: "object", key: "stats", label: "Four figures under the top", hint: "The county and service figures come from Cities and Services.", fields: [
      { kind: "text", key: "responseLabel", label: "Response target — label", required: true },
      { kind: "text", key: "responseValue", label: "Response target — figure", required: true },
      { kind: "text", key: "fromHqLabel", label: "Distance — label", required: true },
      { kind: "text", key: "fromHqValue", label: "Distance — figure", required: true, hint: "Used for every city except our home base." },
      { kind: "text", key: "fromHqValueHome", label: "Distance — figure for the home base city", required: true },
      { kind: "text", key: "countyLabel", label: "County — label", required: true },
      { kind: "text", key: "serviceLabel", label: "Service — label", required: true },
    ] },
    { kind: "object", key: "about", label: "About the service", hint: "The paragraph is each service's “Introduction” in Services.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
    ] },
    { kind: "object", key: "local", label: "The city", hint: "The local note, weather, damage list and neighborhoods are each city's own, in Cities.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "text", key: "weatherTitle", label: "Weather — heading", required: true },
      { kind: "text", key: "lossesTitle", label: "Damage list — heading", required: true },
      { kind: "text", key: "neighborhoodsTitle", label: "Neighborhoods — heading", required: true, hint: "Only shown when the city has neighborhoods listed." },
    ] },
    { kind: "object", key: "process", label: "Process", hint: "The steps are each service's “How it works — steps” in Services.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
    ] },
    { kind: "object", key: "faq", label: "FAQ", hint: "The questions and answers are each service's FAQ in Services.", fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
    ] },
    { kind: "object", key: "otherCities", label: "Same service, other cities", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "link", label: "Each link", required: true, hint: "Here {area} and {areaState} are the other city the link goes to." },
    ] },
    { kind: "object", key: "otherServices", label: "Other services in this city", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "link", label: "Each link", required: true, hint: "Here {serviceShort} is the other service the link goes to." },
      { kind: "text", key: "backService", label: "Link back to the service page", required: true },
      { kind: "text", key: "backArea", label: "Link back to the city page", required: true },
    ] },
    { kind: "object", key: "cta", label: "Closing call-to-action band", fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "subtitle", label: "Line under it", required: true, rows: 2 },
    ] },
  ],
};
