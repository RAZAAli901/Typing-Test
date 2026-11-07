import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TypeMaster - Free Online Typing Test and WPM Trainer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#060606",
          backgroundImage: "radial-gradient(circle at 50% 50%, #1a1500 0%, #060606 100%)",
          color: "#ffb000",
          fontFamily: "monospace",
          padding: "60px",
          border: "12px solid #332200",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "72px",
            fontWeight: "900",
            letterSpacing: "4px",
            marginBottom: "24px",
            textShadow: "0 0 20px rgba(255, 176, 0, 0.6)",
          }}
        >
          TYPEMASTER_v1 ▮
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#d49200",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: "1.4",
            letterSpacing: "1px",
          }}
        >
          Free Online Typing Speed Test, WPM Trainer & Global Leaderboards
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "48px",
            gap: "24px",
            fontSize: "18px",
            color: "#8b5e00",
          }}
        >
          <span>[ 8 TYPING MODES ]</span>
          <span>[ CRT RETRO HUD ]</span>
          <span>[ REAL-TIME ANALYTICS ]</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
