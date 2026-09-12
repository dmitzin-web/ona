"use server";

import Anthropic from "@anthropic-ai/sdk";
import { requireAdmin } from "@/lib/admin/session";
import { findSection } from "@/lib/admin/sections";
import { getAt, type Path } from "@/lib/admin/json-path";
import { fieldsAlong, leaves, trailOf } from "@/components/admin/visual/model";
import { legalFindings, type Finding } from "@/lib/admin/legal-guard";

// "Tell it what to change": the editor writes a sentence ("make the call
// button green", "shorten the headline", "say we work weekends") and this
// proposes the exact field edits. Nothing is
// saved — the changes land in the draft, the page updates in front of the
// editor, and they still press Publish.
//
// The model only ever gets the fields of the page being looked at, and can
// only return edits to those fields; every edit is checked against the
// schema here before it leaves the server, and against the legal guard
// before it can be published.

export type Edit = { sectionId: string; path: Path; value: string | number; label: string; before: unknown };
export type AskResult =
  | { ok: true; reply: string; edits: Edit[]; legal: Finding[] }
  | { ok: false; message: string };

type FieldRef = { sectionId: string; path: Path; label: string; kind: string; value: unknown; options?: string[] };

const MODEL = "claude-sonnet-5";

export async function askEditor(
  request: string,
  context: { sectionIds: string[]; page: string; values: Record<string, unknown> },
): Promise<AskResult> {
  await requireAdmin();
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return { ok: false, message: "The assistant is not connected: add ANTHROPIC_API_KEY in Vercel and redeploy." };
  }
  if (!request.trim()) return { ok: false, message: "…" };

  // Everything the editor could change on this page, with its address.
  const fields: FieldRef[] = [];
  for (const id of context.sectionIds.slice(0, 8)) {
    const section = findSection(id);
    const value = context.values[id];
    if (!section || value === undefined) continue;
    for (const leaf of leaves(section, value)) {
      const f = fieldsAlong(section, leaf.path).at(-1);
      if (!f) continue;
      fields.push({
        sectionId: id,
        path: leaf.path,
        label: trailOf(section, value, leaf.path).join(" › "),
        kind: leaf.photo ? "photo" : f.kind,
        value: getAt(value, leaf.path),
      });
    }
    // Numbers and choices are not text leaves but are editable too.
    for (const f of section.kind === "single" ? section.schema : []) {
      if (f.kind === "number" || f.kind === "color" || f.kind === "select") {
        fields.push({
          sectionId: id,
          path: [f.key],
          label: `${section.label} › ${f.label}`,
          kind: f.kind,
          value: getAt(value, [f.key]),
          options: f.kind === "select" ? [...f.options] : undefined,
        });
      }
    }
  }
  if (!fields.length) return { ok: false, message: "Nothing on this page can be changed automatically." };

  const list = fields
    .slice(0, 400)
    .map((f, i) => `${i}. [${f.kind}] ${f.label}${f.options ? ` (one of: ${f.options.join(", ")})` : ""}\n   ${JSON.stringify(f.value)}`)
    .join("\n");

  const system = `You edit the content of a small restoration contractor's website (Ona Restoration, Vancouver WA) for a non-technical office manager. They describe what they want in their own words; you return the exact field edits.

RULES
- Only edit fields from the list. Refer to them by their number.
- Everything — the site's copy and your reply — is in English.
- Keep {placeholders} exactly as they are: {phone}, {name}, {area}, {service} … They are filled in automatically.
- Match the existing voice: plain, concrete, no marketing fluff, no exclamation marks.
- NEVER write claims we cannot prove: no response-time promises, no invented review/project counts, no client names.
- NEVER say we are licensed, registered or bonded in Oregon (that registration is pending). NEVER write "bonded and insured". NEVER offer to waive, cover or absorb a deductible.
- Photo fields take a path like /photos/projects/p3.avif — only use one that already appears in the list.
- Colours are #rrggbb. Corner rounding is a number of pixels.
- Make the smallest set of edits that does what was asked. If the request is unclear or would break a rule, make no edits and say why.

Reply with the tool. The "reply" is one or two short sentences for the person.`;

  const anthropic = new Anthropic({ apiKey: key });
  let message;
  try {
    message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system,
      tools: [
        {
          name: "propose_changes",
          description: "Propose edits to the page's fields.",
          input_schema: {
            type: "object",
            properties: {
              reply: { type: "string" },
              edits: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    field: { type: "integer", description: "The field's number in the list" },
                    value: { type: ["string", "number"] },
                  },
                  required: ["field", "value"],
                },
              },
            },
            required: ["reply", "edits"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "propose_changes" },
      messages: [{ role: "user", content: `Page: ${context.page}\n\nFIELDS\n${list}\n\nREQUEST\n${request.slice(0, 2000)}` }],
    });
  } catch (err) {
    console.error("[admin] assistant failed", err);
    return { ok: false, message: "The assistant did not answer. Try again." };
  }

  const block = message.content.find((c) => c.type === "tool_use");
  if (!block || block.type !== "tool_use") return { ok: false, message: "The assistant did not answer. Try again." };
  const out = block.input as { reply?: string; edits?: { field: number; value: string | number }[] };

  const edits: Edit[] = [];
  for (const e of out.edits ?? []) {
    const f = fields[e.field];
    if (!f) continue;
    if (typeof e.value !== "string" && typeof e.value !== "number") continue;
    if (f.kind === "number" || f.kind === "color") {
      if (f.kind === "color" && !/^#[0-9a-f]{6}$/i.test(String(e.value))) continue;
    } else if (typeof e.value !== "string") continue;
    if (String(e.value) === String(f.value)) continue;
    edits.push({ sectionId: f.sectionId, path: f.path, value: e.value, label: f.label, before: f.value });
  }

  return { ok: true, reply: String(out.reply ?? ""), edits, legal: legalFindings(edits.map((e) => e.value)) };
}
