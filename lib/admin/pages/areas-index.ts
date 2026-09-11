import type { SectionDef } from "../sections";

// /areas: the page's own copy. The city list is Cities.
export const AREAS_INDEX: SectionDef = {
  id: "areas-index",
  label: "Service areas page (/areas)",
  file: "content/pages/areas-index.json",
  description: "The /areas page's own text. The list of cities under it comes from Cities.",
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
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3, hint: "A response-time figure has to be true for every place named." },
    ] },
  ],
};
