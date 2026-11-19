"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, BookmarkCheck, Copy, Pause, Play, Repeat, Settings2, Share2, SkipForward, StickyNote, X } from "lucide-react";
import { useHydrated, useSettings, useStore, setStore, toggleInList, todayKey } from "@/lib/store";
import { cyrToLat } from "@/lib/uz-script";
import { RECITERS, ayahAudioUrl } from "@/lib/reciters";
import { Dialog, Segmented, Slider, Switch } from "@/components/ui/controls";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

type Tr = { ayahs: string[]; notes: Record<string, string> };
type Ctx = {
  surah: number;
  surahName: string;
  total: number;
  tr: Tr | null;
  trKey: string;
  playing: number | null;
  play: (a: number, mode?: "single" | "continuous") => void;
  stop: () => void;
  repeat: number;
  setRepeat: (n: number) => void;
};
const ReaderCtx = createContext<Ctx | null>(null);
const useReader = () => useContext(ReaderCtx)!;

export type TranslationOption = { key: string; titleUz: string; version: string };

export function ReaderProvider({ surah, surahName, total, defaultTr, children }: { surah: number; surahName: string; total: number; defaultTr: Tr; children: React.ReactNode }) {
  const { settings } = useSettings();
  const hydrated = useHydrated();
  const trKey = hydrated ? settings.translation : "sodiq";
  const [alt, setAlt] = useState<Record<string, Tr>>({});
  useEffect(() => {
    if (trKey === "sodiq" || alt[trKey]) return;
    fetch(`/quran/tr/${trKey}/${surah}.json`).then((r) => r.json()).then((j: Tr) => setAlt((a) => ({ ...a, [trKey]: j }))).catch(() => toast("Tarjimani yuklab boʻlmadi", "error"));
  }, [trKey, surah, alt]);
  const tr = trKey === "sodiq" ? defaultTr : alt[trKey] ?? null;

  // Audio
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [repeat, setRepeat] = useState(1);
  const mode = useRef<"single" | "continuous">("single");
  const left = useRef(1);

  const stop = useCallback(() => {
    audio.current?.pause();
    setPlaying(null);
  }, []);

  const play = useCallback((a: number, m: "single" | "continuous" = "single") => {
    if (!audio.current) audio.current = new Audio();
    const el = audio.current;
    mode.current = m;
    left.current = repeat;
    el.src = ayahAudioUrl(settings.reciter, surah, a);
    el.play().then(() => setPlaying(a)).catch(() => { toast("Audioni ijro etib boʻlmadi. Internet aloqasini tekshiring.", "error"); setPlaying(null); });
    setPlaying(a);
    document.getElementById(`oyat-${a}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [repeat, settings.reciter, surah]);

  useEffect(() => {
    if (!audio.current) audio.current = new Audio();
    const el = audio.current;
    const onEnded = () => {
      setPlaying((cur) => {
        if (cur == null) return null;
        if (left.current > 1 || repeat === 0) {
          left.current -= 1;
          el.currentTime = 0;
          el.play().catch(() => {});
          return cur;
        }
        if (mode.current === "continuous" && cur < total) {
          const nxt = cur + 1;
          left.current = repeat;
          el.src = ayahAudioUrl(settings.reciter, surah, nxt);
          el.play().catch(() => {});
          document.getElementById(`oyat-${nxt}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          return nxt;
        }
        return null;
      });
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, [repeat, settings.reciter, surah, total]);
  useEffect(() => () => audio.current?.pause(), []);

  const value = useMemo(() => ({ surah, surahName, total, tr, trKey, playing, play, stop, repeat, setRepeat }), [surah, surahName, total, tr, trKey, playing, play, stop, repeat]);
  return <ReaderCtx.Provider value={value}>{children}<ProgressTracker /></ReaderCtx.Provider>;
}

