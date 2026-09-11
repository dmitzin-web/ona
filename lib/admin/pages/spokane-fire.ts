import { PHOTO, PLACEHOLDERS, THUMBS } from "../fields";
import type { SectionDef } from "../sections";

// The Spokane wildfire page (/services/fire-damage/spokane-wa), rendered by
// components/services/SpokaneFireDeployment.tsx. That file's header lists the
// legal constraints on this page; they are repeated here in plain English —
// in the description and in the hint of each field they bear on — so the
// editor sees them at the moment of editing, not only a developer.
//
// Left in code, not copy: the sample "live project page" inside the proof
// block (a labelled illustration, like the homepage demo), the icons, the
// step numbers (counted from the list), the link targets and colours.

const NO_RESPONSE_TIME =
  "No promise of how fast we arrive — Spokane is about 350 miles from our base, so “on site in an hour” is a claim we can't back up. A same-day answer is what we promise.";
const DEDUCTIBLE =
  "Never offer to cover, waive or absorb a deductible — that is insurance fraud in Washington, a felony above $1,500. “You pay your deductible, nothing more” is the approved way to say it.";
const REGISTRATION =
  "Keep the WA registration number ONARER*748K8 — Washington law requires it in our advertising. Never write “bonded and insured” (not allowed in Washington), and never say licensed, registered or bonded in Oregon (still pending).";
const NO_FIGURES =
  "No casualty figures, no counts of homes or structures burned, no made-up numbers of jobs, reviews or clients.";
const CALL = "Write {phone} where the number goes — it is filled in from Company details.";

