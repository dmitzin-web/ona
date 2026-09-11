// Checks every string the admin is about to publish against the site's
// legal rules (CLAUDE.md → "Legal — do not edit these away"). A finding does
// not make a save impossible — the owner can publish anyway after an explicit
// acknowledgement — but nothing on this list goes live by accident, and an
// acknowledged save says so in its commit message.
//
// Sentence-level on purpose: "Our Oregon CCB registration is pending" is the
// approved wording and must pass, while "licensed in WA and OR" must not.
// Tuned against every existing piece of copy on the site: zero findings.
// Pure — used by the server action and by the tests.

export type Finding = { rule: string; excerpt: string };

const RULES: { rule: string; test: (sentence: string) => boolean }[] = [
  {
    rule:
      "“Bonded and insured” may not be advertised by a Washington contractor (RCW 18.27.100(4)). Use the registration number instead.",
    test: (s) => /\bbonded\b[\s,]*(?:and|&|\+|,)?[\s,]*insured\b/i.test(s) || /\binsured\b[\s,]*(?:and|&|\+)[\s,]*bonded\b/i.test(s),
  },
  {
    rule:
      "Nothing may say we are licensed, registered or bonded in Oregon while the Oregon CCB registration is pending.",
    test: (s) =>
      /\b(licen[cs]ed|registered|bonded|licen[cs]e)\b/i.test(s) &&
      /\b(Oregon|OR|CCB)\b/.test(s) &&
      !/\bpending\b/i.test(s),
  },
  {
    rule:
      "Never offer to waive, cover or absorb a customer's deductible (RCW 48.30.230). “You pay your deductible, nothing more” is the approved line.",
    test: (s) =>
      /\b(waiv\w*|cover\w*|absorb\w*|eliminat\w*|forgiv\w*|refund\w*)\b[^.]{0,40}\bdeductible/i.test(s) ||
      /\b(no|free|zero|\$0)\s+deductible/i.test(s) ||
      /\bdeductible[- ](free|waived|covered)\b/i.test(s),
  },
];

function* strings(v: unknown): Generator<string> {
  if (typeof v === "string") yield v;
  else if (Array.isArray(v)) for (const x of v) yield* strings(x);
  else if (v && typeof v === "object") for (const x of Object.values(v)) yield* strings(x);
}

// A sentence that asks, or that warns the reader AGAINST the practice, is
// not a claim. Without these, the guard fired on the site's own FAQ
// questions ("Are you licensed … in both WA and OR?") and on the Spokane
// page's "If someone offers to waive your deductible, walk away" — both
// exactly the kind of copy the rules exist to encourage.
const IS_WARNING =
  /\b(never|don['’]t|do not|won['’]t|will not|cannot|can['’]t|if (?:someone|anyone|a contractor|they)|walk away|illegal|felony|fraud|avoid|beware|refuse)\b/i;
const isClaim = (sentence: string) => !sentence.trim().endsWith("?") && !IS_WARNING.test(sentence);

export function legalFindings(value: unknown): Finding[] {
  const out: Finding[] = [];
  const seen = new Set<string>();
  for (const text of strings(value)) {
    for (const sentence of text.split(/(?<=[.!?])\s+|\n+/)) {
      if (!isClaim(sentence)) continue;
      for (const r of RULES) {
        if (!r.test(sentence)) continue;
        const excerpt = sentence.trim().slice(0, 160);
        const k = r.rule + excerpt;
        if (!seen.has(k)) {
          seen.add(k);
          out.push({ rule: r.rule, excerpt });
        }
      }
    }
  }
  return out;
}

// The same rules in Russian, for the admin's Russian interface. Keyed by the
// English rule; the quoted English phrases stay English because the site
// copy they refer to is English.
export const RULES_RU: Record<string, string> = {
  [RULES[0].rule]:
    "В рекламе подрядчика в штате Вашингтон нельзя писать «bonded and insured» (RCW 18.27.100(4)). Вместо этого указывайте регистрационный номер.",
  [RULES[1].rule]:
    "Нельзя писать, что у нас есть лицензия, регистрация или бонд в Орегоне (licensed / registered / bonded in Oregon), пока регистрация в Oregon CCB не выдана.",
  [RULES[2].rule]:
    "Нельзя предлагать отменить, покрыть или взять на себя франшизу клиента (waive / cover / absorb the deductible, RCW 48.30.230). Разрешённая формулировка: «You pay your deductible, nothing more».",
};
