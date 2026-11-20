import { CalculationMethod, CalculationParameters, Coordinates, Madhab, PrayerTimes, Qibla, Shafaq } from "adhan";

export const TZ = "Asia/Tashkent";

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";
export const PRAYERS: { key: PrayerKey; name: string; arabic: string; isPrayer: boolean }[] = [
  { key: "fajr", name: "Bomdod", arabic: "الفجر", isPrayer: true },
  { key: "sunrise", name: "Quyosh", arabic: "الشروق", isPrayer: false },
  { key: "dhuhr", name: "Peshin", arabic: "الظهر", isPrayer: true },
  { key: "asr", name: "Asr", arabic: "العصر", isPrayer: true },
  { key: "maghrib", name: "Shom", arabic: "المغرب", isPrayer: true },
  { key: "isha", name: "Xufton", arabic: "العشاء", isPrayer: true },
];

export type MethodKey = "mwl" | "isna" | "karachi" | "egypt" | "ummalqura" | "turkey" | "moonsighting" | "custom15";
export const METHODS: { key: MethodKey; name: string; desc: string }[] = [
  { key: "mwl", name: "Musulmon olami ligasi (MWL)", desc: "Bomdod 18°, Xufton 17°. Koʻp mamlakatlarda qoʻllanadi." },
  { key: "karachi", name: "Karachi universiteti", desc: "Bomdod 18°, Xufton 18°. Hanafiy mintaqalarda keng tarqalgan." },
  { key: "isna", name: "Shimoliy Amerika (ISNA)", desc: "Bomdod 15°, Xufton 15°." },
  { key: "custom15", name: "15° / 15° (moslashtirilgan)", desc: "Bomdod 15°, Xufton 15°. Rasmiy jadval bilan solishtirish uchun." },
  { key: "egypt", name: "Misr umumiy idorasi", desc: "Bomdod 19.5°, Xufton 17.5°." },
  { key: "ummalqura", name: "Ummul-Quro (Makka)", desc: "Bomdod 18.5°, Xufton shomdan 90 daqiqa keyin." },
  { key: "turkey", name: "Turkiya diyanati", desc: "Bomdod 18°, Xufton 17°, maxsus tuzatishlar bilan." },
  { key: "moonsighting", name: "Moonsighting Committee", desc: "Fasl va kenglikka qarab moslashtiriladi; oq shafaq (Abu Hanifa qavli) tanlangan." },
];

export type PrayerSettings = { method: string; asr: "hanafi" | "shafi"; adjustments: Record<string, number> };

export function paramsFor(s: PrayerSettings): CalculationParameters {
  let p: CalculationParameters;
  switch (s.method as MethodKey) {
    case "isna": p = CalculationMethod.NorthAmerica(); break;
    case "karachi": p = CalculationMethod.Karachi(); break;
    case "egypt": p = CalculationMethod.Egyptian(); break;
    case "ummalqura": p = CalculationMethod.UmmAlQura(); break;
    case "turkey": p = CalculationMethod.Turkey(); break;
    case "moonsighting": p = CalculationMethod.MoonsightingCommittee(); p.shafaq = Shafaq.Abyad; break;
    case "custom15": p = CalculationMethod.Other(); p.fajrAngle = 15; p.ishaAngle = 15; break;
    default: p = CalculationMethod.MuslimWorldLeague();
  }
  p.madhab = s.asr === "shafi" ? Madhab.Shafi : Madhab.Hanafi;
  const adj = s.adjustments ?? {};
  for (const k of ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const) {
    const v = Number(adj[k] ?? 0);
    if (Number.isFinite(v) && Math.abs(v) <= 60) p.adjustments[k] = (p.adjustments[k] ?? 0) + Math.round(v);
  }
  return p;
}

/** Toshkent vaqt mintaqasidagi kalendar sana qismlari. */
export function tzParts(d: Date, tz = TZ) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

export function prayerTimes(lat: number, lng: number, date: Date, s: PrayerSettings) {
  const { y, m, d } = tzParts(date);
  const t = new PrayerTimes(new Coordinates(lat, lng), new Date(y, m - 1, d, 12), paramsFor(s));
  return { fajr: t.fajr, sunrise: t.sunrise, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha } as Record<PrayerKey, Date>;
}

export function nextPrayer(lat: number, lng: number, now: Date, s: PrayerSettings): { key: PrayerKey; at: Date; current: PrayerKey | null } {
  const today = prayerTimes(lat, lng, now, s);
  const order: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  let current: PrayerKey | null = null;
  for (const k of order) if (today[k] <= now && k !== "sunrise") current = k;
  if (today.sunrise <= now && today.dhuhr > now) current = null; // quyosh chiqqandan peshingacha farz vaqti yoʻq
  for (const k of order) if (today[k] > now) return { key: k, at: today[k], current };
  const tomorrow = prayerTimes(lat, lng, new Date(now.getTime() + 86400_000), s);
  return { key: "fajr", at: tomorrow.fajr, current: "isha" };
}

export function qiblaBearing(lat: number, lng: number) {
  return Qibla(new Coordinates(lat, lng));
}

/** Kaʼbagacha masofa (km), Haversine formulasi. */
export function distanceToKaaba(lat: number, lng: number) {
  const R = 6371, K = { lat: 21.4225, lng: 39.8262 };
  const r = (x: number) => (x * Math.PI) / 180;
  const a = Math.sin(r(K.lat - lat) / 2) ** 2 + Math.cos(r(lat)) * Math.cos(r(K.lat)) * Math.sin(r(K.lng - lng) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const fmtTime = (d: Date) => new Intl.DateTimeFormat("uz-UZ", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);

export function fmtCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h > 0 ? `${h}:` : ""}${String(m).padStart(h > 0 ? 2 : 1, "0")}:${String(sec).padStart(2, "0")}`;
}
