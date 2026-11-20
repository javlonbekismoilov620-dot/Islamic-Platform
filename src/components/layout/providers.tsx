"use client";
import { useEffect } from "react";
import { useSettings } from "@/lib/store";
import { Toaster } from "@/components/ui/toast";
import { SyncAgent } from "@/lib/sync";

/** Applies persisted appearance settings to <html> and registers the service worker. */
export function Providers({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const dark = settings.theme === "dark" || (settings.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.dataset.theme = dark ? "dark" : "light";
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0b100e" : "#f6f3ec");
    };
    apply();
    root.style.setProperty("--ar-scale", String(settings.arabicScale));
    root.style.setProperty("--tr-scale", String(settings.translationScale));
    root.dataset.reduceMotion = String(settings.reduceMotion);
    root.dataset.largeText = String(settings.largeText);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [settings.theme, settings.arabicScale, settings.translationScale, settings.reduceMotion, settings.largeText]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
  }, []);

  return (
    <>
      {children}
      <Toaster />
      <SyncAgent />
    </>
  );
}

/** Runs before first paint to avoid a theme flash. Reads the same localStorage key as the store. */
export const themeBootstrap = `(function(){try{var s=JSON.parse(localStorage.getItem('hidoyat:settings')||'{}');var t=s.theme||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.theme=d?'dark':'light';if(s.arabicScale)r.style.setProperty('--ar-scale',s.arabicScale);if(s.translationScale)r.style.setProperty('--tr-scale',s.translationScale);if(s.largeText)r.dataset.largeText='true';if(s.reduceMotion)r.dataset.reduceMotion='true';}catch(e){}})();`;
