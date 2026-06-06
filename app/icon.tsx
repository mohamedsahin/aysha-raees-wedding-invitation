import { ImageResponse } from "next/og";

// Browser-tab favicon: a gold ampersand on deep emerald, matching the palette.

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
          backgroundColor: "#0e3a2c",
          color: "#e7cd86",
          fontFamily: "Cormorant",
          fontSize: 27,
          fontWeight: 600,
          paddingBottom: 2,
        }}
      >
        &amp;
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Cormorant", data: font, weight: 600, style: "normal" }],
    },
  );
}
