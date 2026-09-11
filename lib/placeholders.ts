import { site } from "./site";

// Placeholders an editor can write in admin-managed text, filled from
// Company details at build time — so changing the phone number in one place
// changes it everywhere it is written this way. Used by the privacy and
// terms pages, which interpolated these values when they were code.
const VALUES: Record<string, string> = {
  name: site.name,
  legalName: site.legalName,
  phone: site.phoneDisplay,
  email: site.email,
  url: site.url,
  city: site.address.locality,
  state: site.address.region,
};

export const PLACEHOLDER_HINT =
  "Write {name}, {legalName}, {phone}, {email}, {url}, {city} or {state} and it is filled in from Company details.";

export const fillPlaceholders = (s: string) =>
  s.replace(/\{(name|legalName|phone|email|url|city|state)\}/g, (_, k: string) => VALUES[k]);
