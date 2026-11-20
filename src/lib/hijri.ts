import { tzParts } from "./prayer";

export const HIJRI_MONTHS = ["Muharram", "Safar", "Robiul-avval", "Robiul-oxir", "Jumodul-avval", "Jumodul-oxir", "Rajab", "Shaʼbon", "Ramazon", "Shavvol", "Zulqaʼda", "Zulhijja"];
export const GREG_MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
export const WEEKDAYS = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

export type HijriDate = { y: number; m: number; d: number };

const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { day: "numeric", month: "numeric", year: "numeric", timeZone: "UTC" });

/**
 * Hijriy sana (Ummul-Quro jadvali asosida hisoblangan). `offset` — mahalliy oy koʻrinishiga
 * moslashtirish uchun ±kun. Amaldagi sana Oʻzbekiston musulmonlari idorasi eʼloniga bogʻliq.
 */
export function toHijri(date: Date, offset = 0): HijriDate {
  const { y, m, d } = tzParts(date);
  const utc = new Date(Date.UTC(y, m - 1, d + offset, 12));
  const parts = fmt.formatToParts(utc);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

export function formatHijri(h: HijriDate) {
  return `${h.d} ${HIJRI_MONTHS[h.m - 1]} ${h.y} h.`;
}

export function formatGregorian(date: Date) {
  const { y, m, d } = tzParts(date);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${WEEKDAYS[wd]}, ${d}-${GREG_MONTHS[m - 1]} ${y}-yil`;
}

/** Berilgan hijriy oy/kunga toʻgʻri keladigan keyingi milodiy sanani topadi (maksimal 400 kun ichida). */
export function nextGregorianFor(hm: number, hd: number, from: Date, offset = 0): Date | null {
  const start = tzParts(from);
  for (let i = 0; i < 400; i++) {
    const day = new Date(Date.UTC(start.y, start.m - 1, start.d + i, 7));
    const h = toHijri(day, offset);
    if (h.m === hm && h.d === hd) return day;
  }
  return null;
}

export function daysBetween(a: Date, b: Date) {
  const pa = tzParts(a), pb = tzParts(b);
  return Math.round((Date.UTC(pb.y, pb.m - 1, pb.d) - Date.UTC(pa.y, pa.m - 1, pa.d)) / 86400_000);
}
