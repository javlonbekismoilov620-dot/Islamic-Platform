import Link from "next/link";
import { BookMarked, ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import type { Reference, Status } from "@/server/db/schema";
import { cn } from "@/lib/cn";

export function References({ refs, className, title = "Manbalar" }: { refs: Reference[]; className?: string; title?: string }) {
  if (!refs?.length) return null;
  return (
    <details className={cn("group rounded-2xl bg-sunken px-4 py-3 text-sm", className)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 font-medium text-fg-2 select-none">
        <BookMarked size={16} className="text-gold" />
        {title} <span className="text-muted">({refs.length})</span>
        <span className="ms-auto text-xs text-muted group-open:hidden">Koʻrsatish</span>
      </summary>
      <ol className="mt-3 space-y-2 border-t border-line pt-3">
        {refs.map((r, i) => (
          <li key={i} className="leading-relaxed text-fg-2">
            <span className="font-medium text-fg">{r.title}</span>
            {r.author && <span className="text-muted"> — {r.author}</span>}
            {r.locator && <span>, {r.locator}</span>}
            {r.url && (
              r.url.startsWith("/") ? (
                <Link href={r.url} className="ms-1.5 inline-flex items-center gap-0.5 text-primary hover:underline">oʻqish</Link>
              ) : (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="ms-1.5 inline-flex items-center gap-0.5 text-primary hover:underline">
                  manba <ExternalLink size={12} />
                </a>
              )
            )}
          </li>
        ))}
      </ol>
    </details>
  );
}

/** Tekshiruv holati haqida aniq va halol ogohlantirish. */
export function ReviewNotice({ status, origin, kind, arabicVerified, compact }: { status: Status; origin?: string; kind: "dua" | "hadith" | "article" | "lesson" | "dhikr" | "glossary"; arabicVerified?: boolean; compact?: boolean }) {
  if (status === "published") {
    return (
      <p className="flex items-center gap-2 text-xs text-success">
        <ShieldCheck size={14} /> Ulamolar tomonidan tekshirilgan va tasdiqlangan
      </p>
    );
  }
  const arabic = kind === "dua" || kind === "hadith" || kind === "dhikr";
  const text = arabic
    ? `${arabicVerified === false ? "Arabcha matn avtomatik solishtirilmagan — qoʻlda tekshirish kerak. " : "Arabcha matn manbadan aynan olingan va solishtirilgan. "}Oʻzbekcha tarjima, transliteratsiya va izohlar tahririyat qoralamasi boʻlib, ulamolar tekshiruvini kutmoqda.`
    : "Bu matn tahririyat qoralamasi. Ulamolar tekshiruvidan oʻtmagan — uni fatvo yoki yakuniy hukm sifatida qabul qilmang.";
  return (
    <div className={cn("flex gap-2.5 rounded-2xl border border-warning/25 bg-warning-soft text-warning", compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm")}>
      <ShieldAlert size={compact ? 14 : 17} className="mt-0.5 shrink-0" />
      <p className="leading-relaxed">
        <span className="font-semibold">Tekshiruv kutilmoqda. </span>
        {text}
        {origin === "ai_draft" && !compact && " Qoralama sunʼiy intellekt yordamida tayyorlangan."}
      </p>
    </div>
  );
}
