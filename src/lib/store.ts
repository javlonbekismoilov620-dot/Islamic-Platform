"use client";
/**
 * Mehmon rejimi uchun mahalliy (brauzer) xotira. Hisobga kirgan foydalanuvchida
 * oʻzgarishlar serverga ham sinxronlanadi (src/lib/sync.ts).
 */
import { useSyncExternalStore } from "react";

import { DEFAULTS, type StoreKey, type StoreShape, type Settings } from "./store-schema";

const PREFIX = "hidoyat:";
const listeners = new Map<StoreKey, Set<() => void>>();
const cache = new Map<StoreKey, unknown>();
const changeHooks = new Set<(key: StoreKey, value: unknown) => void>();

function safeRead<K extends StoreKey>(key: K): StoreShape[K] {
  if (cache.has(key)) return cache.get(key) as StoreShape[K];
  let value: StoreShape[K] = DEFAULTS[key];
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(PREFIX + key) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      value = (isPlainObject(DEFAULTS[key]) && isPlainObject(parsed) ? { ...(DEFAULTS[key] as object), ...parsed } : parsed) as StoreShape[K];
    }
  } catch {
    value = DEFAULTS[key];
  }
  cache.set(key, value);
  return value;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

export function getStore<K extends StoreKey>(key: K): StoreShape[K] {
  return safeRead(key);
}

export function setStore<K extends StoreKey>(key: K, value: StoreShape[K] | ((prev: StoreShape[K]) => StoreShape[K]), opts: { silent?: boolean } = {}) {
  const prev = safeRead(key);
  const next = typeof value === "function" ? (value as (p: StoreShape[K]) => StoreShape[K])(prev) : value;
  cache.set(key, next);
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(next));
  } catch {
    /* xotira toʻla yoki bloklangan — qiymat faqat sessiya davomida saqlanadi */
  }
  listeners.get(key)?.forEach((l) => l());
  if (!opts.silent) changeHooks.forEach((h) => h(key, next));
}

export function onStoreChange(hook: (key: StoreKey, value: unknown) => void) {
  changeHooks.add(hook);
  return () => changeHooks.delete(hook);
}

function subscribe(key: StoreKey, cb: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === PREFIX + key) {
      cache.delete(key);
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.get(key)?.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const subscribeFns = new Map<StoreKey, (cb: () => void) => () => void>();
function subscriberFor(key: StoreKey) {
  let fn = subscribeFns.get(key);
  if (!fn) { fn = (cb) => subscribe(key, cb); subscribeFns.set(key, fn); }
  return fn;
}
const noopSubscribe = () => () => {};

/** React hook. Server render va birinchi hydration standart qiymat bilan amalga oshiriladi. */
export function useStore<K extends StoreKey>(key: K): [StoreShape[K], (v: StoreShape[K] | ((p: StoreShape[K]) => StoreShape[K])) => void] {
  const value = useSyncExternalStore(
    subscriberFor(key),
    () => safeRead(key),
    () => DEFAULTS[key],
  );
  return [value, (v) => setStore(key, v)];
}

export function useSettings() {
  const [settings, setSettings] = useStore("settings");
  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  return { settings, update };
}

/** True after hydration — use to avoid rendering locale/time-dependent UI on the server. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function todayKey(d = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  return parts; // YYYY-MM-DD
}

export function toggleInList(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [item, ...list];
}
