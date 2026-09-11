import legal from "../content/legal.json";
import { fillPlaceholders } from "./placeholders";

// Centralized legal copy. Edit here, both pages stay in sync.
// Last reviewed: 2026-05-16. Replace before production launch with
// counsel-reviewed copy. This is a working in-house draft; have a
// Washington / Oregon attorney with restoration-services experience
// review before public launch.


// The text lives in content/legal.json and is edited through the admin
// (/admin → Privacy & Terms). Static import — see lib/site.ts.
//
// It carries {phone}, {email}, {legalName} … placeholders where it used to
// interpolate the company details, so changing the phone in Company details
// still changes it here. See lib/placeholders.ts.
type Section = { heading: string; body: string[] };
const fill = (sections: Section[]): Section[] =>
  sections.map((s) => ({ heading: fillPlaceholders(s.heading), body: s.body.map(fillPlaceholders) }));

export const legalUpdated = fillPlaceholders(legal.updated);
export const draftBanner = fillPlaceholders(legal.draftBanner);
export const privacySections: Section[] = fill(legal.privacy);
export const termsSections: Section[] = fill(legal.terms);
