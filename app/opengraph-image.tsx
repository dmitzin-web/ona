import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 88,
          // Deep teal, not the retired #141414 charcoal. The share card
          // was still on the old palette while every dark surface on
          // the site is #073b3a.
          background: "#073b3a",
          color: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Logo lock-up — the brand book's wordmark, where the chevron IS
            the A. Previously this was a chevron parked to the left of the
            word, which is not the mark. See components/Logo.tsx for the
            geometry; the numbers here are that component's ratios at
            56px: cap 40.0, stem 3.14, chevron width 40.0.

            Satoshi is not loaded in this edge route, so the letters fall
            back to a system sans. That is acceptable because the
            recognisable part of this mark is the substituted A, not the
            typeface — but if the OG images ever need to be exact, the
            fix is a static Satoshi subset passed to ImageResponse's
            `fonts`, not more tweaking here. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              fontSize: 56,
              fontWeight: 300,
              letterSpacing: 6.7,
              lineHeight: 0.715,
            }}
          >
            <div style={{ display: "flex" }}>ON</div>
            <svg width={40.04} height={40.04} viewBox="0 0 40.04 40.04" fill="none">
              <path
                d="M1.57 38.47 L20.02 1.88 L38.47 38.47"
                stroke="#ffffff"
                strokeWidth={3.1}
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 11,
              fontSize: 16,
              fontWeight: 300,
              letterSpacing: 6.9,
              opacity: 0.72,
            }}
          >
            RESTORATION
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 18,
              color: "#c9d8d6",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 4,
            }}
          >
            Property restoration · Vancouver, WA & Portland Metro
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // 92 originally. The rebuilt lockup is taller than the old
              // chevron-beside-word one, and with `space-between` the
              // card had only ~8px between the logo's RESTORATION and
              // the eyebrow below — two wide-tracked cap lines reading as
              // one block. Dropping the headline gives both gaps ~36px.
              fontSize: 74,
              fontWeight: 300,
              letterSpacing: -2,
              lineHeight: 1.0,
            }}
          >
            <span>Precision.</span>
            <span>Restoration.</span>
            <span style={{ fontWeight: 500 }}>Built to Last.</span>
          </div>
        </div>

        {/* Footer line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #1b4e4b",
            paddingTop: 28,
            fontSize: 22,
            color: "#c9d8d6",
            letterSpacing: 1,
          }}
        >
          <div>{site.phoneDisplay}</div>
          <div style={{ fontWeight: 500, color: "#ffffff" }}>onarestore.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
