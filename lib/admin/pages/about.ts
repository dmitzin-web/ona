import { faqList, PLACEHOLDERS } from "../fields";
import type { SectionDef } from "../sections";

// /about: every piece of copy. The credentials list comes from Company
// details and the values grid from Company details → Company values. The
// hidden founder section (SHOW_FOUNDER in app/about/page.tsx) is not on the
// site and stays in code until it is switched back on.
export const ABOUT: SectionDef = {
  id: "about",
  label: "About page",
  file: "content/pages/about.json",
  description: `All text on /about, top to bottom. ${PLACEHOLDERS} {founded} is filled in with the year founded.`,
  kind: "single",
  schema: [
    { kind: "object", key: "seo", label: "Search result", fields: [
      { kind: "text", key: "title", label: "Title (browser tab & Google)", required: true },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 3, hint: "Keep the Washington registration number — the law requires it in advertising." },
      { kind: "text", key: "breadcrumb", label: "Name in the breadcrumb trail", required: true },
    ] },
    { kind: "object", key: "hero", label: "Top of the page", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Headline", required: true },
      { kind: "object", key: "intro", label: "First paragraph", hint: "Written in three parts because the pronunciation is set in a different typeface.", fields: [
        { kind: "textarea", key: "beforePronunciation", label: "Text before the pronunciation", required: true, rows: 2 },
        { kind: "text", key: "pronunciation", label: "Pronunciation", required: true },
        { kind: "textarea", key: "afterPronunciation", label: "Text after the pronunciation", required: true, rows: 3 },
      ] },
      { kind: "textarea", key: "body", label: "Second paragraph", required: true, rows: 5 },
      { kind: "object", key: "registration", label: "Registration paragraph", hint: "The number links to the state's verification page. Do not say we are licensed, registered or bonded in Oregon — the Oregon CCB registration is pending.", fields: [
        { kind: "text", key: "beforeNumber", label: "Text before the number", required: true },
        { kind: "text", key: "number", label: "WA registration number (the link)", required: true, mono: true, hint: "Washington requires this number in advertising." },
        { kind: "textarea", key: "afterNumber", label: "Text after the number", required: true, rows: 3 },
      ] },
      { kind: "text", key: "credentialsLabel", label: "Label over the credentials box", required: true, hint: "The credentials themselves are in Company details → Credentials." },
    ] },
    { kind: "object", key: "howWeWork", label: "“Three things we do differently”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "items", label: "Points", itemTitle: "Point", hint: "Numbered 01, 02, 03 … automatically.", fields: [
        { kind: "text", key: "title", label: "Title", required: true },
        { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 4 },
      ] },
    ] },
    { kind: "object", key: "setup", label: "“How we're set up” figures", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "stats", label: "Figures", itemTitle: "Figure", hint: "Only facts that can be checked today. No Google rating until the Google Business Profile has real reviews.", fields: [
        { kind: "text", key: "label", label: "Label", required: true },
        { kind: "text", key: "value", label: "Figure", required: true },
        { kind: "textarea", key: "note", label: "Note", required: true, rows: 2 },
      ] },
    ] },
    { kind: "object", key: "faq", label: "Questions", hint: "The values grid above this is edited in Company details → Company values.", fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
      { ...faqList("Questions and answers"), hint: "Also sent to Google as structured data. Oregon: the CCB registration is pending — no answer may say we are licensed, registered or bonded there. No response-time promises we can't keep." },
    ] },
  ],
};
