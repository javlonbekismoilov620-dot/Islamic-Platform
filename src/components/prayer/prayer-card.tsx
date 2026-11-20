"use client";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { useNow } from "@/hooks/use-now";
import { useLocation, usePrayerSettings } from "@/hooks/use-location";
import { PRAYERS, fmtCountdown, fmtTime, nextPrayer, prayerTimes } from "@/lib/prayer";
import { cn } from "@/lib/cn";

export function PrayerCard() {
  const now = useNow(1000);
  const loc = useLocation();
  const ps = usePrayerSettings();
  if (!now) {
    return <div className="card glass h-[15.5rem] p-6"><div className="skeleton h-5 w-40" /><div className="skeleton mt-4 h-12 w-56" /><div className="skeleton mt-6 h-16 w-full" /></div>;
  }
  const times = prayerTimes(loc.lat, loc.lng, now, ps);
  const next = nextPrayer(loc.lat, loc.lng, now, ps);
  const nextInfo = PRAYERS.find((p) => p.key === next.key)!;
  const current = PRAYERS.find((p) => p.key === next.current);
  return (
    <section aria-labelledby="pc-title" className="hero relative overflow-hidden p-6">
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p id="pc-title" className="text-sm font-medium opacity-80">{current ? `Hozir: ${current.name} vaqti` : "Keyingi namoz"}</p>
          <p className="mt-1 text-[2rem] leading-tight font-semibold tracking-[-0.02em]">
            {nextInfo.name} <span className="font-normal opacity-80">{fmtTime(next.at)}</span>
          </p>
          <p className="mt-1 text-sm opacity-85" aria-live="off">
            {nextInfo.isPrayer ? "vaqti kirishiga" : "quyosh chiqishiga"} <span className="font-semibold tabular-nums">{fmtCountdown(next.at.getTime() - now.getTime())}</span> qoldi
          </p>
        </div>
        <Link href="/namoz-vaqtlari" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur hover:bg-white/25">
          <MapPin size={13} /> {loc.label}
        </Link>
      </div>
      <ol className="relative mt-6 grid grid-cols-6 gap-1 text-center">
        {PRAYERS.map((p) => (
          <li key={p.key} className={cn("rounded-2xl px-1 py-2.5", p.key === next.key ? "bg-white/20" : "")}>
            <p className="text-[0.7rem] opacity-80">{p.name}</p>
            <p className="mt-0.5 text-[0.92rem] font-semibold tabular-nums">{fmtTime(times[p.key])}</p>
          </li>
        ))}
      </ol>
      <Link href="/namoz-vaqtlari" className="relative mt-4 inline-flex items-center gap-1 text-xs font-medium opacity-85 hover:opacity-100">
        Oylik jadval va sozlamalar <ChevronRight size={14} />
      </Link>
    </section>
  );
}
