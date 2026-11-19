import type { Metadata } from "next";
import { getQuranMeta } from "@/server/quran";
import { PageHeader } from "@/components/ui/card";
import { SurahList } from "@/components/quran/surah-list";
import { QuranContinue } from "@/components/quran/quran-continue";

export const metadata: Metadata = {
  title: "Qurʼoni karim — 114 sura, arabcha matn va oʻzbekcha tarjima",
  description: "Qurʼoni karimning Tanzil Uthmani matni va Shayx Muhammad Sodiq Muhammad Yusuf, Alouddin Mansur hamda Ruvvod markazi oʻzbekcha tarjimalari.",
  alternates: { canonical: "/quron" },
};

export default async function QuranPage() {
  const meta = await getQuranMeta();
  const juzOf = (n: number) => {
    let j = 1;
    meta.juz.forEach((ref, i) => {
      const [s] = ref.split(":").map(Number);
      if (s <= n) j = i + 1;
    });
    return j;
  };
  return (
    <div>
      <PageHeader eyebrow="Qurʼoni karim" title="Qurʼon" subtitle="Tanzil loyihasining tekshirilgan Uthmani matni va QuranEnc nashr etgan oʻzbekcha tarjimalar. Matnlar oʻzgartirilmagan, manbasi va versiyasi koʻrsatilgan." />
      <QuranContinue surahs={meta.surahs.map((s) => ({ n: s.n, uz: s.uz }))} />
      <SurahList surahs={meta.surahs.map((s) => ({ n: s.n, ar: s.ar, uz: s.uz, meaning: s.meaning, type: s.type, ayahs: s.ayahs, juz: juzOf(s.n) }))} />
    </div>
  );
}
