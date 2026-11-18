import { PLACEHOLDERS } from "../fields";
import type { Field } from "../schema";
import type { SectionDef } from "../sections";
import content from "@/content/pages/new.json";

// /new — the one-screen homepage being trialled next to the current one:
// "A person answers.", one tappable sentence ("My kitchen is flooded."),
// Call and Text a photo. The form is derived from the shape of
// content/pages/new.json: every string becomes a text box, every list of
// strings a list, every list of objects a repeatable group. Add a key to the
// JSON and read it in the page, and it is editable.
const label = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

function fieldsOf(obj: Record<string, unknown>): Field[] {
  return Object.entries(obj).map(([key, v]): Field => {
    if (typeof v === "string")
      return v.length > 90
        ? { kind: "textarea", key, label: label(key), required: true, rows: 3 }
        : { kind: "text", key, label: label(key), required: true };
    if (Array.isArray(v)) {
      if (v.every((x) => typeof x === "string")) return { kind: "strings", key, label: label(key) };
      return { kind: "list", key, label: label(key), fields: fieldsOf(v[0] as Record<string, unknown>) };
    }
    return { kind: "object", key, label: label(key), fields: fieldsOf(v as Record<string, unknown>) };
  });
}

export const NEW_HOME: SectionDef = {
  id: "new",
  label: "New homepage (/new)",
  file: "content/pages/new.json",
  description: `The trial homepage at /new: one screen with a person-answers headline, a sentence the visitor can change (places × states, each state with its result line), Call and Text a photo. ${PLACEHOLDERS}`,
  kind: "single",
  schema: fieldsOf(content as unknown as Record<string, unknown>),
};
