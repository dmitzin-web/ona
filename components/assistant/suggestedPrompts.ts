import { chrome } from "@/lib/chrome";

// Per-page suggested prompts shown above the input when the chat is
// empty. Keep each prompt under ~60 chars — they render as compact
// pill buttons inside a narrow drawer.
//
// The matching is most-specific-wins: exact paths first, then prefix
// matches, with a generic fallback. We don't try to be exhaustive —
// the goal is to nudge visitors into the most common follow-up
// questions on each page, not to cover every URL.

// The questions themselves are in content/chrome.json (/admin → Header,
// footer & shared blocks → Ask Ona → Suggested questions); which page gets
// which group is decided here. Order matters: first match wins.
//
// NOTE: "/services/remodeling" sits after the generic "/services" prefix,
// so it never matches and remodeling pages get the `services` group. Kept
// as it was (the admin hint on that field says so); move the remodeling
// entry above "/services" to show its questions.
const q = chrome.assistant.suggestions;

const DEFAULT_PROMPTS: readonly string[] = q.other;

const PROMPTS_BY_PREFIX: { match: (path: string) => boolean; prompts: string[] }[] = [
  { match: (p) => p === "/" || p === "", prompts: q.home },
  { match: (p) => p.startsWith("/services/water-damage"), prompts: q.water },
  { match: (p) => p.startsWith("/services/fire-damage"), prompts: q.fire },
  { match: (p) => p.startsWith("/services/mold-removal"), prompts: q.mold },
  { match: (p) => p.startsWith("/services/storm-damage"), prompts: q.storm },
  { match: (p) => p.startsWith("/services"), prompts: q.services },
  { match: (p) => p.startsWith("/areas"), prompts: q.areas },
  { match: (p) => p.startsWith("/services/remodeling"), prompts: q.remodeling },
  { match: (p) => p.startsWith("/quote"), prompts: q.quote },
  { match: (p) => p.startsWith("/blog"), prompts: q.blog },
];

export function suggestedPromptsForPath(pathname: string): readonly string[] {
  for (const entry of PROMPTS_BY_PREFIX) {
    if (entry.match(pathname)) return entry.prompts;
  }
  return DEFAULT_PROMPTS;
}
