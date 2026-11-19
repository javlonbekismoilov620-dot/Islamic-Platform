/**
 * Barcha boshlangʻich kontentni yagona roʻyxatga yigʻadi. Arabcha matnlar faqat manbadan olingan
 * JSON fayllardan qoʻshiladi; oʻzbekcha qismlar tahririyat qoralamasi sifatida belgilanadi.
 */
import type { Reference } from "@/server/db/schema";
import type { DuaOrigin, Grade, SeedItem } from "../types";
import duaSources from "../sources/dua-sources.json";
import dhikrSources from "../sources/dhikr-sources.json";
import hadithSources from "../sources/hadith-sources.json";
import { DUA_TEXTS } from "./duas";
import { DHIKR_SETS, DHIKR_TEXTS } from "./dhikr";
import { HADITH_TEXTS } from "./hadiths";
import { LESSONS } from "./lessons";
import { QUIZZES, FINAL_QUIZ_SLUG } from "./quizzes";
import { ARTICLES } from "./articles";
import { GLOSSARY } from "./glossary";
import { EVENTS } from "./events";
import { duaRefs, hadithRef } from "../refs";
import { normUz } from "@/lib/search-normalize";
import { normalizeArabic } from "@/lib/arabic";

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ʻʼ'‘’`]/g, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type DuaSource = { id: string; arabic: string; origin: DuaOrigin; checks: { collection: string; number: number; ok: boolean; method: string; abdulBaqi?: number | null; grades?: Grade[] }[]; grades: Grade[]; verified: boolean };

const extraRefs = (xs?: { collection: string; number: number }[]) => (xs ?? []).map((x) => hadithRef(x.collection, x.number, null));

