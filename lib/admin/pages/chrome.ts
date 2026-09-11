import { PLACEHOLDERS } from "../fields";
import type { SectionDef } from "../sections";

// Site-wide chrome and the shared blocks many pages reuse: the status strip,
// the header, the footer, the closing call-to-action, the FAQ block, the
// assistant's window, the browser-tab defaults and the social-share images.
// One file, content/chrome.json, read through lib/chrome.ts.
//
// What stays in code, deliberately: where each menu link goes (routes), the
// service names in menus and the footer (Services), the city names (Cities),
// the phone number, email and address (Company details), the ONA wordmark on
// the share images (it is the logo, not copy), and which assistant questions
// go with which pages (the matching rules). Pages that pass their own heading
// to a shared block (e.g. the closing block on a service page) keep theirs;
// the text here is the default everywhere else.
const SR = "(read aloud by screen readers)";

export const CHROME: SectionDef = {
  id: "chrome",
  label: "Header, footer & shared blocks",
  file: "content/chrome.json",
  description: `The parts every page shares: the strip and menu at the top, the footer, the closing “Get in touch” block, the FAQ block, the assistant, and what Google and link previews show by default. ${PLACEHOLDERS} Names of services and cities come from Services and Cities.`,
  kind: "single",
  schema: [
    { kind: "object", key: "everyPage", label: "Every page — browser tab & Google", fields: [
      { kind: "text", key: "defaultTitle", label: "Default title", required: true, hint: "Used by any page without a title of its own, and for link previews. {tagline} is the tagline from Company details." },
      { kind: "text", key: "titleTemplate", label: "Title pattern for other pages", required: true, mono: true, hint: "%s is replaced by the page's own title, e.g. “Water Damage | Ona Restoration”. Keep the %s." },
      { kind: "text", key: "category", label: "Category (for search engines)", required: true },
      { kind: "text", key: "skipLink", label: "“Skip to content” link", required: true, hint: "Appears only when someone moves through the page with the Tab key." },
    ] },
    { kind: "object", key: "statusStrip", label: "Dark strip at the very top", fields: [
      { kind: "text", key: "text", label: "Text", required: true, hint: "One short line — it must fit on one line on a phone. Only promise what the crew can actually do." },
    ] },
    { kind: "object", key: "header", label: "Menu bar", hint: "Where each menu item goes is fixed; only the words change.", fields: [
      { kind: "object", key: "nav", label: "Menu items", fields: [
        { kind: "text", key: "restoration", label: "Restoration (goes to /services)", required: true },
        { kind: "text", key: "mold", label: "Mold (goes to /services/mold-removal)", required: true },
        { kind: "text", key: "remodeling", label: "Remodeling (goes to /services/remodeling)", required: true },
        { kind: "text", key: "about", label: "How we work (goes to /about)", required: true },
        { kind: "text", key: "blog", label: "Notes (goes to /blog)", required: true },
        { kind: "text", key: "contact", label: "Contact (goes to /contact)", required: true, hint: "Shown only in the phone menu." },
      ] },
      { kind: "text", key: "callShort", label: "Call button on phones", required: true, hint: "Wider screens show the phone number itself." },
      { kind: "text", key: "callAriaLabel", label: `Call button ${SR}`, required: true },
      { kind: "text", key: "sendPhotos", label: "“Send photos” button", required: true, hint: "Opens an email to dispatch. Shown on every page except remodeling." },
      { kind: "text", key: "sendPhotosSubject", label: "Subject of that email", required: true },
      { kind: "text", key: "startProject", label: "“Start a project” button", required: true, hint: "Shown instead of “Send photos” on the remodeling pages." },
      { kind: "text", key: "menuCall", label: "Call button inside the phone menu", required: true },
      { kind: "text", key: "menuButton", label: `Menu button ${SR}`, required: true },
      { kind: "text", key: "menuButtonText", label: `Menu button, hidden text ${SR}`, required: true },
      { kind: "text", key: "navAriaLabel", label: `Name of the menu ${SR}`, required: true },
      { kind: "text", key: "mobileNavAriaLabel", label: `Name of the phone menu ${SR}`, required: true },
    ] },
    { kind: "object", key: "breadcrumbs", label: "Trail of links at the top of inner pages", fields: [
      { kind: "text", key: "ariaLabel", label: `Name of the trail ${SR}`, required: true },
    ] },
    { kind: "object", key: "serviceCard", label: "Service cards", hint: "The service name and line on each card come from Services.", fields: [
      { kind: "text", key: "linkText", label: "Link at the bottom of a card", required: true },
    ] },
    { kind: "object", key: "values", label: "Company values block (About page)", hint: "The values themselves are in Company details → Company values.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
    ] },
    { kind: "object", key: "remodelingGallery", label: "Photo gallery on the Remodeling page", hint: "The photos and their captions are in Remodeling gallery. Say only what the photos show: no project counts, sizes, timelines, budgets, places or clients — several photos are two views of one room.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "intro", label: "Paragraph", required: true, rows: 3 },
      { kind: "text", key: "linkText", label: "Link beside the heading", required: true },
    ] },
    { kind: "object", key: "faq", label: "FAQ block", hint: "The questions belong to each page; most pages also set their own heading.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "defaultTitle", label: "Heading when a page sets none", required: true },
    ] },
    { kind: "object", key: "cta", label: "Closing “Get in touch” block", hint: "The dark block near the end of most pages. Some pages (services, cities) write their own heading and paragraph; these are used everywhere else. The buttons show the phone and email from Company details.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "subtitle", label: "Paragraph", required: true, rows: 2 },
    ] },
    { kind: "object", key: "legalPage", label: "Privacy & Terms pages — labels", hint: "The policy text itself is in Privacy & Terms.", fields: [
      { kind: "text", key: "updatedLabel", label: "Before the date", required: true, hint: "Followed by the “Last updated” date from Privacy & Terms." },
      { kind: "text", key: "draftLabel", label: "Label on the notice at the top", required: true },
    ] },
    { kind: "object", key: "footer", label: "Footer", hint: "Service and city links come from Services and Cities.", fields: [
      { kind: "strings", key: "about", label: "Lines under the logo (one per line)", required: true },
      { kind: "text", key: "location", label: "Location line", required: true },
      { kind: "object", key: "credentials", label: "Credentials", hint: "Washington requires the L&I registration number in advertising (RCW 18.27.100(3)) — keep it, and it links to the state's verification page. The Oregon CCB registration is PENDING: it must say so until the number is issued. Never add “bonded” or “insured” (RCW 18.27.100(4)).", fields: [
        { kind: "text", key: "waLabel", label: "Washington — label", required: true },
        { kind: "text", key: "waNumber", label: "Washington — registration number", required: true, mono: true },
        { kind: "text", key: "orLabel", label: "Oregon — label", required: true },
        { kind: "text", key: "orStatus", label: "Oregon — status", required: true },
        { kind: "text", key: "iicrcLabel", label: "IICRC — label", required: true },
        { kind: "text", key: "iicrcStatus", label: "IICRC — status", required: true },
      ] },
      { kind: "text", key: "servicesTitle", label: "Services column heading", required: true },
      { kind: "text", key: "areaTitle", label: "Cities column heading", required: true },
      { kind: "text", key: "companyTitle", label: "Company column heading", required: true },
      { kind: "text", key: "aboutLink", label: "About link", required: true },
      { kind: "text", key: "contactLink", label: "Contact link", required: true },
      { kind: "text", key: "byCityTitle", label: "“Service by city” heading", required: true, hint: "The folded list of every service in every city." },
      { kind: "text", key: "copyright", label: "Copyright line", required: true, hint: "{year} is the current year." },
      { kind: "text", key: "privacyLink", label: "Privacy link", required: true },
      { kind: "text", key: "termsLink", label: "Terms link", required: true },
      { kind: "text", key: "quoteLink", label: "Quote link", required: true },
    ] },
    { kind: "object", key: "assistant", label: "Ask Ona — the assistant window", hint: "Only the words around the chat. What the assistant knows and how it answers is set in code.", fields: [
      { kind: "text", key: "openButton", label: `Round button, bottom right ${SR}`, required: true },
      { kind: "text", key: "openButtonText", label: `Round button, hidden text ${SR}`, required: true },
      { kind: "text", key: "title", label: "Window title", required: true },
      { kind: "text", key: "subtitle", label: "Line under the title", required: true },
      { kind: "text", key: "newChat", label: "“New chat” button", required: true },
      { kind: "text", key: "close", label: `Close button ${SR}`, required: true },
      { kind: "textarea", key: "greeting", label: "Greeting", required: true, rows: 2 },
      { kind: "text", key: "suggestionsTitle", label: "Heading over the suggested questions", required: true },
      { kind: "object", key: "suggestions", label: "Suggested questions, by page", hint: "Up to three short questions (about 60 characters) per page, one per line. A page gets the first group below that matches it.", fields: [
        { kind: "strings", key: "home", label: "Homepage (one per line)" },
        { kind: "strings", key: "water", label: "Water damage pages (one per line)" },
        { kind: "strings", key: "fire", label: "Fire damage pages (one per line)" },
        { kind: "strings", key: "mold", label: "Mold pages (one per line)" },
        { kind: "strings", key: "storm", label: "Storm damage pages (one per line)" },
        { kind: "strings", key: "services", label: "Other service pages, including Remodeling (one per line)" },
        { kind: "strings", key: "areas", label: "City pages (one per line)" },
        { kind: "strings", key: "remodeling", label: "Remodeling pages (one per line)" },
        { kind: "strings", key: "quote", label: "Quote page (one per line)" },
        { kind: "strings", key: "blog", label: "Blog posts (one per line)" },
        { kind: "strings", key: "other", label: "Every other page (one per line)" },
      ] },
      { kind: "text", key: "placeholder", label: "Text in the empty message box", required: true },
      { kind: "text", key: "attach", label: `Attach button ${SR}`, required: true },
      { kind: "text", key: "send", label: `Send button ${SR}`, required: true },
      { kind: "text", key: "removeImage", label: `Remove-photo button ${SR}`, required: true },
      { kind: "text", key: "attachmentAlt", label: `Photo waiting to be sent ${SR}`, required: true },
      { kind: "text", key: "attachedAlt", label: `Photo in a sent message ${SR}`, required: true },
      { kind: "text", key: "thinking", label: `While the answer is coming ${SR}`, required: true },
      { kind: "text", key: "requestFailed", label: "Error when the assistant can't be reached", required: true, hint: "{status} is the error code." },
    ] },
    { kind: "object", key: "shareImage", label: "Link-preview picture", hint: "The picture shown when a page is shared in a message or on social media. The ONA logo on it is fixed.", fields: [
      { kind: "text", key: "alt", label: `Description ${SR}`, required: true, hint: "{tagline} is the tagline from Company details." },
      { kind: "text", key: "eyebrow", label: "Small line above the headline", required: true },
      { kind: "strings", key: "headline", label: "Headline (one line each; the last is bolder)", required: true },
      { kind: "text", key: "website", label: "Web address at the bottom right", required: true, hint: "Beside the phone number from Company details." },
    ] },
    { kind: "object", key: "blogShareImage", label: "Link-preview picture for blog posts", hint: "Each post's picture shows its category, title and author.", fields: [
      { kind: "text", key: "alt", label: `Description ${SR}`, required: true },
      { kind: "text", key: "readingTime", label: "Reading time", required: true, hint: "{minutes} is the post's reading time." },
      { kind: "text", key: "byline", label: "Author line", required: true, hint: "{author} is the post's author." },
    ] },
  ],
};
