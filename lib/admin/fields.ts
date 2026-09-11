import type { Schema } from "./schema";

// Field helpers shared by the section definitions (sections.ts and
// lib/admin/pages/*). Pure data: this module is also loaded in the browser.

// Kept in sync with lib/placeholders.ts (not imported: that module reads
// site data).
export const PLACEHOLDERS =
  "Write {name}, {legalName}, {phone}, {email}, {url}, {city} or {state} and it is filled in from Company details.";

export const faqList = (label = "FAQ"): Schema[number] => ({
  kind: "list",
  key: "faqs",
  label,
  itemTitle: "Question",
  fields: [
    { kind: "text", key: "q", label: "Question", required: true },
    { kind: "textarea", key: "a", label: "Answer", required: true, rows: 3 },
  ],
});

// The project photos in /public/photos/projects, picked by thumbnail.
export const PHOTO = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"] as const;
export const THUMBS = Object.fromEntries(PHOTO.map((p) => [p, `/photos/projects/${p}.avif`]));

export const steps = (key: string, label: string): Schema[number] => ({
  kind: "strings", key, label: `${label} (one per line)`,
});
