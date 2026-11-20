/** Manba havolalarini import qilingan metamaʼlumotlardan avtomatik yaratish (qoʻlda yozilmaydi). */
import type { Reference } from "@/server/db/schema";
import type { Check, DuaOrigin, Grade } from "./types";
import { SURAH_NAMES_UZ } from "@/data/surah-names-uz";

export const COLLECTIONS: Record<string, { title: string; author: string; short: string }> = {
  bukhari: { title: "Sahih al-Buxoriy", author: "Imom Muhammad ibn Ismoil al-Buxoriy (vaf. 256 h.)", short: "Buxoriy" },
  muslim: { title: "Sahih Muslim", author: "Imom Muslim ibn Hajjoj an-Naysaburiy (vaf. 261 h.)", short: "Muslim" },
  abudawud: { title: "Sunan Abu Dovud", author: "Imom Abu Dovud Sulaymon ibn Ashʼas as-Sijistoniy (vaf. 275 h.)", short: "Abu Dovud" },
  tirmidhi: { title: "Sunan at-Termiziy (al-Jomeʼ)", author: "Imom Abu Iso Muhammad ibn Iso at-Termiziy (vaf. 279 h.)", short: "Termiziy" },
  nasai: { title: "Sunan an-Nasoiy", author: "Imom Ahmad ibn Shuayb an-Nasoiy (vaf. 303 h.)", short: "Nasoiy" },
  ibnmajah: { title: "Sunan Ibn Moja", author: "Imom Muhammad ibn Yazid ibn Moja (vaf. 273 h.)", short: "Ibn Moja" },
};

export const DATASET_URL = "https://github.com/fawazahmed0/hadith-api";

export function hadithLocator(collection: string, number: number, abdulBaqi?: number | null): string {
  if (collection === "muslim") {
    const ab = abdulBaqi != null ? Math.floor(abdulBaqi) : null;
    return ab != null ? `${ab}-hadis (Fuod Abdulboqiy raqamlashi; ketma-ket raqami ${number})` : `ketma-ket ${number}-hadis`;
  }
  return `${number}-hadis`;
}

export function hadithRef(collection: string, number: number, abdulBaqi?: number | null): Reference {
  const c = COLLECTIONS[collection];
  return { title: c?.title ?? collection, author: c?.author, locator: hadithLocator(collection, number, abdulBaqi), kind: "hadith", url: DATASET_URL };
}

export function shortHadithRef(collection: string, number: number, abdulBaqi?: number | null): string {
  const c = COLLECTIONS[collection];
  const n = collection === "muslim" && abdulBaqi != null ? Math.floor(abdulBaqi) : number;
  return `${c?.short ?? collection}, ${n}`;
}

export function quranRef(s: number, a: number, to?: number): Reference {
  const name = SURAH_NAMES_UZ[s - 1]?.[1] ?? String(s);
  return { title: "Qurʼoni karim", locator: `${name} surasi, ${a}${to && to !== a ? `–${to}` : ""}-oyat`, kind: "quran", url: `/quron/${s}#oyat-${a}` };
}

export const HISN_REF = (category: string): Reference => ({
  title: "Hisnul muslim min azkoril-Kitobi vas-Sunna",
  author: "Saʼid ibn Ali ibn Vahf al-Qahtoniy",
  locator: `«${category}» bobi`,
  kind: "book",
});

export function duaRefs(origin: DuaOrigin, checks: Check[]): Reference[] {
  const refs: Reference[] = [];
  if (origin.kind === "quran") refs.push(quranRef(origin.surah, origin.ayah, origin.to));
  if (origin.kind === "hadith") refs.push(hadithRef(origin.collection, origin.number, origin.abdulBaqi));
  for (const c of checks) if (c.method === "contains" && c.ok) refs.push(hadithRef(c.collection, c.number, c.abdulBaqi));
  if (origin.kind === "hisn") refs.push(HISN_REF(origin.category));
  return refs;
}

const GRADE_UZ: Record<string, string> = {
  sahih: "Sahih", hasan: "Hasan", "hasan sahih": "Hasan sahih", daif: "Zaif", "da'if": "Zaif", "very daif": "Juda zaif",
  "isnaad sahih": "Isnodi sahih", "hasan isnaad": "Isnodi hasan", "isnaad hasan": "Isnodi hasan", "sahih isnaad": "Isnodi sahih",
  "isnaad daif": "Isnodi zaif", "daif isnaad": "Isnodi zaif", maudu: "Mavzuʼ (toʻqima)", mawdu: "Mavzuʼ (toʻqima)", munkar: "Munkar", shadh: "Shoz",
  "hasan lighairihi": "Hasan li gʻayrihi", "sahih lighairihi": "Sahih li gʻayrihi",
};

export function gradeUz(grade: string): string {
  return GRADE_UZ[grade.trim().toLowerCase()] ?? grade;
}

const GRADER_UZ: Record<string, string> = {
  "Al-Albani": "Shayx Nosiriddin al-Albaniy",
  "Ahmad Muhammad Shakir": "Ahmad Muhammad Shokir",
  "Bashar Awad Maarouf": "Bashshor Avvod Maʼruf",
  "Zubair Ali Zai": "Zubayr Ali Zay",
  "Abu Ghuddah": "Abdulfattoh Abu Gʻudda",
  "Muhammad Muhyi Al-Din Abdul Hamid": "Muhammad Muhyiddin Abdulhamid",
  "Shuaib Al Arnaut": "Shuayb al-Arnaut",
  "Muhammad Fouad Abd al-Baqi": "Muhammad Fuod Abdulboqiy",
};
export const graderUz = (n: string) => GRADER_UZ[n] ?? n;

/** Sahihayn uchun baho: toʻplam muallifining sahihlik sharti asosida (alohida baholovchi yoʻq). */
export function gradeSummary(collection: string | undefined, grades: Grade[]): { label: string; tone: "success" | "warning" | "danger" | "neutral"; detail: string } {
  if (collection === "bukhari" || collection === "muslim") {
    return { label: "Sahih", tone: "success", detail: `${COLLECTIONS[collection].title} — muallif faqat sahih hadislarni kiritishni shart qilgan toʻplam; ummat ulamolari uni qabul qilgan.` };
  }
  if (!grades.length) return { label: "Baho koʻrsatilmagan", tone: "neutral", detail: "Maʼlumotlar toʻplamida ushbu rivoyat uchun baho mavjud emas." };
  const norm = grades.map((g) => g.grade.toLowerCase());
  const weak = norm.some((g) => g.includes("daif") || g.includes("maudu") || g.includes("munkar"));
  const allWeak = norm.every((g) => g.includes("daif") || g.includes("maudu") || g.includes("munkar"));
  const detail = grades.map((g) => `${graderUz(g.name)}: ${gradeUz(g.grade)}`).join(" · ");
  if (allWeak) return { label: "Zaif", tone: "danger", detail };
  if (weak) return { label: "Baholarda ixtilof bor", tone: "warning", detail };
  return { label: gradeUz(grades[0].grade), tone: "success", detail };
}
