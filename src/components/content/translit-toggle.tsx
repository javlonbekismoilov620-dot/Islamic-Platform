"use client";
import { useHydrated, useSettings } from "@/lib/store";
import { Segmented } from "@/components/ui/controls";

export function TranslitModeToggle() {
  const { settings, update } = useSettings();
  const hydrated = useHydrated();
  return (
    <Segmented label="Transliteratsiya turi" value={hydrated ? settings.translitMode : "aniq"} onChange={(v) => update({ translitMode: v })} options={[{ value: "aniq", label: "Aniq" }, { value: "oddiy", label: "Oddiy" }]} />
  );
}
