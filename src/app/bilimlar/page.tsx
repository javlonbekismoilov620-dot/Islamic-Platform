import type { Metadata } from "next";
import Link from "next/link";
import { BookA, ChevronRight, Languages, ScrollText } from "lucide-react";
import { listCategories, listContent } from "@/server/content/repo";
import { PageHeader, SectionHeader } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { RULINGS, RulingBadge, type Ruling } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Islomiy bilimlar — aqida, fiqh, odob",
  description: "Hanafiy mazhabi asosida aqida, tahorat, namoz, roʻza, zakot, haj, halol-harom, oila, odob va muomalalar boʻyicha maqolalar.",
  alternates: { canonical: "/bilimlar" },
};

export default async function KnowledgePage() {
  const [cats, articles, hadiths] = await Promise.all([listCategories("article"), listContent("article"), listContent("hadith")]);
  const byCat = new Map<string, number>();
  for (const a of articles) byCat.set(a.category ?? "", (byCat.get(a.category ?? "") ?? 0) + 1);
  return (
    <div>
      <PageHeader eyebrow="Bilimlar" title="Islomiy bilimlar" subtitle="Sunniy aqida va Hanafiy mazhabi asosidagi tushuntirishlar. Har bir maqolada Qurʼon oyatlari, hadislar va fiqh manbalari koʻrsatilgan." />
      <div className="mb-10 grid gap-3 sm:grid-cols-3">
        <Link href="/hadislar" className="hero flex items-center gap-3 p-5"><ScrollText size={22} /><span className="flex-1"><span className="block font-semibold">Hadislar</span><span className="text-sm opacity-80">{hadiths.length} ta tanlangan hadis</span></span><ChevronRight size={18} /></Link>
        <Link href="/lugat" className="card glass flex items-center gap-3 p-5"><BookA size={22} className="text-primary" /><span className="flex-1"><span className="block font-semibold text-fg">Atamalar lugʻati</span><span className="text-sm text-muted">Islomiy atamalar izohi</span></span><ChevronRight size={18} className="text-muted" /></Link>
        <Link href="/talaffuz" className="card glass flex items-center gap-3 p-5"><Languages size={22} className="text-primary" /><span className="flex-1"><span className="block font-semibold text-fg">Talaffuz qoʻllanmasi</span><span className="text-sm text-muted">Arab tovushlari va transliteratsiya</span></span><ChevronRight size={18} className="text-muted" /></Link>
      </div>
      <SectionHeader title="Mavzular" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((c) => (
          <li key={c.slug}>
            <Link href={`/bilimlar/${c.slug}`} className="card glass group flex h-full items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary"><CategoryIcon name={c.icon} /></span>
              <span className="flex-1">
                <span className="block font-semibold text-fg">{c.title}</span>
                <span className="mt-1 block text-sm text-muted">{c.description}</span>
                <span className="mt-2 block text-xs text-muted">{byCat.get(c.slug) ?? 0} ta maqola</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="mt-12">
        <SectionHeader title="Shariy hukm darajalari" subtitle="Saytdagi barcha hukmlar shu belgilar bilan ajratilgan — ularni aralashtirmaslik muhim" />
        <ul className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(RULINGS) as Ruling[]).map((r) => (
            <li key={r} className="card glass flex items-start gap-3 p-4">
              <RulingBadge ruling={r} className="mt-0.5" />
              <span className="text-sm text-fg-2">{RULINGS[r].desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
