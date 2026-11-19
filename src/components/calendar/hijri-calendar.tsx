"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Moon } from "lucide-react";
import { useNow } from "@/hooks/use-now";
import { useHydrated, useSettings } from "@/lib/store";
import { GREG_MONTHS, HIJRI_MONTHS, daysBetween, formatHijri, nextGregorianFor, toHijri } from "@/lib/hijri";
import { tzParts } from "@/lib/prayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type CalEvent = { slug: string; title: string; hijriMonth: number; hijriDay: number; days?: number; kind: string; moonDependent: boolean; fasting?: string | null; description: string; hadith?: string };

const KIND: Record<string, { label: string; tone: "primary" | "gold" | "info" | "success" | "neutral" }> = {
  eid: { label: "Hayit", tone: "gold" }, fast: { label: "Roʻza", tone: "primary" }, night: { label: "Muborak kecha", tone: "info" }, month: { label: "Oy", tone: "success" }, day: { label: "Kun", tone: "neutral" },
};
const FAST: Record<string, string> = { farz: "Roʻza farz", sunnat: "Roʻza sunnat", mustahab: "Roʻza mustahab", harom: "Roʻza tutish harom", makruh: "Roʻza makruh" };
const WD = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

export function HijriCalendar({ events }: { events: CalEvent[] }) {
  const now = useNow(60_000);
  const { settings, update } = useSettings();
  const hydrated = useHydrated();
  const [shift, setShift] = useState(0);
  const offset = hydrated ? settings.hijriOffset : 0;

  const grid = useMemo(() => {
    if (!now) return null;
    // Joriy hijriy oyning birinchi kunini topish, soʻng `shift` oy surish
    const h = toHijri(now, offset);
    let start = new Date(now.getTime() - (h.d - 1) * 86400_000);
    for (let i = 0; i < Math.abs(shift); i++) {
      if (shift > 0) start = new Date(start.getTime() + 30 * 86400_000);
      else start = new Date(start.getTime() - 25 * 86400_000);
      const hh = toHijri(start, offset);
      start = new Date(start.getTime() - (hh.d - 1) * 86400_000);
    }
    const first = toHijri(start, offset);
    const days: { date: Date; h: { y: number; m: number; d: number } }[] = [];
    for (let i = 0; i < 31; i++) {
      const d = new Date(start.getTime() + i * 86400_000);
      const hh = toHijri(d, offset);
      if (hh.m !== first.m) break;
      days.push({ date: d, h: hh });
    }
    const p = tzParts(start);
    const wd = (new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay() + 6) % 7;
    return { month: first.m, year: first.y, days, lead: wd };
  }, [now, offset, shift]);

  const upcoming = useMemo(() => {
    if (!now) return [];
    return events
      .map((e) => ({ e, at: nextGregorianFor(e.hijriMonth, e.hijriDay, now, offset) }))
      .filter((x) => x.at)
      .sort((a, b) => a.at!.getTime() - b.at!.getTime());
  }, [events, now, offset]);

  if (!now || !grid) return <div className="skeleton h-96" />;
  const today = tzParts(now);
  const evOn = (m: number, d: number) => events.filter((e) => e.hijriMonth === m && d >= e.hijriDay && d < e.hijriDay + (e.kind === "month" ? 1 : e.days ?? 1));

  return (
    <div className="space-y-8">
      <section className="hero p-6 sm:p-8">
        <p className="text-sm opacity-80">Bugun</p>
        <p className="mt-1 text-[2rem] font-semibold tracking-[-0.02em]">{formatHijri(toHijri(now, offset))}</p>
        <p className="mt-1 text-sm opacity-80">{today.d}-{GREG_MONTHS[today.m - 1]} {today.y}-yil</p>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="opacity-80">Mahalliy oy koʻrinishiga moslash:</span>
          {[-2, -1, 0, 1, 2].map((o) => (
            <button key={o} type="button" onClick={() => update({ hijriOffset: o })} className={cn("rounded-full px-3 py-1 tabular-nums", offset === o ? "bg-white/25 font-semibold" : "bg-white/10 hover:bg-white/20")}>{o > 0 ? `+${o}` : o} kun</button>
          ))}
        </div>
      </section>

      <section className="card glass p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">{HIJRI_MONTHS[grid.month - 1]} {grid.year} h.</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" aria-label="Oldingi oy" onClick={() => setShift((s) => s - 1)}><ChevronLeft size={18} /></Button>
            <Button variant="ghost" size="icon" aria-label="Keyingi oy" onClick={() => setShift((s) => s + 1)}><ChevronRight size={18} /></Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">{WD.map((w) => <div key={w} className="py-1">{w}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: grid.lead }).map((_, i) => <div key={`l${i}`} />)}
          {grid.days.map(({ date, h }) => {
            const p = tzParts(date);
            const isToday = p.y === today.y && p.m === today.m && p.d === today.d;
            const ev = evOn(h.m, h.d);
            const white = [13, 14, 15].includes(h.d);
            return (
              <div key={h.d} title={ev.map((e) => e.title).join(", ")} className={cn("flex aspect-square flex-col items-center justify-center rounded-2xl text-center sm:aspect-[5/3]", isToday ? "bg-primary text-on-primary" : ev.length ? "bg-gold-soft" : "bg-sunken")}>
                <span className="text-[0.95rem] font-semibold tabular-nums">{h.d}</span>
                <span className={cn("text-[0.62rem] tabular-nums", isToday ? "opacity-80" : "text-muted")}>{p.d}.{String(p.m).padStart(2, "0")}</span>
                <span className="flex h-1.5 gap-0.5">{ev.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}{white && <span className={cn("h-1.5 w-1.5 rounded-full", isToday ? "bg-on-primary" : "bg-primary")} />}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 flex flex-wrap gap-4 text-xs text-muted"><span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold" /> Muhim sana</span><span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Oyning «oq kunlari» (13–15)</span></p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-fg">Yaqinlashayotgan sanalar</h2>
        <ul className="space-y-3">
          {upcoming.map(({ e, at }) => {
            const d = daysBetween(now, at!);
            const p = tzParts(at!);
            return (
              <li key={e.slug} className="card glass flex gap-4 p-5">
                <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-sunken py-2 text-center">
                  <span className="text-lg font-semibold text-fg tabular-nums">{e.hijriDay}</span>
                  <span className="text-[0.65rem] leading-tight text-muted">{HIJRI_MONTHS[e.hijriMonth - 1]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-fg">{e.title} <Badge tone={KIND[e.kind]?.tone ?? "neutral"}>{KIND[e.kind]?.label}</Badge>{e.fasting && <Badge tone={e.fasting === "harom" ? "danger" : "primary"}>{FAST[e.fasting]}</Badge>}</p>
                  <p className="mt-0.5 text-sm text-muted">Taxminan {p.d}-{GREG_MONTHS[p.m - 1]} {p.y} · {d === 0 ? "bugun" : `${d} kundan soʻng`}</p>
                  <p className="mt-2 text-sm leading-relaxed text-fg-2">{e.description}</p>
                  {e.moonDependent && <p className="mt-2 inline-flex items-center gap-1 text-xs text-warning"><Moon size={12} /> Aniq sana oy koʻrinishiga bogʻliq — Oʻzbekiston musulmonlari idorasi eʼlonini kuting.</p>}
                  {e.hadith && <Link href={`/hadislar/${e.hadith}`} className="mt-1 block text-xs font-medium text-primary hover:underline">Tegishli hadis →</Link>}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
