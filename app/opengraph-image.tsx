import { ImageResponse } from "next/og";

// Link-preview card shown when the invitation is shared (WhatsApp, iMessage,
// Twitter/X, Facebook, etc.). Rendered on the fly so the text stays crisp.
// Runs on the edge runtime — that's where @vercel/og + local-asset fonts work.

export const runtime = "edge";
export const alt = "Raees & Aysha — Wedding Invitation, August 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [cormorant400, cormorant600] = await Promise.all([
    fetch(new URL("./og-cormorant-400.woff", import.meta.url)).then((r) =>
      r.arrayBuffer(),
    ),
    fetch(new URL("./og-cormorant-600.woff", import.meta.url)).then((r) =>
      r.arrayBuffer(),
    ),
  ]);

  const GOLD = "#b88a3a";
  const GOLD_INK = "#93692a";
  const NAME = "#7d5b24";

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
          backgroundColor: "#f6efe0",
          backgroundImage:
            "linear-gradient(135deg, #f7f0e2 0%, #f1e8d4 55%, #ece0c7 100%)",
          fontFamily: "Cormorant",
          color: "#2a2418",
        }}
      >
        {/* warm glow behind the names */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 760,
            height: 420,
            transform: "translate(-50%, -50%)",
            backgroundImage:
              "radial-gradient(closest-side, rgba(231,205,134,0.5), rgba(231,205,134,0))",
          }}
        />

        {/* double gold frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `2px solid rgba(184,138,58,0.55)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 38,
            left: 38,
            right: 38,
            bottom: 38,
            border: `1px solid rgba(184,138,58,0.28)`,
          }}
        />

        {/* content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: 10,
              color: GOLD_INK,
            }}
          >
            THE WEDDING OF
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 26,
            }}
          >
            <div style={{ fontSize: 88, fontWeight: 600, color: NAME, lineHeight: 1.05 }}>
              Raees Mohamed Ali
            </div>
            <div style={{ fontSize: 46, color: GOLD, margin: "2px 0" }}>&amp;</div>
            <div style={{ fontSize: 88, fontWeight: 600, color: NAME, lineHeight: 1.05 }}>
              Aysha Samiya
            </div>
          </div>

          {/* divider with diamond */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              margin: "34px 0 24px",
            }}
          >
            <div
              style={{
                width: 110,
                height: 1,
                backgroundImage: `linear-gradient(90deg, rgba(184,138,58,0), ${GOLD})`,
              }}
            />
            <div
              style={{
                width: 11,
                height: 11,
                transform: "rotate(45deg)",
                border: `1px solid ${GOLD}`,
              }}
            />
            <div
              style={{
                width: 110,
                height: 1,
                backgroundImage: `linear-gradient(270deg, rgba(184,138,58,0), ${GOLD})`,
              }}
            />
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: 12,
              color: GOLD_INK,
            }}
          >
            AUGUST 2026
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: cormorant400, weight: 400, style: "normal" },
        { name: "Cormorant", data: cormorant600, weight: 600, style: "normal" },
      ],
    },
  );
}
