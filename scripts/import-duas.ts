/**
 * Duolarning arabcha matnini manbalardan aynan olish va hadis toʻplamlari bilan avtomatik solishtirish.
 * Natija: src/content/sources/dua-sources.json
 *
 * Ishlatish: ADHKAR_JSON=/yo'l/adhkar.json HADITH_API_DIR=/yo'l/hadith-api npx tsx scripts/import-duas.ts
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { arabicContains, findVerbatimSpan, normalizeArabic } from "../src/lib/arabic";
import { DUA_SELECTION } from "../src/content/sources/dua-selection";

const ADHKAR = process.env.ADHKAR_JSON!;
const HADITH = process.env.HADITH_API_DIR!;
if (!ADHKAR || !HADITH) throw new Error("ADHKAR_JSON va HADITH_API_DIR kerak");

const adhkarBuf = readFileSync(ADHKAR);
const adhkarSha = createHash("sha256").update(adhkarBuf).digest("hex");
type AdhkarCat = { id: number; category: string; array: { id: number; text: string; count: number }[] };
const adhkar: AdhkarCat[] = JSON.parse(adhkarBuf.toString("utf8"));

type H = { hadithnumber: number; arabicnumber?: number; text: string; grades: { name: string; grade: string }[] };
const eds = new Map<string, { map: Map<number, H>; sha: string }>();
function hadith(c: string, n: number) {
  if (!eds.has(c)) {
    const buf = readFileSync(path.join(HADITH, "editions", `ara-${c}.min.json`));
    const j = JSON.parse(buf.toString("utf8"));
    eds.set(c, { map: new Map(j.hadiths.map((h: H) => [h.hadithnumber, h])), sha: createHash("sha256").update(buf).digest("hex") });
  }
  const e = eds.get(c)!;
  const h = e.map.get(n);
  if (!h) throw new Error(`${c} ${n} topilmadi`);
  return { h, sha: e.sha };
}
function quranSegments(s: number, a: number, to = a, start?: string, end?: string) {
  const j = JSON.parse(readFileSync(path.resolve("public/quran/ar", `${s}.json`), "utf8"));
  const segs: { a: number; text: string }[] = [];
  for (let n = a; n <= to; n++) {
    let text: string = j.ayahs[n - 1];
    // Oyat ichidan duo qismini aynan (harakatlari bilan) kesib olish
    if (n === a && start) {
      const span = findVerbatimSpan(text, start, n === to ? end : undefined, true);
      if (!span) throw new Error(`${s}:${n} ichida «${start}» topilmadi`);
      text = n === to && !end ? text.slice(text.indexOf(span)) : span;
    }
    segs.push({ a: n, text });
  }
  return segs;
}

const out = [];
let failed = 0;
for (const d of DUA_SELECTION) {
  const spec = d.arabic;
  let arabic: string | null = null;
  let origin: Record<string, unknown> = {};
  let grades: H["grades"] = [];
  if (spec.kind === "hisn") {
    for (const cat of adhkar) {
      for (const item of cat.array) {
        const span = findVerbatimSpan(item.text, spec.start, spec.end);
        if (span) { arabic = span; origin = { kind: "hisn", book: "Hisnul muslim (Saʼid ibn Ali ibn Vahf al-Qahtoniy)", category: cat.category, item: item.id, recommendedCount: item.count, dataset: "rn0x/Adhkar-json", sha256: adhkarSha }; break; }
      }
      if (arabic) break;
    }
  } else if (spec.kind === "quran") {
    const segments = quranSegments(spec.s, spec.a, spec.to, spec.start, spec.end);
    arabic = segments.map((x) => x.text).join(" ");
    origin = { kind: "quran", surah: spec.s, ayah: spec.a, to: spec.to ?? spec.a, partial: !!spec.start, segments, text: "Tanzil Uthmani" };
  } else if (spec.kind === "hadith-lines") {
    const { h, sha } = hadith(spec.collection, spec.number);
    const lines = spec.lines.map((l) => ({ label: l.label, arabic: findVerbatimSpan(h.text, l.start, l.end) }));
    if (lines.some((l) => !l.arabic)) { console.error(`✗ ${d.id}: qator topilmadi`); failed++; continue; }
    arabic = lines.map((l) => l.arabic).join("\n");
    grades = h.grades ?? [];
    origin = { kind: "hadith", collection: spec.collection, number: h.hadithnumber, abdulBaqi: spec.collection === "muslim" ? h.arabicnumber ?? null : null, dataset: "fawazahmed0/hadith-api", sha256: sha, lines };
  } else if (spec.kind === "hadith") {
    const { h, sha } = hadith(spec.collection, spec.number);
    arabic = findVerbatimSpan(h.text, spec.start, spec.end);
    grades = h.grades ?? [];
    origin = { kind: "hadith", collection: spec.collection, number: h.hadithnumber, abdulBaqi: spec.collection === "muslim" ? h.arabicnumber ?? null : null, dataset: "fawazahmed0/hadith-api", sha256: sha };
  } else {
    arabic = spec.text;
    origin = { kind: "manual", note: spec.note };
  }
  if (!arabic) { console.error(`✗ ${d.id}: arabcha matn topilmadi`); failed++; continue; }

  const checks = [];
  if (spec.kind === "hadith" || spec.kind === "hadith-lines") checks.push({ collection: spec.collection, number: spec.number, ok: true, method: "extracted" });
  for (const c of d.check ?? []) {
    const { h } = hadith(c.collection, c.number);
    const ok = arabicContains(h.text, arabic.replace(/[()]/g, ""));
    if (!ok) { console.error(`✗ ${d.id}: ${c.collection} ${c.number} matnida topilmadi → «${normalizeArabic(arabic).slice(0, 60)}»`); failed++; }
    checks.push({ collection: c.collection, number: c.number, ok, method: "contains", abdulBaqi: c.collection === "muslim" ? h.arabicnumber ?? null : null, grades: h.grades ?? [] });
    if (!grades.length && h.grades?.length) grades = h.grades;
  }
  out.push({ id: d.id, arabic, origin, checks, grades, verified: spec.kind !== "manual" && checks.every((c) => c.ok) });
  console.log(`✓ ${d.id.padEnd(34)} ${spec.kind}${checks.length ? ` · ${checks.filter((c) => c.ok).length}/${checks.length} mos` : ""}`);
}
writeFileSync(path.resolve("src/content/sources/dua-sources.json"), JSON.stringify(out, null, 1));
console.log(`${out.length} ta duo yozildi, ${failed} ta muammo`);
if (failed) process.exitCode = 1;
