"use client";
import { useEffect } from "react";
import { getStore, onStoreChange, setStore } from "./store";
import { DEFAULTS, SYNC_KEYS, type StoreKey } from "./store-schema";
import { mergeValue } from "./merge";

const META = "hidoyat:meta";
type Meta = Record<string, number>;
const readMeta = (): Meta => {
  try { return JSON.parse(localStorage.getItem(META) || "{}"); } catch { return {}; }
};
const writeMeta = (m: Meta) => {
  try { localStorage.setItem(META, JSON.stringify(m)); } catch { /* ignore */ }
};

let loggedIn = false;
const pending = new Map<StoreKey, unknown>();
let timer: number | undefined;

async function flush() {
  if (!loggedIn || pending.size === 0) return;
  const items = [...pending.entries()].map(([key, value]) => ({ key, value }));
  pending.clear();
  try {
    await fetch("/api/me/data", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ items }), credentials: "same-origin", keepalive: true });
  } catch {
    items.forEach((i) => pending.set(i.key as StoreKey, i.value));
  }
}

export async function syncNow() {
  const res = await fetch("/api/me/data", { credentials: "same-origin", cache: "no-store" }).catch(() => null);
  if (!res || !res.ok) { loggedIn = false; return false; }
  const json = (await res.json()) as { authenticated: boolean; items?: { key: StoreKey; value: unknown; updatedAt: string }[] };
  if (!json.authenticated || !json.items) { loggedIn = false; return false; }
  loggedIn = true;
  const items = json.items;
  const meta = readMeta();
  const serverMap = new Map(items.map((i) => [i.key, i]));
  for (const key of SYNC_KEYS) {
    const local = getStore(key);
    const srv = serverMap.get(key);
    if (!srv) { pending.set(key, local); continue; }
    const localNewer = (meta[key] ?? 0) > new Date(srv.updatedAt).getTime();
    const base = DEFAULTS[key];
    const serverValue = (base && typeof base === "object" && !Array.isArray(base) ? { ...(base as object), ...(srv.value as object) } : srv.value) as never;
    const merged = mergeValue(key, local, serverValue, localNewer);
    setStore(key, merged, { silent: true });
    if (JSON.stringify(merged) !== JSON.stringify(srv.value)) pending.set(key, merged);
  }
  await flush();
  return true;
}

export function markLoggedOut() {
  loggedIn = false;
  pending.clear();
}

/** Mounted once in Providers. */
export function SyncAgent() {
  useEffect(() => {
    syncNow();
    const off = onStoreChange((key) => {
      const meta = readMeta();
      meta[key] = Date.now();
      writeMeta(meta);
      if (!loggedIn) return;
      pending.set(key, getStore(key));
      window.clearTimeout(timer);
      timer = window.setTimeout(flush, 1200);
    });
    const onHide = () => { if (document.visibilityState === "hidden") flush(); };
    document.addEventListener("visibilitychange", onHide);
    return () => { off(); document.removeEventListener("visibilitychange", onHide); };
  }, []);
  return null;
}
