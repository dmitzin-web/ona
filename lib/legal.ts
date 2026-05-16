// Centralized legal copy. Edit here, both pages stay in sync.
// Last reviewed: 2026-05-16. Replace before production launch with counsel-reviewed copy.
//
// NOTE: The ClaimLens-specific sections below are a working draft authored
// in-house. They have NOT been reviewed by counsel. Before public launch,
// have a Washington / Oregon attorney with insurance-services experience
// review the ClaimLens disclaimers in particular — both states have
// specific definitions of public adjusting and unauthorized practice of
// law that AI claim-review products have run afoul of in the past.

import { site } from "./site";

export const legalUpdated = "May 16, 2026";

// Banner copy that flags the draft status on both legal pages.
export const draftBanner =
  "Draft — these terms are a working version pending review by counsel. They are published in good faith to disclose how ClaimLens™ operates, but they are not a substitute for a lawyer-reviewed agreement and may be updated before public launch.";

export const privacySections: { heading: string; body: string[] }[] = [
  {
    heading: "Who we are",
    body: [
      `${site.legalName} ("${site.name}", "we", "us", or "our") operates the website at ${site.url} and provides restoration services in Vancouver, WA and the Portland metro area.`,
      `If you have any questions about this policy, contact us at ${site.email} or ${site.phoneDisplay}.`,
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "Information you provide directly: name, address, phone number, email, photos and a description of property damage when you request a quote, leave a voicemail, or send us an email.",
      "Information collected automatically: anonymous, cookieless web analytics — page views, referrer, device type, and approximate country/region. We do not use cookies for analytics or advertising and we do not build advertising profiles.",
      "Service-call records: when you call our dispatch line, we may record the date, time and duration of the call for quality and dispatch purposes. We do not record call audio without explicit consent.",
    ],
  },
  {
    heading: "How we use information",
    body: [
      "To respond to your inquiry and provide restoration services.",
      "To document the loss for insurance purposes and communicate with your adjuster, with your authorization.",
      "To improve the website and our service delivery.",
      "To comply with legal obligations, including record-keeping required by Washington and Oregon contractor licensing.",
    ],
  },
  {
    heading: "Who we share information with",
    body: [
      "Your insurance carrier and adjuster, with your written or verbal authorization, for the purpose of processing your claim.",
      "Subcontractors and trade partners (e.g. specialty cleaning, content storage) bound by confidentiality obligations.",
      "Government agencies when required by law or in response to a valid legal process.",
      "We do not sell personal information. We do not share personal information for cross-context behavioral advertising.",
    ],
  },
  {
    heading: "Health-related information (Washington residents)",
    body: [
      `Under the Washington My Health My Data Act (RCW 19.373), "consumer health data" is treated with elevated protections. If you describe health-related effects of property damage (for example, mold exposure or smoke inhalation) when contacting us, we collect this data only with your authorization, use it strictly to scope and document the restoration work, and do not sell it or share it for advertising. You may request access, correction, or deletion of this data at any time.`,
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Access: request a copy of the personal information we hold about you.",
      "Correction: ask us to correct inaccurate information.",
      "Deletion: ask us to delete personal information, subject to retention obligations under Washington and Oregon contractor law.",
      `To exercise any of these rights, email ${site.email} with the subject "Privacy request". We will respond within 45 days.`,
    ],
  },
  {
    heading: "Retention",
    body: [
      "Project records, photos and estimates: retained for at least seven (7) years as required by Washington and Oregon contractor licensing rules and standard insurance practice.",
      "Web analytics: aggregated, non-identifying data retained for up to 24 months.",
      "Inquiries that do not become projects: contact details retained for 12 months unless you ask us to delete them sooner.",
    ],
  },
  {
    heading: "Security",
    body: [
      "We use industry-standard encryption (TLS) for data in transit and encrypted storage for project records. Access to client data is limited to staff with a need to know. No system is perfectly secure; we will notify you if a breach occurs involving your information as required by law.",
    ],
  },
  {
    heading: "Children",
    body: [
      "This site is not directed to children under 13 and we do not knowingly collect information from children under 13. If you believe a child has provided us with personal information, please contact us so we can delete it.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy from time to time. The updated version will be posted on this page with a revised effective date. Material changes will be highlighted at the top of the page for at least 30 days.",
    ],
  },
];

