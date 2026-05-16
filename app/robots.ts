import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// AI / LLM crawler policy.
// For a local-service marketing site, surfacing in LLM answers (ChatGPT, Claude,
// Perplexity) is a positive — it functions as a new lead channel. We therefore
// explicitly allow the major AI crawlers below rather than silently relying on
// the wildcard rule. Flip Allow → Disallow on a per-bot basis if you want to
// opt out of a specific platform.
const aiCrawlers = [
  "GPTBot", // OpenAI training
  "OAI-SearchBot", // OpenAI SearchGPT / ChatGPT browsing
  "ChatGPT-User", // user-initiated ChatGPT fetches
  "ClaudeBot", // Anthropic training
  "Claude-Web", // Anthropic browsing
  "anthropic-ai", // legacy Anthropic UA
  "Google-Extended", // Gemini training opt-in/out
  "PerplexityBot", // Perplexity index
  "Perplexity-User", // user-initiated Perplexity fetches
  "Applebot-Extended", // Apple Intelligence training
  "Bytespider", // ByteDance (TikTok/Doubao)
  "Meta-ExternalAgent", // Meta AI
  "DuckAssistBot", // DuckDuckGo AI
  "CCBot", // Common Crawl (powers many models)
  "cohere-ai",
  "Diffbot",
  "FacebookBot",
  "ImagesiftBot",
  "Omgili",
  "YouBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/", "/quote/thanks"] },
      ...aiCrawlers.map((bot) => ({ userAgent: bot, allow: "/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
