import { ImageResponse } from "next/og";

export const alt = "Hidoyat — Qurʼon, namoz, duolar va islomiy bilimlar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg, #0b4536 0%, #0f5c47 60%, #3c6e4f 120%)", color: "#f8f5ee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="96" height="96" viewBox="0 0 48 48"><rect x="2" y="2" width="44" height="44" rx="12" fill="#f8f5ee" fillOpacity="0.12" /><path d="M18.3 33v-7.4c0-3.2 2.5-5.7 5.7-7.4 3.2 1.7 5.7 4.2 5.7 7.4V33" stroke="#f8f5ee" strokeWidth="2" fill="none" /><circle cx="24" cy="14.8" r="1.6" fill="#c9a96b" /></svg>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>Hidoyat</div>
        </div>
        <div style={{ marginTop: 36, fontSize: 40, opacity: 0.92 }}>Quron, namoz darslari, duolar, zikrlar va hadislar</div>
        <div style={{ marginTop: 16, fontSize: 28, opacity: 0.75 }}>Hanafiy mazhabi asosida, manbalari bilan</div>
      </div>
    ),
    size,
  );
}
