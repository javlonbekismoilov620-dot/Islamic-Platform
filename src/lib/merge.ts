/**
 * Mehmon (lokal) va hisob (server) maʼlumotlarini birlashtirish qoidalari.
 * Hech bir maʼlumot yoʻqolmasligi uchun roʻyxatlar birlashtiriladi, progress esa eng kattasi olinadi.
 */
import type { StoreKey, StoreShape } from "./store-schema";

const uniq = (xs: string[]) => Array.from(new Set(xs));
const maxMap = (a: Record<string, number> = {}, b: Record<string, number> = {}) => {
  const out: Record<string, number> = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, v);
  return out;
};

export function mergeValue<K extends StoreKey>(key: K, local: StoreShape[K], server: StoreShape[K], localNewer: boolean): StoreShape[K] {
  switch (key) {
    case "bookmarks": {
      const l = local as StoreShape["bookmarks"], s = server as StoreShape["bookmarks"];
      return { ayahs: uniq([...l.ayahs, ...(s.ayahs ?? [])]), duas: uniq([...l.duas, ...(s.duas ?? [])]), hadiths: uniq([...l.hadiths, ...(s.hadiths ?? [])]), articles: uniq([...l.articles, ...(s.articles ?? [])]) } as StoreShape[K];
    }
    case "learning": {
      const l = local as StoreShape["learning"], s = server as StoreShape["learning"];
      const quiz = { ...(s.quiz ?? {}) };
      for (const [k, v] of Object.entries(l.quiz)) if (!quiz[k] || v.best > quiz[k].best) quiz[k] = v;
      return { completed: uniq([...l.completed, ...(s.completed ?? [])]), quiz } as StoreShape[K];
    }
    case "quranProgress": {
      const l = local as StoreShape["quranProgress"], s = server as StoreShape["quranProgress"];
      return { maxAyah: maxMap(l.maxAyah, s.maxAyah), daily: maxMap(l.daily, s.daily) } as StoreShape[K];
    }
    case "dhikr": {
      const l = local as StoreShape["dhikr"], s = server as StoreShape["dhikr"];
      const byId = new Map([...(s.sessions ?? []), ...l.sessions].map((x) => [x.id, x]));
      const daily: Record<string, Record<string, number>> = { ...(s.daily ?? {}) };
      for (const [day, counts] of Object.entries(l.daily)) daily[day] = maxMap(daily[day], counts);
      const custom = new Map([...(s.custom ?? []), ...l.custom].map((c) => [c.slug, c]));
      return { sessions: [...byId.values()].sort((a, b) => b.endedAt - a.endedAt).slice(0, 500), daily, custom: [...custom.values()] } as StoreShape[K];
    }
    case "history": {
      const l = local as StoreShape["history"], s = server as StoreShape["history"];
      const m = new Map([...(s ?? []), ...l].map((h) => [`${h.kind}:${h.ref}`, h]));
      return [...m.values()].sort((a, b) => b.at - a.at).slice(0, 100) as StoreShape[K];
    }
    case "checklist": {
      const l = local as StoreShape["checklist"], s = server as StoreShape["checklist"];
      const out: StoreShape["checklist"] = { ...(s ?? {}) };
      for (const [day, items] of Object.entries(l)) {
        out[day] = { ...(out[day] ?? {}) };
        for (const [k, v] of Object.entries(items)) out[day][k] = out[day][k] || v;
      }
      return out as StoreShape[K];
    }
    case "memorization": {
      const l = local as StoreShape["memorization"], s = server as StoreShape["memorization"];
      const out = { ...(s ?? {}) };
      for (const [k, v] of Object.entries(l)) if (!out[k] || v.updatedAt > out[k].updatedAt) out[k] = v;
      return out as StoreShape[K];
    }
    case "lastRead": {
      const l = local as StoreShape["lastRead"], s = server as StoreShape["lastRead"];
      if (!l) return s as StoreShape[K];
      if (!s) return l as StoreShape[K];
      return (l.at >= s.at ? l : s) as StoreShape[K];
    }
    default:
      return localNewer ? local : server;
  }
}
