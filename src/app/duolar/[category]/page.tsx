import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { listCategories, listContent } from "@/server/content/repo";
import { DuaCard } from "@/components/content/cards";
import { PageHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/controls";

export const dynamic = "force-dynamic";

async function load(slug: string) {
  const cats = await listCategories("dua");
  return cats.find((c) => c.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const c = await load((await params).category);
  return c ? { title: `${c.title} — duolar`, description: c.description ?? undefined, alternates: { canonical: `/duolar/${c.slug}` } } : {};
}

export default async function DuaCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = await load(category);
  if (!cat) notFound();
  const duas = (await listContent("dua")).filter((d) => d.body.categories.includes(category));
  return (
    <div>
      <Link href="/duolar" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft size={16} /> Barcha toifalar</Link>
      <PageHeader eyebrow="Duolar" title={cat.title} subtitle={cat.description ?? undefined} />
      {duas.length === 0 ? (
        <EmptyState title="Bu toifada hozircha nashr qilingan duo yoʻq" text="Duolar ulamolar tekshiruvidan oʻtgach shu yerda paydo boʻladi." />
      ) : (
        <div className="space-y-5">{duas.map((d) => <DuaCard key={d.slug} dua={d} />)}</div>
      )}
    </div>
  );
}
