// Vvon — single source of truth for product copy, taxonomies, and
// data shapes used across the landing page, upload flow, report UI, and
// /api/vvon/analyze. The product itself is informational only —
// never legal advice, never a guarantee of payment. The disclaimer string
// below is rendered in every report and on every page that takes a file.

export const vvon = {
  name: "Vvon",
  // Trademark glyph rendered next to the name in the <VvonWordmark>
  // component and in user-facing copy throughout the product. Set to ""
  // if/when the brand decides to drop the ™.
  symbol: "™",
  // Brand domain — referenced in OG copy and email footers.
  domain: "vvon.ai",
  tagline: "AI-assisted forensic estimate analysis.",
  hero: {
    eyebrow: "Vvon™ · Forensic estimate analysis",
    headline: "Find What Your Insurance Estimate May Be Missing.",
    subheadline:
      "Vvon™ performs forensic-style analysis of property-insurance estimates, photos, policies, invoices, and denial letters — surfacing potential scope gaps, internal inconsistencies, and documentation deficiencies the same way a senior IICRC estimator would on a desk review.",
    primaryCta: { label: "Analyze My Claim", href: "/vvon/upload" },
    secondaryCta: { label: "See How It Works", href: "#how-it-works" },
  },
  shortDescription:
    "Vvon™ is an AI-assisted forensic estimate analysis platform for property-insurance restoration claims. Upload your claim documents and receive a structured forensic review of potential scope gaps, carrier-consistency issues, and documentation deficiencies.",
  // The exact disclaimer string the project brief requires — used in every
  // report, in the upload-consent checkbox, and at the bottom of every
  // Vvon™ page. Do not paraphrase.
  disclaimer:
    "Vvon™ provides informational estimate and document analysis only. It does not provide legal advice, public adjusting services, or guarantee claim outcomes.",
  consentLabel:
    "I understand Vvon™ provides informational analysis only and does not provide legal advice, public adjusting services, or guaranteed claim outcomes.",
} as const;

// ---------------------------------------------------------------------------
// Upload-form taxonomies
// ---------------------------------------------------------------------------

export const documentCategories = [
  { value: "carrier-estimate", label: "Carrier Estimate" },
  { value: "contractor-estimate", label: "Contractor Estimate" },
  { value: "policy", label: "Policy" },
  { value: "denial-letter", label: "Denial Letter" },
  { value: "photos", label: "Photos" },
  { value: "mitigation-invoice", label: "Mitigation Invoice" },
  { value: "other", label: "Other" },
] as const;
export type DocumentCategory = (typeof documentCategories)[number]["value"];

export const claimTypes = [
  { value: "water", label: "Water" },
  { value: "fire", label: "Fire" },
  { value: "smoke", label: "Smoke" },
  { value: "mold", label: "Mold" },
  { value: "storm", label: "Storm" },
  { value: "reconstruction", label: "Reconstruction" },
  { value: "unknown", label: "Unknown / Not Sure" },
] as const;
export type ClaimType = (typeof claimTypes)[number]["value"];

export const propertyStates = [
  { value: "WA", label: "Washington" },
  { value: "OR", label: "Oregon" },
  { value: "other", label: "Other" },
] as const;
export type PropertyState = (typeof propertyStates)[number]["value"];

export const userRoles = [
  { value: "homeowner", label: "Homeowner" },
  { value: "contractor", label: "Contractor" },
  { value: "estimator", label: "Estimator" },
  { value: "public-adjuster", label: "Public Adjuster" },
  { value: "attorney", label: "Attorney" },
  { value: "other", label: "Other" },
] as const;
export type UserRole = (typeof userRoles)[number]["value"];

// Mime / extension allow-list for the upload module. Anything else is
// rejected client-side with a helpful message. ESX is reserved for a
// future estimate-XML adapter and is currently displayed as "coming soon".
export const acceptedFileExtensions = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".docx",
  ".xlsx",
  ".csv",
  ".txt",
] as const;
export const acceptedFileLabel =
  "PDF, JPG, PNG, DOCX, XLSX, CSV, TXT — up to 25 MB each. ESX support coming soon.";
