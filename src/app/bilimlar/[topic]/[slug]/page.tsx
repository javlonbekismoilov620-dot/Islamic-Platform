import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, ChevronLeft, Clock, ListChecks } from "lucide-react";
import { getContent } from "@/server/content/repo";
import { Markdown } from "@/components/content/markdown";
import { References, ReviewNotice } from "@/components/content/references";
import { BookmarkButton, ShareButton } from "@/components/content/actions";
import { StatusBadge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ topic: string; slug: string }> }): Promise<Metadata> {
  const { topic, slug } = await params;
  const a = await getContent("article", slug);
  return a ? { title: a.title, description: a.summary ?? undefined, alternates: { canonical: `/bilimlar/${topic}/${slug}` } } : {};
}

const fmtDate = (s: string) => new Intl.DateTimeFormat("uz-UZ", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Tashkent" }).format(new Date(s));

export default async function ArticlePage({ params }: { params: Promise<{ topic: string; slug: string }> }) {
  const { topic, slug } = await params;
  const a = await getContent("article", slug);
  if (!a || a.category !== topic) notFound();
  return (
    <article className="mx-auto max-w-3xl">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.summary, inLanguage: "uz", dateModified: a.updatedAt }} />
      <Link href={`/bilimlar/${topic}`} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft size={16} /> Orqaga</Link>
      <header className="animate-in mb-8">
        <h1 className="text-[2rem] leading-tight font-bold tracking-[-0.03em] text-fg sm:text-[2.5rem]">{a.title}</h1>
        <p className="mt-3 text-[1.02rem] text-fg-2">{a.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1"><Clock size={15} /> {a.body.minutes} daqiqa</span>
          <span className="inline-flex items-center gap-1"><CalendarCheck size={15} /> {a.reviewedAt ? `Tekshirilgan: ${fmtDate(a.reviewedAt)}` : "Hali tekshirilmagan"}</span>
          <StatusBadge status={a.status} />
          <span className="ms-auto flex"><BookmarkButton kind="articles" id={`${topic}/${slug}`} /><ShareButton title={a.title} text={a.summary ?? a.title} path={`/bilimlar/${topic}/${slug}`} /></span>
        </div>
      </header>
      <ReviewNotice status={a.status} origin={a.origin} kind="article" />
      {a.body.keyPoints?.length ? (
        <div className="card glass mt-6 p-5">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg"><ListChecks size={16} className="text-primary" /> Asosiy fikrlar</p>
          <ul className="space-y-1 text-sm text-fg-2">{a.body.keyPoints.map((k) => <li key={k}>• {k}</li>)}</ul>
        </div>
      ) : null}
      <Markdown source={a.body.markdown} className="mt-6" />
      <div className="mt-10 space-y-3">
        <References refs={a.refs} title="Fiqh va boshqa manbalar (bibliografiya)" />
        <p className="text-xs text-muted">Oxirgi tahrir: {fmtDate(a.updatedAt)}. Qurʼon oyatlari va hadislar maqola ichida oʻz manbalari bilan koʻrsatilgan.</p>
      </div>
    </article>
  );
}
