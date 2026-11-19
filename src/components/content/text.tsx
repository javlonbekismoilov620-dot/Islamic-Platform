"use client";
import { useSettings, useHydrated } from "@/lib/store";
import { cyrToLat } from "@/lib/uz-script";
import { renderTranslit } from "@/lib/translit";
import { cn } from "@/lib/cn";

/** Transliteratsiya — foydalanuvchi sozlamasiga koʻra «aniq» yoki «oddiy» shaklda. */
export function Translit({ text, className }: { text: string; className?: string }) {
  const { settings } = useSettings();
  const hydrated = useHydrated();
  const mode = hydrated ? settings.translitMode : "aniq";
  if (hydrated && !settings.showTranslit) return null;
  return (
    <p lang="uz-Latn" className={cn("translit whitespace-pre-line", className)}>
      {renderTranslit(text, mode)}
    </p>
  );
}

/** QuranEnc tarjimasi (kirill asl nusxa). Sozlamaga koʻra lotin yozuvida koʻrsatiladi. */
export function UzTranslation({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: "p" | "span" | "div" }) {
  const { settings } = useSettings();
  const hydrated = useHydrated();
  const script = hydrated ? settings.translationScript : "lotin";
  return (
    <Tag lang={script === "kirill" ? "uz-Cyrl" : "uz-Latn"} className={className}>
      {script === "kirill" ? text : cyrToLat(text)}
    </Tag>
  );
}
