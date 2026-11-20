"use client";
import Link from "next/link";
import { useState } from "react";
import { History, Trash2 } from "lucide-react";
import { useHydrated, useStore } from "@/lib/store";
import { Dialog, EmptyState } from "@/components/ui/controls";
import { Button, LinkButton } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const fmt = (t: number) => new Intl.DateTimeFormat("uz-UZ", { timeZone: "Asia/Tashkent", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t));

export function DhikrHistory() {
  const [dhikr, setDhikr] = useStore("dhikr");
  const hydrated = useHydrated();
  const [confirm, setConfirm] = useState(false);
  if (!hydrated) return <div className="skeleton h-40" />;
  const days = Object.entries(dhikr.daily).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14);
  if (!dhikr.sessions.length && !days.length)
    return <EmptyState icon={<History size={22} />} title="Hali saqlangan zikr yoʻq" text="Zikr hisoblagichida «Saqlash» tugmasini bossangiz, natijalar shu yerda koʻrinadi." action={<LinkButton href="/zikrlar">Zikr qilish</LinkButton>} />;
  const max = Math.max(1, ...days.map(([, v]) => Object.values(v).reduce((a, b) => a + b, 0)));
  return (
    <div className="space-y-8">
      <section className="card glass p-5">
        <p className="mb-4 font-semibold text-fg">Soʻnggi 14 kun</p>
        <div className="flex h-36 items-end gap-1.5">
          {days.slice().reverse().map(([d, v]) => {
            const t = Object.values(v).reduce((a, b) => a + b, 0);
            return (
              <div key={d} className="flex flex-1 flex-col items-center gap-1" title={`${d}: ${t}`}>
                <span className="text-[0.65rem] text-muted tabular-nums">{t}</span>
                <span className="w-full rounded-t-lg bg-primary" style={{ height: `${Math.max(4, (t / max) * 100)}px` }} />
                <span className="text-[0.6rem] text-muted">{d.slice(8)}</span>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-fg">Seanslar</p>
          <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}><Trash2 size={15} /> Tarixni tozalash</Button>
        </div>
        <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
          {dhikr.sessions.slice(0, 100).map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <span>
                <Link href={`/zikrlar/${s.slug}`} className="font-medium text-fg hover:text-primary">{s.title}</Link>
                <span className="block text-xs text-muted">{fmt(s.endedAt)}</span>
              </span>
              <span className="text-sm font-semibold text-fg tabular-nums">{s.count}{s.target ? <span className="font-normal text-muted"> / {s.target}</span> : null}</span>
            </li>
          ))}
        </ul>
      </section>
      <Dialog open={confirm} onClose={() => setConfirm(false)} title="Zikrlar tarixini tozalaysizmi?" footer={<><Button variant="ghost" onClick={() => setConfirm(false)}>Bekor qilish</Button><Button variant="danger" onClick={() => { setDhikr((d) => ({ ...d, sessions: [], daily: {} })); setConfirm(false); toast("Tarix tozalandi"); }}>Tozalash</Button></>}>
        Barcha saqlangan seanslar va kunlik natijalar oʻchiriladi. Bu amalni qaytarib boʻlmaydi.
      </Dialog>
    </div>
  );
}
