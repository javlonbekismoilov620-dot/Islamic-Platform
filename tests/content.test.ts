/** Kontent yaxlitligi: manbalar, ichki havolalar, transliteratsiya va Qurʼon maʼlumotlari. */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildSeed } from "@/content/seed";
import { parseMarkdown } from "@/components/content/markdown-parse";
import { QURAN_TRANSLIT } from "@/content/seed/quran-translit";
import type { DuaBody, HadithBody } from "@/content/types";

const items = buildSeed();
const meta = JSON.parse(readFileSync(path.resolve("public/quran/meta.json"), "utf8"));

describe("seed content", () => {
  it("builds without missing texts and has unique, URL-safe slugs", () => {
    expect(items.length).toBeGreaterThan(250);
    const keys = items.map((i) => `${i.type}:${i.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const i of items) expect(i.slug).toMatch(/^[a-z0-9-]{1,80}$/);
  });
  it("contains no corrupted characters", () => {
    for (const i of items) expect(JSON.stringify(i.body).includes("�"), `${i.type}:${i.slug}`).toBe(false);
  });
  it("every dua has a source and a reference", () => {
    for (const d of items.filter((i) => i.type === "dua")) {
      const b = d.body as DuaBody;
      expect(b.arabic.length, d.slug).toBeGreaterThan(2);
      expect(d.refs.length, d.slug).toBeGreaterThan(0);
      expect(b.translit.length, d.slug).toBeGreaterThan(2);
      if (b.lines?.length) expect(b.translit.split("\n").length, d.slug).toBe(b.lines.length);
      if (b.origin.kind !== "manual") expect(b.arabicVerified, d.slug).toBe(true);
    }
  });
  it("only the documented manual dua lacks automatic verification", () => {
    const manual = items.filter((i) => i.type === "dua" && (i.body as DuaBody).origin.kind === "manual").map((i) => i.slug);
    expect(manual).toEqual(["qunut-duosi"]);
  });
  it("hadiths keep collection numbers and Arabic matn from the dataset", () => {
    for (const h of items.filter((i) => i.type === "hadith")) {
      const b = h.body as HadithBody;
      expect(b.number).toBeGreaterThan(0);
      expect(b.arabicFull.includes(b.matn) || b.arabicFull.length > b.matn.length, h.slug).toBe(true);
      if (b.collection === "muslim") expect(b.abdulBaqi, h.slug).not.toBeNull();
      if (!["bukhari", "muslim"].includes(b.collection)) expect(b.grades.length, h.slug).toBeGreaterThan(0);
    }
  });
  it("all embeds in lessons and articles resolve", () => {
    const slugs = new Set(items.map((i) => `${i.type}:${i.slug}`));
    const strip = (s: string) => s.replace(/[ʻʼ]/g, "");
    for (const i of items.filter((x) => x.type === "lesson" || x.type === "article")) {
      const md = (i.body as { markdown: string }).markdown;
      const walk = (blocks: ReturnType<typeof parseMarkdown>) => {
        for (const b of blocks) {
          if (b.t === "callout") walk(b.blocks);
          if (b.t !== "embed") continue;
          if (b.kind === "steps") { expect(b.ref).toBe("wudu"); continue; }
          if (b.kind === "quran") {
            const m = /^(\d+):(\d+)(?:-(\d+))?$/.exec(b.ref)!;
            expect(m, b.ref).not.toBeNull();
            const s = meta.surahs[Number(m[1]) - 1];
            expect(Number(m[3] ?? m[2])).toBeLessThanOrEqual(s.ayahs);
          } else {
            expect(slugs.has(`${b.kind}:${strip(b.ref)}`), `${i.slug} → ${b.kind}:${b.ref}`).toBe(true);
          }
        }
      };
      walk(parseMarkdown(md));
    }
  });
  it("every quiz answer index is valid", () => {
    for (const q of items.filter((i) => i.type === "quiz")) {
      for (const qq of (q.body as { questions: { options: string[]; answer: number }[] }).questions) {
        expect(qq.answer).toBeGreaterThanOrEqual(0);
        expect(qq.answer).toBeLessThan(qq.options.length);
      }
    }
  });
});

describe("Quran data", () => {
  it("has 114 surahs and 6236 verses", () => {
    expect(meta.surahs).toHaveLength(114);
    expect(meta.surahs.reduce((s: number, x: { ayahs: number }) => s + x.ayahs, 0)).toBe(6236);
  });
  it("basmala split preserves the verbatim Tanzil verse", () => {
    const ar = JSON.parse(readFileSync(path.resolve("public/quran/ar/2.json"), "utf8"));
    expect(ar.basmala).toBeTruthy();
    expect(ar.ayahs[0]).toBe("الٓمٓ");
    const at9 = JSON.parse(readFileSync(path.resolve("public/quran/ar/9.json"), "utf8"));
    expect(at9.basmala).toBeNull();
  });
  it("transliterations align with verse counts", () => {
    for (const [s, lines] of Object.entries(QURAN_TRANSLIT)) expect(lines.length, `sura ${s}`).toBe(meta.surahs[Number(s) - 1].ayahs);
  });
  it("records Hanafi sajda positions (14 of 15 Madinah mushaf marks)", () => {
    expect(meta.sajda).toHaveLength(15);
    expect(meta.sajda.filter((x: { hanafi: boolean }) => x.hanafi)).toHaveLength(14);
  });
});
