import { ImageResponse } from "next/og";

// iOS home-screen / bookmark icon: gold "R & A" monogram in a ringed emerald
// tile, echoing the intro and OG card.

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await fetch(
    new URL("./og-cormorant-600.woff", import.meta.url),
  ).then((r) => r.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: "#0e3a2c",
          backgroundImage:
            "radial-gradient(circle at 50% 38%, #14503b 0%, #0e3a2c 60%, #08241b 100%)",
          color: "#e7cd86",
          fontFamily: "Cormorant",
        }}
      >
        {/* gold ring */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 22,
            right: 22,
            bottom: 22,
            borderRadius: "50%",
            border: "2px solid rgba(231,205,134,0.7)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 84,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          <span>R</span>
          <span style={{ fontSize: 50, color: "#c59f51", margin: "0 4px" }}>
            &amp;
          </span>
          <span>A</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Cormorant", data: font, weight: 600, style: "normal" }],
    },
  );
}
