import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/card";
import { SearchClient } from "@/components/search/search-client";

export const metadata: Metadata = { title: "Qidiruv", description: "Qurʼon oyatlari, suralar, duolar, zikrlar, hadislar, namoz darslari va islomiy bilimlar boʻyicha yagona qidiruv.", alternates: { canonical: "/qidiruv" } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Qidiruv" subtitle="Lotin yoki kirill yozuvida, «oʻ» va «oʻ» farqlarisiz yozavering: Qurʼon/Quron, namoz/namaz, hadis/xadis — barchasi topiladi. Arabcha soʻzlar bilan ham qidirish mumkin." />
      <SearchClient initial={typeof q === "string" ? q.slice(0, 120) : ""} />
    </div>
  );
}
