import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type SurahMeta = { n: number; ar: string; tanzil: string; uz: string; meaning: string; type: "makkiy" | "madaniy"; ayahs: number };
export type TranslationMeta = { key: string; titleUz: string; translator: string; publisher: string; edition: string; version: string; script: string; url: string; downloadUrl: string; terms: string; sha256: string };
export type QuranMeta = {
  arabic: { title: string; url: string; license: string; licenseUrl: string; sha256: string };
  translations: TranslationMeta[];
  surahs: SurahMeta[];
  juz: string[];
  sajda: { s: number; a: number; hanafi: boolean }[];
};
export type SurahArabic = { n: number; basmala: string | null; ayahs: string[] };
export type SurahTranslation = { n: number; ayahs: string[]; notes: Record<string, string> };

const ROOT = path.join(process.cwd(), "public", "quran");
const cache = new Map<string, unknown>();

async function load<T>(rel: string): Promise<T> {
  if (cache.has(rel)) return cache.get(rel) as T;
  const data = JSON.parse(await readFile(path.join(ROOT, rel), "utf8")) as T;
  cache.set(rel, data);
  return data;
}

export const getQuranMeta = () => load<QuranMeta>("meta.json");
export const getSurahArabic = (n: number) => load<SurahArabic>(`ar/${n}.json`);
export const getTranslation = (key: string, n: number) => load<SurahTranslation>(`tr/${key}/${n}.json`);
export const getCleanText = () => load<[number, number, string][]>("clean.json");

export function isValidSurah(n: number) {
  return Number.isInteger(n) && n >= 1 && n <= 114;
}

/** "2:255" yoki "17:23-24" → oyatlar roʻyxati (Arabcha + tasdiqlangan tarjima). */
export async function getVerses(spec: string, trKey = "sodiq") {
  const m = /^(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?$/.exec(spec.trim());
  if (!m) return null;
  const s = Number(m[1]), a = Number(m[2]), b = Number(m[3] ?? m[2]);
  if (!isValidSurah(s)) return null;
  const [meta, ar, tr] = await Promise.all([getQuranMeta(), getSurahArabic(s), getTranslation(trKey, s)]);
  const sm = meta.surahs[s - 1];
  if (a < 1 || b > sm.ayahs || a > b) return null;
  const verses = [];
  for (let i = a; i <= b; i++) verses.push({ s, a: i, ar: ar.ayahs[i - 1], tr: tr.ayahs[i - 1], note: tr.notes[String(i)] ?? null });
  return { surah: sm, verses, translation: meta.translations.find((t) => t.key === trKey)! };
}
