import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getContent, listContent } from "@/server/content/repo";
import { DuaCard, duaHref } from "@/components/content/cards";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = await getContent("dua", (await params).slug);
  return d ? { title: `${d.title} — duo`, description: d.body.meaning.slice(0, 160), alternates: { canonical: duaHref(d) } } : {};
}

export default async function DuaPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const dua = await getContent("dua", slug);
  if (!dua) notFound();
  if (!dua.body.categories.includes(category)) permanentRedirect(duaHref(dua));
  const related = (await listContent("dua")).filter((d) => d.slug !== slug && d.body.categories.includes(category)).slice(0, 6);
  return (
    <div className="mx-auto max-w-3xl">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: dua.title, inLanguage: "uz", about: "Duo", text: dua.body.meaning }} />
      <Link href={`/duolar/${category}`} className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft size={16} /> Orqaga</Link>
      <DuaCard dua={dua} showLink={false} />
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-fg">Shu toifadagi boshqa duolar</h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}><Link href={duaHref(r)} className="card glass block px-4 py-3 text-sm font-medium text-fg-2 hover:text-primary">{r.title}</Link></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
