import Link from "next/link";
import { ChevronRight, Repeat } from "lucide-react";
import type { Content } from "@/content/types";
import { Arabic } from "./arabic";
import { Translit, UzTranslation } from "./text";
import { BookmarkButton, CopyButton, ShareButton } from "./actions";
import { References, ReviewNotice } from "./references";
import { GradeBadge } from "./grade";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { COLLECTIONS, hadithLocator } from "@/content/refs";
import { QURAN_TRANSLIT } from "@/content/seed/quran-translit";
import type { getVerses } from "@/server/quran";
import { cn } from "@/lib/cn";

export function duaHref(d: Content<"dua">) {
  return `/duolar/${d.body.categories[0] ?? d.category}/${d.slug}`;
}

export function DuaCard({ dua, compact = false, showLink = true }: { dua: Content<"dua">; compact?: boolean; showLink?: boolean }) {
  const b = dua.body;
  const translitLines = b.translit.split("\n");
  const lines = b.lines?.length ? b.lines : null;
  const segments = b.origin.kind === "quran" ? b.origin.segments : null;
  const copyText = `${b.arabic}\n\n${b.translit}\n\n${b.meaning}`;
  return (
    <article className="card glass animate-in overflow-hidden p-5 sm:p-7">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[1.08rem] font-semibold tracking-[-0.01em] text-fg">
            {showLink ? <Link href={duaHref(dua)} className="hover:text-primary">{dua.title}</Link> : dua.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <StatusBadge status={dua.status} />
            {b.count ? <Badge tone="gold" icon={<Repeat size={12} />}>{b.count} marta</Badge> : null}
            {b.grades?.length || b.origin.kind === "hadith" ? <GradeBadge collection={b.origin.kind === "hadith" ? b.origin.collection : undefined} grades={b.grades ?? []} /> : null}
            {b.origin.kind === "quran" && <Badge tone="primary">Qurʼoniy duo</Badge>}
          </div>
        </div>
        <div className="-me-2 -mt-1 flex shrink-0 items-center">
          <BookmarkButton kind="duas" id={dua.slug} />
          <CopyButton text={copyText} />
          <ShareButton title={dua.title} text={`${b.arabic}\n${b.meaning}`} path={duaHref(dua)} />
        </div>
      </header>

      <div className="space-y-4">
        {segments ? (
          <p lang="ar" dir="rtl" className="ar-quran text-fg">
            {segments.map((s) => (
              <span key={s.a}>
                {s.text}
                {segments.length > 1 && <span className="ayah-num">{s.a}</span>}{" "}
              </span>
            ))}
          </p>
        ) : lines ? (
          <div className="space-y-3">
            {lines.map((l, i) => (
              <div key={i}>
                {l.label && <p className="mb-1 text-xs font-medium tracking-wide text-gold uppercase">{l.label}</p>}
                <Arabic text={l.arabic} />
                {translitLines[i] && <Translit text={translitLines[i]} className="mt-1" />}
              </div>
            ))}
          </div>
        ) : (
          <>
            <Arabic text={b.arabic} />
            <Translit text={b.translit} />
          </>
        )}
        {segments && <Translit text={b.translit} />}

        <div className="rounded-2xl bg-primary-soft px-4 py-3">
          <p className="mb-1 text-xs font-semibold tracking-wide text-primary uppercase">Maʼnosi</p>
          <p className="translation-text text-fg">{b.meaning}</p>
        </div>

        {!compact && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-fg">Qachon aytiladi</dt>
              <dd className="mt-0.5 leading-relaxed text-fg-2">{b.occasion}</dd>
            </div>
            {b.countNote && (
              <div>
                <dt className="font-medium text-fg">Takrorlash soni</dt>
                <dd className="mt-0.5 leading-relaxed text-fg-2">{b.countNote}</dd>
              </div>
            )}
            {b.virtue && (
              <div className="sm:col-span-2">
                <dt className="font-medium text-fg">Fazilati</dt>
                <dd className="mt-0.5 leading-relaxed text-fg-2">{b.virtue}</dd>
              </div>
            )}
            {b.note && (
              <div className="sm:col-span-2">
                <dt className="font-medium text-fg">Izoh</dt>
                <dd className="mt-0.5 leading-relaxed text-fg-2">{b.note}</dd>
              </div>
            )}
          </dl>
        )}

        <ReviewNotice status={dua.status} origin={dua.origin} kind="dua" arabicVerified={b.arabicVerified} compact={compact} />
        <References refs={dua.refs} />
      </div>
    </article>
  );
}

