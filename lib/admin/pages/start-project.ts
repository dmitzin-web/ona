import { PLACEHOLDERS } from "../fields";
import type { Field } from "../schema";
import type { SectionDef } from "../sections";

// /start-project — the four-question intake. Every word the visitor sees.
// The answer codes each choice sends (restoration-urgent, 30-days …), the
// number of steps and the fallback e-mail the browser opens if sending
// fails are part of how the form works and stay in app/start-project/page.tsx.
const choice = (key: string, label: string, code: string): Field => ({
  kind: "object",
  key,
  label,
  hint: `Sent to us as “${code}”. That code stays fixed — only the words change.`,
  fields: [
    { kind: "text", key: "label", label: "Choice", required: true },
    { kind: "text", key: "hint", label: "Line under it", required: true },
  ],
});

const heading = (hint?: string): Field[] => [
  { kind: "text", key: "label", label: "Label", required: true },
  { kind: "text", key: "title", label: "Question", required: true },
  { kind: "text", key: "hint", label: "Line under the question", required: true, hint },
];

const input = (key: string, label: string): Field => ({
  kind: "object",
  key,
  label,
  fields: [
    { kind: "text", key: "label", label: "Label above the box", required: true },
    { kind: "text", key: "placeholder", label: "Grey example text inside the box", required: true },
  ],
});

export const START_PROJECT: SectionDef = {
  id: "start-project",
  label: "Start a project page",
  file: "content/pages/start-project.json",
  description: `The four-question “Start a project” form, the buttons under it and the thank-you screen. ${PLACEHOLDERS} {step} and {steps} are filled in with the step the visitor is on and the number of steps; {firstName} with the first name they typed.`,
  kind: "single",
  schema: [
    { kind: "object", key: "seo", label: "Search result", fields: [
      { kind: "text", key: "title", label: "Title (browser tab & Google)", required: true },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 3 },
    ] },
    { kind: "object", key: "progress", label: "Above the form", fields: [
      { kind: "text", key: "stepOf", label: "Step counter", required: true, hint: "e.g. “Step {step} of {steps}”." },
      { kind: "text", key: "cancel", label: "Cancel link", required: true },
    ] },
    { kind: "object", key: "kind", label: "Question 1 — what kind of project", fields: [
      ...heading(),
      { kind: "object", key: "options", label: "Choices", fields: [
        choice("urgent", "Choice 1", "restoration-urgent"),
        choice("notUrgent", "Choice 2", "restoration-not-urgent"),
        choice("remodel", "Choice 3", "remodel"),
        choice("notSure", "Choice 4", "not-sure"),
      ] },
    ] },
    { kind: "object", key: "where", label: "Question 2 — where", fields: [
      ...heading(),
      input("zip", "ZIP code box"),
      input("neighborhood", "Neighborhood box"),
    ] },
    { kind: "object", key: "when", label: "Question 3 — when", fields: [
      ...heading(),
      { kind: "object", key: "options", label: "Choices", fields: [
        choice("asap", "Choice 1", "asap"),
        choice("days30", "Choice 2", "30-days"),
        choice("days90", "Choice 3", "90-days"),
        choice("planning", "Choice 4", "planning"),
      ] },
    ] },
    { kind: "object", key: "contact", label: "Question 4 — contact details", fields: [
      ...heading("A promise of how fast we call back has to be one we keep every time."),
      input("name", "Name box"),
      input("phone", "Phone box"),
      input("email", "Email box"),
      input("note", "Note box"),
    ] },
    { kind: "object", key: "buttons", label: "Buttons under the form", fields: [
      { kind: "text", key: "back", label: "Back", required: true },
      { kind: "text", key: "next", label: "Continue", required: true },
      { kind: "text", key: "submit", label: "Send (last step)", required: true },
      { kind: "text", key: "sending", label: "While sending", required: true },
    ] },
    { kind: "object", key: "done", label: "Thank-you screen (after sending)", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true, hint: "{firstName} is the first name the visitor typed." },
      { kind: "text", key: "nameFallback", label: "Used instead of the name when none was typed", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 2 },
      { kind: "text", key: "ctaCall", label: "Call button", required: true },
      { kind: "text", key: "ctaHome", label: "Second button", required: true },
    ] },
  ],
};
