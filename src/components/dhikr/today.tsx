"use client";
import { useHydrated, useStore, todayKey } from "@/lib/store";
import { Ring } from "@/components/home/dashboard-widgets";

export function DhikrToday({ titles }: { titles: Record<string, string> }) {
  const [dhikr] = useStore("dhikr");
  const [goals] = useStore("goals");
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const today = dhikr.daily[todayKey()] ?? {};
  const total = Object.values(today).reduce((a, b) => a + b, 0);
  return (
    <section className="card glass mb-10 flex flex-wrap items-center gap-5 p-5">
      <Ring value={total / Math.max(1, goals.dailyDhikr)} size={64} stroke={6}>{total}</Ring>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-fg">Bugungi zikrlar</p>
        <p className="text-sm text-muted">Shaxsiy kunlik maqsad: {goals.dailyDhikr} (profilda oʻzgartiriladi)</p>
        {total > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(today).map(([k, v]) => <span key={k} className="rounded-full bg-sunken px-2.5 py-0.5 text-xs text-fg-2">{titles[k] ?? k}: {v}</span>)}
          </div>
        )}
      </div>
    </section>
  );
}