export const termsSections: { heading: string; body: string[] }[] = [
  {
    heading: "Acceptance",
    body: [
      `By accessing ${site.url} or engaging ${site.legalName} for restoration services, you agree to these Terms of Service. If you do not agree, do not use the website.`,
    ],
  },
  {
    heading: "Services",
    body: [
      "We provide property restoration services including water damage mitigation, fire and smoke restoration, mold remediation, storm damage response, and related reconstruction.",
      "Specific scope, schedule, and pricing for any project are set out in a written estimate or contract you sign before work begins. These Terms govern use of the website and general engagement; the project contract governs the work itself.",
      "Emergency mitigation services may begin before a written contract is signed at your verbal authorization, with a follow-up written agreement provided promptly.",
    ],
  },
  {
    heading: "Estimates and pricing",
    body: [
      "Estimates are based on the conditions and scope visible at the time of inspection. Changes in scope (concealed damage, additional contamination, customer-requested upgrades) may result in change orders, documented in writing and approved before the additional work proceeds.",
      "Insurance estimates are prepared using Xactimate and follow IICRC standards. We will work directly with your carrier when authorized, but you remain ultimately responsible for amounts your insurance does not cover.",
    ],
  },
  {
    heading: "Warranties",
    body: [
      "We warrant our workmanship for one (1) year from substantial completion of the work, subject to normal wear, owner maintenance, and conditions beyond our control.",
      "Manufacturer warranties on materials installed pass through directly to you.",
      "We make no warranty against pre-existing conditions, concealed damage, recurrence due to unresolved moisture sources outside our scope, or acts of God.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      `Our total liability for any claim arising out of services performed is limited to the amount paid for those services. Neither party is liable for indirect, incidental, consequential, special or punitive damages, except where prohibited by law. Nothing in these Terms limits liability for gross negligence, willful misconduct, or any liability that cannot be limited under Washington or Oregon law.`,
    ],
  },
  {
    heading: "Disputes",
    body: [
      "These Terms are governed by the laws of the State of Washington. Any dispute will first be addressed through good-faith negotiation; if unresolved, by binding arbitration in Clark County, Washington, under the rules of the American Arbitration Association — except that either party may seek injunctive relief in court to protect intellectual property or confidential information.",
      "You agree to bring any claim individually and not as part of a class action.",
    ],
  },
  {
    heading: "Website use",
    body: [
      "The site is provided for informational and lead-generation purposes. All text, images, schemas and code are owned by " +
        `${site.legalName} or licensed to us. You may not reproduce, scrape, or republish material from this site for commercial use without prior written consent. Personal use, accurate citation by AI systems with attribution and a link back, and use for fair-use purposes is permitted.`,
    ],
  },
  {
    heading: "Contact",
    body: [
      `${site.legalName}`,
      `${site.address.locality}, ${site.address.region}`,
      `${site.phoneDisplay}`,
      `${site.email}`,
    ],
  },
];

// ---------------------------------------------------------------------------
// ClaimLens™ — product-specific privacy & terms.
//
// These appear on the same /privacy and /terms pages, after the
// restoration-company sections, under a distinct heading. The legal
// posture for ClaimLens is meaningfully different from the restoration
// business: it is an AI software product that ingests sensitive insurance
// documents, so the data-handling disclosures and the "not legal advice"
// framing are stricter.
// ---------------------------------------------------------------------------

