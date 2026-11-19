import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/card";
import { DhikrHistory } from "@/components/dhikr/history";

export const metadata: Metadata = { title: "Zikrlar tarixi", robots: { index: false } };

export default function DhikrHistoryPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Zikrlar" title="Zikrlar tarixi" subtitle="Saqlangan zikr seanslaringiz va kunlik natijalaringiz. Maʼlumotlar qurilmangizda (hisobga kirsangiz, hisobingizda ham) saqlanadi." />
      <DhikrHistory />
    </div>
  );
}
