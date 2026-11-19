import "server-only";
import { listContent } from "@/server/content/repo";
import { getCleanText, getQuranMeta, getTranslation } from "@/server/quran";
import { normUz, normAr, isArabicQuery, tokenize } from "@/lib/search-normalize";
import { cyrToLat } from "@/lib/uz-script";
import { duaHref, hadithHref } from "@/components/content/cards";

export type SearchHit = { group: string; title: string; snippet: string; href: string; score: number; arabic?: string };
type Doc = { group: string; title: string; titleN: string; bodyN: string; bodyAr: string; snippet: string; href: string; arabic?: string };

let quranIdx: { s: number; a: number; tr: string; trN: string; ar: string; arN: string }[] | null = null;
async function quranIndex() {
  if (quranIdx) return quranIdx;
  const [meta, clean] = await Promise.all([getQuranMeta(), getCleanText()]);
  const out: NonNullable<typeof quranIdx> = [];
  for (const s of meta.surahs) {
    const tr = await getTranslation("sodiq", s.n);
    tr.ayahs.forEach((t, i) => {
      const lat = cyrToLat(t);
      out.push({ s: s.n, a: i + 1, tr: lat, trN: ` ${normUz(lat)} `, ar: "", arN: "" });
    });
  }
  for (const [s, a, text] of clean) {
    const row = out.find((r) => r.s === s && r.a === a);
    if (row) { row.ar = text; row.arN = ` ${normAr(text)} `; }
  }
  quranIdx = out;
  return out;
}

async function contentDocs(): Promise<Doc[]> {
  const [duas, dhikr, hadiths, articles, lessons, glossary, meta] = await Promise.all([
    listContent("dua"), listContent("dhikr"), listContent("hadith"), listContent("article"), listContent("lesson"), listContent("glossary"), getQuranMeta(),
  ]);
  const docs: Doc[] = [];
  const add = (group: string, title: string, body: string, snippet: string, href: string, arabic?: string) =>
    docs.push({ group, title, titleN: ` ${normUz(title)} `, bodyN: ` ${normUz(body)} `, bodyAr: arabic ? ` ${normAr(arabic)} ` : "", snippet, href, arabic });
  for (const s of meta.surahs) add("Suralar", `${s.uz} surasi`, `${s.uz} ${s.meaning} ${s.tanzil} ${s.n} sura ${s.type}`, `${s.n}-sura · ${s.meaning} · ${s.ayahs} oyat`, `/quron/${s.n}`, s.ar);
  for (const d of duas) add("Duolar", d.title, `${d.body.translit} ${d.body.meaning} ${d.body.occasion} ${d.body.categories.join(" ")}`, d.body.meaning, duaHref(d), d.body.arabic);
  for (const d of dhikr) add("Zikrlar", d.title, `${d.body.translit ?? ""} ${d.body.meaning ?? ""} ${d.summary ?? ""} zikr tasbeh`, d.summary ?? "", `/zikrlar/${d.slug}`, d.body.arabic);
  for (const h of hadiths) add("Hadislar", h.title, `${h.body.translation} ${h.body.narrator} ${h.body.collection} ${h.body.number} ${h.category}`, h.body.translation, hadithHref(h), h.body.matn);
  for (const l of lessons) add("Namoz darslari", `${l.body.order}-dars: ${l.title}`, `${l.summary} ${l.body.markdown} namoz`, l.summary ?? "", `/ibodat/namoz/${l.slug}`);
  for (const a of articles) add("Bilimlar", a.title, `${a.summary} ${a.body.markdown}`, a.summary ?? "", `/bilimlar/${a.category}/${a.slug}`);
  for (const g of glossary) add("Atamalar", g.title, `${g.body.translit ?? ""} ${g.body.definition}`, g.body.definition, `/lugat#${g.slug}`, g.body.arabic);
  return docs;
}

let docsCache: { at: number; docs: Doc[] } | null = null;
async function getDocs() {
  if (docsCache && Date.now() - docsCache.at < 5 * 60_000) return docsCache.docs;
  docsCache = { at: Date.now(), docs: await contentDocs() };
  return docsCache.docs;
}

function wordHit(hay: string, tok: string) {
  return hay.includes(` ${tok}`);
}

export async function search(q: string, limitPerGroup = 6): Promise<{ groups: { name: string; hits: SearchHit[] }[]; total: number }> {
  const query = q.trim().slice(0, 120);
  if (query.length < 2) return { groups: [], total: 0 };
  const arabic = isArabicQuery(query);
  const toks = arabic ? normAr(query).split(" ").filter(Boolean) : tokenize(query);
  if (!toks.length) return { groups: [], total: 0 };
  const hits: SearchHit[] = [];

  for (const d of await getDocs()) {
    let score = 0, ok = true;
    for (const t of toks) {
      if (arabic) { if (d.bodyAr.includes(t)) score += 2; else { ok = false; break; } continue; }
      const inTitle = wordHit(d.titleN, t), inBody = wordHit(d.bodyN, t);
      if (!inTitle && !inBody) { ok = false; break; }
      score += inTitle ? 6 : 1;
    }
    if (ok) hits.push({ group: d.group, title: d.title, snippet: d.snippet.slice(0, 180), href: d.href, score: score + (d.group === "Suralar" ? 2 : 0), arabic: d.arabic && d.arabic.length < 120 ? d.arabic : undefined });
  }

  const quran = await quranIndex();
  let qn = 0;
  for (const v of quran) {
    const hay = arabic ? v.arN : v.trN;
    if (toks.every((t) => (arabic ? hay.includes(t) : wordHit(hay, t)))) {
      hits.push({ group: "Qurʼon oyatlari", title: `${v.s}:${v.a}`, snippet: v.tr.slice(0, 200), href: `/quron/${v.s}#oyat-${v.a}`, score: 1, arabic: v.ar });
      if (++qn >= 40) break;
    }
  }

  const order = ["Suralar", "Duolar", "Zikrlar", "Namoz darslari", "Bilimlar", "Hadislar", "Atamalar", "Qurʼon oyatlari"];
  const groups = order
    .map((name) => ({ name, hits: hits.filter((h) => h.group === name).sort((a, b) => b.score - a.score).slice(0, name === "Qurʼon oyatlari" ? 10 : limitPerGroup) }))
    .filter((g) => g.hits.length);
  return { groups, total: hits.length };
}