function withAbdulBaqi(refs: Reference[]): Reference[] {
  const seen = new Set<string>();
  return refs.filter((r) => {
    const k = `${r.title}|${r.locator}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function searchTextFor(parts: (string | undefined | null)[]): string {
  const latin = parts.filter(Boolean).join(" ");
  return `${normUz(latin)} ${normalizeArabic(latin, true)}`.slice(0, 20000);
}

function buildDuas(): SeedItem<"dua">[] {
  const items: SeedItem<"dua">[] = [];
  (duaSources as DuaSource[]).forEach((src, i) => {
    const t = DUA_TEXTS[src.id];
    if (!t) throw new Error(`Duo matni topilmadi: ${src.id}`);
    const lines = src.origin.kind === "hadith" && src.origin.lines
      ? src.origin.lines.map((l, k) => ({ label: l.label, arabic: l.arabic, translit: t.translit.split("\n")[k] }))
      : undefined;
    const refs = withAbdulBaqi([
      ...duaRefs(src.origin, src.checks),
      ...extraRefs(t.extra),
      ...(t.fiqh ?? []).map((f) => ({ ...f, kind: "book" })),
    ]);
    items.push({
      type: "dua",
      slug: slugify(src.id),
      category: t.cats[0],
      title: t.title,
      summary: t.meaning.slice(0, 160),
      sort: i,
      refs,
      body: {
        arabic: src.arabic,
        lines,
        translit: t.translit,
        meaning: t.meaning,
        occasion: t.occasion,
        count: t.count ?? null,
        countNote: t.countNote,
        virtue: t.virtue,
        note: t.note,
        categories: t.cats,
        origin: src.origin,
        checks: src.checks,
        grades: src.grades,
        arabicVerified: src.verified,
        audioUrl: null,
      },
    });
  });
  return items;
}

function buildDhikr(duas: SeedItem<"dua">[]): SeedItem<"dhikr">[] {
  const items: SeedItem<"dhikr">[] = [];
  const dhikrById = new Map((dhikrSources as DuaSource[]).map((d) => [d.id, d]));
  let sort = 0;
  for (const set of DHIKR_SETS) {
    const steps = set.steps.map((st) => {
      if (st.kind === "dhikr") {
        const src = dhikrById.get(st.ref)!;
        const t = DHIKR_TEXTS[st.ref];
        return { title: t.title, arabic: src.arabic, translit: t.translit, meaning: t.meaning, count: st.count, ref: `dhikr:${slugify(st.ref)}` };
      }
      const d = duas.find((x) => x.slug === slugify(st.ref));
      if (!d) throw new Error(`Toʻplam qadami topilmadi: ${st.ref}`);
      return { title: d.title, arabic: d.body.arabic, translit: d.body.translit, meaning: d.body.meaning, count: st.count, ref: `dua:${d.slug}` };
    });
    items.push({
      type: "dhikr",
      slug: set.slug,
      category: "toplam",
      title: set.title,
      summary: set.summary,
      sort: sort++,
      refs: set.refs.map((r) => hadithRef(r.collection, r.number, null)),
      body: { kind: "set", target: null, targetBasis: "hadith", targetNote: set.note, steps },
    });
  }
  for (const src of dhikrSources as DuaSource[]) {
    const t = DHIKR_TEXTS[src.id];
    if (!t) throw new Error(`Zikr matni topilmadi: ${src.id}`);
    items.push({
      type: "dhikr",
      slug: slugify(src.id),
      category: "zikr",
      title: t.title,
      summary: t.meaning,
      sort: sort++,
      refs: withAbdulBaqi([...duaRefs(src.origin, src.checks), ...extraRefs(t.extra)]),
      body: { kind: "single", arabic: src.arabic, translit: t.translit, meaning: t.meaning, target: t.target, targetBasis: t.targetBasis, targetNote: t.targetNote, virtue: t.virtue },
    });
  }
  return items;
}

type HadithSource = { id: string; collection: string; number: number; abdulBaqi: number | null; book: number | null; bookTitleEn: string | null; hadithInBook: number | null; arabicFull: string; matn: string; grades: Grade[]; dataset: { name: string; edition: string; sha256: string } };

function buildHadiths(): SeedItem<"hadith">[] {
  return (hadithSources as HadithSource[]).map((h, i) => {
    const t = HADITH_TEXTS[h.id];
    if (!t) throw new Error(`Hadis tarjimasi topilmadi: ${h.id}`);
    const topic = (h as unknown as { topic?: string }).topic;
    return {
      type: "hadith" as const,
      slug: slugify(h.id),
      category: topic ?? null,
      title: t.title,
      summary: t.translation.replace(/[«»]/g, "").slice(0, 180),
      sort: i,
      refs: [hadithRef(h.collection, h.number, h.abdulBaqi)],
      body: {
        collection: h.collection,
        number: h.number,
        abdulBaqi: h.abdulBaqi,
        book: h.book,
        bookTitleEn: h.bookTitleEn,
        hadithInBook: h.hadithInBook,
        matn: h.matn,
        arabicFull: h.arabicFull,
        narrator: t.narrator,
        translation: t.translation,
        explanation: t.explanation,
        grades: h.grades,
        topic: topic ?? "",
        dataset: h.dataset,
      },
    };
  });
}

function buildLessons(): SeedItem[] {
  const out: SeedItem[] = [];
  for (const l of LESSONS) {
    out.push({
      type: "lesson",
      slug: l.slug,
      category: "namoz",
      title: l.title,
      summary: l.summary,
      sort: l.order,
      refs: l.refs.map((r) => ({ ...r, kind: "book" })),
      body: { order: l.order, minutes: l.minutes, markdown: l.markdown, outcomes: l.outcomes },
    });
  }
  const all = Object.values(QUIZZES).flat();
  for (const [lesson, questions] of Object.entries(QUIZZES)) {
    out.push({ type: "quiz", slug: `${lesson}-test`, category: "namoz", title: `«${LESSONS.find((l) => l.slug === lesson)?.title}» boʻyicha test`, sort: 0, refs: [], body: { lesson, questions } });
  }
  out.push({ type: "quiz", slug: `${FINAL_QUIZ_SLUG}-test`, category: "namoz", title: "Yakuniy test: tahorat va namoz", sort: 99, refs: [], body: { lesson: FINAL_QUIZ_SLUG, questions: all } });
  return out;
}

function buildArticles(): SeedItem<"article">[] {
  return ARTICLES.map((a, i) => ({
    type: "article" as const,
    slug: a.slug,
    category: a.category,
    title: a.title,
    summary: a.summary,
    sort: i,
    refs: a.refs.map((r) => ({ ...r, kind: "book" })),
    body: { markdown: a.markdown, minutes: a.minutes, keyPoints: a.keyPoints },
  }));
}

function buildGlossary(): SeedItem<"glossary">[] {
  return GLOSSARY.map((g, i) => ({
    type: "glossary" as const,
    slug: slugify(g.term),
    category: null,
    title: g.term,
    summary: g.definition.slice(0, 160),
    sort: i,
    refs: [],
    body: { arabic: g.arabic, translit: g.translit, definition: g.definition, ruling: g.ruling },
  }));
}

function buildEvents(): SeedItem<"event">[] {
  return EVENTS.map((e, i) => ({
    type: "event" as const,
    slug: e.slug,
    category: e.kind,
    title: e.title,
    summary: e.description.slice(0, 160),
    sort: i,
    refs: [],
    body: { hijriMonth: e.hijriMonth, hijriDay: e.hijriDay, days: e.days, kind: e.kind, moonDependent: e.moonDependent, fasting: e.fasting ?? null, description: e.description },
  }));
}

/** Hadis yozuvlariga mavzu (topic) maydonini tanlov roʻyxatidan qoʻshish. */
import { HADITH_SELECTION } from "../sources/hadith-selection";
for (const h of hadithSources as (HadithSource & { topic?: string })[]) {
  h.topic = HADITH_SELECTION.find((p) => p.id === h.id)?.topic;
}

export function buildSeed(): SeedItem[] {
  const duas = buildDuas();
  return [...duas, ...buildDhikr(duas), ...buildHadiths(), ...buildLessons(), ...buildArticles(), ...buildGlossary(), ...buildEvents()];
}

export function seedSearchText(item: SeedItem): string {
  const b = item.body as unknown as Record<string, unknown>;
  const pick = (k: string) => (typeof b[k] === "string" ? (b[k] as string) : "");
  return searchTextFor([item.title, item.summary, pick("meaning"), pick("translit"), pick("translation"), pick("definition"), pick("occasion"), pick("narrator"), pick("markdown"), pick("description"), pick("arabic"), pick("matn"), pick("term")]);
}
