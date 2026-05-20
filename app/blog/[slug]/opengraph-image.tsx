import { ImageResponse } from "next/og";
import { findPost } from "@/lib/posts";
import { site } from "@/lib/site";

// Dynamic OG image per blog post. Next.js wires this as og:image on each
// /blog/[slug] route, replacing the global fallback in app/opengraph-image.tsx.
// Generated on edge on first social-share request and CDN-cached thereafter
// (no generateStaticParams — edge runtime can't combine with it, and the
// first-hit cost is acceptable for crawler-traffic patterns).
//
// Image lifts iMessage/Slack/Twitter share preview from generic homepage card
// to a per-post card with the title and category — meaningful CTR boost.

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const alt = "ONA Restoration blog post share image";

export default async function BlogOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "#141414",
          }}
        />
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#141414",
          color: "#F5F4F1",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Top: logo + category */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg
              width={44}
              height={33}
              viewBox="0 0 48 36"
              fill="none"
              stroke="#F5F4F1"
              strokeWidth={1.4}
            >
              <path d="M4 32 L24 4 L44 32" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 500,
                  letterSpacing: 6,
                  lineHeight: 1,
                }}
              >
                ONA
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 11,
                  fontWeight: 300,
                  letterSpacing: 5,
                  opacity: 0.7,
                }}
              >
                RESTORATION
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#C9C4BA",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 4,
              border: "1px solid #2A2A2A",
              padding: "10px 18px",
            }}
          >
            {`${post.category} · ${post.readingMinutes} min read`}
          </div>
        </div>

        {/* Middle: post title */}
        <div
          style={{
            display: "flex",
            fontSize: post.title.length > 70 ? 52 : 64,
            fontWeight: 300,
            letterSpacing: -1.5,
            lineHeight: 1.08,
            maxWidth: 1040,
          }}
        >
          {post.title}
        </div>

        {/* Bottom: byline + site */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #2A2A2A",
            paddingTop: 28,
            fontSize: 20,
            color: "#C9C4BA",
            letterSpacing: 1,
          }}
        >
          <div style={{ display: "flex" }}>{`By ${post.author.name}`}</div>
          <div style={{ display: "flex", fontWeight: 500, color: "#F5F4F1" }}>
            {`${site.url.replace(/^https?:\/\//, "")}/blog`}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
