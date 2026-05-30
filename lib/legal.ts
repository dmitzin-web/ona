// Centralized legal copy. Edit here, both pages stay in sync.
// Last reviewed: 2026-05-16. Replace before production launch with
// counsel-reviewed copy. This is a working in-house draft; have a
// Washington / Oregon attorney with restoration-services experience
// review before public launch.

import { site } from "./site";

export const legalUpdated = "May 16, 2026";

// Banner copy that flags the draft status on both legal pages.
export const draftBanner =
  "Draft — these terms are a working version pending review by counsel. They are published in good faith to disclose how the website and our restoration services operate, but they are not a substitute for a lawyer-reviewed agreement and may be updated before public launch.";

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
    heading: "Third-party services we use",
    body: [
      "Our website runs on infrastructure and tools operated by third parties. Each receives only the data needed to perform its function, and none are authorized to use your information for their own advertising:",
      "Hosting (Vercel): serves the website and processes form submissions. Standard server logs (IP address, request time, user agent) are retained briefly for security and reliability.",
      "Analytics (Plausible): cookieless, privacy-first web analytics. It does not use cookies, does not collect personal identifiers, and does not track you across other websites.",
      "Maps (Google Maps): our Contact page embeds a Google map. When it loads, Google may receive your IP address and device information under Google's own privacy policy. The map only loads on that page.",
      'AI assistant "Ask ONA" (Anthropic): if you use the optional chat assistant, the text you type — and any photo you choose to attach — is sent to Anthropic\'s Claude API to generate a reply. Anthropic processes it to return an answer and, per its commercial terms, does not use it to train its models. Do not paste sensitive personal, financial, or medical details into the chat; for those, call us instead.',
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

