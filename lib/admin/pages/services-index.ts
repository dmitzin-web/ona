import type { Schema } from "../schema";
import type { SectionDef } from "../sections";

// /services: the overview page's own copy. Service names, headline
// paragraphs and the restoration cards come from Services; the city list
// from Cities — they are edited there, not here.
const featured = (key: string, label: string, service: string): Schema[number] => ({
  kind: "object",
  key,
  label,
  hint: `The name in front of the headline and the paragraph under it are Services → ${service} (Short name, Headline paragraph).`,
  fields: [
    { kind: "text", key: "eyebrow", label: "Label", required: true },
    { kind: "text", key: "tagline", label: "Line beside the label", required: true },
    { kind: "text", key: "accent", label: "Headline after the name (in colour)", required: true },
    { kind: "text", key: "linkText", label: "Link", required: true },
  ],
});

export const SERVICES_INDEX: SectionDef = {
  id: "services-index",
  label: "Services overview page (/services)",
  file: "content/pages/services-index.json",
  description: "The /services page's own text, top to bottom. Each service's name and paragraphs are edited in Services; the cities in Cities.",
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
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3, hint: "Keep the Washington registration number — the law requires it in advertising. Nothing may say we are licensed or registered in Oregon while that registration is pending." },
    ] },
    featured("remodeling", "Remodeling box", "Remodeling & Reconstruction"),
    featured("mold", "Mold box", "Mold Remediation"),
    { kind: "object", key: "restoration", label: "Restoration cards", hint: "The cards are Services → Water Damage, Fire & Smoke and Storm Damage.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "tagline", label: "Line beside the label", required: true, hint: "A response-time figure has to be one we keep." },
    ] },
    { kind: "object", key: "serviceArea", label: "Service area", hint: "The city links are the cities in Cities.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
    ] },
  ],
};
