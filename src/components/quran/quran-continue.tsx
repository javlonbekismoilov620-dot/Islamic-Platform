"use client";
import Link from "next/link";
import { BookmarkCheck, ChevronRight, History } from "lucide-react";
import { useHydrated, useStore } from "@/lib/store";

export function QuranContinue({ surahs }: { surahs: { n: number; uz: string }[] }) {
  const [lastRead] = useStore("lastRead");
  const [bm] = useStore("bookmarks");
  const hydrated = useHydrated();
  if (!hydrated || (!lastRead && !bm.ayahs.length)) return null;
  const lr = lastRead ? surahs.find((s) => s.n === lastRead.surah) : null;
  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-2">
      {lr && (
        <Link href={`/quron/${lr.n}#oyat-${lastRead!.ayah}`} className="hero flex items-center gap-3 p-5">
          <History size={20} className="opacity-80" />
          <span className="flex-1">
            <span className="block text-sm opacity-80">Oxirgi oʻqilgan joy</span>
            <span className="block font-semibold">{lr.uz} surasi, {lastRead!.ayah}-oyat</span>
          </span>
          <ChevronRight size={18} className="opacity-80" />
        </Link>
      )}
      {bm.ayahs.length > 0 && (
        <div className="card glass p-5">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-fg"><BookmarkCheck size={17} className="text-gold" /> Saqlangan oyatlar</p>
          <div className="flex flex-wrap gap-1.5">
            {bm.ayahs.slice(0, 8).map((id) => {
              const [s, a] = id.split(":");
              const name = surahs.find((x) => x.n === Number(s))?.uz;
              return (
                <Link key={id} href={`/quron/${s}#oyat-${a}`} className="rounded-full bg-sunken px-3 py-1 text-xs text-fg-2 hover:text-primary">
                  {name} {a}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
