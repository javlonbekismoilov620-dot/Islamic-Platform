"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, Info, RotateCcw, Vibrate, Volume2, VolumeX } from "lucide-react";
import { useHydrated, useSettings, useStore, setStore, todayKey } from "@/lib/store";
import { renderTranslit } from "@/lib/translit";
import { Dialog } from "@/components/ui/controls";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

export type CounterStep = { title: string; arabic: string; translit: string; meaning: string; count: number | null };

type Props = { slug: string; title: string; steps: CounterStep[]; targetNote: string; targetBasis: "hadith" | "optional"; isSet: boolean };

const LIVE_KEY = "hidoyat:dhikr-live";
type Live = { slug: string; step: number; count: number; startedAt: number };

function readLive(slug: string): Live | null {
  try {
    const l = JSON.parse(localStorage.getItem(LIVE_KEY) || "null") as Live | null;
    return l && l.slug === slug ? l : null;
  } catch {
    return null;
  }
}

let audioCtx: AudioContext | null = null;
function tick(done = false) {
  try {
    audioCtx ??= new AudioContext();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = done ? 880 : 520;
    g.gain.setValueAtTime(0.06, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (done ? 0.25 : 0.06));
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + (done ? 0.25 : 0.06));
  } catch { /* audio not available */ }
}