export const SPOKANE_FIRE: SectionDef = {
  id: "spokane-fire",
  label: "Spokane fire deployment page",
  file: "content/pages/spokane-fire.json",
  description:
    "All text on the Spokane wildfire page (/services/fire-damage/spokane-wa), top to bottom. This page has legal rules — each one has caused trouble before. " +
    "1) No promise of how fast we arrive: Spokane is about 350 miles away; we promise a same-day answer instead. " +
    "2) Never offer to cover, waive or absorb a homeowner's deductible (insurance fraud in Washington). " +
    "3) Never write “bonded and insured”; the WA registration number ONARER*748K8 must stay on the page. " +
    "4) Nothing may say we are licensed, registered or bonded in Oregon. " +
    "5) No casualty or structure figures and no invented numbers. " +
    "6) The photos are our own finished work, not Spokane fire jobs, and the page must keep saying so. " +
    `Change wording only if you are sure it still follows these. ${PLACEHOLDERS}`,
  kind: "single",
  schema: [
    { kind: "object", key: "seo", label: "Search result", hint: `What Google shows for this page. ${NO_RESPONSE_TIME} Don't promise “deductible only” either — we control what we charge, not what the insurer covers.`, fields: [
      { kind: "text", key: "title", label: "Title (browser tab & Google)", required: true },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 3, hint: NO_RESPONSE_TIME },
      { kind: "strings", key: "keywords", label: "Keywords (one per line)" },
    ] },
    { kind: "object", key: "breadcrumb", label: "Breadcrumb (the path above the headline)", hint: "Also sent to Google. The links themselves are fixed.", fields: [
      { kind: "text", key: "home", label: "Home", required: true },
      { kind: "text", key: "services", label: "Services", required: true },
      { kind: "text", key: "service", label: "Fire service", required: true },
      { kind: "text", key: "page", label: "This page", required: true },
    ] },
    { kind: "object", key: "hero", label: "Top of the page", hint: NO_FIGURES, fields: [
      { kind: "text", key: "eyebrow", label: "Label above the headline", required: true, hint: "Keep the words people search for here (fire, smoke, Spokane County)." },
      { kind: "text", key: "titleLead", label: "Headline — first line", required: true },
      { kind: "text", key: "titleRest", label: "Headline — second line (lighter)", required: true },
      { kind: "textarea", key: "bodyLead", label: "Paragraph", required: true, rows: 2, hint: NO_RESPONSE_TIME },
      { kind: "text", key: "bodyEmphasis", label: "Paragraph — darker ending", required: true },
      { kind: "text", key: "ctaCall", label: "Call button", required: true, hint: CALL },
      { kind: "text", key: "ctaPhotos", label: "Send photos button", required: true },
      { kind: "text", key: "emailSubject", label: "Email subject line", required: true, hint: "Filled in when someone taps any “Send photos” / “Email photographs” button on this page." },
      { kind: "text", key: "note", label: "Line under the buttons", required: true, hint: NO_RESPONSE_TIME },
      { kind: "strings", key: "credentials", label: "Credentials line (one per line)", hint: `${REGISTRATION} Only credentials held today.` },
    ] },
    { kind: "object", key: "triage", label: "“Whichever one you're dealing with” — three situations", hint: NO_FIGURES, fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "situations", label: "Situations", itemTitle: "Situation", hint: "Laid out for three.", fields: [
        { kind: "text", key: "tag", label: "Label", required: true },
        { kind: "text", key: "title", label: "Heading", required: true },
        { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
        { kind: "textarea", key: "detail", label: "Note under the line", required: true, rows: 2, hint: NO_RESPONSE_TIME },
      ] },
      { kind: "text", key: "ctaCall", label: "Call button", required: true, hint: CALL },
      { kind: "text", key: "aside", label: "Line beside the button", required: true },
    ] },
    { kind: "object", key: "cost", label: "What it costs", hint: `${DEDUCTIBLE} Don't promise the homeowner pays “only the deductible” — what the policy covers is the insurer's decision.`, fields: [
      { kind: "list", key: "cells", label: "Boxes", itemTitle: "Box", hint: "Laid out for three.", fields: [
        { kind: "text", key: "label", label: "Label", required: true },
        { kind: "text", key: "value", label: "Big line", required: true },
        { kind: "textarea", key: "body", label: "Line under it", required: true, rows: 2, hint: DEDUCTIBLE },
      ] },
      { kind: "textarea", key: "note", label: "Small print under the boxes", required: true, rows: 3 },
    ] },
    { kind: "object", key: "gates", label: "“Three things have to happen before rebuilding”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "steps", label: "Steps", itemTitle: "Step", hint: "Numbered automatically. Laid out for three. Fees, rules and permit times must match what Spokane Clean Air and the city actually say today.", fields: [
        { kind: "text", key: "title", label: "Step", required: true },
        { kind: "textarea", key: "body", label: "Detail", required: true, rows: 2 },
        { kind: "text", key: "who", label: "Who does it (the tag)", required: true },
      ] },
      { kind: "textarea", key: "note", label: "Paragraph under the steps", required: true, rows: 2 },
    ] },
    { kind: "object", key: "scope", label: "“One crew from debris to final paint”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
      { kind: "strings", key: "items", label: "What we handle (one per line)", required: true },
    ] },
    { kind: "object", key: "finish", label: "Finished-work photos", hint: "These are our own completed remodels, NOT Spokane fire jobs, and the caption says so. Don't relabel them as fire restoration — passing remodel photos off as fire work is exactly the trick this page warns people about. Only our own work, never stock. Swap in real Spokane before/after photos once jobs finish.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph beside the heading", required: true, rows: 3 },
      { kind: "list", key: "photos", label: "Photos", itemTitle: "Photo", hint: "Laid out for three.", fields: [
        { kind: "select", key: "photo", label: "Photo", options: PHOTO, thumbs: THUMBS },
        { kind: "text", key: "alt", label: "Photo description (read aloud to blind visitors)", required: true, hint: "Only what is visible in the photo: no brands, sizes, places, clients or timelines." },
      ] },
      { kind: "textarea", key: "caption", label: "Caption under the photos", required: true, rows: 3, hint: "Must keep saying these are not Spokane fire jobs." },
    ] },
    { kind: "object", key: "whyUs", label: "“Before you sign with anyone”", hint: "Every line here must be something a homeowner can verify. Don't name or describe other companies.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "textarea", key: "title", label: "Heading", required: true, rows: 2 },
      { kind: "object", key: "guarantees", label: "Three cards", hint: "The icons stay as they are: shield, document, clock.", fields: [
        { kind: "object", key: "first", label: "Card 1 (shield)", fields: [
          { kind: "text", key: "title", label: "Heading", required: true },
          { kind: "text", key: "body", label: "Line", required: true },
        ] },
        { kind: "object", key: "second", label: "Card 2 (document)", fields: [
          { kind: "text", key: "title", label: "Heading", required: true },
          { kind: "text", key: "body", label: "Line", required: true },
        ] },
        { kind: "object", key: "third", label: "Card 3 (clock)", fields: [
          { kind: "text", key: "title", label: "Heading", required: true },
          { kind: "text", key: "body", label: "Line", required: true },
        ] },
      ] },
      { kind: "list", key: "points", label: "Three points", itemTitle: "Point", hint: `${DEDUCTIBLE} ${REGISTRATION}`, fields: [
        { kind: "text", key: "title", label: "Heading", required: true },
        { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 4 },
      ] },
    ] },
    { kind: "object", key: "proof", label: "“The live project page”", hint: "The sample project shown beside this text (N Assembly St, day 6 of 12) is a labelled illustration and stays as it is.", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 3 },
      { kind: "strings", key: "bullets", label: "Checklist (one per line)" },
      { kind: "text", key: "caption", label: "Line under the sample", required: true, hint: "Must keep saying the sample is sample data." },
    ] },
    { kind: "object", key: "process", label: "“What happens next” — five steps", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "steps", label: "Steps", itemTitle: "Step", hint: `Numbered automatically; each step keeps its icon by position (phone, house, document, bottle, hammer). Laid out for five. ${NO_RESPONSE_TIME}`, fields: [
        { kind: "text", key: "title", label: "Step", required: true },
        { kind: "textarea", key: "body", label: "Detail", required: true, rows: 2 },
      ] },
    ] },
    { kind: "object", key: "areas", label: "Where we're working", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true },
      { kind: "strings", key: "places", label: "Places (one per line)", required: true, hint: "Shown on one line, separated by dots." },
    ] },
    { kind: "object", key: "faq", label: "Questions", hint: `Shown on the page and sent to Google. ${DEDUCTIBLE} ${REGISTRATION} We don't negotiate settlements — that needs a public adjuster licence we don't hold.`, fields: [
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "list", key: "faqs", label: "Questions", itemTitle: "Question", fields: [
        { kind: "text", key: "q", label: "Question", required: true },
        { kind: "textarea", key: "a", label: "Answer", required: true, rows: 4 },
      ] },
    ] },
    { kind: "object", key: "closing", label: "Closing “Send us photos”", fields: [
      { kind: "text", key: "eyebrow", label: "Label", required: true, hint: NO_RESPONSE_TIME },
      { kind: "text", key: "title", label: "Heading", required: true },
      { kind: "textarea", key: "body", label: "Paragraph", required: true, rows: 2 },
      { kind: "text", key: "ctaCall", label: "Call button", required: true, hint: CALL },
      { kind: "text", key: "ctaEmail", label: "Email button", required: true },
      { kind: "textarea", key: "legalLine", label: "Small print at the bottom", required: true, rows: 3, hint: `${REGISTRATION} This is where the law needs it. {legalName}, {city} and {state} are filled in from Company details.` },
    ] },
    { kind: "object", key: "links", label: "Links at the very bottom", hint: "Where they go is fixed.", fields: [
      { kind: "text", key: "fireService", label: "Link to the fire & smoke page", required: true },
      { kind: "text", key: "about", label: "Link to the About page", required: true },
    ] },
    { kind: "object", key: "mobileBar", label: "Call bar on phones", hint: "The bar pinned to the bottom of the screen on phones.", fields: [
      { kind: "text", key: "call", label: "Call button", required: true },
      { kind: "text", key: "photos", label: "Send photos button", required: true },
    ] },
    { kind: "object", key: "structuredData", label: "Service description for Google (not shown on the page)", hint: `${NO_RESPONSE_TIME} ${NO_FIGURES}`, fields: [
      { kind: "text", key: "serviceType", label: "Service type", required: true },
      { kind: "text", key: "name", label: "Service name", required: true },
      { kind: "textarea", key: "description", label: "Description", required: true, rows: 3 },
      { kind: "text", key: "areaServed", label: "Area served", required: true },
    ] },
  ],
};
