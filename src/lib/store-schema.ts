/** Mahalliy xotira sxemasi — server va mijoz uchun umumiy (client direktivasisiz). */

export type Settings = {
  theme: "system" | "light" | "dark";
  arabicScale: number;
  translationScale: number;
  translation: "sodiq" | "mansur" | "ruvvod";
  translationScript: "lotin" | "kirill";
  showTranslation: boolean;
  showTranslit: boolean;
  translitMode: "aniq" | "oddiy";
  showFootnotes: boolean;
  reciter: string;
  city: string;
  customLocation: { lat: number; lng: number; label: string } | null;
  prayerMethod: string;
  asrMethod: "hanafi" | "shafi";
  adjustments: Record<string, number>;
  hijriOffset: number;
  reduceMotion: boolean;
  largeText: boolean;
  haptics: boolean;
  sound: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  arabicScale: 1,
  translationScale: 1,
  translation: "sodiq",
  translationScript: "lotin",
  showTranslation: true,
  showTranslit: true,
  translitMode: "aniq",
  showFootnotes: false,
  reciter: "alafasy",
  city: "toshkent",
  customLocation: null,
  prayerMethod: "mwl",
  asrMethod: "hanafi",
  adjustments: {},
  hijriOffset: 0,
  reduceMotion: false,
  largeText: false,
  haptics: true,
  sound: false,
};

export type Bookmarks = { ayahs: string[]; duas: string[]; hadiths: string[]; articles: string[] };
export type LastRead = { surah: number; ayah: number; at: number } | null;
export type DhikrSession = { id: string; slug: string; title: string; count: number; target: number | null; startedAt: number; endedAt: number };
export type DhikrState = { sessions: DhikrSession[]; daily: Record<string, Record<string, number>>; custom: { slug: string; title: string; target: number | null }[] };
export type LearningState = { completed: string[]; quiz: Record<string, { best: number; total: number; at: number }> };
export type Goals = { dailyAyahs: number; dailyDhikr: number; dailyLessonMinutes: number };
export type Reminders = { prayer: boolean; minutesBefore: number; morningAdhkar: boolean; eveningAdhkar: boolean };
export type QuranProgress = { maxAyah: Record<string, number>; daily: Record<string, number> };
export type Memorization = Record<string, { status: "learning" | "memorized"; ayahs: number; updatedAt: number }>;
export type Checklist = Record<string, Record<string, boolean>>;
export type History = { kind: "ayah" | "dua" | "hadith" | "article" | "lesson"; ref: string; title: string; at: number }[];

export type StoreShape = {
  settings: Settings;
  bookmarks: Bookmarks;
  lastRead: LastRead;
  history: History;
  dhikr: DhikrState;
  learning: LearningState;
  goals: Goals;
  reminders: Reminders;
  quranProgress: QuranProgress;
  memorization: Memorization;
  checklist: Checklist;
};

export const DEFAULTS: StoreShape = {
  settings: DEFAULT_SETTINGS,
  bookmarks: { ayahs: [], duas: [], hadiths: [], articles: [] },
  lastRead: null,
  history: [],
  dhikr: { sessions: [], daily: {}, custom: [] },
  learning: { completed: [], quiz: {} },
  goals: { dailyAyahs: 10, dailyDhikr: 100, dailyLessonMinutes: 10 },
  reminders: { prayer: false, minutesBefore: 10, morningAdhkar: false, eveningAdhkar: false },
  quranProgress: { maxAyah: {}, daily: {} },
  memorization: {},
  checklist: {},
};

export type StoreKey = keyof StoreShape;
export const SYNC_KEYS: StoreKey[] = ["settings", "bookmarks", "lastRead", "history", "dhikr", "learning", "goals", "reminders", "quranProgress", "memorization", "checklist"];

