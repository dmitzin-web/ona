import { pathKey } from "./admin/json-path";
import { targetOf, type At, type Content, type SitePage } from "./seo-pages";

// What is wrong with the site as far as Google is concerned, in the words of
// someone who has never heard of a meta description.
//
// Every rule here is something we can see from the content itself and state
// as a fact — a title that is too long to be shown, two pages saying the
// same thing, a photo nobody described. Nothing here guesses at rankings or
// invents a score out of thin air: the number on the screen is "pages with
// nothing wrong", and each finding names the page, the reason, and the field
// that fixes it.
//
// Pure: it runs on the draft in the browser, so the count drops as the
// editor types, and on the files on disk in scripts.

export type Severity = "fix" | "improve";
export type Where = { path: string; label: string; at: At | null; href: string | null };

export type Finding = {
  key: string;
  rule: string;
  severity: Severity;
  /** What is wrong, in one line. */
  what: string;
  /** What it costs, in one line. */
  why: string;
  /** What to do about it. */
  fix: string;
  /** The pages it affects, each with the field that fixes it. */
  pages: Where[];
  /** A sentence the assistant can act on, if this can be written for you. */
  ask: string | null;
};

export type Report = {
  findings: Finding[];
  /** Indexable pages with nothing in the "fix" column. */
  ready: number;
  total: number;
};

// Google shows about 600px of title and 920px of description. Characters are
// a rough stand-in; these are the widths at which text starts being cut.
const TITLE_MAX = 60;
/** Past this there is no doubt the end of the title is thrown away. */
const TITLE_CUT = 70;
const TITLE_MIN = 25;
const DESC_MAX = 160;
const DESC_MIN = 70;
/** Under this many words of its own, a page from a template says nothing new. */
const THIN_WORDS = 90;

const STOP = new Set(["a", "an", "the", "in", "of", "and", "for", "to", "at", "on", "with", "near", "my", "me", "your", "we"]);
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(/\s+/).filter(Boolean);

// "remodeling" counts as covering "remodel"; "vancouver's" covers "vancouver".
const covers = (haystack: string[], word: string) => {
  const stem = word.slice(0, Math.max(4, word.length - 3));
  return haystack.some((w) => w.startsWith(stem) || word.startsWith(w.slice(0, Math.max(4, w.length - 3))));
};

const where = (p: SitePage, at: At | null): Where => ({ path: p.path, label: p.label, at, href: p.editHref });
const plural = (n: number, one: string, many: string) => (n === 1 ? one : `${n} ${many}`);