/** Koʻrinib turgan oyatlarni kuzatib, oxirgi oʻqilgan joy va progressni saqlaydi. */
function ProgressTracker() {
  const { surah } = useReader();
  useEffect(() => {
    const seen = new Set<number>();
    let timer: number | undefined;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) seen.add(Number((e.target as HTMLElement).dataset.ayah));
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!seen.size) return;
        const max = Math.max(...seen);
        const day = todayKey();
        setStore("lastRead", { surah, ayah: max, at: Date.now() });
        setStore("quranProgress", (p) => {
          const prev = p.maxAyah[String(surah)] ?? 0;
          const gained = Math.max(0, max - prev);
          return { maxAyah: { ...p.maxAyah, [String(surah)]: Math.max(prev, max) }, daily: { ...p.daily, [day]: (p.daily[day] ?? 0) + gained } };
        });
      }, 1200);
    }, { rootMargin: "0px 0px -40% 0px", threshold: 0.6 });
    document.querySelectorAll<HTMLElement>("[data-ayah]").forEach((el) => io.observe(el));
    return () => { io.disconnect(); window.clearTimeout(timer); };
  }, [surah]);
  return null;
}

export function VerseTranslation({ a }: { a: number }) {
  const { tr } = useReader();
  const { settings } = useSettings();
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  if (hydrated && !settings.showTranslation) return null;
  if (!tr) return <div className="skeleton mt-3 h-5 w-3/4" />;
  const text = tr.ayahs[a - 1] ?? "";
  const note = tr.notes?.[String(a)];
  const kir = hydrated && settings.translationScript === "kirill";
  const show = (s: string) => (kir ? s : cyrToLat(s));
  return (
    <div className="mt-3">
      <p lang={kir ? "uz-Cyrl" : "uz-Latn"} className="translation-text text-fg">{show(text)}</p>
      {note && (hydrated && settings.showFootnotes ? (
        <p className="mt-2 rounded-xl bg-sunken px-3 py-2 text-sm leading-relaxed text-fg-2">{show(note)}</p>
      ) : (
        <button type="button" onClick={() => setOpen((o) => !o)} className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-gold">
          <StickyNote size={13} /> {open ? "Izohni yashirish" : "Tarjimon izohi"}
        </button>
      ))}
      {note && open && !(hydrated && settings.showFootnotes) && <p className="mt-2 rounded-xl bg-sunken px-3 py-2 text-sm leading-relaxed text-fg-2">{show(note)}</p>}
    </div>
  );
}

