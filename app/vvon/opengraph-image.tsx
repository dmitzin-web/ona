import { ImageResponse } from "next/og";

// Vvon Open Graph image (1200x630). Shared when /vvon or any
// of its subpages are linked in chat / social. Visually distinct from
// the main ONA Restoration OG image: gold accent on charcoal, product
// wordmark prominent, "AI claim review" framing.

export const runtime = "edge";
export const alt = "Vvon — AI insurance estimate review";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function VvonOpenGraphImage() {
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
          // Subtle radial gold glow in the upper-right, mirroring the
          // live hero. Inline gradient because ImageResponse doesn't
          // support pseudo-elements.
          backgroundImage:
            "radial-gradient(ellipse at 80% 0%, rgba(184,152,94,0.18) 0%, transparent 55%)",
          color: "#F5F4F1",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Wordmark lock-up — product first, parent brand below */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 4,
              fontSize: 48,
              fontWeight: 500,
              letterSpacing: -1.5,
              color: "#F5F4F1",
            }}
          >
            <span>Vvon</span>
            <span style={{ fontSize: 22, opacity: 0.7 }}>™</span>
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#B8985E",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 5,
            }}
          >
            AI claim review · by ONA Restoration
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 80,
              fontWeight: 300,
              letterSpacing: -2,
              lineHeight: 1.05,
              color: "#F5F4F1",
            }}
          >
            <span>Find what your</span>
            <span>insurance estimate</span>
            <span>
              may be{" "}
              <span style={{ fontWeight: 500, color: "#B8985E" }}>missing.</span>
            </span>
          </div>
        </div>

        {/* Footer line — product framing */}
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
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <span>Estimate review</span>
            <span style={{ color: "#5A554E" }}>·</span>
            <span>Scope gaps</span>
            <span style={{ color: "#5A554E" }}>·</span>
            <span>Documentation checklist</span>
          </div>
          <div style={{ fontWeight: 500, color: "#F5F4F1" }}>
            onarestore.com/vvon
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
