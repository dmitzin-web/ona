import { PLACEHOLDERS } from "../fields";
import type { SectionDef } from "../sections";

// /contact: every piece of copy, plus the screen-reader labels of the
// Call / Email / Text links used all over the site
// (components/contact/ContactLinks.tsx). The phone number, email and address
// themselves come from Company details; the map is a fixed embed.
export const CONTACT: SectionDef = {
  id: "contact",
  label: "Contact page",
  file: "content/pages/contact.json",
  description: `All text on /contact, top to bottom. ${PLACEHOLDERS}`,
  kind: "single",
  schema: [
    { kind: "object", key: "seo", label: "Search result", fields: [
      { kind: "text", key: "title", label: "Title (browser tab & Google)", required: true },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 3 },
      { kind: "text", key: "breadcrumb", label: "Name in the breadcrumb trail", required: true },
    ] },
    { kind: "object", key: "hero", label: "Top of the page", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Headline", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
    ] },
    { kind: "object", key: "phoneCard", label: "Phone box", hint: "The number is Company details → Phone.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "note", label: "Line under the number", required: true },
    ] },
    { kind: "object", key: "emailCard", label: "Email box", hint: "The address is Company details → Email.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "textarea", key: "note", label: "Line under the address", required: true, rows: 2, hint: "A reply-time promise has to be one we keep." },
    ] },
    { kind: "object", key: "afterCall", label: "“What happens after you call”", fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 2 },
      { kind: "text", key: "stepLabel", label: "Word before each step number", required: true, hint: "Steps are numbered automatically: “Step 1”, “Step 2” …" },
      { kind: "list", key: "steps", label: "Steps", itemTitle: "Step", hint: "Response-time figures have to be true for the whole area named.", fields: [
        { kind: "text", key: "title", label: "Step", required: true },
        { kind: "textarea", key: "text", label: "Detail", required: true, rows: 2 },
      ] },
    ] },
    { kind: "object", key: "hq", label: "“Headquarters & hours”", fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "text", key: "addressLabel", label: "Address column — label", required: true, hint: "The address is Company details → Public name and Address." },
      { kind: "text", key: "hoursLabel", label: "Hours column — label", required: true },
      { kind: "list", key: "hours", label: "Hours", itemTitle: "Row", hint: "The first row is shown in bold. These lines are only what the page says — the opening hours sent to Google are Company details → Opening hours.", fields: [
        { kind: "text", key: "label", label: "What", required: true },
        { kind: "text", key: "value", label: "When", required: true },
      ] },
      { kind: "text", key: "areaLabel", label: "Service area column — label", required: true },
      { kind: "textarea", key: "areaText", label: "Service area column — text", required: true, rows: 2 },
      { kind: "text", key: "mapTitle", label: "Map description (read aloud by screen readers)", required: true },
      { kind: "text", key: "mapLink", label: "Link under the map", required: true },
    ] },
    { kind: "object", key: "links", label: "Call / Email / Text links — screen-reader labels (whole site)", hint: "What a screen reader says for every Call, Email and Text link on the site, unless that link has its own label.", fields: [
      { kind: "text", key: "callLabel", label: "Call links", required: true },
      { kind: "text", key: "emailLabel", label: "Email links", required: true },
      { kind: "text", key: "smsLabel", label: "Text-message links", required: true },
    ] },
  ],
};
