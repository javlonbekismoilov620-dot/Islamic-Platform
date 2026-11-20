import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { adminGet, requireStaffPage } from "@/server/admin/queries";
import { toContent } from "@/server/content/repo";
import { DuaCard, HadithCard } from "@/components/content/cards";
import { Markdown } from "@/components/content/markdown";
import { References } from "@/components/content/references";
import type { Content } from "@/content/types";

export const metadata = { title: "Oldindan koʻrish" };

export default async function Preview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requireStaffPage(`/admin/kontent/${id}/korish`);
  const data = await adminGet(me.id, id);
  if (!data) notFound();
  const c = toContent(data.row);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={`/admin/kontent/${id}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft size={16} /> Tahrirga qaytish</Link>
      <p className="rounded-2xl bg-info-soft px-4 py-3 text-sm text-info">Bu — xodimlar uchun oldindan koʻrish. Holati: {c.status}.</p>
      {c.type === "dua" && <DuaCard dua={c as Content<"dua">} showLink={false} />}
      {c.type === "hadith" && <HadithCard hadith={c as Content<"hadith">} showLink={false} />}
      {(c.type === "article" || c.type === "lesson") && (
        <article>
          <h1 className="text-3xl font-bold text-fg">{c.title}</h1>
          <p className="mt-2 text-fg-2">{c.summary}</p>
          <Markdown source={(c.body as { markdown: string }).markdown} className="mt-6" />
          <References refs={c.refs} className="mt-8" />
        </article>
      )}
      {!["dua", "hadith", "article", "lesson"].includes(c.type) && <pre className="card glass overflow-auto p-5 text-xs">{JSON.stringify(c.body, null, 2)}</pre>}
    </div>
  );
}
