import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#faf7f2",
          padding: "80px 96px",
          position: "relative",
        }}
      >
        {/* Amber accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            background: "#c8893a",
          }}
        />

        {/* Wordmark */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#1a1a1a",
            fontFamily: "sans-serif",
            letterSpacing: "-4px",
            lineHeight: 1,
            marginBottom: 32,
          }}
        >
          BOTTEIN
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 36,
            fontWeight: 400,
            color: "#666666",
            fontFamily: "sans-serif",
            letterSpacing: "-0.5px",
            lineHeight: 1.3,
            maxWidth: 700,
            gap: 10,
          }}
        >
          <span>Your protein.</span>
          <span style={{ color: "#c8893a", fontWeight: 600 }}>
            Personalized.
          </span>
        </div>

        {/* Bottom detail */}
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 96,
            fontSize: 20,
            color: "#999999",
            fontFamily: "sans-serif",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          bottein.ca
        </div>
      </div>
    ),
    size,
  );
}
