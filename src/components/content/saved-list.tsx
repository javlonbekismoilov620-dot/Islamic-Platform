"use client";
import Link from "next/link";
import { BookmarkCheck } from "lucide-react";
import { useHydrated, useStore } from "@/lib/store";

export function SavedDuas({ all }: { all: { slug: string; title: string; category: string }[] }) {
  const [bm] = useStore("bookmarks");
  const hydrated = useHydrated();
  if (!hydrated || !bm.duas.length) return null;
  const items = bm.duas.map((s) => all.find((d) => d.slug === s)).filter(Boolean) as typeof all;
  if (!items.length) return null;
  return (
    <section className="card glass mb-6 p-5">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg"><BookmarkCheck size={17} className="text-gold" /> Saqlangan duolaringiz</p>
      <div className="flex flex-wrap gap-2">
        {items.map((d) => (
          <Link key={d.slug} href={`/duolar/${d.category}/${d.slug}`} className="rounded-full bg-sunken px-3.5 py-1.5 text-sm text-fg-2 hover:text-primary">{d.title}</Link>
        ))}
      </div>
    </section>
  );
}
