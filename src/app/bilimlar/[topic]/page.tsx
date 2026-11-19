import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock } from "lucide-react";
import { listCategories, listContent } from "@/server/content/repo";
import { PageHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/controls";
import { StatusBadge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

async function cat(slug: string) {
  return (await listCategories("article")).find((c) => c.slug === slug) ?? null;
}
export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const c = await cat((await params).topic);
  return c ? { title: `${c.title} — Islomiy bilimlar`, description: c.description ?? undefined, alternates: { canonical: `/bilimlar/${c.slug}` } } : {};
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const c = await cat(topic);
  if (!c) notFound();
  const articles = (await listContent("article")).filter((a) => a.category === topic);
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/bilimlar" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft size={16} /> Barcha mavzular</Link>
      <PageHeader eyebrow="Bilimlar" title={c.title} subtitle={c.description ?? undefined} />
      {articles.length === 0 ? (
        <EmptyState title="Bu mavzuda hozircha maqola yoʻq" text="Maqolalar ulamolar tekshiruvidan oʻtgach shu yerda chiqadi." />
      ) : (
        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link href={`/bilimlar/${topic}/${a.slug}`} className="card glass block p-5 transition-all hover:-translate-y-0.5 hover:shadow-card">
                <span className="block text-lg font-semibold text-fg">{a.title}</span>
                <span className="mt-1 block text-sm text-muted">{a.summary}</span>
                <span className="mt-3 flex items-center gap-3 text-xs text-muted"><span className="inline-flex items-center gap-1"><Clock size={12} /> {a.body.minutes} daqiqa</span><StatusBadge status={a.status} /></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
