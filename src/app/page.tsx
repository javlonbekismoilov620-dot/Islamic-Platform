import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { listContent, pickDaily } from "@/server/content/repo";
import { getQuranMeta, getVerses } from "@/server/quran";
import { DuaCard, HadithCard, VerseEmbed } from "@/components/content/cards";
import { DhikrInline } from "@/components/content/dhikr-inline";
import { Greeting } from "@/components/home/greeting";
import { PrayerCard } from "@/components/prayer/prayer-card";
import { ContinueCards, DailyChecklist } from "@/components/home/dashboard-widgets";
import { QuickTools } from "@/components/home/quick-tools";
import { SectionHeader } from "@/components/ui/card";

export const dynamic = "force-dynamic";

/** Kun oyati uchun tanlangan oyatlar (matn va tarjima manbadan olinadi). */
const DAILY_VERSES = ["2:152", "2:153", "2:186", "2:286", "3:8", "3:139", "3:190", "13:28", "94:5-6", "65:3", "39:53", "29:45", "20:114", "40:60", "49:13", "2:255", "112:1-4", "103:1-3", "17:23", "4:36", "16:97", "33:41-42", "57:4", "8:2", "14:7", "21:87", "50:16", "62:9", "2:183", "51:56"];

export default async function Home() {
  const now = new Date();
  const [duas, hadiths, dhikrs, lessons, meta] = await Promise.all([listContent("dua"), listContent("hadith"), listContent("dhikr"), listContent("lesson"), getQuranMeta()]);
  const verseRef = pickDaily(DAILY_VERSES, 3, now)!;
  const verse = await getVerses(verseRef);
  const dua = pickDaily(duas.filter((d) => d.body.origin.kind !== "quran"), 7, now);
  const hadith = pickDaily(hadiths, 11, now);
  const dhikr = pickDaily(dhikrs.filter((d) => d.body.kind === "single"), 5, now);

  return (
    <div className="space-y-10">
      <Greeting />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
        <PrayerCard />
        <DailyChecklist />
      </div>

      <QuickTools />

      <section>
        <SectionHeader title="Davom ettirish" subtitle="Oʻqish va oʻrganish jarayoningiz" />
        <ContinueCards lessons={lessons.map((l) => ({ slug: l.slug, title: l.title, order: l.body.order }))} surahs={meta.surahs.map((s) => ({ n: s.n, uz: s.uz, ayahs: s.ayahs }))} />
      </section>

      {verse && (
        <section>
          <SectionHeader title="Kun oyati" subtitle="Har kuni yangi oyat — tasdiqlangan tarjima bilan" />
          <VerseEmbed data={verse} className="!my-0" />
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {hadith && (
          <section>
            <SectionHeader title="Kun hadisi" action={<Link href="/hadislar" className="inline-flex items-center text-sm font-medium text-primary">Barchasi <ChevronRight size={15} /></Link>} />
            <HadithCard hadith={hadith} compact />
          </section>
        )}
        {dua && (
          <section>
            <SectionHeader title="Kun duosi" action={<Link href="/duolar" className="inline-flex items-center text-sm font-medium text-primary">Barchasi <ChevronRight size={15} /></Link>} />
            <DuaCard dua={dua} compact />
          </section>
        )}
      </div>

      {dhikr && (
        <section>
          <SectionHeader title="Kun zikri" action={<Link href="/zikrlar" className="inline-flex items-center text-sm font-medium text-primary">Zikrlar <ChevronRight size={15} /></Link>} />
          <DhikrInline dhikr={dhikr} />
        </section>
      )}
    </div>
  );
}
