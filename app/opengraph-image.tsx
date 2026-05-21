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
          background: "#141414",
          color: "#F5F4F1",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Logo lock-up */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg
            width={56}
            height={42}
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
                fontSize: 36,
                fontWeight: 500,
                letterSpacing: 8,
                lineHeight: 1,
              }}
            >
              ONA
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 13,
                fontWeight: 300,
                letterSpacing: 6,
                opacity: 0.7,
              }}
            >
              RESTORATION
            </div>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 18,
              color: "#C9C4BA",
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
              fontSize: 92,
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
            borderTop: "1px solid #2A2A2A",
            paddingTop: 28,
            fontSize: 22,
            color: "#C9C4BA",
            letterSpacing: 1,
          }}
        >
          <div>{site.phoneDisplay}</div>
          <div style={{ fontWeight: 500, color: "#F5F4F1" }}>onarestore.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
