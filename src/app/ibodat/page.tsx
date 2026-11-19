import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ChevronRight, Clock, Compass, Droplets, GraduationCap, Waves } from "lucide-react";
import { PageHeader } from "@/components/ui/card";
import { PrayerCard } from "@/components/prayer/prayer-card";
import { MihrabIcon, TasbihIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Ibodat — namoz, tahorat, namoz vaqtlari, qibla",
  description: "Namozni noldan oʻrganish akademiyasi, tahorat va gʻusl darslari, namoz vaqtlari, qibla va hijriy taqvim.",
  alternates: { canonical: "/ibodat" },
};

const CARDS = [
  { href: "/ibodat/namoz", title: "Namoz akademiyasi", text: "8 ta bosqichma-bosqich dars va test — namozni noldan oʻrganing.", icon: <GraduationCap size={22} /> },
  { href: "/ibodat/namoz/tahorat", title: "Tahorat", text: "Hanafiy mazhabidagi 4 farz, sunnatlar va tahoratni buzuvchilar.", icon: <Droplets size={22} /> },
  { href: "/ibodat/namoz/gusl", title: "Gʻusl", text: "Gʻusl qachon farz boʻladi, 3 farzi va toʻgʻri tartibi.", icon: <Waves size={22} /> },
  { href: "/ibodat/namoz/amaliy-namoz", title: "Namoz oʻqish tartibi", text: "Ikki, uch va toʻrt rakaatli namozlar, vitr va juma.", icon: <MihrabIcon size={22} /> },
  { href: "/namoz-vaqtlari", title: "Namoz vaqtlari", text: "Oʻzbekiston shaharlari uchun kunlik va oylik jadval.", icon: <Clock size={22} /> },
  { href: "/qibla", title: "Qibla", text: "Kaʼba yoʻnalishi va qurilma kompasi orqali qibla.", icon: <Compass size={22} /> },
  { href: "/taqvim", title: "Hijriy taqvim", text: "Ramazon, hayitlar va muborak kunlar.", icon: <CalendarDays size={22} /> },
  { href: "/zikrlar/namozdan-keyingi-zikrlar", title: "Namozdan keyingi zikrlar", text: "Tasbeh, tahmid, takbir va duolar ketma-ketligi.", icon: <TasbihIcon size={22} /> },
];

export default function IbodatPage() {
  return (
    <div>
      <PageHeader eyebrow="Ibodat" title="Ibodat" subtitle="Hanafiy mazhabi asosida namoz, tahorat va kundalik ibodatlar uchun kerakli hamma narsa bir joyda." />
      <div className="mb-10"><PrayerCard /></div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="card glass group flex h-full items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">{c.icon}</span>
              <span className="flex-1">
                <span className="block font-semibold text-fg">{c.title}</span>
                <span className="mt-1 block text-sm text-muted">{c.text}</span>
              </span>
              <ChevronRight size={18} className="mt-1 text-muted transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
