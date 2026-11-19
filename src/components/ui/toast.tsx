"use client";
import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

type ToastItem = { id: number; text: string; tone: "success" | "info" | "error" };
let counter = 0;
const EVENT = "hidoyat:toast";

export function toast(text: string, tone: ToastItem["tone"] = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { id: ++counter, text, tone } }));
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => {
    const onToast = (e: Event) => {
      const item = (e as CustomEvent<ToastItem>).detail;
      setItems((xs) => [...xs.slice(-2), item]);
      window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== item.id)), 2600);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--tab-h)+env(safe-area-inset-bottom)+12px)] z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-8">
      {items.map((t) => (
        <div key={t.id} className="animate-in glass-strong pointer-events-auto flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium text-fg">
          {t.tone === "success" ? <CircleCheck size={18} className="text-success" /> : t.tone === "error" ? <TriangleAlert size={18} className="text-danger" /> : <Info size={18} className="text-info" />}
          {t.text}
        </div>
      ))}
    </div>
  );
}
