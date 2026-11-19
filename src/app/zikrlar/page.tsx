import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, History } from "lucide-react";
import { listContent } from "@/server/content/repo";
import { PageHeader, SectionHeader } from "@/components/ui/card";
import { DuaZikrTabs } from "@/components/layout/dua-zikr-tabs";
import { DhikrToday } from "@/components/dhikr/today";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Zikrlar — tasbeh hisoblagichi",
  description: "Subhanalloh, Alhamdulillah, Allohu akbar, istigʻfor, salovot va namozdan keyingi, ertalabki, kechki zikrlar uchun hisoblagich.",
  alternates: { canonical: "/zikrlar" },
};

export default async function DhikrPage() {
  const all = await listContent("dhikr");
  const sets = all.filter((d) => d.body.kind === "set");
  const singles = all.filter((d) => d.body.kind === "single");
  return (
    <div>
      <DuaZikrTabs active="zikrlar" />
      <PageHeader eyebrow="Zikr" title="Zikrlar" subtitle="Allohni yod etish uchun chiroyli, chalgʻitmaydigan hisoblagich. Hadisda kelgan sonlar alohida belgilangan; qolgan maqsadlar — shaxsiy va ixtiyoriy." />
      <DhikrToday titles={Object.fromEntries(all.map((d) => [d.slug, d.title]))} />
      <section className="mb-10">
        <SectionHeader title="Zikr toʻplamlari" subtitle="Ketma-ket bajariladigan zikrlar" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {sets.map((s) => (
            <li key={s.slug}>
              <Link href={`/zikrlar/${s.slug}`} className="hero group flex h-full flex-col p-5 transition-transform hover:-translate-y-0.5">
                <span className="text-lg font-semibold">{s.title}</span>
                <span className="mt-1 text-sm opacity-80">{s.summary}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium opacity-90">{s.body.steps?.length} bosqich · Boshlash <ChevronRight size={15} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <SectionHeader title="Zikrlar" action={<Link href="/zikrlar/tarix" className="inline-flex items-center gap-1 text-sm font-medium text-primary"><History size={15} /> Tarix</Link>} />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {singles.map((s) => (
            <li key={s.slug}>
              <Link href={`/zikrlar/${s.slug}`} className="card glass flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-card">
                <span lang="ar" dir="rtl" className="ar-text text-[1.5rem] leading-[1.8] text-fg">{s.body.arabic}</span>
                <span className="mt-1 font-semibold text-fg">{s.title}</span>
                <span className="mt-0.5 text-sm text-muted">{s.body.meaning}</span>
                <span className="mt-3">
                  {s.body.target ? <Badge tone={s.body.targetBasis === "hadith" ? "primary" : "neutral"}>{s.body.targetBasis === "hadith" ? "Hadisda" : "Ixtiyoriy"}: {s.body.target}</Badge> : <Badge>Son cheklanmagan</Badge>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
