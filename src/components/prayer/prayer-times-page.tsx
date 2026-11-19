"use client";
import { useEffect, useMemo, useState } from "react";
import { Bell, BellOff, Crosshair, Info, MapPin, Printer } from "lucide-react";
import { CITIES } from "@/data/cities";
import { useLocation, usePrayerSettings } from "@/hooks/use-location";
import { useNow } from "@/hooks/use-now";
import { useHydrated, useSettings, useStore } from "@/lib/store";
import { METHODS, PRAYERS, TZ, fmtTime, nextPrayer, prayerTimes, tzParts, type PrayerKey } from "@/lib/prayer";
import { GREG_MONTHS, HIJRI_MONTHS, toHijri } from "@/lib/hijri";
import { Segmented, Switch } from "@/components/ui/controls";
import { Button } from "@/components/ui/button";
import { PrayerCard } from "./prayer-card";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

export function PrayerTimesPage() {
  const { settings, update } = useSettings();
  const hydrated = useHydrated();
  const loc = useLocation();
  const ps = usePrayerSettings();
  const now = useNow(60_000);
  const [month, setMonth] = useState<{ y: number; m: number } | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (now && !month) { const p = tzParts(now); setMonth({ y: p.y, m: p.m }); }
  }, [now, month]);

  const days = useMemo(() => {
    if (!month || !hydrated) return [];
    const n = new Date(Date.UTC(month.y, month.m, 0)).getUTCDate();
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(Date.UTC(month.y, month.m - 1, i + 1, 7));
      return { d, day: i + 1, t: prayerTimes(loc.lat, loc.lng, d, ps), h: toHijri(d, settings.hijriOffset) };
    });
  }, [month, hydrated, loc.lat, loc.lng, ps, settings.hijriOffset]);

  const today = now ? tzParts(now) : null;

  const useGeo = () => {
    if (!("geolocation" in navigator)) return toast("Qurilmangiz joylashuvni aniqlashni qoʻllab-quvvatlamaydi", "error");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        update({ customLocation: { lat: Math.round(pos.coords.latitude * 1e4) / 1e4, lng: Math.round(pos.coords.longitude * 1e4) / 1e4, label: "Joriy joylashuv" } });
        toast("Joylashuv aniqlandi (faqat qurilmangizda saqlanadi)");
      },
      () => { setLocating(false); toast("Joylashuvga ruxsat berilmadi", "error"); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600_000 },
    );
  };

  return (
    <div className="space-y-8">
      <PrayerCard />

      <section className="card glass p-5 sm:p-6">
        <h2 className="mb-4 font-semibold text-fg">Joylashuv</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex-1">
            <span className="sr-only">Shahar</span>
            <select value={settings.customLocation ? "" : settings.city} onChange={(e) => update({ city: e.target.value, customLocation: null })} className="h-11 w-full rounded-xl border border-line bg-surface-solid px-3 text-fg">
              {settings.customLocation && <option value="">Joriy joylashuv ({settings.customLocation.lat}, {settings.customLocation.lng})</option>}
              {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name} — {c.region}</option>)}
            </select>
          </label>
          <Button variant="secondary" onClick={useGeo} disabled={locating}><Crosshair size={16} /> {locating ? "Aniqlanmoqda…" : "Joylashuvimni aniqlash"}</Button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><MapPin size={12} /> {loc.label}: {loc.lat.toFixed(3)}°, {loc.lng.toFixed(3)}° · Vaqt mintaqasi: Toshkent (UTC+5). Koordinatalar serverga yuborilmaydi.</p>
      </section>

      <section className="card glass p-5 sm:p-6">
        <h2 className="mb-1 font-semibold text-fg">Hisoblash usuli</h2>
        <p className="mb-4 text-sm text-muted">Namoz vaqtlari astronomik hisob-kitob bilan aniqlanadi. Turli tashkilotlar tong va shafaq uchun quyoshning turli burchaklarini qoʻllaydi.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1.5 block font-medium text-fg">Bomdod va xufton burchaklari</span>
            <select value={settings.prayerMethod} onChange={(e) => update({ prayerMethod: e.target.value })} className="h-11 w-full rounded-xl border border-line bg-surface-solid px-3 text-fg">
              {METHODS.map((m) => <option key={m.key} value={m.key}>{m.name}</option>)}
            </select>
            <span className="mt-1.5 block text-xs text-muted">{METHODS.find((m) => m.key === settings.prayerMethod)?.desc}</span>
          </label>
          <div className="text-sm">
            <span className="mb-1.5 block font-medium text-fg">Asr vaqti</span>
            <Segmented label="Asr hisoblash" value={settings.asrMethod} onChange={(v) => update({ asrMethod: v })} options={[{ value: "hanafi", label: "Hanafiy (soya ×2)" }, { value: "shafi", label: "Jumhur (soya ×1)" }]} />
            <span className="mt-1.5 block text-xs text-muted">Imom Abu Hanifa qavliga koʻra asr soya ikki baravar boʻlganda kiradi; Oʻzbekistonda shu qavl qoʻllanadi.</span>
          </div>
        </div>
        <details className="mt-5">
          <summary className="cursor-pointer text-sm font-medium text-primary">Daqiqa tuzatishlari (rasmiy jadvalga moslashtirish)</summary>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-6">
            {PRAYERS.map((p) => (
              <label key={p.key} className="text-xs">
                <span className="mb-1 block text-muted">{p.name}</span>
                <input type="number" min={-30} max={30} step={1} value={settings.adjustments[p.key] ?? 0} onChange={(e) => update({ adjustments: { ...settings.adjustments, [p.key]: Math.max(-30, Math.min(30, Number(e.target.value) || 0)) } })} className="h-10 w-full rounded-xl border border-line bg-surface-solid px-3 text-sm text-fg tabular-nums" />
              </label>
            ))}
          </div>
        </details>
        <div className="mt-5 flex gap-2.5 rounded-2xl bg-info-soft px-4 py-3 text-sm text-fg-2">
          <Info size={16} className="mt-0.5 shrink-0 text-info" />
          <p>Oʻzbekiston musulmonlari idorasi har oy rasmiy namoz vaqtlari jadvalini eʼlon qiladi. Bu yerdagi hisob u bilan bir necha daqiqa farq qilishi mumkin — farq boʻlsa, yuqoridagi tuzatishlar orqali rasmiy jadvalga moslang. Ehtiyot uchun vaqt kirganidan keyin bir oz kutib namoz oʻqish tavsiya etiladi.</p>
        </div>
      </section>

      <Reminders />

      <section className="card glass overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
          <div>
            <h2 className="font-semibold text-fg">Oylik jadval</h2>
            {month && <p className="text-sm text-muted">{GREG_MONTHS[month.m - 1]} {month.y} · {loc.label}</p>}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => month && setMonth(month.m === 1 ? { y: month.y - 1, m: 12 } : { y: month.y, m: month.m - 1 })}>‹ Oldingi</Button>
            <Button variant="ghost" size="sm" onClick={() => month && setMonth(month.m === 12 ? { y: month.y + 1, m: 1 } : { y: month.y, m: month.m + 1 })}>Keyingi ›</Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()} aria-label="Chop etish"><Printer size={15} /></Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] text-sm">
            <thead className="bg-sunken text-left text-fg">
              <tr><th className="px-4 py-2.5">Sana</th><th className="px-3 py-2.5">Hijriy</th>{PRAYERS.map((p) => <th key={p.key} className="px-3 py-2.5 text-center">{p.name}</th>)}</tr>
            </thead>
            <tbody className="tabular-nums">
              {days.map(({ d, day, t, h }) => {
                const isToday = today && month && today.y === month.y && today.m === month.m && today.d === day;
                const wd = new Date(d).getUTCDay();
                return (
                  <tr key={day} className={cn("border-t border-line", isToday && "bg-primary-soft font-semibold", wd === 5 && !isToday && "bg-gold-soft/40")}>
                    <td className="px-4 py-2 text-fg">{day} {wd === 5 && <span className="text-xs font-normal text-gold">Juma</span>}</td>
                    <td className="px-3 py-2 text-xs text-muted">{h.d} {HIJRI_MONTHS[h.m - 1]}</td>
                    {PRAYERS.map((p) => <td key={p.key} className="px-3 py-2 text-center text-fg-2">{fmtTime(t[p.key])}</td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Reminders() {
  const [rem, setRem] = useStore("reminders");
  const loc = useLocation();
  const ps = usePrayerSettings();
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");
  useEffect(() => { setPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission); }, []);

  useEffect(() => {
    if (!rem.prayer || perm !== "granted") return;
    let timer: number | undefined;
    const schedule = () => {
      const now = new Date();
      const nx = nextPrayer(loc.lat, loc.lng, now, ps);
      const fireAt = nx.at.getTime() - rem.minutesBefore * 60_000;
      const delay = Math.max(1000, fireAt - now.getTime());
      if (delay > 2 ** 31 - 1) return;
      timer = window.setTimeout(async () => {
        const name = PRAYERS.find((p) => p.key === (nx.key as PrayerKey))?.name;
        const body = rem.minutesBefore ? `${rem.minutesBefore} daqiqadan soʻng ${name} vaqti kiradi (${fmtTime(nx.at)}).` : `${name} vaqti kirdi.`;
        try {
          const reg = await navigator.serviceWorker?.getRegistration();
          if (reg) await reg.showNotification("Namoz vaqti", { body, icon: "/icon-192.png", tag: "prayer" });
          else new Notification("Namoz vaqti", { body, icon: "/icon-192.png" });
        } catch { /* ignore */ }
        schedule();
      }, delay);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [rem.prayer, rem.minutesBefore, perm, loc.lat, loc.lng, ps]);

  const enable = async (v: boolean) => {
    if (!v) return setRem((r) => ({ ...r, prayer: false }));
    if (perm === "unsupported") return toast("Brauzeringiz bildirishnomalarni qoʻllab-quvvatlamaydi", "error");
    const p = await Notification.requestPermission();
    setPerm(p);
    if (p === "granted") { setRem((r) => ({ ...r, prayer: true })); toast("Eslatmalar yoqildi"); }
    else toast("Bildirishnomalarga ruxsat berilmadi", "error");
  };

  return (
    <section className="card glass p-5 sm:p-6">
      <h2 className="mb-1 flex items-center gap-2 font-semibold text-fg">{rem.prayer ? <Bell size={17} className="text-primary" /> : <BellOff size={17} className="text-muted" />} Namoz eslatmalari</h2>
      <Switch checked={rem.prayer && perm === "granted"} onChange={enable} label="Namoz vaqti eslatmasi" description="Sayt (yoki oʻrnatilgan ilova) ochiq turganda brauzer bildirishnomasi koʻrsatiladi." disabled={perm === "unsupported"} />
      {rem.prayer && (
        <label className="flex items-center justify-between gap-3 py-2 text-sm">
          <span className="text-fg">Necha daqiqa oldin</span>
          <select value={rem.minutesBefore} onChange={(e) => setRem((r) => ({ ...r, minutesBefore: Number(e.target.value) }))} className="h-10 rounded-xl border border-line bg-surface-solid px-3 text-fg">
            {[0, 5, 10, 15, 30].map((m) => <option key={m} value={m}>{m === 0 ? "Vaqt kirganda" : `${m} daqiqa`}</option>)}
          </select>
        </label>
      )}
      <p className="mt-2 text-xs leading-relaxed text-muted">Eslatmalar faqat qurilmangizda ishlaydi va hech qanday server xizmatidan foydalanmaydi. Shu sababli sayt butunlay yopilganda ular kelmaydi. Doimiy eslatma uchun telefoningizdagi rasmiy namoz vaqti ilovasidan ham foydalaning. Vaqt mintaqasi: {TZ}.</p>
    </section>
  );
}