export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB per file
export const MAX_FILES_PER_CLAIM = 20;

// Per-user rate limit on analyses. Counts every `claims` row the user has
// created in the last 24 hours (including drafts/errors — otherwise a
// user could spam by triggering failures). Bump this if you upgrade
// users to a paid tier; the API route will read the current value.
export const MAX_CLAIMS_PER_24H = 10;

// ---------------------------------------------------------------------------
// Analysis category taxonomy — drives the landing-page categories grid and
// constrains the report sections returned by the API.
// ---------------------------------------------------------------------------

export const analysisCategories = [
  {
    key: "repair-scope",
    title: "Repair Scope",
    blurb:
      "The reconstruction work needed to put the property back to pre-loss condition.",
    items: [
      "Drywall",
      "Texture",
      "Paint",
      "Flooring",
      "Baseboards",
      "Cabinetry",
      "Countertops",
      "Tile",
      "Insulation",
      "Electrical",
      "HVAC",
      "Trim",
      "Cleaning",
      "Contents",
    ],
  },
  {
    key: "mitigation-scope",
    title: "Mitigation Scope",
    blurb:
      "Emergency services that stop the loss and protect the structure before rebuild.",
    items: [
      "Water extraction",
      "Drying equipment",
      "Containment",
      "HEPA filtration",
      "Demolition",
      "Antimicrobial",
      "Mold remediation",
      "PPE",
      "Post-remediation verification",
    ],
  },
  {
    key: "estimate-logic",
    title: "Estimate Logic",
    blurb:
      "Whether the line items, quantities, and dependencies add up against the documented loss.",
    items: [
      "Quantities",
      "Waste factors",
      "Labor minimums",
      "Detach / reset logic",
      "Access limitations",
      "Trade sequencing",
      "Overhead & supervision",
      "Final cleaning",
      "Protection",
    ],
  },
  {
    key: "claim-documents",
    title: "Claim Documents",
    blurb:
      "Cross-reads across policy, estimates, photos, and correspondence to find gaps and conflicts.",
    items: [
      "Policy",
      "Denial letter",
      "Carrier estimate",
      "Contractor estimate",
      "Invoices",
      "Photos",
      "Matterport",
      "Adjuster notes",
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Feature-grid copy for the landing page
// ---------------------------------------------------------------------------

export const features = [
  {
    title: "Estimate Gap Detection",
    body: "Surfaces line items that may be missing or under-scoped relative to the documented loss.",
  },
  {
    title: "Scope Dependency Logic",
    body: "Flags connected work that may be required when one item is approved or removed.",
  },
  {
    title: "Mitigation Review",
    body: "Reads water, mold, smoke, fire, and emergency-service scope for consistency and completeness.",
  },
  {
    title: "Policy & Denial Letter Review",
    body: "Highlights relevant policy language, exclusions, limitations, and stated denial reasoning.",
  },
  {
    title: "Photo-to-Scope Support",
    body: "Connects visible damage in your photos to scope items that typically follow.",
  },
  {
    title: "Supplement Opportunity Summary",
    body: "Ranks the most important claim issues by likely impact and documentation strength.",
  },
  {
    title: "Documentation Checklist",
    body: "Tells you what evidence — photos, measurements, readings, invoices — to gather next.",
  },
  {
    title: "Professional Report Export",
    body: "Generates a clean, structured report you can share with your contractor or adjuster.",
  },
] as const;

// ---------------------------------------------------------------------------
// How-it-works steps
// ---------------------------------------------------------------------------

export const howItWorks = [
  {
    n: "01",
    title: "Upload Documents",
    body: "Carrier estimate, contractor estimate, photos, policy, denial letter, mitigation invoice, Matterport screenshots, or scope notes.",
  },
  {
    n: "02",
    title: "Forensic Analysis",
    body: "The system performs a senior-estimator-level review — line-item logic, quantity consistency, trade sequencing, and carrier-consistency cross-checks against IICRC standards.",
  },
  {
    n: "03",
    title: "Structured Report",
    body: "You receive a forensic report — scope gap analysis, internal consistency findings, evidentiary confidence on each item, and carrier clarification requests.",
  },
  {
    n: "04",
    title: "Next Action Packet",
    body: "A clean summary you can use in conversation with the carrier, contractor, or a licensed claim professional.",
  },
] as const;

// ---------------------------------------------------------------------------
// FAQs — also feeds JSON-LD on the landing page
// ---------------------------------------------------------------------------

export const faqs = [
  {
    q: "Is Vvon™ a public adjuster?",
    a: "No. Vvon™ provides informational document and estimate analysis only. It does not negotiate, represent you, or adjust your claim.",
  },
  {
    q: "Does Vvon™ guarantee more money from insurance?",
    a: "No. It identifies possible issues and documentation gaps, but claim outcomes depend on policy terms, evidence, carrier review, and applicable law.",
  },
  {
    q: "What documents should I upload?",
    a: "Carrier estimate, contractor estimate, photos, policy, denial letter, mitigation invoice, and any claim correspondence. The more context the system has, the more grounded the report.",
  },
  {
    q: "Can contractors use Vvon™?",
    a: "Yes. Contractors and estimators can use it as a second-pass scope review to identify possible omissions before submitting a supplement.",
  },
  {
    q: "Does it replace an estimator or attorney?",
    a: "No. It is a support tool, not a substitute for licensed professionals. For legal or representation questions, work with a licensed public adjuster or attorney in your state.",
  },
  {
    q: "How is my information handled?",
    a: "Uploaded files are processed for the purpose of generating your report and are not shared with third parties. Treat any document you upload as sensitive — do not include information you would not want analyzed.",
  },
] as const;

// ---------------------------------------------------------------------------
// Report data shape — shared by /api/vvon/analyze and the report UI.
// Severity values are constrained to keep the UI palette stable.
// ---------------------------------------------------------------------------

export const severityLevels = [
  "critical",
  "high",
  "medium",
  "low",
  "needs-documentation",
] as const;
export type Severity = (typeof severityLevels)[number];

// Severity labels use the forensic-review register — "concern" rather
// than bare adjectives. Keeps the report reading as professional
// analysis, not chatbot output.
export const severityLabel: Record<Severity, string> = {
  critical: "Critical concern",
  high: "High concern",
  medium: "Moderate concern",
  low: "Low concern",
  "needs-documentation": "Documentation gap",
};

// Confidence is a 4-step scale. The AI is instructed to map "confirmed"
// only to items directly cited by an uploaded document line. Labels are
// chosen so the reader sees them as an evidentiary scale, not a
// chatbot's hedge words ("likely", "possible").
export const confidenceLevels = [
  "confirmed",
  "likely",
  "possible",
  "needs-verification",
] as const;
export type Confidence = (typeof confidenceLevels)[number];

export const confidenceLabel: Record<Confidence, string> = {
  confirmed: "Documented in file",
  likely: "High confidence",
  possible: "Moderate confidence",
  "needs-verification": "Requires verification",
};

export type ClaimSnapshot = {
  claimType: string;
  documentsReviewed: number;
  estimateTotal: string | null;
  lossDate: string | null;
  carrier: string | null;
  propertyState: string | null;
};

export type MissingScopeItem = {
  item: string;
  whyItMatters: string;
  evidenceReference: string;
  evidenceNeeded: string;
  confidence: Confidence;
  severity: Severity;
  recommendedQuestion: string;
};

export type Inconsistency = {
  title: string;
  detail: string;
  severity: Severity;
};

export type ChecklistItem = {
  label: string;
  hint?: string;
};

export type ClaimReport = {
  snapshot: ClaimSnapshot;
  keyFindings: { label: string; severity: Severity; summary: string }[];
  missingScope: MissingScopeItem[];
  inconsistencies: Inconsistency[];
  questionsToAsk: string[];
  documentationChecklist: ChecklistItem[];
  generatedAt: string;
  source: "demo" | "ai" | "mock";
};
