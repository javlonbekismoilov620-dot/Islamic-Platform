import Link from "next/link";
import { CalendarDays, Clock, Compass, Library, ScrollText, Search } from "lucide-react";
import { DuaIcon, MihrabIcon, QuranIcon, TasbihIcon } from "@/components/ui/icons";

const TOOLS = [
  { href: "/quron", label: "Qurʼon", icon: <QuranIcon size={22} /> },
  { href: "/ibodat/namoz", label: "Namoz darslari", icon: <MihrabIcon size={22} /> },
  { href: "/duolar", label: "Duolar", icon: <DuaIcon size={22} /> },
  { href: "/zikrlar", label: "Zikr", icon: <TasbihIcon size={22} /> },
  { href: "/namoz-vaqtlari", label: "Namoz vaqtlari", icon: <Clock size={22} strokeWidth={1.75} /> },
  { href: "/qibla", label: "Qibla", icon: <Compass size={22} strokeWidth={1.75} /> },
  { href: "/taqvim", label: "Taqvim", icon: <CalendarDays size={22} strokeWidth={1.75} /> },
  { href: "/hadislar", label: "Hadislar", icon: <ScrollText size={22} strokeWidth={1.75} /> },
  { href: "/bilimlar", label: "Bilimlar", icon: <Library size={22} strokeWidth={1.75} /> },
  { href: "/qidiruv", label: "Qidiruv", icon: <Search size={22} strokeWidth={1.75} /> },
];

export function QuickTools() {
  return (
    <nav aria-label="Tezkor vositalar" className="grid grid-cols-5 gap-2 sm:grid-cols-10">
      {TOOLS.map((t) => (
        <Link key={t.href} href={t.href} className="group flex flex-col items-center gap-2 rounded-2xl px-1 py-3 text-center transition-colors hover:bg-sunken">
          <span className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-line bg-surface-strong text-primary shadow-soft transition-transform group-hover:-translate-y-0.5">{t.icon}</span>
          <span className="text-[0.72rem] leading-tight font-medium text-fg-2">{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