export const claimLensPrivacySections: { heading: string; body: string[] }[] = [
  {
    heading: "About ClaimLens™ data handling",
    body: [
      `ClaimLens™ is an AI-assisted insurance-estimate review product operated by ${site.legalName}. The disclosures below describe how it handles your account and your uploaded claim documents. They are in addition to the restoration-services disclosures above; in case of conflict for matters relating to ClaimLens™, the ClaimLens™ sections govern.`,
    ],
  },
  {
    heading: "Information ClaimLens™ collects",
    body: [
      "Account information: the email address you provide to receive a magic sign-in link. We use Supabase Auth (Supabase Inc., USA) to handle authentication. We do not collect or store passwords.",
      "Documents you upload: insurance estimates, contractor estimates, policy documents, denial letters, mitigation invoices, photos, and any notes you provide. We do not require you to upload Social Security numbers, account numbers, or other identifiers that are not necessary for scope review — we recommend redacting these before upload.",
      "Claim metadata: claim type, property state, your role (homeowner, contractor, etc.), and carrier name if you provide it.",
      "Technical metadata: timestamps, file sizes, and the same anonymous web-analytics events described above for the main site.",
    ],
  },
  {
    heading: "Where your ClaimLens™ data is stored",
    body: [
      "Documents are stored in a private object-storage bucket hosted by Supabase Inc. in the AWS US-West-2 region (Oregon). Access is restricted by per-user folder policies enforced at the storage layer — your files are not accessible to other users of the service.",
      "Database records (your account, your claims, file metadata, and AI-generated reports) live in a Supabase-managed Postgres instance in the same region. Row-Level Security policies restrict each row to the user who created it.",
      "All data in transit uses TLS. Data at rest is encrypted by the storage provider.",
    ],
  },
  {
    heading: "How ClaimLens™ uses AI sub-processors",
    body: [
      "To generate your report, ClaimLens™ sends the text extracted from your PDFs and the image bytes of your photos to Anthropic PBC (operators of the Claude API) for analysis. Anthropic acts as a sub-processor for this purpose under its commercial-API terms. Under Anthropic's published API policies, inputs and outputs submitted via the API are not used to train Anthropic's models.",
      "We do not send your data to any other AI provider, advertising network, or analytics service.",
      "Our current sub-processors:",
      "• Supabase Inc. — authentication, database, file storage",
      "• Anthropic PBC — AI document analysis (Claude API)",
      "• Vercel Inc. — application hosting",
      "If we add or change sub-processors we will update this list and post a notice at the top of this page for at least 30 days.",
    ],
  },
  {
    heading: "Retention and deletion (ClaimLens™)",
    body: [
      "ClaimLens™ documents and reports are retained for as long as you keep your account, so you can refer back to them. You can delete an individual claim and all of its associated files and reports from the report view, or delete your entire account by emailing us at the address below.",
      `Account deletion requests: email ${site.email} with the subject "ClaimLens deletion request" from the email address tied to your account. We will delete your account, your uploaded documents, and your generated reports within 14 days of verifying the request, except where retention is required by law.`,
      "Backups: deletions propagate to encrypted backups within 30 days.",
    ],
  },
  {
    heading: "What you should not upload",
    body: [
      "Please do not upload documents you do not have authority to share — for example, another person's insurance documents without their written consent.",
      "Please do not upload information you do not want analyzed by an AI service. ClaimLens™ is designed for property-insurance claim documents. It is not designed for, and you should not upload, government-issued IDs, medical records, financial-account statements, or any document containing Social Security numbers — redact these before uploading.",
    ],
  },
  {
    heading: "Your rights (ClaimLens™)",
    body: [
      "You have the same access, correction, and deletion rights described in the main privacy policy above. For ClaimLens™ data specifically you can also request a machine-readable export of your account contents (claims, file metadata, and reports as JSON).",
      `Requests: email ${site.email} with the subject "ClaimLens privacy request" from the email tied to your account.`,
    ],
  },
  {
    heading: "Security incidents (ClaimLens™)",
    body: [
      "If we become aware of a security incident affecting ClaimLens™ data we will notify affected users without undue delay and in any case within the timeframes required by Washington and Oregon notification laws.",
    ],
  },
];

