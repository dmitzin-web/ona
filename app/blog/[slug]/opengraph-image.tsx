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

export const alt = "Ona Restoration blog post share image";

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
            background: "#073b3a",
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
          // Deep teal, matching app/opengraph-image.tsx. Both cards were
          // still on the retired charcoal palette.
          background: "#073b3a",
          color: "#ffffff",
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
          {/* Same lockup as app/opengraph-image.tsx at 38px: the chevron
              is the A, not an icon beside the word. Ratios come from
              components/Logo.tsx — cap 27.17, stem 2.13, chevron width 27.17. */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                fontSize: 38,
                fontWeight: 300,
                letterSpacing: 4.6,
                lineHeight: 0.715,
              }}
            >
              <div style={{ display: "flex" }}>ON</div>
              <svg width={27.17} height={27.17} viewBox="0 0 27.17 27.17" fill="none">
                <path
                  d="M1.07 26.10 L13.59 1.28 L26.10 26.10"
                  stroke="#ffffff"
                  strokeWidth={2.1}
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 8,
                fontSize: 11,
                fontWeight: 300,
                letterSpacing: 4.7,
                opacity: 0.72,
              }}
            >
              RESTORATION
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#c9d8d6",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 4,
              border: "1px solid #1b4e4b",
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
            borderTop: "1px solid #1b4e4b",
            paddingTop: 28,
            fontSize: 20,
            color: "#c9d8d6",
            letterSpacing: 1,
          }}
        >
          <div style={{ display: "flex" }}>{`By ${post.author.name}`}</div>
          <div style={{ display: "flex", fontWeight: 500, color: "#ffffff" }}>
            {`${site.url.replace(/^https?:\/\//, "")}/blog`}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
