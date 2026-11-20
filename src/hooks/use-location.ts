"use client";
import { useMemo } from "react";
import { useSettings } from "@/lib/store";
import { cityBySlug } from "@/data/cities";

export function useLocation() {
  const { settings } = useSettings();
  if (settings.customLocation) return { lat: settings.customLocation.lat, lng: settings.customLocation.lng, label: settings.customLocation.label, isCustom: true };
  const c = cityBySlug(settings.city);
  return { lat: c.lat, lng: c.lng, label: c.name, isCustom: false };
}

export function usePrayerSettings() {
  const { settings } = useSettings();
  const { prayerMethod, asrMethod, adjustments } = settings;
  return useMemo(() => ({ method: prayerMethod, asr: asrMethod, adjustments }), [prayerMethod, asrMethod, adjustments]);
}
