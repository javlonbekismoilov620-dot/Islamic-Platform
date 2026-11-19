"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { normUz } from "@/lib/search-normalize";
import { normalizeArabic } from "@/lib/arabic";
import { useHydrated, useStore } from "@/lib/store";
import { Segmented } from "@/components/ui/controls";
import { cn } from "@/lib/cn";

export type SurahItem = { n: number; ar: string; uz: string; meaning: string; type: "makkiy" | "madaniy"; ayahs: number; juz: number };

export function SurahList({ surahs }: { surahs: SurahItem[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "makkiy" | "madaniy" | "saved">("all");
  const [qp] = useStore("quranProgress");
  const [bm] = useStore("bookmarks");
  const hydrated = useHydrated();
  const savedSurahs = useMemo(() => new Set(bm.ayahs.map((a) => Number(a.split(":")[0]))), [bm.ayahs]);

  const list = useMemo(() => {
    const nq = normUz(q);
    const aq = normalizeArabic(q, true);
    return surahs.filter((s) => {
      if (filter === "makkiy" || filter === "madaniy") { if (s.type !== filter) return false; }
      if (filter === "saved" && !savedSurahs.has(s.n)) return false;
      if (!q.trim()) return true;
      if (/^\d+$/.test(q.trim())) return String(s.n).startsWith(q.trim());
      return normUz(`${s.uz} ${s.meaning}`).includes(nq) || (aq && normalizeArabic(s.ar, true).includes(aq));
    });
  }, [q, filter, surahs, savedSurahs]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="glass-strong flex h-12 flex-1 items-center gap-2 rounded-2xl px-4">
          <Search size={18} className="text-muted" />
          <span className="sr-only">Surani qidirish</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Sura nomi yoki raqami (masalan, Yosin, 36)" className="h-full w-full bg-transparent text-[0.95rem] outline-none placeholder:text-muted" />
        </label>
        <Segmented
          label="Saralash"
          value={filter}
          onChange={setFilter}
          size="sm"
          options={[{ value: "all", label: "Barchasi" }, { value: "makkiy", label: "Makkiy" }, { value: "madaniy", label: "Madaniy" }, { value: "saved", label: "Saqlangan" }]}
        />
      </div>
      {list.length === 0 && <p className="py-10 text-center text-muted">Hech narsa topilmadi.</p>}
      <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const read = hydrated ? qp.maxAyah[String(s.n)] ?? 0 : 0;
          const pct = Math.round((read / s.ayahs) * 100);
          return (
            <li key={s.n}>
              <Link href={`/quron/${s.n}`} className="card glass group flex items-center gap-3.5 p-4 transition-all hover:-translate-y-0.5 hover:shadow-card">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center text-sm font-semibold text-gold">
                  <svg viewBox="0 0 44 44" className="absolute inset-0" aria-hidden>
                    <path d="M22 2 27.6 7.6H36.4V16.4L42 22 36.4 27.6V36.4H27.6L22 42 16.4 36.4H7.6V27.6L2 22 7.6 16.4V7.6H16.4Z" fill="var(--gold-soft)" stroke="color-mix(in srgb, var(--gold) 45%, transparent)" />
                  </svg>
                  <span className="relative">{s.n}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-fg">{s.uz}</span>
                  <span className="block truncate text-xs text-muted">{s.meaning} · {s.type === "makkiy" ? "Makkiy" : "Madaniy"} · {s.ayahs} oyat</span>
                  {read > 0 && (
                    <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-line">
                      <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </span>
                  )}
                </span>
                <span lang="ar" dir="rtl" className={cn("ar-inline shrink-0 text-[1.3rem] text-fg-2")} style={{ fontFamily: "var(--font-quran)" }}>{s.ar}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
