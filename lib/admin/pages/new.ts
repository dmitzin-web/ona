import { PLACEHOLDERS } from "../fields";
import type { Field } from "../schema";
import type { SectionDef } from "../sections";
import content from "@/content/pages/new.json";

// /new — the use-first homepage being trialled next to the current one.
// The page has a lot of small copy (the intake's screens, buttons, the
// questions it asks), so instead of hand-listing ~150 fields the form is
// derived from the shape of content/pages/new.json: every string becomes a
// text box, every list of strings a list, every list of objects a repeatable
// group. Add a key to the JSON and read it in the page, and it is editable.
// The safety instructions (gas, sparks, fire …) are NOT here on purpose —
// they live in lib/intake/understand.ts so they can't be softened by accident.
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
  description: `The trial homepage at /new and its Talk / Photo / Type intake. ${PLACEHOLDERS} In the intake, {step} and {steps} are the step the visitor is on and how many there are.`,
  kind: "single",
  schema: fieldsOf(content as unknown as Record<string, unknown>),
};
