"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { normUz } from "@/lib/search-normalize";
import { RULINGS, RulingBadge, type Ruling } from "@/components/ui/badge";
import { useHydrated, useSettings } from "@/lib/store";
import { renderTranslit } from "@/lib/translit";

type G = { slug: string; term: string; arabic?: string; translit?: string; definition: string; ruling?: string };

export function Glossary({ items }: { items: G[] }) {
  const [q, setQ] = useState("");
  const { settings } = useSettings();
  const hydrated = useHydrated();
  const list = useMemo(() => {
    const n = normUz(q);
    return items.filter((g) => !n || normUz(`${g.term} ${g.translit ?? ""} ${g.definition}`).includes(n)).sort((a, b) => a.term.localeCompare(b.term, "uz"));
  }, [items, q]);
  return (
    <div>
      <label className="glass-strong mb-6 flex h-12 items-center gap-2 rounded-2xl px-4">
        <Search size={18} className="text-muted" />
        <span className="sr-only">Atamani qidirish</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Atama yoki izoh boʻyicha qidiring" className="h-full w-full bg-transparent outline-none placeholder:text-muted" />
      </label>
      <dl className="grid gap-3 sm:grid-cols-2">
        {list.map((g) => (
          <div key={g.slug} id={g.slug} className="card glass scroll-mt-28 p-5">
            <dt className="flex items-start justify-between gap-3">
              <span>
                <span className="block text-[1.05rem] font-semibold text-fg">{g.term}</span>
                {g.translit && <span className="text-sm text-muted">{renderTranslit(g.translit, hydrated ? settings.translitMode : "aniq")}</span>}
              </span>
              {g.arabic && <span lang="ar" dir="rtl" className="ar-inline text-[1.35rem] text-fg">{g.arabic}</span>}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-fg-2">
              {g.ruling && g.ruling in RULINGS && <RulingBadge ruling={g.ruling as Ruling} className="me-1.5" />}
              {g.definition}
            </dd>
          </div>
        ))}
      </dl>
      {!list.length && <p className="py-10 text-center text-muted">Hech narsa topilmadi.</p>}
    </div>
  );
}