export function DhikrCounter({ slug, title, steps, targetNote, targetBasis, isSet }: Props) {
  const { settings, update } = useSettings();
  const hydrated = useHydrated();
  const [dhikr] = useStore("dhikr");
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const [customTarget, setCustomTarget] = useState<number | null | undefined>(undefined);
  const [confirmReset, setConfirmReset] = useState(false);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(Date.now());
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const live = readLive(slug);
    if (live) { setStep(live.step); setCount(live.count); startedAt.current = live.startedAt; }
  }, [slug]);
  useEffect(() => {
    try { localStorage.setItem(LIVE_KEY, JSON.stringify({ slug, step, count, startedAt: startedAt.current } satisfies Live)); } catch { /* ignore */ }
  }, [slug, step, count]);

  const cur = steps[Math.min(step, steps.length - 1)];
  const target = isSet ? cur.count : customTarget === undefined ? cur.count : customTarget;
  const day = todayKey();
  const todayTotal = hydrated ? dhikr.daily[day]?.[slug] ?? 0 : 0;

  const save = useCallback((finalCount: number) => {
    if (finalCount <= 0) return;
    const now = Date.now();
    setStore("dhikr", (d) => ({
      ...d,
      sessions: [{ id: `${now}-${Math.random().toString(36).slice(2, 7)}`, slug, title, count: finalCount, target: isSet ? steps.reduce((s, x) => s + (x.count ?? 0), 0) : target ?? null, startedAt: startedAt.current, endedAt: now }, ...d.sessions].slice(0, 500),
      daily: { ...d.daily, [day]: { ...(d.daily[day] ?? {}), [slug]: (d.daily[day]?.[slug] ?? 0) + finalCount } },
    }));
  }, [day, isSet, slug, steps, target, title]);

  const totalDoneInSet = useMemo(() => steps.slice(0, step).reduce((s, x) => s + (x.count ?? 0), 0) + count, [steps, step, count]);

  const increment = useCallback(() => {
    if (finished) return;
    const next = count + 1;
    const reached = target != null && next >= target;
    if (settings.haptics && "vibrate" in navigator) navigator.vibrate(reached ? [30, 40, 30] : 12);
    if (settings.sound) tick(reached);
    if (isSet && reached) {
      if (step < steps.length - 1) {
        setStep(step + 1);
        setCount(0);
        toast(`${cur.title} — bajarildi`);
      } else {
        setCount(next);
        setFinished(true);
        save(totalDoneInSet + 1);
        toast("Toʻplam yakunlandi. Alloh qabul qilsin!");
      }
      return;
    }
    setCount(next);
    if (reached && next === target) toast("Maqsadga yetdingiz. Alloh qabul qilsin!");
  }, [count, cur.title, finished, isSet, save, settings.haptics, settings.sound, step, steps.length, target, totalDoneInSet]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && document.activeElement === document.body) { e.preventDefault(); increment(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [increment]);

  const finishSingle = () => {
    save(count);
    toast(`${count} marta saqlandi`);
    setCount(0);
    startedAt.current = Date.now();
  };
  const reset = () => {
    setCount(0); setStep(0); setFinished(false); startedAt.current = Date.now(); setConfirmReset(false);
  };

  const pct = target ? Math.min(1, count / target) : 0;
  const R = 118, C = 2 * Math.PI * R;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-5 flex items-center justify-between">
        <Link href="/zikrlar" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft size={16} /> Zikrlar</Link>
        <div className="flex items-center gap-1">
          <button type="button" aria-pressed={settings.haptics} aria-label="Tebranish" onClick={() => update({ haptics: !settings.haptics })} className={cn("rounded-full p-2.5", settings.haptics ? "text-primary" : "text-muted")}><Vibrate size={18} /></button>
          <button type="button" aria-pressed={settings.sound} aria-label="Ovoz" onClick={() => update({ sound: !settings.sound })} className={cn("rounded-full p-2.5", settings.sound ? "text-primary" : "text-muted")}>{settings.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>
          <button type="button" aria-label="Qaytadan boshlash" onClick={() => setConfirmReset(true)} className="rounded-full p-2.5 text-muted hover:text-fg"><RotateCcw size={18} /></button>
        </div>
      </div>

      {isSet && (
        <ol className="no-scrollbar mb-5 flex gap-1.5 overflow-x-auto" aria-label="Toʻplam bosqichlari">
          {steps.map((s, i) => (
            <li key={i} className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-medium", i < step || finished ? "bg-primary text-on-primary" : i === step ? "bg-primary-soft text-primary" : "bg-sunken text-muted")}>
              {i < step || finished ? <Check size={12} className="-mt-0.5 mr-1 inline" /> : null}{s.title.length > 18 ? s.title.slice(0, 17) + "…" : s.title} ×{s.count}
            </li>
          ))}
        </ol>
      )}

      <div className={cn("text-center", cur.arabic.length > 140 && "max-h-[34vh] overflow-y-auto rounded-2xl bg-sunken px-4 py-3 [mask-image:linear-gradient(to_bottom,black_85%,transparent)]")}>
        <h1 className="text-xl font-semibold text-fg">{cur.title}</h1>
        <p lang="ar" dir="rtl" className="ar-text mx-auto mt-3 max-w-lg !text-center text-fg" style={{ textAlign: "center", fontSize: cur.arabic.length > 120 ? "1.25rem" : undefined }}>{cur.arabic}</p>
        {settings.showTranslit && <p className="translit mt-1 whitespace-pre-line">{renderTranslit(cur.translit, hydrated ? settings.translitMode : "aniq")}</p>}
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-2">{cur.meaning}</p>
      </div>

      <button
        ref={btnRef}
        type="button"
        onClick={increment}
        aria-label={`Sanash. Hozir ${count}${target ? `, maqsad ${target}` : ""}`}
        className="group relative mx-auto mt-8 flex aspect-square w-[min(80vw,19rem)] items-center justify-center rounded-full select-none focus-visible:outline-offset-8 active:scale-[0.985] [touch-action:manipulation] [-webkit-tap-highlight-color:transparent]"
      >
        <svg viewBox="0 0 260 260" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="130" cy="130" r={R} fill="none" stroke="var(--border-strong)" strokeWidth="6" />
          {target ? <circle cx="130" cy="130" r={R} fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset .25s ease" }} /> : null}
        </svg>
        <span className="hero absolute inset-5 rounded-full shadow-float transition-transform group-active:scale-[0.97]" />
        <span className="relative flex flex-col items-center text-[var(--hero-text)]">
          <span className="text-[4.2rem] leading-none font-semibold tracking-[-0.04em] tabular-nums">{count}</span>
          <span className="mt-2 text-sm opacity-80">{target ? `/ ${target}` : "cheksiz"}</span>
        </span>
      </button>
      <p className="mt-4 text-center text-xs text-muted">Doira ustiga bosing yoki «Boʻsh joy» tugmasini bosing</p>

      {!isSet && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
          {[cur.count, 33, 99, 100, 1000, null].filter((v, i, a) => a.indexOf(v) === i).map((v) => (
            <button key={String(v)} type="button" onClick={() => setCustomTarget(v)} className={cn("rounded-full px-3.5 py-1.5 text-sm", target === v ? "bg-primary text-on-primary" : "bg-sunken text-fg-2 hover:text-fg")}>
              {v === null ? "Cheksiz" : v}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-sunken px-4 py-3 text-sm text-fg-2">
        <Info size={16} className="mt-0.5 shrink-0 text-info" />
        <p><span className="font-medium text-fg">{targetBasis === "hadith" ? "Hadisda kelgan son. " : "Ixtiyoriy maqsad. "}</span>{targetNote}</p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Bugun: <span className="font-semibold text-fg tabular-nums">{todayTotal}</span> marta</p>
        {!isSet && <Button variant="soft" size="sm" onClick={finishSingle} disabled={count === 0}><Check size={15} /> Saqlash va yakunlash</Button>}
        {isSet && finished && <Button variant="soft" size="sm" onClick={reset}><RotateCcw size={15} /> Qaytadan</Button>}
      </div>

      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)} title="Hisobni nolga tushirasizmi?" footer={<><Button variant="ghost" onClick={() => setConfirmReset(false)}>Bekor qilish</Button><Button variant="danger" onClick={reset}>Nolga tushirish</Button></>}>
        Joriy hisob ({count}) saqlanmaydi. Saqlab qoʻymoqchi boʻlsangiz, avval «Saqlash va yakunlash» tugmasini bosing.
      </Dialog>
    </div>
  );
}
