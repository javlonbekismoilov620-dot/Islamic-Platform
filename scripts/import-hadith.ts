/**
 * Tanlangan hadislarning arabcha matnini fawazahmed0/hadith-api (Unlicense) toʻplamidan aynan kesib olish.
 * Natija: src/content/sources/hadith-sources.json — har bir yozuvda toʻplam, raqam, Abdulboqiy raqami,
 * kitob/bob havolasi, toʻliq sanadli matn, asosiy matn (matn) va baholar (manbadagidek).
 *
 * Ishlatish: HADITH_API_DIR=/yo'l/hadith-api npm run data:import-hadith
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { findVerbatimSpan } from "../src/lib/arabic";
import { HADITH_SELECTION } from "../src/content/sources/hadith-selection";

const DIR = process.env.HADITH_API_DIR ?? process.argv[2];
if (!DIR) throw new Error("HADITH_API_DIR koʻrsatilmagan");

type H = { hadithnumber: number; arabicnumber?: number; text: string; grades: { name: string; grade: string }[]; reference: { book: number; hadith: number } };
const editions = new Map<string, { hadiths: Map<number, H>; sha256: string; sections: Record<string, string> }>();
function edition(c: string) {
  if (!editions.has(c)) {
    const file = path.join(DIR, "editions", `ara-${c}.min.json`);
    const buf = readFileSync(file);
    const json = JSON.parse(buf.toString("utf8"));
    const eng = JSON.parse(readFileSync(path.join(DIR, "editions", `eng-${c}.min.json`), "utf8"));
    editions.set(c, {
      hadiths: new Map(json.hadiths.map((h: H) => [h.hadithnumber, h])),
      sha256: createHash("sha256").update(buf).digest("hex"),
      sections: eng.metadata.sections ?? {},
    });
  }
  return editions.get(c)!;
}

const out = [];
let failed = 0;
for (const pick of HADITH_SELECTION) {
  const ed = edition(pick.collection);
  const h = ed.hadiths.get(pick.number);
  if (!h) { console.error(`✗ ${pick.id}: ${pick.collection} ${pick.number} topilmadi`); failed++; continue; }
  const matn = findVerbatimSpan(h.text, pick.start, pick.end);
  if (!matn) { console.error(`✗ ${pick.id}: matn chegaralari topilmadi`); failed++; continue; }
  out.push({
    id: pick.id,
    collection: pick.collection,
    number: h.hadithnumber,
    abdulBaqi: pick.collection === "muslim" ? (h.arabicnumber ?? null) : null,
    book: h.reference?.book ?? null,
    bookTitleEn: ed.sections[String(h.reference?.book)] ?? null,
    hadithInBook: h.reference?.hadith ?? null,
    arabicFull: h.text,
    matn,
    grades: h.grades ?? [],
    dataset: { name: "fawazahmed0/hadith-api", edition: `ara-${pick.collection}`, sha256: ed.sha256 },
  });
  console.log(`✓ ${pick.id.padEnd(32)} ${pick.collection} ${h.hadithnumber}${h.arabicnumber && pick.collection === "muslim" ? ` (Abdulboqiy ${h.arabicnumber})` : ""}`);
}
if (failed) throw new Error(`${failed} ta hadis import qilinmadi`);
writeFileSync(path.resolve("src/content/sources/hadith-sources.json"), JSON.stringify(out, null, 1));
console.log(`✓ ${out.length} ta hadis yozildi`);
