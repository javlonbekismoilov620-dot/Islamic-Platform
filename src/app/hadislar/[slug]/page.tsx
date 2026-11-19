import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getContent, listContent } from "@/server/content/repo";
import { HadithCard, hadithHref } from "@/components/content/cards";
import { COLLECTIONS } from "@/content/refs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const h = await getContent("hadith", (await params).slug);
  return h ? { title: `${h.title} — hadis (${COLLECTIONS[h.body.collection]?.short})`, description: h.body.translation.slice(0, 160), alternates: { canonical: hadithHref(h) } } : {};
}

export default async function HadithPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = await getContent("hadith", slug);
  if (!h) notFound();
  const related = (await listContent("hadith")).filter((x) => x.category === h.category && x.slug !== slug).slice(0, 4);
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/hadislar" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft size={16} /> Barcha hadislar</Link>
      <HadithCard hadith={h} showLink={false} />
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-fg">Shu mavzudagi boshqa hadislar</h2>
          <ul className="grid gap-2 sm:grid-cols-2">{related.map((r) => <li key={r.slug}><Link href={hadithHref(r)} className="card glass block px-4 py-3 text-sm font-medium text-fg-2 hover:text-primary">{r.title}</Link></li>)}</ul>
        </section>
      )}
    </div>
  );
}
