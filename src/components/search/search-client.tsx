"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { SearchHit } from "@/server/search";

type Res = { groups: { name: string; hits: SearchHit[] }[]; total: number };
const SUGGEST = ["tahorat", "Oyatul Kursiy", "safar duosi", "vitr", "roʻza", "Yosin", "istigʻfor", "ota-ona", "الحمد لله"];

export function SearchClient({ initial }: { initial: string }) {
  const [q, setQ] = useState(initial);
  const [res, setRes] = useState<Res | null>(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  useEffect(() => {
    const term = q.trim();
    const url = new URL(window.location.href);
    if (term) url.searchParams.set("q", term); else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
    if (term.length < 2) { setRes(null); return; }
    const ctrl = new AbortController();
    const t = window.setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (r.ok) setRes(await r.json());
      } catch { /* bekor qilindi */ } finally { setLoading(false); }
    }, 220);
    return () => { ctrl.abort(); window.clearTimeout(t); };
  }, [q]);

  return (
    <div>
      <label className="glass-strong flex h-14 items-center gap-3 rounded-2xl px-5">
        <Search size={20} className="text-muted" />
        <span className="sr-only">Qidiruv soʻzi</span>
        <input ref={ref} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nima izlayapsiz?" className="h-full w-full bg-transparent text-[1.05rem] outline-none placeholder:text-muted" enterKeyHint="search" />
        {q && <button type="button" aria-label="Tozalash" onClick={() => setQ("")} className="rounded-full p-1 text-muted hover:text-fg"><X size={18} /></button>}
      </label>
      {!q.trim() && (
        <div className="mt-6 flex flex-wrap gap-2">
          {SUGGEST.map((s) => <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full bg-sunken px-3.5 py-1.5 text-sm text-fg-2 hover:text-fg">{s}</button>)}
        </div>
      )}
      <div className="mt-6 min-h-[8rem]" aria-live="polite" aria-busy={loading}>
        {loading && !res && <div className="space-y-3"><div className="skeleton h-16" /><div className="skeleton h-16" /></div>}
        {res && res.total === 0 && q.trim().length >= 2 && <p className="py-10 text-center text-muted">«{q}» boʻyicha hech narsa topilmadi. Boshqa soʻz bilan urinib koʻring.</p>}
        {res?.groups.map((g) => (
          <section key={g.name} className="mb-8">
            <h2 className="mb-2 text-sm font-semibold tracking-wide text-gold uppercase">{g.name}</h2>
            <ul className="space-y-2">
              {g.hits.map((h) => (
                <li key={h.href + h.title}>
                  <Link href={h.href} className="card glass block p-4 transition-all hover:-translate-y-0.5 hover:shadow-card">
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-fg">{g.name === "Qurʼon oyatlari" ? `Oyat ${h.title}` : h.title}</span>
                      {h.arabic && <span lang="ar" dir="rtl" className="ar-inline line-clamp-1 max-w-[55%] text-[1.15rem] text-fg-2">{h.arabic}</span>}
                    </span>
                    {h.snippet && <span className="mt-1 line-clamp-2 block text-sm text-muted">{h.snippet}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
