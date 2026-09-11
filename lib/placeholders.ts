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

// The same, over every string in a content object — for page copy, where a
// placeholder can sit in any field.
export function fillPlaceholdersDeep<T>(v: T): T {
  if (typeof v === "string") return fillPlaceholders(v) as T;
  if (Array.isArray(v)) return v.map(fillPlaceholdersDeep) as T;
  if (v && typeof v === "object")
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fillPlaceholdersDeep(x)])) as T;
  return v;
}
