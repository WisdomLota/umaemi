import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DIAMOND_PIECES, DIAMOND_VIEWBOX } from "@/components/three/diamond-paths";

// The preview card shown when umaemi.com is shared: the brand's own headline,
// diamond and colours.
export const alt = "Umaemi — We handle the tech, so you can focus on growth.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [display, mono] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/BricolageGrotesque-Medium.ttf")),
    readFile(join(process.cwd(), "assets/fonts/DMMono-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFD0A5" }}>
        <div style={{ height: 14, background: "#E54100", display: "flex" }} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 80px", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontFamily: "Mono", fontSize: 26, color: "#E54100", letterSpacing: 4, marginBottom: 28 }}>
              UMAEMI
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                fontFamily: "Display",
                fontSize: 84,
                lineHeight: 0.98,
                letterSpacing: -3,
                color: "#460E04",
              }}
            >
              We handle the tech, so you can focus on&nbsp;<span style={{ color: "#E54100" }}>growth.</span>
            </div>
            <div style={{ display: "flex", fontFamily: "Mono", fontSize: 24, color: "#460E04", opacity: 0.75, marginTop: 36 }}>
              www.umaemi.com
            </div>
          </div>
          <svg width="340" height="318" viewBox={`0 0 ${DIAMOND_VIEWBOX.width} ${DIAMOND_VIEWBOX.height}`}>
            {DIAMOND_PIECES.map((p) => (
              <path key={p.id} d={p.d} fill="#460E04" />
            ))}
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display, style: "normal", weight: 500 },
        { name: "Mono", data: mono, style: "normal", weight: 500 },
      ],
    }
  );
}
