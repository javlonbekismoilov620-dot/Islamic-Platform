"use client";
import Link from "next/link";
import { BookOpen, Check, ChevronRight, GraduationCap } from "lucide-react";
import { useHydrated, useStore, todayKey } from "@/lib/store";
import { cn } from "@/lib/cn";

export type LessonLite = { slug: string; title: string; order: number };
export type SurahLite = { n: number; uz: string; ayahs: number };

export function Ring({ value, size = 56, stroke = 5, children }: { value: number; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, v = Math.max(0, Math.min(1, value));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-strong)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--primary)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v)} style={{ transition: "stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)" }} />
      </svg>
      <span className="absolute text-[0.78rem] font-semibold text-fg tabular-nums">{children}</span>
    </div>
  );
}

export function ContinueCards({ lessons, surahs }: { lessons: LessonLite[]; surahs: SurahLite[] }) {
  const [lastRead] = useStore("lastRead");
  const [learning] = useStore("learning");
  const [qp] = useStore("quranProgress");
  const hydrated = useHydrated();
  const total = 6236;
  const read = hydrated ? Object.entries(qp.maxAyah).reduce((s, [, v]) => s + v, 0) : 0;
  const done = hydrated ? learning.completed.length : 0;
  const next = lessons.find((l) => !learning.completed.includes(l.slug)) ?? lessons[0];
  const lr = hydrated && lastRead ? surahs.find((s) => s.n === lastRead.surah) : null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Link href={lr ? `/quron/${lr.n}#oyat-${lastRead!.ayah}` : "/quron"} className="card glass group flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5">
        <Ring value={read / total}>{Math.round((read / total) * 100)}%</Ring>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm text-muted"><BookOpen size={15} /> Qurʼon</p>
          <p className="mt-0.5 truncate font-semibold text-fg">{lr ? `${lr.uz} surasi, ${lastRead!.ayah}-oyat` : "Oʻqishni boshlang"}</p>
          <p className="text-xs text-muted">{lr ? "Davom ettirish" : "114 sura, tasdiqlangan tarjima bilan"}</p>
        </div>
        <ChevronRight size={18} className="text-muted transition-transform group-hover:translate-x-0.5" />
      </Link>
      <Link href={next ? `/ibodat/namoz/${next.slug}` : "/ibodat/namoz"} className="card glass group flex items-center gap-4 p-5 transition-transform hover:-translate-y-0.5">
        <Ring value={done / Math.max(1, lessons.length)}>{done}/{lessons.length}</Ring>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm text-muted"><GraduationCap size={15} /> Namoz akademiyasi</p>
          <p className="mt-0.5 truncate font-semibold text-fg">{done >= lessons.length ? "Barcha darslar tugallandi" : `${next?.order}-dars: ${next?.title}`}</p>
          <p className="text-xs text-muted">{done ? "Davom ettirish" : "Noldan boshlab oʻrganing"}</p>
        </div>
        <ChevronRight size={18} className="text-muted transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

const ITEMS = [
  { key: "fajr", label: "Bomdod" },
  { key: "dhuhr", label: "Peshin" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Shom" },
  { key: "isha", label: "Xufton" },
  { key: "witr", label: "Vitr" },
  { key: "quran", label: "Qurʼon tilovati" },
  { key: "adhkar", label: "Ertalabki/kechki zikr" },
];

export function DailyChecklist() {
  const [list, setList] = useStore("checklist");
  const hydrated = useHydrated();
  const day = todayKey();
  const today = hydrated ? list[day] ?? {} : {};
  const count = ITEMS.filter((i) => today[i.key]).length;
  return (
    <section className="card glass p-5 sm:p-6" aria-labelledby="cl-title">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 id="cl-title" className="font-semibold text-fg">Bugungi amallar</h2>
          <p className="text-sm text-muted">Shaxsiy belgilaringiz faqat sizga koʻrinadi</p>
        </div>
        <Ring value={count / ITEMS.length} size={48} stroke={4}>{count}</Ring>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {ITEMS.map((i) => {
          const on = !!today[i.key];
          return (
            <li key={i.key}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setList((l) => ({ ...l, [day]: { ...(l[day] ?? {}), [i.key]: !on } }))}
                className={cn("flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors", on ? "bg-primary-soft text-primary" : "bg-sunken text-fg-2 hover:text-fg")}
              >
                <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors", on ? "border-primary bg-primary text-on-primary" : "border-line-strong")}>
                  {on && <Check size={13} strokeWidth={3} />}
                </span>
                {i.label}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
