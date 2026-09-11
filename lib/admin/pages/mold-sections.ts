import { PLACEHOLDERS } from "../fields";
import type { SectionDef } from "../sections";

// The dedicated blocks on /services/mold-removal
// (components/services/MoldSections.tsx), shown in place of the service
// template's top, introduction, sections, steps and signs.
export const MOLD_SECTIONS: SectionDef = {
  id: "mold-sections",
  label: "Mold page — extra sections",
  file: "content/pages/mold-sections.json",
  description:
    "The mold page (/services/mold-removal) replaces the usual top, introduction, sections, steps and signs with these blocks. " +
    "Its introduction, steps, signs and FAQ are still Mold Remediation's in Services. " +
    "Every claim here must be operationally true — IICRC S520 method, sealed containment with HEPA negative air, independent clearance testing, " +
    "direct insurance billing, one crew through the rebuild — and no reviews, counts or figures we can't back. " +
    PLACEHOLDERS,
  kind: "single",
  schema: [
    { kind: "object", key: "hero", label: "Top of the page", hint: "The paragraph under the headline is Mold Remediation's “Introduction” in Services.", fields: [
      { kind: "text", key: "eyebrow", label: "Label above the headline", required: true },
      { kind: "text", key: "titleLead", label: "Headline — first part", required: true },
      { kind: "text", key: "titleRest", label: "Headline — second part (lighter)", required: true },
      { kind: "text", key: "ctaCall", label: "Call button", required: true },
      { kind: "text", key: "ctaEmail", label: "Email button", required: true },
      { kind: "strings", key: "credibility", label: "Strip under the buttons (one per line)", hint: "Only what we do on every job." },
    ] },
    { kind: "object", key: "why", label: "“Why most mold jobs fail”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "strings", key: "paragraphs", label: "Paragraphs (one per line)", required: true },
    ] },
    { kind: "object", key: "method", label: "“The Ona method” — steps", hint: "The steps are Mold Remediation's “How it works — steps” in Services. If their number changes, change the number in the heading too.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
    ] },
    { kind: "object", key: "whyOna", label: "“Why Ona for mold”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "items", label: "Reasons", itemTitle: "Reason", fields: [
        { kind: "text", key: "title", label: "Title", required: true },
        { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
      ] },
    ] },
    { kind: "object", key: "health", label: "Health & insurance", hint: "Never offer to waive, cover or absorb a deductible (RCW 48.30.230) — the customer pays their deductible.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "textarea", key: "lead", label: "Large line", required: true, rows: 2 },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
    ] },
    { kind: "object", key: "signs", label: "“When to call” block", hint: "The list is Mold Remediation's “Signs you need this” in Services.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 2 },
    ] },
  ],
};
