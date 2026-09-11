import { PLACEHOLDERS } from "../fields";
import type { Schema } from "../schema";
import type { SectionDef } from "../sections";

// The page shown after a quote request (/quote/thanks) and the "page not
// found" page. The phone number on both buttons is Company details → Phone.
const page = (hint?: string): Schema => [
  { kind: "text", key: "eyebrow", label: "Label", required: true },
  { kind: "text", key: "title", label: "Headline", required: true },
  { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3, ...(hint ? { hint } : {}) },
  { kind: "text", key: "backHome", label: "Button back to the homepage", required: true },
];

export const MISC: SectionDef = {
  id: "misc",
  label: "Thank-you & not-found pages",
  file: "content/pages/misc.json",
  description: `The page after someone sends a quote request, and the page shown for a link that doesn't exist. The phone button on both uses Company details → Phone. ${PLACEHOLDERS}`,
  kind: "single",
  schema: [
    { kind: "object", key: "thanks", label: "After a quote request (/quote/thanks)", fields: [
      { kind: "object", key: "seo", label: "Browser tab", hint: "This page is hidden from Google.", fields: [
        { kind: "text", key: "title", label: "Title", required: true },
        { kind: "text", key: "description", label: "Description", required: true },
      ] },
      ...page("A reply-time promise has to be one we keep."),
    ] },
    { kind: "object", key: "notFound", label: "Page not found", fields: page() },
  ],
};
