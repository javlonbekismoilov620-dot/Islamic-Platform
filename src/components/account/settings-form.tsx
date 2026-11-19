"use client";
import Link from "next/link";
import { ChevronRight, Monitor, Moon, Sun } from "lucide-react";
import { useHydrated, useSettings } from "@/lib/store";
import { Segmented, Slider, Switch } from "@/components/ui/controls";
import { renderTranslit } from "@/lib/translit";

function Group({ title, children, desc }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="card glass p-5 sm:p-6">
      <h2 className="font-semibold text-fg">{title}</h2>
      {desc && <p className="mt-0.5 text-sm text-muted">{desc}</p>}
      <div className="mt-4 divide-y divide-line">{children}</div>
    </section>
  );
}

export function SettingsForm() {
  const { settings: s, update } = useSettings();
  const hydrated = useHydrated();
  if (!hydrated) return <div className="skeleton h-96" />;
  return (
    <div className="space-y-6">
      <Group title="Koʻrinish">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <span className="text-[0.95rem] text-fg">Mavzu</span>
          <Segmented label="Mavzu" value={s.theme} onChange={(v) => update({ theme: v })} options={[{ value: "light", label: <span className="inline-flex items-center gap-1.5"><Sun size={14} /> Yorugʻ</span> }, { value: "dark", label: <span className="inline-flex items-center gap-1.5"><Moon size={14} /> Tungi</span> }, { value: "system", label: <span className="inline-flex items-center gap-1.5"><Monitor size={14} /> Tizim</span> }]} />
        </div>
        <Switch checked={s.largeText} onChange={(v) => update({ largeText: v })} label="Kattaroq matn" description="Butun sayt matnini kattalashtiradi" />
        <Switch checked={s.reduceMotion} onChange={(v) => update({ reduceMotion: v })} label="Animatsiyalarni kamaytirish" description="Harakatga sezgir foydalanuvchilar uchun" />
      </Group>

      <Group title="Arabcha matn va tarjima">
        <div className="py-3"><Slider label="Arabcha matn oʻlchami" value={s.arabicScale} min={0.8} max={1.8} step={0.05} onChange={(v) => update({ arabicScale: v })} format={(v) => `${Math.round(v * 100)}%`} /></div>
        <p lang="ar" dir="rtl" className="ar-quran py-2 text-fg">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        <div className="py-3"><Slider label="Tarjima matni oʻlchami" value={s.translationScale} min={0.85} max={1.5} step={0.05} onChange={(v) => update({ translationScale: v })} format={(v) => `${Math.round(v * 100)}%`} /></div>
        <label className="flex flex-wrap items-center justify-between gap-3 py-3">
          <span className="text-[0.95rem] text-fg">Qurʼon tarjimasi</span>
          <select value={s.translation} onChange={(e) => update({ translation: e.target.value as never })} className="h-10 rounded-xl border border-line bg-surface-solid px-3 text-sm text-fg">
            <option value="sodiq">Muhammad Sodiq Muhammad Yusuf</option>
            <option value="mansur">Alouddin Mansur</option>
            <option value="ruvvod">Ruvvod tarjima markazi</option>
          </select>
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <span className="text-[0.95rem] text-fg">Tarjima yozuvi</span>
          <Segmented label="Tarjima yozuvi" value={s.translationScript} onChange={(v) => update({ translationScript: v })} options={[{ value: "lotin", label: "Lotin" }, { value: "kirill", label: "Kirill (asl nashr)" }]} />
        </div>
      </Group>

      <Group title="Transliteratsiya (lotin yozuvidagi talaffuz)" desc="Duolar va zikrlarning arabcha talaffuzi">
        <Switch checked={s.showTranslit} onChange={(v) => update({ showTranslit: v })} label="Transliteratsiyani koʻrsatish" />
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <span>
            <span className="block text-[0.95rem] text-fg">Yozuv turi</span>
            <span className="text-sm text-muted">Namuna: {renderTranslit("Subḥānaka-llāhumma wa biḥamdik", s.translitMode)}</span>
          </span>
          <Segmented label="Transliteratsiya turi" value={s.translitMode} onChange={(v) => update({ translitMode: v })} options={[{ value: "aniq", label: "Aniq" }, { value: "oddiy", label: "Oddiy" }]} />
        </div>
        <Link href="/talaffuz" className="flex items-center justify-between py-3 text-sm font-medium text-primary">Talaffuz qoʻllanmasi <ChevronRight size={16} /></Link>
      </Group>

      <Group title="Zikr hisoblagichi">
        <Switch checked={s.haptics} onChange={(v) => update({ haptics: v })} label="Tebranish" description="Qoʻllab-quvvatlanadigan qurilmalarda (Android)" />
        <Switch checked={s.sound} onChange={(v) => update({ sound: v })} label="Ovozli signal" />
      </Group>

      <Group title="Namoz vaqtlari va taqvim">
        <Link href="/namoz-vaqtlari" className="flex items-center justify-between py-3 text-[0.95rem] text-fg">Shahar, hisoblash usuli va eslatmalar <ChevronRight size={16} className="text-muted" /></Link>
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <span className="text-[0.95rem] text-fg">Hijriy sanaga tuzatish</span>
          <Segmented label="Hijriy tuzatish" value={String(s.hijriOffset) as "0"} onChange={(v) => update({ hijriOffset: Number(v) })} options={["-2", "-1", "0", "1", "2"].map((v) => ({ value: v as "0", label: Number(v) > 0 ? `+${v}` : v }))} size="sm" />
        </div>
      </Group>
    </div>
  );
}
