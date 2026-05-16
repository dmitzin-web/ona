import Anthropic from "@anthropic-ai/sdk";
import { triageSystemPrompt } from "@/lib/triage/prompts";

// AI Damage Triage endpoint.
//
// POST /api/triage
// {
//   messages: [
//     { role: "user"|"assistant", content: string|ContentBlock[] }, ...
//   ]
// }
//
// Returns a text/plain stream of the model response.
//
// If ANTHROPIC_API_KEY is missing we fall back to a deterministic mock so the
// UI is reviewable without a key. Replace with `claude-opus-4-7` once a real
// key is available — same API shape, no client changes needed.

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGES = 30;
const MAX_TEXT_LENGTH = 8000;
const MAX_IMAGES_PER_MESSAGE = 4;

type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
const ALLOWED_MEDIA_TYPES: ReadonlyArray<ImageMediaType> = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

type TextBlock = { type: "text"; text: string };
type ImageBlock = {
  type: "image";
  source: { type: "base64"; media_type: ImageMediaType; data: string };
};
type ContentBlock = TextBlock | ImageBlock;
type ChatMessage = { role: "user" | "assistant"; content: string | ContentBlock[] };

function isValidMessage(m: unknown): m is ChatMessage {
  if (typeof m !== "object" || m === null) return false;
  const obj = m as Record<string, unknown>;
  if (obj.role !== "user" && obj.role !== "assistant") return false;
  if (typeof obj.content === "string") return obj.content.length <= MAX_TEXT_LENGTH;
  if (!Array.isArray(obj.content)) return false;
  if (obj.content.length === 0) return false;
  let imageCount = 0;
  for (const block of obj.content) {
    if (typeof block !== "object" || block === null) return false;
    const b = block as Record<string, unknown>;
    if (b.type === "text") {
      if (typeof b.text !== "string") return false;
      if (b.text.length > MAX_TEXT_LENGTH) return false;
    } else if (b.type === "image") {
      imageCount++;
      if (imageCount > MAX_IMAGES_PER_MESSAGE) return false;
      const src = b.source as Record<string, unknown> | undefined;
      if (!src || src.type !== "base64") return false;
      if (typeof src.media_type !== "string") return false;
      if (!ALLOWED_MEDIA_TYPES.includes(src.media_type as ImageMediaType)) return false;
      if (typeof src.data !== "string") return false;
      // Rough size cap: base64 string > 7M chars ≈ 5MB raw — refuse anything heavier
      if (src.data.length > 7_000_000) return false;
    } else {
      return false;
    }
  }
  return true;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON.", { status: 400 });
  }

  const messages =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).messages
      : undefined;

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return new Response("Invalid messages payload.", { status: 400 });
  }
  for (const m of messages) {
    if (!isValidMessage(m)) {
      return new Response("Invalid message format.", { status: 400 });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Fallback path: no API key configured. Return a deterministic mock so the
  // UI is fully exercisable in dev.
  if (!apiKey) {
    return new Response(buildMockStream(messages as ChatMessage[]), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Triage-Source": "mock",
        "Cache-Control": "no-store",
      },
    });
  }

  const client = new Anthropic({ apiKey });

  try {
    const stream = client.messages.stream({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: triageSystemPrompt,
          // 5-minute prefix cache — system prompt is identical across every
          // triage call, so subsequent requests pay ~10% of input price.
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages as ChatMessage[],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          stream.on("text", (delta: string) => {
            controller.enqueue(encoder.encode(delta));
          });
          await stream.finalMessage();
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              "\n\n[Triage assistant is unavailable right now. Please call (360) 823-3196 for dispatch.]",
            ),
          );
          controller.close();
          console.error("[/api/triage] stream error", err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Triage-Source": "claude-opus-4-7",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/triage] init error", err);
    return new Response(
      "Triage assistant is unavailable right now. Please call (360) 823-3196 for dispatch.",
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }
}

// Mock stream — used when ANTHROPIC_API_KEY is not configured. Returns a
// scripted triage that demonstrates the format the real model emits, so the
// UI can be reviewed without API access.
function buildMockStream(messages: ChatMessage[]): ReadableStream<Uint8Array> {
  const last = messages[messages.length - 1];
  const hasImage =
    Array.isArray(last.content) && last.content.some((b) => b.type === "image");
  const userText = Array.isArray(last.content)
    ? last.content
        .filter((b): b is TextBlock => b.type === "text")
        .map((b) => b.text)
        .join(" ")
        .toLowerCase()
    : typeof last.content === "string"
      ? last.content.toLowerCase()
      : "";

  let damageType = "Water";
  if (/(fire|smoke|burn|soot)/.test(userText)) damageType = "Fire / smoke";
  else if (/(mold|mildew|musty)/.test(userText)) damageType = "Mold";
  else if (/(storm|tree|wind|hail|roof|tarp)/.test(userText)) damageType = "Storm";

  const reply = [
    `**What we see** — ${hasImage ? "From the photo" : "Based on your description"}, this looks like a ${damageType.toLowerCase()} loss in the early-to-moderate range. ${hasImage ? "I'd need a closer shot of the affected materials to refine the category." : ""}`.trim(),
    "",
    "**First-hour actions:**",
    "1. Stop the source if you safely can (shut-off valve, breaker, board-up).",
    "2. Photograph every affected area before moving anything.",
    "3. Move rugs, electronics and paper records off the floor.",
    "4. Do not lift wet drywall or insulation — let our crew bag it inside containment.",
    "5. Note the time the loss started; your adjuster will ask.",
    "",
    "**Call or email?** Call (360) 823-3196 now if water is still spreading or the structure is unsafe. Otherwise, email photos to dmitry@onarestore.com — a specialist will reply within the hour during business hours.",
    "",
    "_A live specialist will follow up. This is a triage assist, not a claim or contract._",
    "",
    "_(Demo response — set ANTHROPIC_API_KEY in `.env.local` to switch to the live AI.)_",
  ].join("\n");

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      // Stream a few characters at a time to mimic real model latency.
      for (let i = 0; i < reply.length; i += 8) {
        controller.enqueue(encoder.encode(reply.slice(i, i + 8)));
        await new Promise((r) => setTimeout(r, 18));
      }
      controller.close();
    },
  });
}
