import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

// Node runtime: the edge build of @vercel/og fails to load its default font
// in this Next 13.4 setup; the node build reads it from the filesystem.
export const runtime = "nodejs";
export const alt = "Hwat Sauce — offensive security, red teaming, and CTF writeups";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Explicit fonts sidestep @vercel/og's broken bundled default font and give
// the card the theme's real mono face.
const fonts = [
  {
    name: "JetBrains Mono",
    data: readFileSync(join(process.cwd(), "fonts", "JetBrainsMono-Regular.ttf")),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "JetBrains Mono",
    data: readFileSync(join(process.cwd(), "fonts", "JetBrainsMono-Bold.ttf")),
    weight: 700 as const,
    style: "normal" as const,
  },
];

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 80% 15%, rgba(52, 211, 153, 0.18), transparent 55%)",
          fontFamily: "JetBrains Mono",
        }}
      >
        {/* Terminal window */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 1000,
            borderRadius: 18,
            border: "1px solid #27272a",
            backgroundColor: "#101012",
            overflow: "hidden",
          }}
        >
          {/* Chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "18px 26px",
              borderBottom: "1px solid #27272a",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 99, backgroundColor: "#f87171" }} />
            <div style={{ width: 16, height: 16, borderRadius: 99, backgroundColor: "#facc15" }} />
            <div style={{ width: 16, height: 16, borderRadius: 99, backgroundColor: "#34d399" }} />
            <div style={{ display: "flex", marginLeft: 14, fontSize: 22, color: "#a1a1aa" }}>
              hwat.sauce — bash
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "48px 56px 56px",
            }}
          >
            <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa" }}>
              <span style={{ color: "#34d399", marginRight: 14 }}>$</span>
              whoami
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                fontSize: 84,
                fontWeight: 700,
                color: "#e4e4e7",
                letterSpacing: -2,
              }}
            >
              Hwat
              <span style={{ color: "#34d399" }}>.</span>
              Sauce
            </div>
            <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: "#a1a1aa" }}>
              Offensive Security · Red Team · CTF Player
            </div>
            <div style={{ display: "flex", marginTop: 44, fontSize: 26, color: "#34d399" }}>
              ❯ iabdullah.vercel.app
              <span style={{ marginLeft: 8, color: "#34d399" }}>_</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
