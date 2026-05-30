import Anthropic from "@anthropic-ai/sdk";
import { askOnaSystemPrompt } from "@/lib/assistant/prompts";
import { site } from "@/lib/site";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

// POST /api/assistant
//
// Streams a Claude response for the "Ask ONA" assistant. Body shape:
//   { messages: [{ role: "user"|"assistant", content: string|ContentBlock[] }] }
//
// `content` blocks may include `text` and `image` (base64) for vision.
// Image support is intentional — visitors can drop a photo of their
// damage into the chat and the assistant can describe what it sees
// at a high level (no medical diagnosis, no engineering opinion).
//
// Falls back to a deterministic mock when ANTHROPIC_API_KEY is unset,
// so the UI stays exercisable without an API key.

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGES = 30;
const MAX_TEXT_LENGTH = 12_000; // a bit more than triage — page context can be long
const MAX_IMAGES_PER_MESSAGE = 4;
// Aggregate body cap. The per-block image limit (4 × ~7MB base64) lets a
// single photo-heavy message reach ~28MB legitimately, but the per-message
// caps alone permit a pathological ~MAX_MESSAGES × that. This Content-Length
// pre-check cheaply rejects absurd payloads before we ever read the body.
const MAX_BODY_BYTES = 32 * 1024 * 1024; // 32 MB

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
type ChatMessage = {
  role: "user" | "assistant";
  content: string | ContentBlock[];
};

function isValidMessage(m: unknown): m is ChatMessage {
  if (typeof m !== "object" || m === null) return false;
  const obj = m as Record<string, unknown>;
  if (obj.role !== "user" && obj.role !== "assistant") return false;
  if (typeof obj.content === "string") {
    return obj.content.length <= MAX_TEXT_LENGTH;
  }
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
      if (!ALLOWED_MEDIA_TYPES.includes(src.media_type as ImageMediaType))
        return false;
      if (typeof src.data !== "string") return false;
      // ~5MB raw cap (base64 inflates ~33%).
      if (src.data.length > 7_000_000) return false;
    } else {
      return false;
    }
  }
  return true;
}

export async function POST(req: Request) {
  // Reject obviously-oversized bodies before reading them. Content-Length can
  // be spoofed or absent, so this is a cheap pre-filter, not the only guard —
  // the per-message/per-block caps below still apply to the parsed payload.
  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return new Response("Payload too large.", { status: 413 });
  }

  // Per-IP rate limit. Runs before body parsing so a flood of malformed or
  // huge requests is throttled too. Counts every POST against the IP's window;
  // returns null (allow) when Upstash isn't configured (dev/preview).
  const rl = await checkRateLimit(clientIp(req));
  if (rl && !rl.success) {
    const retryAfterSec = Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000));
    return new Response(
      `Too many requests. Please wait a moment, or call ${site.phoneDisplay} for live help.`,
      {
        status: 429,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Reset": String(rl.reset),
          "Cache-Control": "no-store",
        },
      },
    );
  }

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

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES
  ) {
    return new Response("Invalid messages payload.", { status: 400 });
  }
  for (const m of messages) {
    if (!isValidMessage(m)) {
      return new Response("Invalid message format.", { status: 400 });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(buildMockStream(messages as ChatMessage[]), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Assistant-Source": "mock",
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
          text: askOnaSystemPrompt,
          // System prompt is identical across requests — cache it.
          // 5-minute TTL on the ephemeral cache. Subsequent requests
          // pay ~10% of input cost on the prompt prefix.
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
              `\n\n_The assistant ran into an issue. Please call ${site.phoneDisplay} for live help._`,
            ),
          );
          controller.close();
          console.error("[/api/assistant] stream error", err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Assistant-Source": "claude-opus-4-7",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/assistant] init error", err);
    return new Response(
      `Ask ONA is unavailable right now. Please call ${site.phoneDisplay} for live help.`,
      {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }
}

// ---------------------------------------------------------------------------
// Mock stream — used when ANTHROPIC_API_KEY is unset. Picks a reply based
// on rough keyword matching so the UI is exercisable without API access.
// ---------------------------------------------------------------------------

function buildMockStream(messages: ChatMessage[]): ReadableStream<Uint8Array> {
  const last = messages[messages.length - 1];
  const userText = Array.isArray(last.content)
    ? last.content
        .filter((b): b is TextBlock => b.type === "text")
        .map((b) => b.text)
        .join(" ")
        .toLowerCase()
    : typeof last.content === "string"
      ? last.content.toLowerCase()
      : "";

  let reply: string;
  if (/(remodel|kitchen|bath|whole.house|addition|millwork)/.test(userText)) {
    reply = `Yes — ${site.name} has a full remodeling division covering kitchens, baths, whole-house renovations, additions, and custom millwork. Same crew that handles restoration losses; same insurance-grade documentation discipline.\n\n[Remodeling overview →](${site.url}/services/remodeling)`;
  } else if (/(area|zip|portland|vancouver|beaverton|tigard|gresham)/.test(userText)) {
    reply = `${site.name} serves Vancouver, WA and the entire Portland, OR metro — Clark, Multnomah, Washington, and Clackamas counties. Response target is **60 minutes** anywhere in the metro, 24/7.\n\n[See our full service area →](${site.url}/areas)`;
  } else if (/(water|leak|flood|drying)/.test(userText)) {
    reply = `For active water intrusion: stop the source if it's safe, kill power to affected areas, move rugs and electronics off wet floors, and call us at **${site.phoneDisplay}** — we'll have a crew on site within an hour.\n\n[Water damage details →](${site.url}/services/water-damage)`;
  } else if (/(fire|smoke|soot)/.test(userText)) {
    reply = `After a fire — wait for the fire department to clear the property, then call us at **${site.phoneDisplay}**. We'll board up openings, run air filtration, and start the cleaning sequence in the first hour.\n\n[Fire & smoke restoration →](${site.url}/services/fire-damage)`;
  } else if (/(mold|musty|mildew)/.test(userText)) {
    reply = `Visible mold growth on porous materials usually needs remediation by a trained crew working inside containment to the IICRC S520 standard. If you can already see or smell it, don't disturb it — call **${site.phoneDisplay}** and we'll scope an inspection.\n\n[Mold remediation →](${site.url}/services/mold-removal)`;
  } else {
    reply = `I'm Ask ONA — the assistant for ${site.name}. I can help with restoration questions, remodeling, service-area coverage, and insurance basics. What's going on?\n\n_(Demo response — set ANTHROPIC_API_KEY to switch to the live model.)_`;
  }

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < reply.length; i += 8) {
        controller.enqueue(encoder.encode(reply.slice(i, i + 8)));
        await new Promise((r) => setTimeout(r, 14));
      }
      controller.close();
    },
  });
}
