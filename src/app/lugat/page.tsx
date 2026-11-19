import type { Metadata } from "next";
import { listContent } from "@/server/content/repo";
import { PageHeader } from "@/components/ui/card";
import { Glossary } from "@/components/content/glossary";
import { ReviewNotice } from "@/components/content/references";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Islomiy atamalar lugʻati", description: "Namoz, fiqh va aqidaga oid islomiy atamalarning oʻzbekcha izohi, arabcha yozilishi va talaffuzi.", alternates: { canonical: "/lugat" } };

export default async function GlossaryPage() {
  const items = await listContent("glossary");
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Lugʻat" title="Islomiy atamalar" subtitle={`${items.length} ta atama — arabcha yozilishi, aniq talaffuzi va qisqa izohi bilan.`} />
      <div className="mb-6"><ReviewNotice status={items[0]?.status ?? "in_review"} kind="glossary" compact /></div>
      <Glossary items={items.map((g) => ({ slug: g.slug, term: g.title, arabic: g.body.arabic, translit: g.body.translit, definition: g.body.definition, ruling: g.body.ruling }))} />
    </div>
  );
}