export function auditSite(pages: SitePage[], values: Content, now = new Date()): Report {
  const found = new Map<string, Finding>();
  const add = (
    f: Omit<Finding, "key" | "pages"> & { groupBy?: string },
    page: SitePage,
    at: At | null,
  ) => {
    // One finding per field to fix: the ten city pages share one title, so
    // they are one line on the screen, not ten.
    const key = `${f.rule}|${f.groupBy ?? (at ? `${at.sectionId}:${pathKey(at.path)}` : page.path)}`;
    const existing = found.get(key);
    if (existing) {
      if (!existing.pages.some((w) => w.path === page.path)) existing.pages.push(where(page, at));
      return;
    }
    found.set(key, { ...f, key, pages: [where(page, at)] });
  };

  const indexable = pages.filter((p) => !p.noindex);
  const thin = new Map<string, SitePage[]>();

  for (const p of indexable) {
    const name = p.label;

    // ── The blue line in Google ──
    if (!p.title.trim()) {
      add({ rule: "title-missing", severity: "fix", what: `${name} has no title.`, why: "Google invents one from the page, usually badly.", fix: "Write a title with the service and the city in it.", ask: `Write the browser-tab title for the ${name} page: what we do, where, under 60 characters.` }, p, p.titleAt);
    } else if (p.title.length > TITLE_MAX) {
      add({ rule: "title-long", severity: p.title.length > TITLE_CUT ? "fix" : "improve", what: `The title is ${p.title.length} characters long.`, why: `Google shows about ${TITLE_MAX} and cuts the rest — the end of the sentence never gets read.`, fix: `Shorten it to ${TITLE_MAX} characters, keeping the words people search for at the front.`, ask: `Shorten this page's title to under ${TITLE_MAX} characters. Keep the service and the city; drop anything else.` }, p, p.titleAt);
    } else if (p.title.length < TITLE_MIN) {
      add({ rule: "title-short", severity: "improve", what: `The title is only ${p.title.length} characters.`, why: "There is room for the city or the service, and both are what people type.", fix: "Add where we work or what the page is about.", ask: "Make this page's title fuller — add the service and the city — but stay under 60 characters." }, p, p.titleAt);
    }

    // ── The grey lines under it ──
    if (!p.description.trim()) {
      add({ rule: "desc-missing", severity: "fix", what: `${name} has no description.`, why: "Google picks a sentence from the page instead, often the wrong one.", fix: "Write two sentences: what this page is, and what to do next.", ask: `Write the Google description for the ${name} page: what it is and what to do next, 140 characters or so.` }, p, p.descriptionAt);
    } else if (p.description.length > DESC_MAX) {
      add({ rule: "desc-long", severity: "improve", what: `The description is ${p.description.length} characters.`, why: `Google shows about ${DESC_MAX}; the phone number or the call to action at the end is what gets cut.`, fix: `Trim it to ${DESC_MAX} characters.`, ask: `Shorten this page's Google description to under ${DESC_MAX} characters without losing the city or the phone number.` }, p, p.descriptionAt);
    } else if (p.description.length < DESC_MIN) {
      add({ rule: "desc-short", severity: "improve", what: `The description is only ${p.description.length} characters.`, why: "A fuller line takes up more of the screen and gets clicked more often.", fix: `Two sentences, ${DESC_MIN}–${DESC_MAX} characters.`, ask: `Make this page's Google description two full sentences, between ${DESC_MIN} and ${DESC_MAX} characters.` }, p, p.descriptionAt);
    }

    // ── A placeholder that never got filled in ──
    for (const [label, text, at] of [
      ["title", p.title, p.titleAt],
      ["description", p.description, p.descriptionAt],
      ["heading", p.heading, p.headingAt],
    ] as const) {
      const left = text.match(/\{\w+\}/g);
      if (left) {
        add({ rule: "placeholder", severity: "fix", what: `The ${label} still says ${left[0]}.`, why: "It prints exactly like that — in Google, and on the page.", fix: "Either write the words out, or use a placeholder this page fills in.", ask: null }, p, at);
      }
    }

    // ── The heading ──
    if (!p.heading.trim()) {
      add({ rule: "heading-missing", severity: "improve", what: `${name} has no heading.`, why: "The big line at the top is the second thing Google reads after the title.", fix: "Write a heading that says what the page is about.", ask: null }, p, p.headingAt);
    }

    // ── The words this page is meant to be found for ──
    const target = targetOf(p);
    if (target) {
      const missing = words(target).filter((w) => !STOP.has(w) && !covers(words(p.title), w));
      if (missing.length) {
        add({ rule: "target-title", severity: "improve", what: `The title doesn't say “${missing.join(" ")}”.`, why: `This page is meant to be found for “${target}”, and the title is the strongest signal there is.`, fix: "Work those words into the title naturally — no keyword stuffing.", ask: `This page should be found for “${target}”. Rewrite its title so those words appear naturally, under 60 characters.`, groupBy: p.titleAt ? undefined : p.path }, p, p.titleAt);
      }
    }

    // ── Pages built from a template: collected and reported per family ──
    if (p.template && p.ownWords < THIN_WORDS) {
      thin.set(p.template.id, [...(thin.get(p.template.id) ?? []), p]);
    }

    // ── Photos ──
    for (const photo of p.photos) {
      if (!photo.alt.trim()) {
        add({ rule: "alt-missing", severity: "improve", what: "A photo has no description.", why: "Google can't see photos, and neither can a blind visitor using a screen reader.", fix: "Describe what is in the frame, in a few words.", ask: null }, p, photo.at);
      }
    }

    // ── A block of questions that has no questions in it ──
    if (p.schema.includes("FAQPage") && p.faqs === 0) {
      add({ rule: "faq-none", severity: "improve", what: `${name} sends Google an empty list of questions.`, why: "Questions are what Google shows expanded under a result, and what people type in the first place. An empty block is a wasted slot.", fix: "Add three or four questions people actually ask about this, with short, honest answers.", ask: "Add three questions people ask about this page's subject, with short, honest answers." }, p, p.ownAt);
    }
  }

  // ── Pages built from a template, all together ──────────────────────────
  // Fifty pages that differ by a city name are one problem, not fifty, and
  // the answer is the same for each: give that city something to say.
  for (const [templateId, group] of thin) {
    const family = group[0].template!;
    const key = `thin|${templateId}`;
    const fewest = [...group].sort((a, b) => a.ownWords - b.ownWords);
    found.set(key, {
      key,
      rule: "thin",
      severity: "improve",
      what: `${group.length} of the ${family.siblings} pages from the ${family.label.toLowerCase()} say almost nothing of their own.`,
      why: `Everything else on them is the same words with a name swapped in. Google keeps one page out of a set that says the same thing and drops the rest.`,
      fix: `Give each one a few lines that could only be about it — the streets, the weather, what actually goes wrong there. ${fewest[0].label} has the least to say (${fewest[0].ownWords} words).`,
      ask: null,
      pages: fewest.map((p) => where(p, p.ownAt)),
    });
  }

  // ── Two pages saying the same thing ────────────────────────────────────
  const groupSame = (
    pick: (p: SitePage) => string,
    at: (p: SitePage) => At | null,
    rule: string,
    what: (n: number, text: string) => string,
    why: string,
    fix: string,
    ask: string,
  ) => {
    const by = new Map<string, SitePage[]>();
    for (const p of indexable) {
      const v = pick(p).trim().toLowerCase();
      if (!v) continue;
      by.set(v, [...(by.get(v) ?? []), p]);
    }
    for (const [text, group] of by) {
      // Pages from one template share one field: that is one thing to write,
      // not a duplicate to hunt down.
      const fields = new Set(group.map((p) => (at(p) ? `${at(p)!.sectionId}:${pathKey(at(p)!.path)}` : p.path)));
      if (group.length < 2 || fields.size < 2) continue;
      found.set(`${rule}|${text}`, {
        key: `${rule}|${text}`,
        rule,
        severity: "fix",
        what: what(group.length, group[0][rule.startsWith("title") ? "title" : "description"]),
        why,
        fix,
        pages: group.map((p) => where(p, at(p))),
        ask,
      });
    }
  };

  groupSame(
    (p) => p.title,
    (p) => p.titleAt,
    "title-duplicate",
    (n, text) => `${n} pages have the same title: “${text}”.`,
    "Google shows one of them and drops the others — they are competing with each other, not with other companies.",
    "Give each page a title of its own: the service, the city, or what makes it different.",
    "Give this page a title of its own — no other page on the site should have the same one.",
  );
  groupSame(
    (p) => p.description,
    (p) => p.descriptionAt,
    "desc-duplicate",
    (n, text) => `${n} pages have the same description: “${text.slice(0, 60)}…”.`,
    "It is the same sales line under every result, and Google treats the pages as interchangeable.",
    "Write a line for each page that could not have been written for the other.",
    "Write a Google description for this page that could not be used on any other page of the site.",
  );

  // ── Two pages after the same search ────────────────────────────────────
  // Whoever writes the targets can point two pages at one phrase without
  // noticing. Google then has to choose between them, and often picks the
  // weaker one.
  const byTarget = new Map<string, SitePage[]>();
  for (const p of indexable) {
    const target = targetOf(p).trim().toLowerCase();
    if (target) byTarget.set(target, [...(byTarget.get(target) ?? []), p]);
  }
  for (const [target, group] of byTarget) {
    if (group.length < 2) continue;
    const key = `cannibal|${target}`;
    found.set(key, {
      key,
      rule: "cannibal",
      severity: "improve",
      what: `${group.length} pages are both meant to be found for “${target}”.`,
      why: "They compete with each other: Google shows one and holds the other back, and neither is as strong as one page would be.",
      fix: "Point each page at something different, or fold one into the other.",
      ask: null,
      pages: group.map((p) => where(p, p.targetAt)),
    });
  }

  // ── The same photo description everywhere ──────────────────────────────
  const alts = new Map<string, { page: SitePage; at: At }[]>();
  for (const p of indexable) {
    for (const photo of p.photos) {
      const a = photo.alt.trim().toLowerCase();
      if (!a) continue;
      alts.set(a, [...(alts.get(a) ?? []), { page: p, at: photo.at }]);
    }
  }
  for (const [alt, uses] of alts) {
    const fields = new Set(uses.map((u) => `${u.at.sectionId}:${pathKey(u.at.path)}`));
    if (fields.size < 3) continue;
    const key = `alt-duplicate|${alt}`;
    found.set(key, {
      key,
      rule: "alt-duplicate",
      severity: "improve",
      what: `${fields.size} photos are described with the same words: “${uses[0].page.photos.find((x) => x.alt.trim().toLowerCase() === alt)?.alt ?? alt}”.`,
      why: "A description that fits every photo tells Google nothing about any of them.",
      fix: "Describe what is actually in each frame — the room, the work, the stage.",
      ask: null,
      pages: uses.map((u) => where(u.page, u.at)),
    });
  }

  // ── The site as a whole ────────────────────────────────────────────────
  const site = (values.site ?? {}) as Record<string, unknown>;
  const reviews = ((values.reviews as Record<string, unknown>)?.reviews ?? []) as unknown[];
  const seo = (values.seo ?? {}) as Record<string, unknown>;
  const everywhere: Where[] = [{ path: "/", label: "The whole site", at: null, href: null }];

  if (reviews.length === 0 && !site.rating) {
    found.set("no-reviews", {
      key: "no-reviews",
      rule: "no-reviews",
      severity: "improve",
      what: "No reviews, so no stars in Google.",
      why: "Stars under a result are the single biggest difference in how many people click it.",
      fix: "Ask finished clients for a Google review; add the ones they write here, word for word, once the Google profile shows them.",
      ask: null,
      pages: [{ path: "/", label: "Reviews", at: { sectionId: "reviews", path: ["reviews"] }, href: null }],
    });
  }

  const social = (site.social ?? {}) as Record<string, string>;
  if (!Object.values(social).some((x) => typeof x === "string" && x.trim())) {
    found.set("social-empty", {
      key: "social-empty",
      rule: "social-empty",
      severity: "improve",
      what: "No Facebook or Instagram page is linked.",
      why: "Google uses the profiles a business links to confirm it is the same business it sees elsewhere.",
      fix: "Add the addresses of the profiles that exist. Leave the rest empty — a dead link is worse than none.",
      ask: null,
      pages: [{ path: "/contact", label: "Company details", at: { sectionId: "site", path: ["social", "facebook"] }, href: null }],
    });
  }

  const updated = String(seo.structureUpdated ?? "");
  const stamp = Date.parse(updated);
  if (Number.isNaN(stamp)) {
    found.set("sitemap-date", {
      key: "sitemap-date",
      rule: "sitemap-date",
      severity: "fix",
      what: `“${updated}” is not a date Google can read.`,
      why: "It is the date every page reports in the sitemap.",
      fix: "Write it as 2026-09-11.",
      ask: null,
      pages: [{ path: "/", label: "SEO settings", at: { sectionId: "seo", path: ["structureUpdated"] }, href: null }],
    });
  } else if (now.getTime() - stamp > 180 * 864e5) {
    const months = Math.round((now.getTime() - stamp) / 2592e6);
    found.set("sitemap-stale", {
      key: "sitemap-stale",
      rule: "sitemap-stale",
      severity: "improve",
      what: `Google is told the pages last changed ${months} months ago.`,
      why: "It decides how often to come back and look by that date.",
      fix: "If the pages have really changed since, move the date forward.",
      ask: null,
      pages: [{ path: "/", label: "SEO settings", at: { sectionId: "seo", path: ["structureUpdated"] }, href: null }],
    });
  }

  // ── The settings themselves ────────────────────────────────────────────
  // A redirect or a canonical that points at nothing is worse than none:
  // it takes a page out of Google and gives nothing back. These are
  // checked here, before publishing, and again in next.config.ts, which
  // simply drops a malformed redirect rather than serving it.
  const known = new Set(pages.map((p) => p.path));
  const redirects = ((seo.redirects ?? []) as { from: string; to: string }[]).filter((r) => r?.from);
  const froms = new Set(redirects.map((r) => r.from));
  const settingsPage = (label: string, at: At): Where[] => [{ path: "/", label, at, href: null }];

  redirects.forEach((r, i) => {
    const at: At = { sectionId: "seo", path: ["redirects", i, "from"] };
    const note = (rule: string, what: string, why: string, fix: string) =>
      found.set(`${rule}|${i}`, { key: `${rule}|${i}`, rule, severity: "fix", what, why, fix, ask: null, pages: settingsPage(`Redirect ${r.from}`, at) });
    if (known.has(r.from)) {
      note("redirect-shadow", `The redirect from ${r.from} hides a real page.`, "A redirect is applied before the page is: that page can no longer be opened by anyone, including Google.", "Redirect a retired address, not a live one.");
    } else if (r.from === r.to) {
      note("redirect-loop", `The redirect from ${r.from} points at itself.`, "The browser gives up after a few rounds and shows an error instead of the page.", "Point it somewhere else, or delete it.");
    } else if (froms.has(r.to)) {
      note("redirect-chain", `${r.from} redirects to ${r.to}, which redirects on again.`, "Each hop loses a little of the old page's standing, and Google stops following after a few.", `Send ${r.from} straight to where the chain ends.`);
    } else if (r.to.startsWith("/") && !known.has(r.to) && !r.to.startsWith("/work/")) {
      note("redirect-dead", `${r.from} redirects to ${r.to}, which is not a page on this site.`, "Anyone following the old address lands on “page not found”.", "Point it at a page that exists.");
    }
  });

  ((seo.pages ?? []) as { path: string; hide: boolean; canonical: string }[]).forEach((r, i) => {
    if (!r?.path) return;
    if (!known.has(r.path)) {
      const key = `rule-unknown|${i}`;
      found.set(key, { key, rule: "rule-unknown", severity: "improve", what: `The indexing setting for ${r.path} applies to no page.`, why: "There is no such address on the site, so the setting does nothing.", fix: "Correct the address or delete the line.", ask: null, pages: settingsPage(`Setting for ${r.path}`, { sectionId: "seo", path: ["pages", i, "path"] }) });
    } else if (r.canonical?.trim() && r.canonical.startsWith("/") && !known.has(r.canonical.trim())) {
      const key = `canonical-dead|${i}`;
      found.set(key, { key, rule: "canonical-dead", severity: "fix", what: `${r.path} says it is a copy of ${r.canonical}, which is not a page on this site.`, why: "Google is told the real version lives at an address that does not exist, and may drop both.", fix: "Point it at a page that exists, or leave it empty.", ask: null, pages: settingsPage(`Setting for ${r.path}`, { sectionId: "seo", path: ["pages", i, "canonical"] }) });
    }
  });

  // Cookies the visitor was not told about. Plausible sets none; Google's
  // two do, and Washington's My Health My Data Act and the FTC both care
  // what the policy says.
  const analytics = (seo.analytics ?? {}) as Record<string, string>;
  const measuring = Boolean(String(analytics.ga4 ?? "").trim() || String(analytics.gtm ?? "").trim());
  const privacyText = JSON.stringify((values.legal as Record<string, unknown>)?.privacy ?? "").toLowerCase();
  if (measuring && !privacyText.includes("google analytics") && !privacyText.includes("tag manager")) {
    found.set("analytics-privacy", {
      key: "analytics-privacy",
      rule: "analytics-privacy",
      severity: "fix",
      what: "Google Analytics is switched on, and the privacy policy does not mention it.",
      why: "It sets cookies in the visitor's browser. A privacy policy that does not say which analytics is used is the kind of gap regulators and lawyers look for first.",
      fix: "Add a line to the privacy policy naming Google Analytics and what it collects, or take the ID out again.",
      ask: null,
      pages: [{ path: "/privacy", label: "Privacy policy", at: { sectionId: "legal", path: ["privacy"] }, href: null }],
    });
  }

  if (!String((seo.verification as Record<string, string>)?.google ?? "").trim()) {
    found.set("no-search-console", {
      key: "no-search-console",
      rule: "no-search-console",
      severity: "improve",
      what: "The site is not verified in Google Search Console.",
      why: "Search Console is the only place that shows what the site is actually found for, which pages Google has indexed and what it refuses to index. Without it, every SEO decision here is made blind.",
      fix: "Add the property at search.google.com/search-console, choose the “HTML tag” method, and paste the code here.",
      ask: null,
      pages: settingsPage("Verification codes", { sectionId: "seo", path: ["verification", "google"] }),
    });
  }

  const untargeted = indexable.filter((p) => !targetOf(p) && (p.group === "Main" || p.group === "Services"));
  if (untargeted.length) {
    found.set("no-target", {
      key: "no-target",
      rule: "no-target",
      severity: "improve",
      what: `${plural(untargeted.length, "One page has", "pages have")} nothing written down about what they should be found for.`,
      why: "Without it nobody — not the assistant, not the next person to edit — knows which words the page is fighting for.",
      fix: "Write the line someone would type into Google to end up on that page.",
      ask: null,
      pages: untargeted.map((p) => ({ path: p.path, label: p.label, at: { sectionId: "seo", path: ["targets"] }, href: null })),
    });
  }

  // A finding about one page says which page, so a column of "The title is
  // 61 characters long" is readable without opening anything.
  for (const f of found.values()) {
    if (f.pages.length === 1 && !f.what.includes(f.pages[0].label) && f.pages[0].label !== "The whole site") {
      // Lower-case the sentence only where it starts with a word that is
      // only capitalised because it started a sentence — never "Google".
      const lead = /^(The|A|An|This|It|Its)\b/.test(f.what) ? f.what[0].toLowerCase() + f.what.slice(1) : f.what;
      f.what = `${f.pages[0].label} — ${lead}`;
    }
  }

  const findings = [...found.values()].sort(
    (a, b) =>
      Number(b.severity === "fix") - Number(a.severity === "fix") ||
      b.pages.length - a.pages.length ||
      a.rule.localeCompare(b.rule),
  );

  const broken = new Set(findings.filter((f) => f.severity === "fix").flatMap((f) => f.pages.map((w) => w.path)));
  return { findings, ready: indexable.filter((p) => !broken.has(p.path)).length, total: indexable.length };
}

/** Everything wrong with one page, for the panel beside it. */
export const findingsFor = (report: Report, path: string) =>
  report.findings.filter((f) => f.pages.some((w) => w.path === path));
