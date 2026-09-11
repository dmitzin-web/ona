import { faqList, PLACEHOLDERS } from "../fields";
import type { Field } from "../schema";
import type { SectionDef } from "../sections";

// /quote — the quote request page and its form, including the error
// messages the form shows. The damage-type codes the form sends (water,
// fire …) are checked by the server and stay in code; so do the hidden
// anti-spam field and the 8-photo limit itself (app/quote/actions.ts).
const RESPONSE_TIMES =
  "Every response time here is a promise. Only write times we meet every time — no promise we can't keep.";

const box = (key: string, label: string, extra: Field[] = []): Field => ({
  kind: "object",
  key,
  label,
  fields: [
    { kind: "text", key: "label", label: "Label", required: true },
    ...extra,
  ],
});
const mark: Field = { kind: "text", key: "mark", label: "Small grey note after the label", required: true, hint: "e.g. “*” for required." };
const placeholder: Field = { kind: "text", key: "placeholder", label: "Grey example text inside the box", required: true };
const option = (key: string, code: string): Field => ({
  kind: "text", key, label: `Choice “${code}”`, required: true,
  hint: `Sent to us as “${code}”. That code stays fixed — only the words change.`,
});

export const QUOTE: SectionDef = {
  id: "quote",
  label: "Quote request page",
  file: "content/pages/quote.json",
  description: `All text on the /quote page, top to bottom, including the form and its error messages. ${PLACEHOLDERS} In “What happens next”, {n} is the step's number.`,
  kind: "single",
  schema: [
    { kind: "object", key: "seo", label: "Search result", fields: [
      { kind: "text", key: "title", label: "Title (browser tab & Google)", required: true },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 3, hint: RESPONSE_TIMES },
    ] },
    { kind: "object", key: "breadcrumb", label: "Breadcrumb trail", fields: [
      { kind: "text", key: "home", label: "First link", required: true },
      { kind: "text", key: "current", label: "This page", required: true },
      { kind: "text", key: "currentForGoogle", label: "This page, as sent to Google", required: true },
    ] },
    { kind: "object", key: "intro", label: "Top of the page", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
      { kind: "text", key: "phoneLine", label: "Phone link", required: true },
      { kind: "text", key: "smsLine", label: "Text-message link", required: true, hint: "The email link shows the address from Company details." },
    ] },
    { kind: "object", key: "form", label: "The form", fields: [
      box("name", "Name", [mark]),
      box("phone", "Phone", [mark, placeholder]),
      box("email", "Email", [mark]),
      box("address", "Property address", [placeholder]),
      box("damageType", "Damage type", [
        mark,
        { kind: "text", key: "placeholder", label: "Shown before a choice is made", required: true },
        { kind: "object", key: "options", label: "Choices", fields: [
          option("water", "water"),
          option("fire", "fire"),
          option("mold", "mold"),
          option("storm", "storm"),
          option("other", "other"),
        ] },
      ]),
      box("description", "What happened", [mark, placeholder]),
      { kind: "object", key: "photos", label: "Photos", hint: "The form keeps at most 8 photos. Changing the number in the label does not change that limit.", fields: [
        { kind: "text", key: "label", label: "Label", required: true },
        { kind: "text", key: "help", label: "Line under it", required: true },
      ] },
      { kind: "object", key: "consent", label: "Consent checkbox", hint: "The link goes to the privacy policy.", fields: [
        { kind: "text", key: "beforeLink", label: "Text before the link", required: true },
        { kind: "text", key: "linkText", label: "Link", required: true },
        { kind: "text", key: "afterLink", label: "Text after the link", required: true },
      ] },
      { kind: "text", key: "submit", label: "Send button", required: true },
      { kind: "text", key: "sending", label: "Send button while sending", required: true },
      { kind: "object", key: "errors", label: "Error messages", fields: [
        { kind: "text", key: "name", label: "No name", required: true },
        { kind: "text", key: "phoneOrEmail", label: "No phone and no email", required: true },
        { kind: "text", key: "email", label: "Email doesn't look right", required: true },
        { kind: "text", key: "damageType", label: "No damage type picked", required: true },
        { kind: "text", key: "description", label: "Description missing or too short", required: true },
        { kind: "text", key: "consent", label: "Consent box not ticked", required: true },
      ] },
    ] },
    { kind: "object", key: "include", label: "“What to include”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "items", label: "Things to include", itemTitle: "Item", hint: "Numbered 01, 02 … automatically.", fields: [
        { kind: "text", key: "title", label: "Title", required: true },
        { kind: "textarea", key: "text", label: "Detail", required: true, rows: 2 },
      ] },
    ] },
    { kind: "object", key: "next", label: "“What happens next”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "text", key: "stepLabel", label: "Label above each step", required: true, hint: "{n} is the step's number." },
      { kind: "list", key: "steps", label: "Steps", itemTitle: "Step", hint: RESPONSE_TIMES, fields: [
        { kind: "text", key: "title", label: "Step", required: true },
        { kind: "textarea", key: "text", label: "Detail", required: true, rows: 2 },
      ] },
    ] },
    { kind: "object", key: "responseTimes", label: "“When you'll hear back”", hint: RESPONSE_TIMES, fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "items", label: "Response times", itemTitle: "Response time", fields: [
        { kind: "text", key: "label", label: "Channel", required: true },
        { kind: "text", key: "value", label: "Time", required: true },
        { kind: "textarea", key: "note", label: "Detail", required: true, rows: 2 },
      ] },
    ] },
    { kind: "text", key: "faqTitle", label: "FAQ heading", required: true },
    { ...faqList(), hint: RESPONSE_TIMES },
  ],
};
