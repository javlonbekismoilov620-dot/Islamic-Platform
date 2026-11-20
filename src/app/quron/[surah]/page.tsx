import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getQuranMeta, getSurahArabic, getTranslation, isValidSurah } from "@/server/quran";
import { PlayingHighlight, ReaderProvider, ReaderToolbar, VerseActions, VerseTranslation } from "@/components/quran/reader";
import { Translit } from "@/components/content/text";
import { QURAN_TRANSLIT } from "@/content/seed/quran-translit";
import { Badge } from "@/components/ui/badge";
import { cyrToLat } from "@/lib/uz-script";

export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ surah: String(i + 1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ surah: string }> }): Promise<Metadata> {
  const n = Number((await params).surah);
  const meta = await getQuranMeta();
  const s = meta.surahs[n - 1];
  if (!s) return {};
  const tr = await getTranslation("sodiq", n);
  return {
    title: `${s.uz} surasi (${s.n}) — arabcha matn va oʻzbekcha tarjima`,
    description: `${s.uz} surasi (${s.meaning}), ${s.ayahs} oyat, ${s.type}. ${cyrToLat(tr.ayahs[0]).slice(0, 120)}`,
    alternates: { canonical: `/quron/${n}` },
  };
}

export default async function SurahPage({ params }: { params: Promise<{ surah: string }> }) {
  const n = Number((await params).surah);
  if (!isValidSurah(n)) notFound();
  const [meta, ar, tr] = await Promise.all([getQuranMeta(), getSurahArabic(n), getTranslation("sodiq", n)]);
  const s = meta.surahs[n - 1];
  const prev = n > 1 ? meta.surahs[n - 2] : null;
  const next = n < 114 ? meta.surahs[n] : null;
  const translit = QURAN_TRANSLIT[n];
  const sajda = new Map(meta.sajda.filter((x) => x.s === n).map((x) => [x.a, x.hanafi]));
  const juzStarts = new Map(meta.juz.map((ref, i) => [ref, i + 1]));
  const trMeta = meta.translations.find((t) => t.key === "sodiq")!;

  return (
    <ReaderProvider surah={n} surahName={s.uz} total={s.ayahs} defaultTr={tr}>
      <header className="animate-in mb-8 text-center">
        <p className="text-[0.8rem] font-semibold tracking-[0.08em] text-gold uppercase">{n}-sura · {s.type === "makkiy" ? "Makkiy" : "Madaniy"} · {s.ayahs} oyat</p>
        <h1 className="mt-2 text-[2.2rem] font-bold tracking-[-0.03em] text-fg sm:text-[2.8rem]">{s.uz} surasi</h1>
        <p className="mt-1 text-fg-2">{s.meaning}</p>
        <p lang="ar" dir="rtl" className="mt-3 text-[2.2rem] text-fg" style={{ fontFamily: "var(--font-quran)" }}>{s.ar}</p>
      </header>

      <ReaderToolbar translations={meta.translations.map((t) => ({ key: t.key, titleUz: t.titleUz, version: t.version }))} hasTranslit={!!translit} />

      {ar.basmala && (
        <p lang="ar" dir="rtl" className="ar-quran mb-8 text-fg" style={{ textAlign: "center" }}>{ar.basmala}</p>
      )}

      <ol className="space-y-2">
        {ar.ayahs.map((text, i) => {
          const a = i + 1;
          const juz = juzStarts.get(`${n}:${a}`);
          return (
            <li key={a} id={`oyat-${a}`} data-ayah={a} className="scroll-mt-40">
              {juz && a > 1 && <p className="my-6 text-center text-xs font-semibold tracking-[0.12em] text-gold uppercase">{juz}-pora</p>}
              <PlayingHighlight a={a}>
                <article className="border-b border-line px-1 py-6 sm:px-3">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="ayah-num !m-0">{a}</span>
                      {sajda.has(a) && (
                        <Badge tone={sajda.get(a) ? "gold" : "neutral"}>{sajda.get(a) ? "Tilovat sajdasi" : "Sajda belgisi (Hanafiyda sajda emas)"}</Badge>
                      )}
                    </div>
                    <VerseActions a={a} arabic={text} />
                  </div>
                  <p lang="ar" dir="rtl" className="ar-quran text-fg">{text}</p>
                  {translit?.[i] && <Translit text={translit[i]} className="mt-2" />}
                  <VerseTranslation a={a} />
                </article>
              </PlayingHighlight>
            </li>
          );
        })}
      </ol>

      <footer className="mt-10 space-y-6">
        <nav className="flex items-center justify-between gap-3" aria-label="Suralar boʻylab">
          {prev ? (
            <Link href={`/quron/${prev.n}`} className="card glass flex flex-1 items-center gap-2 p-4 hover:-translate-y-0.5">
              <ChevronLeft size={18} className="text-muted" /> <span><span className="block text-xs text-muted">Oldingi</span>{prev.uz}</span>
            </Link>
          ) : <span className="flex-1" />}
          {next ? (
            <Link href={`/quron/${next.n}`} className="card glass flex flex-1 items-center justify-end gap-2 p-4 text-right hover:-translate-y-0.5">
              <span><span className="block text-xs text-muted">Keyingi</span>{next.uz}</span> <ChevronRight size={18} className="text-muted" />
            </Link>
          ) : <span className="flex-1" />}
        </nav>
        <div className="rounded-2xl bg-sunken px-5 py-4 text-xs leading-relaxed text-muted">
          <p><span className="font-medium text-fg-2">Arabcha matn:</span> {meta.arabic.title}. {meta.arabic.license}</p>
          <p className="mt-1.5"><span className="font-medium text-fg-2">Tarjima:</span> {trMeta.translator} — {trMeta.edition}, {trMeta.version}-versiya ({trMeta.publisher}). Asl nashr kirill yozuvida; lotin koʻrinishi avtomatik harf almashtirish.</p>
          {translit && <p className="mt-1.5"><span className="font-medium text-fg-2">Transliteratsiya:</span> tahririyat qoralamasi, ulamolar tekshiruvi kutilmoqda. Toʻgʻri talaffuzni qorining tilovatidan oʻrganing.</p>}
          <p className="mt-1.5"><span className="font-medium text-fg-2">Sajda belgilari:</span> Madina mushafidagi 15 oʻrin; Hanafiy mazhabida Haj surasining 77-oyati tilovat sajdasi hisoblanmaydi.</p>
        </div>
      </footer>
    </ReaderProvider>
  );
}
