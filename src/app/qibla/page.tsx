import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/card";
import { QiblaCompass } from "@/components/prayer/qibla";

export const metadata: Metadata = { title: "Qibla yoʻnalishi", description: "Joylashuvingizdan Kaʼba yoʻnalishi (qibla) — daraja va qurilma kompasi orqali.", alternates: { canonical: "/qibla" } };

export default function QiblaPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Ibodat" title="Qibla" subtitle="Joylashuvni «Namoz vaqtlari» sahifasida oʻzgartirishingiz mumkin. Hisob-kitob qurilmangizda bajariladi." />
      <QiblaCompass />
    </div>
  );
}
