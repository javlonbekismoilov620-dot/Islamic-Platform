"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { normUz } from "@/lib/search-normalize";
import { gradeSummary, hadithLocator, COLLECTIONS } from "@/content/refs";
import type { Grade } from "@/content/types";
import { Badge, StatusBadge, type ContentStatus } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type Item = { slug: string; title: string; topic: string; collection: string; number: number; abdulBaqi: number | null; translation: string; narrator: string; grades: Grade[]; status: ContentStatus };

export function HadithBrowser({ items, topics, collections }: { items: Item[]; topics: { slug: string; title: string }[]; collections: { key: string; title: string }[] }) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const [col, setCol] = useState("");
  const list = useMemo(() => {
    const nq = normUz(q);
    return items.filter((h) => (!topic || h.topic === topic) && (!col || h.collection === col) && (!nq || normUz(`${h.title} ${h.translation} ${h.narrator} ${h.number}`).includes(nq)));
  }, [items, q, topic, col]);
  const chip = (on: boolean) => cn("shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors", on ? "bg-primary text-on-primary" : "bg-sunken text-fg-2 hover:text-fg");
  return (
    <div>
      <label className="glass-strong mb-4 flex h-12 items-center gap-2 rounded-2xl px-4">
        <Search size={18} className="text-muted" />
        <span className="sr-only">Hadislardan qidirish</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Soʻz, mavzu, roviy yoki raqam boʻyicha qidiring" className="h-full w-full bg-transparent outline-none placeholder:text-muted" />
      </label>
      <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto pb-1">
        <button type="button" className={chip(!topic)} onClick={() => setTopic("")}>Barcha mavzular</button>
        {topics.map((t) => <button key={t.slug} type="button" className={chip(topic === t.slug)} onClick={() => setTopic(t.slug)}>{t.title}</button>)}
      </div>
      <div className="no-scrollbar mb-6 flex gap-1.5 overflow-x-auto pb-1">
        <button type="button" className={chip(!col)} onClick={() => setCol("")}>Barcha toʻplamlar</button>
        {collections.map((c) => <button key={c.key} type="button" className={chip(col === c.key)} onClick={() => setCol(c.key)}>{c.title}</button>)}
      </div>
      <p className="mb-3 text-sm text-muted">{list.length} ta hadis</p>
      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {list.map((h) => {
          const g = gradeSummary(h.collection, h.grades);
          return (
            <li key={h.slug}>
              <Link href={`/hadislar/${h.slug}`} className="card glass flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-card">
                <span className="font-semibold text-fg">{h.title}</span>
                <span className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-fg-2">{h.translation}</span>
                <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-3 text-xs text-muted">
                  {COLLECTIONS[h.collection]?.short}, {hadithLocator(h.collection, h.number, h.abdulBaqi).split(" (")[0]}
                  <Badge tone={g.tone === "neutral" ? "neutral" : g.tone}>{g.label}</Badge>
                  <StatusBadge status={h.status} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
