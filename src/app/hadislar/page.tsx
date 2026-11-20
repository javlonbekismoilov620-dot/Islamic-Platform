import type { Metadata } from "next";
import { listCategories, listContent } from "@/server/content/repo";
import { PageHeader } from "@/components/ui/card";
import { HadithBrowser } from "@/components/content/hadith-browser";
import { COLLECTIONS } from "@/content/refs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Hadislar — Kutubi sittadan tanlangan hadislar",
  description: "Sahih al-Buxoriy, Sahih Muslim, Abu Dovud, Termiziy, Nasoiy va Ibn Mojadan tanlangan hadislar: arabcha matn, oʻzbekcha tarjima, raqam va sahihlik darajasi.",
  alternates: { canonical: "/hadislar" },
};

export default async function HadithsPage() {
  const [hadiths, cats] = await Promise.all([listContent("hadith"), listCategories("hadith")]);
  return (
    <div>
      <PageHeader eyebrow="Hadislar" title="Hadislar" subtitle="Kutubi sittadan tanlangan hadislar. Arabcha matn, toʻplam raqami va baholar manba maʼlumotlar toʻplamidan aynan olingan — raqam yoki baho qoʻlda yozilmagan." />
      <HadithBrowser
        items={hadiths.map((h) => ({ slug: h.slug, title: h.title, topic: h.category ?? "", collection: h.body.collection, number: h.body.number, abdulBaqi: h.body.abdulBaqi, translation: h.body.translation, narrator: h.body.narrator, grades: h.body.grades, status: h.status }))}
        topics={cats.map((c) => ({ slug: c.slug, title: c.title }))}
        collections={Object.entries(COLLECTIONS).map(([k, v]) => ({ key: k, title: v.title }))}
      />
    </div>
  );
}
