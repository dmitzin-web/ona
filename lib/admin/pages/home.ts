import { PLACEHOLDERS, steps } from "../fields";
import type { SectionDef } from "../sections";

// Homepage: every piece of marketing copy. The sample project inside the
// "live project page" demo (NE Hazel Dell, day 7 of 14, the phone feed) is
// an illustration of the product, not copy, and stays in app/page.tsx.
export const HOME: SectionDef = {
  id: "home",
  label: "Homepage",
  file: "content/pages/home.json",
  description: `All text on the homepage, top to bottom. ${PLACEHOLDERS}`,
  kind: "single",
  schema: [
    { kind: "object", key: "seo", label: "Search result", fields: [
      { kind: "text", key: "title", label: "Title (browser tab & Google)", required: true },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 3 },
    ] },
    { kind: "object", key: "hero", label: "Top of the page", fields: [
      { kind: "text", key: "titleLead", label: "Headline — first part", required: true },
      { kind: "text", key: "titleRest", label: "Headline — second part (lighter)", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 4 },
      { kind: "text", key: "ctaCall", label: "Call button", required: true },
      { kind: "text", key: "ctaSecondary", label: "Second button", required: true },
      { kind: "text", key: "ctaSample", label: "Link under the buttons", required: true, hint: "Goes to the sample project page. Say “sample” — the project shown there is an illustration, not a real customer." },
      { kind: "image", key: "photo", label: "Photo", aspect: "4 / 5" },
      { kind: "text", key: "imageAlt", label: "Photo description", required: true },
      { kind: "text", key: "overlayEyebrow", label: "Card on the photo — label", required: true },
      { kind: "text", key: "overlayStatus", label: "Card on the photo — status", required: true },
      { kind: "text", key: "overlayNote", label: "Card on the photo — note", required: true },
      { kind: "text", key: "overlayCta", label: "Card on the photo — link", required: true, hint: "The whole card is a link to the sample project page." },
    ] },
    { kind: "object", key: "projectFile", label: "“Your project page” block", hint: "The sample project shown inside the demo stays as it is.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
      { kind: "text", key: "phoneEyebrow", label: "Phone preview — label", required: true, hint: "Shown on computers and tablets only." },
      { kind: "text", key: "phoneTitle", label: "Phone preview — heading", required: true },
      { kind: "textarea", key: "phoneBody", label: "Phone preview — paragraph", required: true, rows: 3 },
      { kind: "text", key: "linkText", label: "Link to the sample project page", required: true },
    ] },
    { kind: "object", key: "whatWeDo", label: "“What we do” — three lines of work", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "object", key: "restoration", label: "Restoration column", hint: "The service links are the restoration services themselves.", fields: [
        { kind: "text", key: "label", label: "Name", required: true },
        { kind: "text", key: "badge", label: "Badge", required: true },
        { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
        { kind: "text", key: "stepsTitle", label: "Steps heading", required: true },
        steps("steps", "Steps"),
      ] },
      { kind: "object", key: "mold", label: "Mold column", fields: [
        { kind: "text", key: "label", label: "Name", required: true },
        { kind: "text", key: "badge", label: "Badge", required: true },
        { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
        { kind: "strings", key: "links", label: "Links to the mold page (one per line)" },
        { kind: "text", key: "stepsTitle", label: "Steps heading", required: true },
        steps("steps", "Steps"),
      ] },
      { kind: "object", key: "remodel", label: "Remodeling column", fields: [
        { kind: "text", key: "label", label: "Name", required: true },
        { kind: "text", key: "badge", label: "Badge", required: true },
        { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
        { kind: "list", key: "links", label: "Links", itemTitle: "Link", fields: [
          { kind: "text", key: "label", label: "Text", required: true },
          { kind: "text", key: "href", label: "Goes to (e.g. /services/remodeling)", required: true, mono: true },
        ] },
        { kind: "text", key: "stepsTitle", label: "Steps heading", required: true },
        steps("steps", "Steps"),
      ] },
    ] },
    { kind: "object", key: "data", label: "Numbers block", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "stats", label: "Figures", itemTitle: "Figure", hint: "Only figures a real job has produced.", fields: [
        { kind: "text", key: "value", label: "Figure", required: true },
        { kind: "text", key: "label", label: "What it is", required: true },
      ] },
    ] },
    { kind: "list", key: "reassurance", label: "Four promises strip", itemTitle: "Promise", fields: [
      { kind: "text", key: "title", label: "Promise", required: true },
      { kind: "text", key: "hint", label: "Line under it", required: true },
    ] },
    { kind: "object", key: "pricing", label: "“How we charge”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "object", key: "restoration", label: "Restoration", fields: [
        { kind: "text", key: "label", label: "Name", required: true },
        { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 2 },
        { kind: "strings", key: "bullets", label: "Checklist (one per line)" },
      ] },
      { kind: "object", key: "remodel", label: "Remodel", fields: [
        { kind: "text", key: "label", label: "Name", required: true },
        { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 2 },
        { kind: "list", key: "phases", label: "Payment phases", itemTitle: "Phase", fields: [
          { kind: "text", key: "name", label: "Phase", required: true },
          { kind: "text", key: "pct", label: "Share", required: true },
          { kind: "text", key: "body", label: "What is signed", required: true },
        ] },
        { kind: "text", key: "note", label: "Note under the phases", required: true },
      ] },
    ] },
    { kind: "object", key: "gallery", label: "Photo gallery", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "intro", label: "Line beside the heading", required: true, rows: 2 },
      { kind: "list", key: "cards", label: "Photos", itemTitle: "Photo", hint: "Captions: only what is visible in the photo.", fields: [
        { kind: "image", key: "photo", label: "Photo", aspect: "3 / 2" },
        { kind: "text", key: "imageAlt", label: "Photo description", required: true, hint: "Read aloud to blind visitors and shown if the photo fails to load." },
        { kind: "text", key: "kind", label: "Room", required: true },
        { kind: "text", key: "meta", label: "Caption", required: true },
      ] },
      { kind: "text", key: "linkText", label: "Link under the photos", required: true },
    ] },
    { kind: "object", key: "band", label: "Wide photo", fields: [
      { kind: "image", key: "photo", label: "Photo", aspect: "21 / 9" },
      { kind: "text", key: "imageAlt", label: "Photo description", required: true },
    ] },
    { kind: "object", key: "team", label: "“Who you're working with”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "lead", label: "Short paragraph", required: true, rows: 2 },
      { kind: "textarea", key: "body", label: "Main paragraph", required: true, rows: 4 },
      { kind: "text", key: "stepsTitle", label: "Steps heading", required: true },
      { kind: "list", key: "steps", label: "Steps", itemTitle: "Step", fields: [
        { kind: "text", key: "title", label: "Step", required: true },
        { kind: "text", key: "body", label: "Detail", required: true },
      ] },
      { kind: "text", key: "note", label: "Note", required: true },
      { kind: "text", key: "ctaSecondary", label: "Second button", required: true },
    ] },
    { kind: "object", key: "realWork", label: "“Real work” cards", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "text", key: "linkText", label: "Link", required: true },
      { kind: "list", key: "cards", label: "Cards", itemTitle: "Card", fields: [
        { kind: "image", key: "photo", label: "Photo", allowNone: true, aspect: "16 / 10", hint: "Leave empty for a card with no photo." },
        { kind: "text", key: "imageAlt", label: "Photo description", hint: "Read aloud to blind visitors." },
        { kind: "text", key: "kind", label: "Status", required: true },
        { kind: "text", key: "title", label: "Title", required: true },
        { kind: "text", key: "meta", label: "Line", required: true },
        { kind: "text", key: "signalLabel", label: "Chip on the photo (leave empty for none)" },
        { kind: "checkbox", key: "signalLive", label: "Chip has the live pulse" },
      ] },
      { kind: "text", key: "emptyLabel", label: "Label on a card with no photo", required: true },
    ] },
    { kind: "object", key: "closing", label: "Closing “Talk to us”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 2 },
      { kind: "text", key: "ctaCall", label: "Call button", required: true },
      { kind: "text", key: "ctaSecondary", label: "Second button", required: true },
      { kind: "list", key: "facts", label: "Facts beside it", itemTitle: "Fact", fields: [
        { kind: "text", key: "label", label: "Label", required: true },
        { kind: "text", key: "value", label: "Value", required: true },
        { kind: "text", key: "note", label: "Note", required: true },
      ] },
    ] },
    { kind: "list", key: "faqs", label: "FAQ for Google (not shown on the page)", itemTitle: "Question", hint: "Sent to Google as structured data.", fields: [
      { kind: "text", key: "q", label: "Question", required: true },
      { kind: "textarea", key: "a", label: "Answer", required: true, rows: 3 },
    ] },
  ],
};