export function VerseActions({ a, arabic }: { a: number; arabic: string }) {
  const { surah, surahName, tr, playing, play, stop } = useReader();
  const [bm, setBm] = useStore("bookmarks");
  const hydrated = useHydrated();
  const id = `${surah}:${a}`;
  const saved = hydrated && bm.ayahs.includes(id);
  const isPlaying = playing === a;
  const text = () => `${arabic}\n\n${tr ? cyrToLat(tr.ayahs[a - 1]) : ""}\n\n— ${surahName} surasi, ${a}-oyat`;
  const btn = "inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-fg";
  return (
    <div className="flex items-center gap-0.5">
      <button type="button" className={cn(btn, isPlaying && "bg-primary-soft text-primary")} aria-label={isPlaying ? "Toʻxtatish" : "Tinglash"} onClick={() => (isPlaying ? stop() : play(a))}>
        {isPlaying ? <Pause size={17} /> : <Play size={17} />}
      </button>
      <button type="button" className={cn(btn, saved && "text-gold")} aria-pressed={saved} aria-label="Oyatni saqlash" onClick={() => { setBm((b) => ({ ...b, ayahs: toggleInList(b.ayahs, id) })); toast(saved ? "Saqlanganlardan olib tashlandi" : "Oyat saqlandi", saved ? "info" : "success"); }}>
        {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
      </button>
      <button type="button" className={btn} aria-label="Nusxa olish" onClick={() => navigator.clipboard.writeText(text()).then(() => toast("Nusxa olindi"), () => toast("Nusxa olib boʻlmadi", "error"))}>
        <Copy size={16} />
      </button>
      <button
        type="button"
        className={btn}
        aria-label="Ulashish"
        onClick={async () => {
          const url = `${location.origin}/quron/${surah}#oyat-${a}`;
          try {
            if (navigator.share) await navigator.share({ title: `${surahName}, ${a}-oyat`, text: text(), url });
            else { await navigator.clipboard.writeText(`${text()}\n${url}`); toast("Havola nusxalandi"); }
          } catch { /* bekor qilindi */ }
        }}
      >
        <Share2 size={16} />
      </button>
    </div>
  );
}

export function ReaderToolbar({ translations, hasTranslit }: { translations: TranslationOption[]; hasTranslit: boolean }) {
  const { settings, update } = useSettings();
  const { playing, play, stop, repeat, setRepeat } = useReader();
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-strong sticky top-[calc(var(--nav-h)+20px)] z-30 mb-8 flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-2">
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => (playing ? stop() : play(1, "continuous"))} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-on-primary">
          {playing ? <Pause size={16} /> : <Play size={16} />} {playing ? `${playing}-oyat` : "Surani tinglash"}
        </button>
        {playing && (
          <button type="button" aria-label="Keyingi oyat" onClick={() => play(playing + 1, "continuous")} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-fg-2 hover:bg-sunken">
            <SkipForward size={17} />
          </button>
        )}
        <button
          type="button"
          onClick={() => setRepeat(repeat === 1 ? 3 : repeat === 3 ? 5 : repeat === 5 ? 0 : 1)}
          aria-label="Oyatni takrorlash"
          className={cn("inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm", repeat !== 1 ? "bg-primary-soft text-primary" : "text-fg-2 hover:bg-sunken")}
        >
          <Repeat size={16} /> {repeat === 0 ? "∞" : `×${repeat}`}
        </button>
      </div>
      <button type="button" onClick={() => setOpen(true)} aria-label="Oʻqish sozlamalari" className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-fg-2 hover:bg-sunken">
        <Settings2 size={17} /> <span className="hidden sm:inline">Oʻqish sozlamalari</span>
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Oʻqish sozlamalari" footer={<button type="button" onClick={() => setOpen(false)} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-on-primary"><X size={15} /> Yopish</button>}>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-fg">Tarjima</p>
            <div className="space-y-1.5">
              {translations.map((t) => (
                <label key={t.key} className={cn("flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-sm", settings.translation === t.key ? "border-primary bg-primary-soft text-fg" : "border-line")}>
                  <span>{t.titleUz} <span className="text-muted">v{t.version}</span></span>
                  <input type="radio" name="tr" className="accent-[var(--primary)]" checked={settings.translation === t.key} onChange={() => update({ translation: t.key as never })} />
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-fg">Tarjima yozuvi</p>
            <Segmented label="Tarjima yozuvi" value={settings.translationScript} onChange={(v) => update({ translationScript: v })} options={[{ value: "lotin", label: "Lotin" }, { value: "kirill", label: "Kirill (asl nashr)" }]} />
            <p className="mt-1.5 text-xs leading-relaxed text-muted">Tarjimalarning asl nashri kirill yozuvida. Lotin koʻrinishi harfma-harf avtomatik oʻgirilgan; matn mazmuni oʻzgarmaydi.</p>
          </div>
          <Slider label="Arabcha matn oʻlchami" value={settings.arabicScale} min={0.8} max={1.8} step={0.05} onChange={(v) => update({ arabicScale: v })} format={(v) => `${Math.round(v * 100)}%`} />
          <Slider label="Tarjima matni oʻlchami" value={settings.translationScale} min={0.85} max={1.5} step={0.05} onChange={(v) => update({ translationScale: v })} format={(v) => `${Math.round(v * 100)}%`} />
          <div className="divide-y divide-line">
            <Switch checked={settings.showTranslation} onChange={(v) => update({ showTranslation: v })} label="Tarjimani koʻrsatish" />
            <Switch checked={settings.showFootnotes} onChange={(v) => update({ showFootnotes: v })} label="Tarjimon izohlarini doim ochiq koʻrsatish" />
            {hasTranslit && <Switch checked={settings.showTranslit} onChange={(v) => update({ showTranslit: v })} label="Transliteratsiyani koʻrsatish" description="Faqat namozda koʻp oʻqiladigan suralar uchun" />}
          </div>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-fg">Qori</span>
            <select value={settings.reciter} onChange={(e) => update({ reciter: e.target.value })} className="h-11 w-full rounded-xl border border-line bg-surface-solid px-3 text-fg">
              {RECITERS.map((r) => <option key={r.key} value={r.key}>{r.name}</option>)}
            </select>
            <span className="mt-1.5 block text-xs text-muted">Tilovatlar EveryAyah.com saytidan oqim sifatida tinglanadi.</span>
          </label>
        </div>
      </Dialog>
    </div>
  );
}

export function PlayingHighlight({ a, children }: { a: number; children: React.ReactNode }) {
  const { playing } = useReader();
  return <div className={cn("rounded-3xl transition-colors duration-500", playing === a && "bg-primary-soft")}>{children}</div>;
}
