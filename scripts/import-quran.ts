/**
 * Qurʼon maʼlumotlarini tekshirilgan manbalardan import qilish.
 *
 * Manba: risan/quran-json (CC BY-SA 4.0) ichidagi verbatim nusxalar:
 *  - Tanzil Uthmani matni (CC BY 3.0, oʻzgartirish taqiqlangan)
 *  - QuranEnc oʻzbekcha tarjimalar (kirill), versiya raqamlari bilan
 * Har bir fayl SHA-256 xeshi manba yozuvidagi (data/meta/sources.json) xesh bilan solishtiriladi.
 * Matnlar oʻzgartirilmaydi. Faqat 1-oyatdagi Basmala alohida maydonga ajratiladi
 * (basmala + " " + oyat === asl matn sharti tekshiriladi).
 *
 * Ishlatish: QURAN_JSON_DIR=/yo'l/quran-json npm run data:import-quran
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { SURAH_NAMES_UZ } from "../src/data/surah-names-uz";

const SRC = process.env.QURAN_JSON_DIR ?? process.argv[2];
if (!SRC) throw new Error("QURAN_JSON_DIR koʻrsatilmagan");
const OUT = path.resolve("public/quran");

type SourceEntry = { path: string; sha256: string; url: string; license: string; source: string; revision?: string; source_metadata?: { version?: string; title?: string; browse_url?: string } };
const sources: SourceEntry[] = JSON.parse(readFileSync(path.join(SRC, "data/meta/sources.json"), "utf8"));

function loadVerified(rel: string) {
  const entry = sources.find((s) => s.path === rel);
  if (!entry) throw new Error(`Manba yozuvi topilmadi: ${rel}`);
  const buf = readFileSync(path.join(SRC, rel));
  const sha = createHash("sha256").update(buf).digest("hex");
  if (sha !== entry.sha256) throw new Error(`XESH MOS EMAS: ${rel}\n  kutilgan ${entry.sha256}\n  olingan  ${sha}`);
  console.log(`✓ ${rel} sha256 mos keldi`);
  return { data: JSON.parse(buf.toString("utf8")), entry, sha };
}

type Verse = { chapter: number; verse: number; text: string; footnotes?: string };
const stripMarks = (s: string) => s.replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, "").replace(/[ٱأإآ]/g, "ا");

const uth = loadVerified("data/tanzil/uthmani.json");
const clean = loadVerified("data/tanzil/simple-clean.json");
const chapters = loadVerified("data/tanzil/chapters.json");

const TRANSLATIONS = [
  { key: "sodiq", file: "data/quranenc/uzbek_sadiq.json", translator: "Shayx Muhammad Sodiq Muhammad Yusuf", titleUz: "Muhammad Sodiq Muhammad Yusuf tarjimasi" },
  { key: "mansur", file: "data/quranenc/uzbek_mansour.json", translator: "Alouddin Mansur", titleUz: "Alouddin Mansur tarjimasi" },
  { key: "ruvvod", file: "data/quranenc/uzbek_rwwad.json", translator: "Ruvvod tarjima markazi", titleUz: "Ruvvod tarjima markazi tarjimasi" },
] as const;

// Hafs (Madinah mushaf) sajda oʻrinlari — quran-meta (MIT) HafsLists.SajdaList bilan solishtirilgan.
// 22:77 — Hanafiy mazhabida tilovat sajdasi oʻrni hisoblanmaydi (14 ta oʻrin).
const SAJDA = [[7, 206], [13, 15], [16, 50], [17, 109], [19, 58], [22, 18], [22, 77], [25, 60], [27, 26], [32, 15], [38, 24], [41, 38], [53, 62], [84, 21], [96, 19]] as const;
// Pora (juz) boshlanish oyatlari — quran-meta Hafs meta bilan solishtirilgan.
const JUZ = ["1:1", "2:142", "2:253", "3:93", "4:24", "4:148", "5:82", "6:111", "7:88", "8:41", "9:93", "11:6", "12:53", "15:1", "17:1", "18:75", "21:1", "23:1", "25:21", "27:56", "29:46", "33:31", "36:28", "39:32", "41:47", "46:1", "51:31", "58:1", "67:1", "78:1"];

mkdirSync(path.join(OUT, "ar"), { recursive: true });
const fatiha1 = (uth.data["1"] as Verse[])[0].text;
const basmalaKey = stripMarks(fatiha1).split(/\s+/).join(" ");

let total = 0;
const surahs: unknown[] = [];
const cleanAll: [number, number, string][] = [];
for (let n = 1; n <= 114; n++) {
  const verses: Verse[] = uth.data[String(n)];
  const ch = chapters.data.chapters[n - 1];
  if (!verses || ch.id !== n || verses.length !== ch.total_verses) throw new Error(`Sura ${n}: oyatlar soni mos emas`);
  total += verses.length;
  const ayahs = verses.map((v) => v.text);
  let basmala: string | null = null;
  if (n !== 1 && n !== 9) {
    const words = ayahs[0].split(" ");
    const head = words.slice(0, 4).join(" ");
    if (stripMarks(head).split(/\s+/).join(" ") === basmalaKey && words.length > 4) {
      basmala = head;
      ayahs[0] = words.slice(4).join(" ");
      if (`${basmala} ${ayahs[0]}` !== verses[0].text) throw new Error(`Sura ${n}: basmala ajratish asl matnni saqlamadi`);
    } else {
      throw new Error(`Sura ${n}: 1-oyatda basmala topilmadi`);
    }
  }
  writeFileSync(path.join(OUT, "ar", `${n}.json`), JSON.stringify({ n, basmala, ayahs }));
  for (const v of clean.data[String(n)] as Verse[]) cleanAll.push([n, v.verse, v.text]);
  const [, uz, meaning] = SURAH_NAMES_UZ[n - 1];
  surahs.push({
    n, ar: ch.name, tanzil: ch.transliteration, uz, meaning,
    type: ch.type === "meccan" ? "makkiy" : "madaniy",
    ayahs: ch.total_verses,
  });
}
if (total !== 6236) throw new Error(`Jami oyatlar ${total}, 6236 boʻlishi kerak`);
writeFileSync(path.join(OUT, "clean.json"), JSON.stringify(cleanAll));

const trMeta = [];
for (const t of TRANSLATIONS) {
  const { data, entry, sha } = loadVerified(t.file);
  mkdirSync(path.join(OUT, "tr", t.key), { recursive: true });
  let count = 0;
  for (let n = 1; n <= 114; n++) {
    const vs: Verse[] = data[String(n)];
    const notes: Record<number, string> = {};
    vs.forEach((v, i) => {
      if (v.verse !== i + 1) throw new Error(`${t.key} ${n}:${i + 1} tartib buzilgan`);
      if (v.footnotes) notes[v.verse] = v.footnotes;
    });
    count += vs.length;
    writeFileSync(path.join(OUT, "tr", t.key, `${n}.json`), JSON.stringify({ n, ayahs: vs.map((v) => v.text), notes }));
  }
  if (count !== 6236) throw new Error(`${t.key}: ${count} oyat`);
  trMeta.push({
    key: t.key, titleUz: t.titleUz, translator: t.translator, publisher: "QuranEnc.com (Qurʼoniy tarjimalar ensiklopediyasi)",
    edition: entry.source_metadata?.title, version: entry.source_metadata?.version, script: "kirill",
    url: entry.source_metadata?.browse_url, downloadUrl: entry.url, terms: entry.license, sha256: sha,
  });
}

const meta = {
  generatedFrom: "github.com/risan/quran-json (verbatim snapshots)",
  arabic: { title: "Tanzil — Uthmani matni", url: "https://tanzil.net", license: uth.entry.license, licenseUrl: "https://tanzil.net/docs/text_license", sha256: uth.sha, searchTextSha256: clean.sha },
  translations: trMeta,
  surahs,
  juz: JUZ,
  sajda: SAJDA.map(([s, a]) => ({ s, a, hanafi: !(s === 22 && a === 77) })),
};
writeFileSync(path.join(OUT, "meta.json"), JSON.stringify(meta, null, 1));
console.log(`✓ ${total} oyat, ${TRANSLATIONS.length} tarjima yozildi → ${OUT}`);
