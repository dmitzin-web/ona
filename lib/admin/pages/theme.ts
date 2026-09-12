import type { SectionDef } from "../sections";

// Appearance: the site's colours and corner radius. Every colour here is a
// role a non-developer can see on the page, and the shades derived from it
// (hover, hairlines, muted type) are computed in lib/theme.ts so nothing
// can drift. The admin warns when a combination becomes hard to read.
export const THEME: SectionDef = {
  id: "theme",
  label: "Appearance (colours)",
  file: "content/theme.json",
  description:
    "The colours and corner rounding of the whole site. Change one and every page follows. The editor warns you if a combination becomes hard to read.",
  kind: "single",
  schema: [
    { kind: "color", key: "ground", label: "Page background", hint: "The colour behind everything. White on this site." },
    { kind: "color", key: "ink", label: "Text", hint: "Headlines and body text." },
    { kind: "color", key: "band", label: "Striped section background", hint: "Every other section uses this to separate it from the one above." },
    { kind: "color", key: "well", label: "Inset background", hint: "Boxes and panels inside a section." },
    { kind: "color", key: "line", label: "Lines and borders" },
    { kind: "color", key: "accent", label: "Links and small buttons", hint: "The teal used for links, icons and status." },
    { kind: "color", key: "surface", label: "Dark band", hint: "The deep colour behind whole sections (footer, “what happens when you call”). White text sits on it." },
    { kind: "color", key: "action", label: "Call button", hint: "The one loud colour on the site. Only the Call action uses it." },
    { kind: "number", key: "radius", label: "Corner rounding (pixels)", min: 0, max: 24, integer: true, hint: "0 = sharp corners, 2 = the current look, 12 = very round. Applies to buttons, cards and inputs." },
  ],
};
