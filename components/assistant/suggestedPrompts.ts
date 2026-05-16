// Per-page suggested prompts shown above the input when the chat is
// empty. Keep each prompt under ~60 chars — they render as compact
// pill buttons inside a narrow drawer.
//
// The matching is most-specific-wins: exact paths first, then prefix
// matches, with a generic fallback. We don't try to be exhaustive —
// the goal is to nudge visitors into the most common follow-up
// questions on each page, not to cover every URL.

const DEFAULT_PROMPTS: readonly string[] = [
  "Do you serve my area?",
  "I have a water leak — what should I do first?",
  "Can Vvon review my insurance estimate?",
];

const PROMPTS_BY_PREFIX: { match: (path: string) => boolean; prompts: string[] }[] = [
  {
    match: (p) => p === "/" || p === "",
    prompts: [
      "Do you serve my area?",
      "How fast can a crew get to me?",
      "What is Vvon?",
    ],
  },
  {
    match: (p) => p.startsWith("/services/water-damage"),
    prompts: [
      "How long does structural drying take?",
      "Will insurance cover a slow leak?",
      "What is the difference between mitigation and reconstruction?",
    ],
  },
  {
    match: (p) => p.startsWith("/services/fire-damage"),
    prompts: [
      "What should I do in the first hour after a fire?",
      "Will smoke damage my electronics?",
      "Can you handle the insurance claim with my carrier?",
    ],
  },
  {
    match: (p) => p.startsWith("/services/mold-removal"),
    prompts: [
      "Is the mold in my home dangerous?",
      "Do I need air-quality testing first?",
      "How long does mold remediation take?",
    ],
  },
  {
    match: (p) => p.startsWith("/services/storm-damage"),
    prompts: [
      "Can you do emergency board-up tonight?",
      "What does the insurance process look like for storm damage?",
      "Do you handle tree-impact damage?",
    ],
  },
  {
    match: (p) => p.startsWith("/services"),
    prompts: [
      "Which service do I need?",
      "Are you available 24/7?",
      "Are you IICRC-certified?",
    ],
  },
  {
    match: (p) => p.startsWith("/areas"),
    prompts: [
      "How fast can you reach this area?",
      "Do you have crews based here?",
      "What's the response target?",
    ],
  },
  {
    match: (p) => p.startsWith("/vvon/upload"),
    prompts: [
      "What documents should I upload?",
      "How long does the analysis take?",
      "What if I don't have my policy?",
    ],
  },
  {
    match: (p) => p.startsWith("/vvon/report"),
    prompts: [
      "Explain a finding in plain language.",
      "What's my next step?",
      "Help me draft an email to my adjuster.",
    ],
  },
  {
    match: (p) => p.startsWith("/vvon"),
    prompts: [
      "What is Vvon?",
      "Is Vvon a public adjuster?",
      "What does the report look like?",
    ],
  },
  {
    match: (p) => p.startsWith("/quote"),
    prompts: [
      "What information do you need from me?",
      "How quickly will you respond?",
      "Can I send photos with the quote?",
    ],
  },
  {
    match: (p) => p.startsWith("/blog"),
    prompts: [
      "Summarize this article for me.",
      "Do you have other articles like this?",
      "I need help with this — what should I do?",
    ],
  },
];

export function suggestedPromptsForPath(pathname: string): readonly string[] {
  for (const entry of PROMPTS_BY_PREFIX) {
    if (entry.match(pathname)) return entry.prompts;
  }
  return DEFAULT_PROMPTS;
}
