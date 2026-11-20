import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/card";
import { PrayerTimesPage } from "@/components/prayer/prayer-times-page";

export const metadata: Metadata = {
  title: "Namoz vaqtlari — Toshkent va Oʻzbekiston shaharlari",
  description: "Oʻzbekiston shaharlari uchun bugungi va oylik namoz vaqtlari: Hanafiy asr, sozlanadigan hisoblash usuli, keyingi namozgacha qolgan vaqt.",
  alternates: { canonical: "/namoz-vaqtlari" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Ibodat" title="Namoz vaqtlari" subtitle="Shaharingizni tanlang yoki joylashuvingizni aniqlang. Hisoblash usuli va asr qavlini oʻzingiz sozlashingiz mumkin." />
      <PrayerTimesPage />
    </div>
  );
}
