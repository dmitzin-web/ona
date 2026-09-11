import { PLACEHOLDERS } from "../fields";
import type { SectionDef } from "../sections";

// The fixed words around each service's own copy on /services/<slug>
// (app/services/[slug]/page.tsx). The service's name, headline paragraph,
// introduction, sections, steps, signs and FAQ live in content/services.json
// (Services) and are not repeated here. Search keywords stay in code: they
// are no longer written into the page (see lib/seo.ts).
export const SERVICE_PAGE: SectionDef = {
  id: "service-page",
  label: "Service page template",
  file: "content/pages/service-page.json",
  description:
    "The words around each service's own copy on the five service pages (/services/water-damage …). " +
    "The service's name, headline paragraph, introduction, sections, steps, signs and FAQ are in Services. " +
    "Write {service} for the service's full name (“Water Damage Restoration”), {serviceShort} for its short name (“Water Damage”) " +
    "and {serviceShortLower} for the short name in lower case (“water damage”). " +
    `${PLACEHOLDERS} ({city} and {state} are the company's own, not a service city.)`,
  kind: "single",
  schema: [
    { kind: "object", key: "breadcrumbs", label: "Breadcrumbs", hint: "The trail of links at the top of the page. Google reads it too.", fields: [
      { kind: "text", key: "home", label: "First link (the homepage)", required: true },
      { kind: "text", key: "services", label: "Second link (all services)", required: true },
    ] },
    { kind: "object", key: "hero", label: "Top of the page", hint: "The paragraph under the headline is each service's “Headline paragraph” in Services. Not shown on the mold page, which has its own top (Mold page — extra sections).", fields: [
      { kind: "text", key: "eyebrow", label: "Label above the headline", required: true },
      { kind: "text", key: "title", label: "Headline — first line", required: true },
      { kind: "text", key: "titleSub", label: "Headline — second line (lighter)", required: true },
      { kind: "text", key: "ctaCall", label: "Call button", required: true },
      { kind: "text", key: "ctaEmail", label: "Email button", required: true },
    ] },
    { kind: "object", key: "process", label: "“How the job runs” block", hint: "The steps are each service's “How it works — steps” in Services. Not shown on the mold page.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
    ] },
    { kind: "object", key: "signs", label: "“When to call” block", hint: "The list is each service's “Signs you need this” in Services. Not shown on the mold page.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 2 },
    ] },
    { kind: "object", key: "faq", label: "FAQ", hint: "The questions and answers are each service's FAQ in Services.", fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
    ] },
    { kind: "object", key: "spokane", label: "Spokane wildfire box (fire damage page only)", hint: "Links to the Spokane wildfire page. Spokane is ~350 miles away: no response-time promise here. Never write “bonded and insured”.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Line", required: true },
      { kind: "textarea", key: "body", label: "Smaller line", required: true, rows: 2 },
      { kind: "text", key: "linkText", label: "Link text", required: true },
    ] },
    { kind: "object", key: "cities", label: "Links to the city pages", hint: "One link per city in Cities.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Line beside the heading", required: true, rows: 2 },
      { kind: "text", key: "link", label: "Each link", required: true, hint: "Write {area} for the city and {areaState} for its state code (Beaverton, OR)." },
    ] },
    { kind: "object", key: "related", label: "Other services", hint: "The service cards come from Services.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "allLink", label: "Link to all services", required: true },
    ] },
    { kind: "object", key: "cta", label: "Closing call-to-action band", fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "subtitle", label: "Line under it", required: true, rows: 2, hint: "Response times have to be true." },
    ] },
  ],
};