export const claimLensTermsSections: { heading: string; body: string[] }[] = [
  {
    heading: "ClaimLens™ — informational only",
    body: [
      "ClaimLens™ provides informational estimate and document analysis only. It does not provide legal advice, public adjusting services, insurance representation, or any guaranteed claim outcome. ClaimLens™ is not a substitute for a licensed public adjuster, an attorney, a licensed estimator, or any other licensed professional.",
      "Nothing produced by ClaimLens™ should be interpreted as a legal opinion, an interpretation of insurance-policy coverage, a guarantee that an insurer will pay any specific amount, or a representation that the carrier acted improperly. Outcomes on insurance claims depend on the terms of your policy, the evidence in your claim file, the carrier's adjustment of that evidence, and applicable law in your state.",
      "If you need representation in your claim, work with a licensed public adjuster or attorney in your state.",
    ],
  },
  {
    heading: "AI limitations",
    body: [
      "ClaimLens™ uses a large-language-model AI to read your uploaded documents and produce a structured report. Like all current AI systems, it can miss issues that a human professional would catch, surface findings that on close inspection are not applicable, and produce confident-sounding statements that turn out to be wrong.",
      "Every finding in a ClaimLens™ report is meant to be a starting point for a conversation, not a conclusion. The report explicitly labels each finding with a confidence level (confirmed by documents, likely, possible, or needs verification) and a severity. Always verify against the underlying documents before acting.",
      "Do not rely on ClaimLens™ as your sole tool for evaluating a claim.",
    ],
  },
  {
    heading: "Your responsibilities",
    body: [
      "Documents: you represent that you have the legal right to upload every document and photograph you submit to ClaimLens™, and that doing so does not violate any contract, court order, confidentiality agreement, or applicable law.",
      "Identifiers: you agree to redact Social Security numbers, government-issued ID numbers, financial account numbers, and any sensitive identifiers from documents before upload. ClaimLens™ does not need this information to perform a scope review.",
      "Truthful use: you agree not to misrepresent your role, your relationship to the property, or facts about the loss in the notes you provide.",
      "No abusive use: you agree not to attempt to reverse-engineer the AI prompts, evade rate limits, scrape outputs at scale, or use the service to harass or defraud any insurer, contractor, or claimant.",
    ],
  },
  {
    heading: "Account and rate limits",
    body: [
      "ClaimLens™ requires a free account, created by entering an email and clicking a one-tap sign-in link. We may impose per-user rate limits on analyses to prevent abuse and to manage AI-service costs. The current limit is 10 analyses per 24-hour period per user; we may change this with reasonable notice.",
      "We may suspend or terminate an account that violates these Terms, abuses the service, or uploads content described in the privacy policy as not allowed.",
    ],
  },
  {
    heading: "No public adjusting, no UPL",
    body: [
      "Washington (RCW 48.17) and Oregon (ORS 744) regulate public adjusting and the practice of law. ClaimLens™ is not a public adjuster, does not negotiate with insurers on your behalf, does not collect or charge a contingent fee tied to your settlement, and does not interpret your policy or apply the law to your specific facts. Reports are generated by software and reviewed only at your direction.",
      "If you would like representation, please retain a licensed public adjuster or attorney in your state. We do not endorse or accept referral fees from any specific public adjuster or law firm.",
    ],
  },
  {
    heading: "Disclaimer of warranties (ClaimLens™)",
    body: [
      "THE CLAIMLENS™ SERVICE IS PROVIDED ON AN \"AS IS\" AND \"AS AVAILABLE\" BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, OR COMPLETENESS. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE OR THAT FINDINGS PRODUCED BY THE AI WILL BE ACCURATE OR COMPLETE.",
    ],
  },
  {
    heading: "Limitation of liability (ClaimLens™)",
    body: [
      `Our total aggregate liability arising out of or related to use of ClaimLens™ shall not exceed one hundred U.S. dollars ($100.00), or, if greater, the total amount you have paid us in the twelve (12) months preceding the claim. Neither party is liable for indirect, incidental, consequential, special or punitive damages. These limitations apply to the maximum extent permitted by law. Nothing in these Terms limits liability for gross negligence, willful misconduct, fraud, or any liability that cannot be limited under Washington or Oregon law.`,
    ],
  },
];