export function hadithHref(h: Content<"hadith">) {
  return `/hadislar/${h.slug}`;
}

export function HadithCard({ hadith, compact = false, showLink = true }: { hadith: Content<"hadith">; compact?: boolean; showLink?: boolean }) {
  const b = hadith.body;
  const c = COLLECTIONS[b.collection];
  return (
    <article className="card glass animate-in p-5 sm:p-7">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[1.08rem] font-semibold tracking-[-0.01em] text-fg">
            {showLink ? <Link href={hadithHref(hadith)} className="hover:text-primary">{hadith.title}</Link> : hadith.title}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {c?.title}, {hadithLocator(b.collection, b.number, b.abdulBaqi)}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusBadge status={hadith.status} />
            <GradeBadge collection={b.collection} grades={b.grades} />
          </div>
        </div>
        <div className="-me-2 -mt-1 flex shrink-0 items-center">
          <BookmarkButton kind="hadiths" id={hadith.slug} />
          <CopyButton text={`${b.matn}\n\n${b.translation}\n\n${c?.title}, ${hadithLocator(b.collection, b.number, b.abdulBaqi)}`} />
          <ShareButton title={hadith.title} text={b.translation} path={hadithHref(hadith)} />
        </div>
      </header>
      <Arabic text={b.matn} />
      <p className="mt-4 text-sm text-muted">{b.narrator} rivoyat qiladi:</p>
      <p className="translation-text mt-1 text-fg">{b.translation}</p>
      {!compact && b.explanation && (
        <div className="mt-4 rounded-2xl bg-sunken px-4 py-3 text-sm leading-relaxed text-fg-2">
          <span className="font-medium text-fg">Izoh: </span>
          {b.explanation}
        </div>
      )}
      {!compact && (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-fg-2 hover:text-fg">Sanadi bilan toʻliq arabcha matn</summary>
          <p lang="ar" dir="rtl" className="ar-text mt-3 text-[1.2rem] leading-[2] text-fg-2">{b.arabicFull}</p>
        </details>
      )}
      <div className="mt-4 space-y-3">
        <ReviewNotice status={hadith.status} origin={hadith.origin} kind="hadith" compact={compact} />
        {!compact && <GradeBadge collection={b.collection} grades={b.grades} showDetail />}
        <References refs={hadith.refs} />
      </div>
    </article>
  );
}

type Verses = NonNullable<Awaited<ReturnType<typeof getVerses>>>;

export function VerseEmbed({ data, className }: { data: Verses; className?: string }) {
  const translit = QURAN_TRANSLIT[data.surah.n];
  const first = data.verses[0].a, last = data.verses[data.verses.length - 1].a;
  return (
    <figure className={cn("card glass my-6 p-5 sm:p-7", className)}>
      <div className="space-y-5">
        {data.verses.map((v) => (
          <div key={v.a}>
            <p lang="ar" dir="rtl" className="ar-quran text-fg">
              {v.ar} <span className="ayah-num">{v.a}</span>
            </p>
            {translit?.[v.a - 1] && <Translit text={translit[v.a - 1]} className="mt-1" />}
            <UzTranslation text={v.tr} className="translation-text mt-2 text-fg" />
          </div>
        ))}
      </div>
      <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-muted">
        <span>
          {data.surah.uz} surasi, {first}{last !== first ? `–${last}` : ""}-oyat · Tarjima: {data.translation.translator} (QuranEnc, v{data.translation.version})
          {translit?.length ? " · Transliteratsiya — tahririyat qoralamasi" : ""}
        </span>
        <Link href={`/quron/${data.surah.n}#oyat-${first}`} className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline">
          Qurʼonda oʻqish <ChevronRight size={14} />
        </Link>
      </figcaption>
    </figure>
  );
}
