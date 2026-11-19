"use client";
import { useEffect, useState } from "react";

/** Har `interval` ms da yangilanadigan joriy vaqt. Hydrationdan keyin ishlaydi (SSR: null). */
export function useNow(interval = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), interval);
    return () => window.clearInterval(id);
  }, [interval]);
  return now;
}
