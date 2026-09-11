import type { Schema } from "./schema";
import { faqList, PLACEHOLDERS } from "./fields";
import { HOME } from "./pages/home";
import { SERVICE_PAGE } from "./pages/service-page";
import { MOLD_SECTIONS } from "./pages/mold-sections";
import { AREA_PAGE } from "./pages/area-page";
import { SERVICE_AREA_PAGE } from "./pages/service-area-page";

// Every schema-driven section of the admin: what file it lives in, how it
// is shaped, and what the editor is told about it. Blog posts and the
// remodeling gallery have their own bespoke editors (PostEditor,
// WorkEditor) and are not listed here.
//
// Each file is ONE JSON document imported statically by the site
// (lib/site.ts, lib/services.ts …). Static imports rather than fs reads:
// lib/site.ts is imported by client components (the header), which have no
// filesystem, and a static import cannot trip the file tracer.
//
// `collection` sections are an array of items keyed by `slug`. The slug is
// never editable here — it is the page's URL — and items cannot be created
// or deleted from the admin yet, because a new service or city also needs
// code (icons, routing, cross-links).

export type SectionDef = {
  id: string;
  label: string;
  file: string;
  description: string;
} & (
  | { kind: "single"; schema: Schema }
  | { kind: "collection"; schema: Schema; titleKey: string; subtitleKey?: string }
);

