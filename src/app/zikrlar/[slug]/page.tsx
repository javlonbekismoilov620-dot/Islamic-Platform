import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/server/content/repo";
import { DhikrCounter } from "@/components/dhikr/counter";
import { References, ReviewNotice } from "@/components/content/references";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = await getContent("dhikr", (await params).slug);
  return d ? { title: `${d.title} — zikr hisoblagichi`, description: d.summary ?? undefined, alternates: { canonical: `/zikrlar/${d.slug}` } } : {};
}

export default async function DhikrCounterPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = await getContent("dhikr", (await params).slug);
  if (!d) notFound();
  const b = d.body;
  const steps = b.kind === "set" ? (b.steps ?? []).map((s) => ({ title: s.title, arabic: s.arabic, translit: s.translit, meaning: s.meaning, count: s.count })) : [{ title: d.title, arabic: b.arabic ?? "", translit: b.translit ?? "", meaning: b.meaning ?? "", count: b.target }];
  return (
    <div>
      <DhikrCounter slug={d.slug} title={d.title} steps={steps} isSet={b.kind === "set"} targetBasis={b.targetBasis} targetNote={b.targetNote} />
      <div className="mx-auto mt-10 max-w-xl space-y-3">
        {b.virtue && <p className="rounded-2xl bg-primary-soft px-4 py-3 text-sm leading-relaxed text-fg"><span className="font-semibold">Fazilati: </span>{b.virtue}</p>}
        <ReviewNotice status={d.status} origin={d.origin} kind="dhikr" compact />
        <References refs={d.refs} />
      </div>
    </div>
  );
}
