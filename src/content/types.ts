import type { Reference, Status } from "@/server/db/schema";

export type Grade = { name: string; grade: string };
export type Check = { collection: string; number: number; ok: boolean; method: string; abdulBaqi?: number | null; grades?: Grade[] };
export type DuaOrigin =
  | { kind: "hisn"; book: string; category: string; item: number; recommendedCount?: number; dataset: string; sha256: string }
  | { kind: "quran"; surah: number; ayah: number; to: number; partial: boolean; segments: { a: number; text: string }[]; text: string }
  | { kind: "hadith"; collection: string; number: number; abdulBaqi: number | null; dataset: string; sha256: string; lines?: { label: string; arabic: string }[] }
  | { kind: "manual"; note: string };

export type DuaBody = {
  arabic: string;
  lines?: { label: string; arabic: string; translit?: string }[];
  translit: string;
  meaning: string;
  occasion: string;
  count?: number | null;
  countNote?: string;
  virtue?: string;
  note?: string;
  categories: string[];
  origin: DuaOrigin;
  checks: Check[];
  grades: Grade[];
  arabicVerified: boolean;
  audioUrl?: string | null;
};

export type DhikrBody = {
  kind: "single" | "set";
  arabic?: string;
  translit?: string;
  meaning?: string;
  target: number | null;
  targetBasis: "hadith" | "optional";
  targetNote: string;
  virtue?: string;
  steps?: { title: string; arabic: string; translit: string; meaning: string; count: number; ref?: string }[];
};

export type HadithBody = {
  collection: string;
  number: number;
  abdulBaqi: number | null;
  book: number | null;
  bookTitleEn: string | null;
  hadithInBook: number | null;
  matn: string;
  arabicFull: string;
  narrator: string;
  translation: string;
  explanation?: string;
  grades: Grade[];
  topic: string;
  dataset: { name: string; edition: string; sha256: string };
};

export type ArticleBody = { markdown: string; minutes: number; keyPoints?: string[] };
export type LessonBody = { order: number; minutes: number; markdown: string; outcomes: string[] };
export type QuizQuestion = { q: string; options: string[]; answer: number; explain: string };
export type QuizBody = { lesson: string; questions: QuizQuestion[] };
export type GlossaryBody = { arabic?: string; translit?: string; definition: string; ruling?: string };
export type EventBody = {
  hijriMonth: number;
  hijriDay: number;
  days?: number;
  kind: "eid" | "fast" | "night" | "month" | "day";
  moonDependent: boolean;
  fasting?: "farz" | "sunnat" | "mustahab" | "harom" | "makruh" | null;
  description: string;
};

export type BodyByType = {
  dua: DuaBody;
  dhikr: DhikrBody;
  hadith: HadithBody;
  article: ArticleBody;
  lesson: LessonBody;
  quiz: QuizBody;
  glossary: GlossaryBody;
  event: EventBody;
};

export type ContentType = keyof BodyByType;

export type Content<T extends ContentType = ContentType> = {
  id: string;
  type: T;
  slug: string;
  category: string | null;
  title: string;
  summary: string | null;
  body: BodyByType[T];
  refs: Reference[];
  status: Status;
  origin: "editor" | "ai_draft" | "import";
  sort: number;
  version: number;
  reviewedAt: string | null;
  updatedAt: string;
};

export type SeedItem<T extends ContentType = ContentType> = {
  type: T;
  slug: string;
  category: string | null;
  title: string;
  summary?: string;
  body: BodyByType[T];
  refs: Reference[];
  sort?: number;
};