export const SECTIONS: SectionDef[] = [
  HOME,
  SERVICE_PAGE,
  MOLD_SECTIONS,
  AREA_PAGE,
  SERVICE_AREA_PAGE,
  {
    id: "site",
    label: "Company details",
    file: "content/site.json",
    description:
      "Name, phone, email, address, hours, credentials and values. Used in the header, footer, every page's structured data for Google, and the AI assistant.",
    kind: "single",
    schema: [
      { kind: "text", key: "name", label: "Public name", required: true, hint: "What customers see. Short." },
      { kind: "text", key: "legalName", label: "Legal entity name", required: true, hint: "Exactly as filed with the WA Secretary of State — Google cross-checks it." },
      { kind: "text", key: "tagline", label: "Tagline" },
      { kind: "textarea", key: "shortDescription", label: "Short description", required: true, rows: 3, hint: "The default description for search results and link previews." },
      { kind: "text", key: "phone", label: "Phone (for dialling)", required: true, mono: true, hint: "International format, digits only after +1: +13605532138. Every Call button uses this." },
      { kind: "text", key: "phoneDisplay", label: "Phone (as shown)", required: true, hint: "How the number is written on the page: (360) 553-2138." },
      { kind: "text", key: "email", label: "Email", required: true, mono: true },
      { kind: "text", key: "founded", label: "Year founded", required: true, hint: "The LLC's formation year. Google checks it against state records — do not change it to look older." },
      { kind: "select", key: "priceRange", label: "Price range (for Google)", options: ["$", "$$", "$$$", "$$$$"] },
      {
        kind: "object",
        key: "address",
        label: "Address",
        fields: [
          { kind: "text", key: "locality", label: "City", required: true },
          { kind: "text", key: "region", label: "State code", required: true },
          { kind: "text", key: "regionName", label: "State", required: true },
          { kind: "text", key: "country", label: "Country code", required: true },
          { kind: "text", key: "countryName", label: "Country", required: true },
        ],
      },
      {
        kind: "object",
        key: "geo",
        label: "Map location",
        fields: [
          { kind: "number", key: "latitude", label: "Latitude", min: -90, max: 90 },
          { kind: "number", key: "longitude", label: "Longitude", min: -180, max: 180 },
        ],
      },
      {
        kind: "list",
        key: "hours",
        label: "Opening hours",
        itemTitle: "Hours",
        hint: "00:00 – 23:59 on all seven days means 24/7.",
        fields: [
          { kind: "strings", key: "days", label: "Days (one per line)", required: true },
          { kind: "text", key: "opens", label: "Opens", required: true, mono: true },
          { kind: "text", key: "closes", label: "Closes", required: true, mono: true },
        ],
      },
      {
        kind: "optional",
        key: "rating",
        label: "Google rating",
        toggleLabel: "Show a Google rating",
        hint: "Only once the Google Business Profile has real reviews, and only the numbers Google shows. A made-up rating is a violation of Google's rules and can sink the listing.",
        fields: [
          { kind: "number", key: "value", label: "Average rating", min: 1, max: 5 },
          { kind: "number", key: "count", label: "Number of reviews", min: 1, integer: true },
        ],
      },
      { kind: "strings", key: "certifications", label: "Credentials (one per line)", hint: "Only credentials held today. The WA L&I registration number must stay — Washington requires it in advertising." },
      { kind: "checkbox", key: "iicrcCertified", label: "IICRC certifications are issued (not in progress)" },
      { kind: "strings", key: "iicrcPending", label: "IICRC certifications still in progress (one per line)" },
      {
        kind: "list",
        key: "values",
        label: "Company values",
        itemTitle: "Value",
        fields: [
          { kind: "select", key: "key", label: "Icon", options: ["precision", "integrity", "craftsmanship", "accountability", "respect"] },
          { kind: "text", key: "title", label: "Title", required: true },
          { kind: "text", key: "body", label: "Line", required: true },
        ],
      },
      {
        kind: "object",
        key: "social",
        label: "Social profiles",
        hint: "Only profiles that exist. Dead links are read by Google as a negative signal.",
        fields: [
          { kind: "text", key: "facebook", label: "Facebook URL", mono: true },
          { kind: "text", key: "instagram", label: "Instagram URL", mono: true },
        ],
      },
    ],
  },
  {
    id: "services",
    label: "Services",
    file: "content/services.json",
    description:
      "The five service pages — water, fire, mold, storm, remodeling — and the city × service pages built from them.",
    kind: "collection",
    titleKey: "name",
    subtitleKey: "title",
    schema: [
      { kind: "text", key: "name", label: "Service name", required: true },
      { kind: "text", key: "shortName", label: "Short name", required: true, hint: "Used in menus and the footer." },
      { kind: "text", key: "title", label: "Page title (browser tab & Google)", required: true },
      { kind: "textarea", key: "description", label: "Search description", required: true, rows: 3 },
      { kind: "textarea", key: "hero", label: "Headline paragraph", required: true, rows: 2 },
      { kind: "textarea", key: "intro", label: "Introduction", required: true, rows: 5 },
      {
        kind: "list",
        key: "body",
        label: "Page sections",
        itemTitle: "Section",
        fields: [
          { kind: "text", key: "heading", label: "Heading", required: true },
          { kind: "strings", key: "paragraphs", label: "Paragraphs (one per line)", required: true },
        ],
      },
      {
        kind: "list",
        key: "process",
        label: "How it works — steps",
        itemTitle: "Step",
        fields: [
          { kind: "text", key: "step", label: "Step", required: true },
          { kind: "textarea", key: "text", label: "Detail", required: true, rows: 2 },
        ],
      },
      { kind: "strings", key: "signs", label: "Signs you need this (one per line)" },
      faqList(),
    ],
  },
  {
    id: "areas",
    label: "Cities",
    file: "content/areas.json",
    description: "The ten city pages and the local details on every city × service page.",
    kind: "collection",
    titleKey: "name",
    subtitleKey: "county",
    schema: [
      { kind: "text", key: "name", label: "City", required: true },
      { kind: "select", key: "region", label: "State", options: ["WA", "OR"] },
      { kind: "text", key: "regionName", label: "State name", required: true },
      { kind: "text", key: "county", label: "County", required: true },
      { kind: "text", key: "population", label: "Population", required: true },
      { kind: "number", key: "driveMinutesFromHQ", label: "Drive time from Vancouver (minutes)", min: 0, integer: true, hint: "Shown as a response-time figure. It has to be true." },
      { kind: "strings", key: "zips", label: "ZIP codes (one per line)", required: true },
      { kind: "strings", key: "neighborhoods", label: "Neighborhoods (one per line)" },
      { kind: "textarea", key: "weatherPattern", label: "Local weather", rows: 3 },
      { kind: "strings", key: "commonLosses", label: "Common kinds of damage (one per line)" },
      { kind: "textarea", key: "localNote", label: "Local note", rows: 3 },
    ],
  },
  {
    id: "legal",
    label: "Privacy & Terms",
    file: "content/legal.json",
    description: `The /privacy and /terms pages. ${PLACEHOLDERS}`,
    kind: "single",
    schema: [
      { kind: "text", key: "updated", label: "Last updated (as shown)", required: true, hint: "Update this whenever the text changes, e.g. “May 16, 2026”." },
      { kind: "textarea", key: "draftBanner", label: "Notice at the top", rows: 2, hint: "Leave empty once a lawyer has reviewed the text." },
      {
        kind: "list",
        key: "privacy",
        label: "Privacy policy sections",
        itemTitle: "Section",
        fields: [
          { kind: "text", key: "heading", label: "Heading", required: true },
          { kind: "strings", key: "body", label: "Paragraphs (one per line)", required: true },
        ],
      },
      {
        kind: "list",
        key: "terms",
        label: "Terms of service sections",
        itemTitle: "Section",
        fields: [
          { kind: "text", key: "heading", label: "Heading", required: true },
          { kind: "strings", key: "body", label: "Paragraphs (one per line)", required: true },
        ],
      },
    ],
  },
  {
    id: "reviews",
    label: "Reviews",
    file: "content/reviews.json",
    description:
      "Customer reviews sent to Google as structured data. Empty until the Google Business Profile has real reviews.",
    kind: "single",
    schema: [
      {
        kind: "list",
        key: "reviews",
        label: "Reviews",
        itemTitle: "Review",
        hint: "Only real reviews from real clients, quoted word for word, with their permission to use their name. Invented or edited reviews break FTC rules and Google's, and can get the listing removed.",
        fields: [
          { kind: "text", key: "author", label: "Name (first name + last initial)", required: true },
          { kind: "number", key: "rating", label: "Stars (1–5)", min: 1, max: 5, integer: true },
          { kind: "text", key: "datePublished", label: "Date (YYYY-MM-DD)", required: true, mono: true },
          { kind: "textarea", key: "reviewBody", label: "Review — exactly as written", required: true, rows: 4 },
          { kind: "text", key: "location", label: "City (optional)" },
          { kind: "text", key: "service", label: "Service (optional)" },
        ],
      },
    ],
  },
];

export const findSection = (id: string) => SECTIONS.find((s) => s.id === id);
