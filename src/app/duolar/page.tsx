import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { listCategories, listContent } from "@/server/content/repo";
import { PageHeader } from "@/components/ui/card";
import { CategoryIcon } from "@/components/ui/category-icon";
import { SavedDuas } from "@/components/content/saved-list";
import { DuaZikrTabs } from "@/components/layout/dua-zikr-tabs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Duolar — arabcha matn, talaffuz va maʼno",
  description: "Kundalik hayot uchun 20 toifadagi duolar: arabcha matn, oʻzbek lotin yozuvida aniq transliteratsiya, maʼno, manba va sahihlik darajasi.",
  alternates: { canonical: "/duolar" },
};

export default async function DuasPage() {
  const [cats, duas] = await Promise.all([listCategories("dua"), listContent("dua")]);
  const counts = new Map<string, number>();
  for (const d of duas) for (const c of d.body.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  const verified = duas.filter((d) => d.body.arabicVerified).length;
  return (
    <div>
      <DuaZikrTabs active="duolar" />
      <PageHeader eyebrow="Duolar kutubxonasi" title="Duolar" subtitle={`${duas.length} ta duo, ${cats.length} ta toifa. Har bir duoning arabcha matni manbadan aynan olingan; ${verified} tasi hadis toʻplamlari yoki Qurʼon matni bilan avtomatik solishtirilgan.`} />
      <SavedDuas all={duas.map((d) => ({ slug: d.slug, title: d.title, category: d.body.categories[0] }))} />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((c) => (
          <li key={c.slug}>
            <Link href={`/duolar/${c.slug}`} className="card glass group flex h-full items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary"><CategoryIcon name={c.icon} /></span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 font-semibold text-fg">
                  {c.title}
                  <span className="text-xs font-normal text-muted">{counts.get(c.slug) ?? 0}</span>
                </span>
                <span className="mt-1 block text-sm leading-snug text-muted">{c.description}</span>
              </span>
              <ChevronRight size={18} className="mt-1 text-muted transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-sm text-muted">
        Talaffuz belgilari haqida — <Link href="/talaffuz" className="text-primary underline-offset-2 hover:underline">Talaffuz qoʻllanmasi</Link>
      </p>
    </div>
  );
}
