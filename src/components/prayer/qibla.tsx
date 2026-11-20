"use client";
import { useState } from "react";
import { Compass, Info } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { distanceToKaaba, qiblaBearing } from "@/lib/prayer";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/lib/store";
import { cn } from "@/lib/cn";

type OrientationWithPermission = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

export function QiblaCompass() {
  const loc = useLocation();
  const hydrated = useHydrated();
  const bearing = qiblaBearing(loc.lat, loc.lng);
  const [heading, setHeading] = useState<number | null>(null);
  const [rawState, setState] = useState<"idle" | "active" | "denied" | "unsupported">("idle");
  const state = hydrated && !("DeviceOrientationEvent" in window) ? "unsupported" : rawState;

  const start = async () => {
    const DOE = window.DeviceOrientationEvent as OrientationWithPermission;
    if (!DOE) return setState("unsupported");
    try {
      if (typeof DOE.requestPermission === "function") {
        const r = await DOE.requestPermission();
        if (r !== "granted") return setState("denied");
      }
    } catch {
      return setState("denied");
    }
    const handler = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      let h: number | null = null;
      if (typeof e.webkitCompassHeading === "number") h = e.webkitCompassHeading;
      else if (e.absolute && typeof e.alpha === "number") h = (360 - e.alpha) % 360;
      if (h != null) { setHeading(h); setState("active"); }
    };
    window.addEventListener("deviceorientationabsolute", handler as EventListener, true);
    window.addEventListener("deviceorientation", handler as EventListener, true);
    window.setTimeout(() => setState((s) => (s === "active" ? s : "unsupported")), 3000);
  };

  const rot = heading == null ? 0 : -heading;
  const delta = heading == null ? null : ((bearing - heading + 540) % 360) - 180;
  const aligned = delta != null && Math.abs(delta) < 5;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1fr] md:items-center">
      <div className="relative mx-auto aspect-square w-[min(84vw,22rem)] overflow-hidden rounded-full [--r:min(42vw,11rem)]">
        <div className={cn("hero absolute inset-0 rounded-full transition-shadow", aligned && "ring-4 ring-gold")} />
        <div className="absolute inset-0 transition-transform duration-300" style={{ transform: `rotate(${rot}deg)` }}>
          {["N", "E", "S", "W"].map((d, i) => (
            <span key={d} className="absolute top-1/2 left-1/2 text-xs font-semibold text-[var(--hero-text)] opacity-80" style={{ transform: `rotate(${i * 90}deg) translateY(calc(-1 * var(--r) + 2rem)) rotate(${-i * 90}deg) translate(-50%, -50%)` }}>
              {{ N: "Sh", E: "Shq", S: "J", W: "Gʻ" }[d]}
            </span>
          ))}
          {Array.from({ length: 72 }).map((_, i) => (
            <span key={i} className="absolute top-1/2 left-1/2 h-2 w-px origin-[0_0] bg-[var(--hero-text)] opacity-30" style={{ transform: `rotate(${i * 5}deg) translateY(calc(-1 * var(--r) + 0.6rem))` }} />
          ))}
          <div className="absolute inset-0" style={{ transform: `rotate(${bearing}deg)` }}>
            <div className="absolute top-[8%] left-1/2 flex -translate-x-1/2 flex-col items-center">
              <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden className="drop-shadow-lg"><rect x="6" y="9" width="28" height="25" rx="3" fill="#15130f" /><rect x="6" y="15" width="28" height="3.5" fill="var(--gold)" /><rect x="22" y="22" width="6" height="12" rx="1" fill="var(--gold)" opacity="0.85" /></svg>
            </div>
            <div className="absolute top-[18%] bottom-1/2 left-1/2 w-1 -translate-x-1/2 rounded-full bg-gradient-to-t from-transparent to-[var(--gold)]" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--hero-text)]" />
        {heading != null && <div className="absolute top-0 left-1/2 h-6 w-1 -translate-x-1/2 rounded-full bg-[var(--hero-text)]" aria-hidden />}
      </div>

      <div>
        <p className="text-sm text-muted">{loc.label} uchun qibla yoʻnalishi</p>
        <p className="mt-1 text-[3rem] leading-none font-semibold tracking-[-0.03em] text-fg tabular-nums">{hydrated ? bearing.toFixed(1) : "—"}°</p>
        <p className="mt-2 text-fg-2">Shimoldan soat mili boʻyicha (janubi-gʻarb). Kaʼbagacha masofa: {hydrated ? Math.round(distanceToKaaba(loc.lat, loc.lng)).toLocaleString("uz-UZ") : "—"} km.</p>
        {state === "active" && delta != null && (
          <p className={cn("mt-4 rounded-2xl px-4 py-3 text-sm font-medium", aligned ? "bg-success-soft text-success" : "bg-sunken text-fg-2")} aria-live="polite">
            {aligned ? "Siz qiblaga yuzlandingiz." : `Qiblagacha ${Math.abs(Math.round(delta))}° ${delta > 0 ? "oʻngga" : "chapga"} buriling.`}
          </p>
        )}
        {state === "idle" && <Button className="mt-5" onClick={start}><Compass size={17} /> Qurilma kompasini yoqish</Button>}
        {state === "denied" && <p className="mt-4 text-sm text-danger">Kompas sensoriga ruxsat berilmadi. Brauzer sozlamalaridan ruxsat bering.</p>}
        {state === "unsupported" && <p className="mt-4 text-sm text-muted">Bu qurilmada kompas sensori mavjud emas yoki brauzer uni bermaydi. Yuqoridagi daraja va xarita kompasidan foydalaning.</p>}
        <div className="mt-6 flex gap-2.5 rounded-2xl bg-info-soft px-4 py-3 text-sm text-fg-2">
          <Info size={16} className="mt-0.5 shrink-0 text-info" />
          <p>Telefon kompasi metall buyumlar va elektr qurilmalar yonida xato koʻrsatishi mumkin. Kompasni sakkiz shaklida harakatlantirib kalibrlang. Masjid mehrobi eng ishonchli yoʻnalishdir.</p>
        </div>
      </div>
    </div>
  );
}
