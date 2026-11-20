"use client";
import { useEffect, useState } from "react";
import { useNow } from "@/hooks/use-now";
import { useSettings } from "@/lib/store";
import { formatGregorian, formatHijri, toHijri } from "@/lib/hijri";

export function Greeting() {
  const now = useNow(60_000);
  const { settings } = useSettings();
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/me/data", { cache: "no-store" }).then((r) => r.json()).then((j) => j.authenticated && setName(j.user?.displayName || null)).catch(() => {});
  }, []);
  return (
    <header className="animate-in pt-2">
      <p className="text-[0.82rem] font-semibold tracking-[0.08em] text-gold uppercase">Bismillāhir-raḥmānir-raḥīm</p>
      <h1 className="mt-2 text-[2.1rem] leading-[1.1] font-bold tracking-[-0.035em] text-fg sm:text-[2.7rem]">
        Assalomu alaykum{name ? `, ${name}` : ""}
      </h1>
      <p className="mt-2 min-h-[1.5rem] text-[0.98rem] text-fg-2">
        {now ? (
          <>
            {formatGregorian(now)} <span className="text-muted">·</span> <span className="text-primary">{formatHijri(toHijri(now, settings.hijriOffset))}</span>
          </>
        ) : (
          <span className="skeleton inline-block h-4 w-72 align-middle" />
        )}
      </p>
    </header>
  );
}
