import { describe, expect, it } from "vitest";
import { prayerTimes, nextPrayer, qiblaBearing, fmtTime, distanceToKaaba } from "@/lib/prayer";
import { toHijri, nextGregorianFor, formatHijri } from "@/lib/hijri";

const TASHKENT = { lat: 41.2995, lng: 69.2401 };
const s = { method: "mwl", asr: "hanafi" as const, adjustments: {} };

describe("prayer times", () => {
  it("orders the day's times correctly in Tashkent", () => {
    const t = prayerTimes(TASHKENT.lat, TASHKENT.lng, new Date("2026-11-19T06:00:00Z"), s);
    expect(t.fajr < t.sunrise && t.sunrise < t.dhuhr && t.dhuhr < t.asr && t.asr < t.maghrib && t.maghrib < t.isha).toBe(true);
    expect(fmtTime(t.dhuhr)).toMatch(/^12:/);
  });
  it("Hanafi asr is later than Shafi asr", () => {
    const d = new Date("2026-06-15T06:00:00Z");
    const h = prayerTimes(TASHKENT.lat, TASHKENT.lng, d, s).asr;
    const sh = prayerTimes(TASHKENT.lat, TASHKENT.lng, d, { ...s, asr: "shafi" }).asr;
    expect(h.getTime() - sh.getTime()).toBeGreaterThan(30 * 60_000);
  });
  it("applies minute adjustments", () => {
    const d = new Date("2026-11-19T06:00:00Z");
    const a = prayerTimes(TASHKENT.lat, TASHKENT.lng, d, s).fajr;
    const b = prayerTimes(TASHKENT.lat, TASHKENT.lng, d, { ...s, adjustments: { fajr: 5 } }).fajr;
    expect((b.getTime() - a.getTime()) / 60000).toBe(5);
  });
  it("finds the next prayer after isha as tomorrow's fajr", () => {
    const late = new Date("2026-11-19T18:30:00Z"); // 23:30 Tashkent
    expect(nextPrayer(TASHKENT.lat, TASHKENT.lng, late, s).key).toBe("fajr");
  });
  it("qibla from Tashkent is south-west and ~3200 km", () => {
    const q = qiblaBearing(TASHKENT.lat, TASHKENT.lng);
    expect(q).toBeGreaterThan(235);
    expect(q).toBeLessThan(245);
    expect(Math.round(distanceToKaaba(TASHKENT.lat, TASHKENT.lng) / 100)).toBeGreaterThan(30);
  });
});

describe("hijri", () => {
  it("converts and applies offset", () => {
    const d = new Date("2026-11-19T06:00:00Z");
    const h = toHijri(d);
    expect(h.y).toBe(1448);
    const h2 = toHijri(d, 1);
    expect(h2.d === h.d + 1 || h2.d === 1).toBe(true);
    expect(formatHijri(h)).toContain("1448");
  });
  it("finds the next Ramadan start", () => {
    const r = nextGregorianFor(9, 1, new Date("2026-11-19T06:00:00Z"));
    expect(r).not.toBeNull();
    expect(toHijri(r!).m).toBe(9);
  });
});
