/**
 * Hidoyat transliteratsiya standarti (T1) — arab tilini oʻzbek lotin yozuvida aniq ifodalash.
 *
 * Asosiy (aniq) yozuv oʻzbek alifbosida mavjud boʻlmagan tovushlarni alohida belgilar bilan ajratadi.
 * "Oddiy" yozuv aniq yozuvdan avtomatik va bir xil qoida bilan hosil qilinadi — shuning uchun ikkisi
 * hech qachon bir-biridan farq qilib qolmaydi.
 */

export type LetterGuide = {
  ar: string;
  name: string;
  latin: string;
  simple: string;
  /** Oʻzbek tilida bormi? */
  inUzbek: boolean;
  how: string;
  example: { ar: string; latin: string; meaning: string };
};

export const TRANSLIT_VERSION = "T1 (2026)";

export const LETTERS: LetterGuide[] = [
  { ar: "ء", name: "Hamza", latin: "ʼ", simple: "ʼ", inUzbek: false, how: "Boʻgʻizda havo bir zum toʻxtatilib, keyin qoʻyib yuboriladi (tutuq belgisi). Soʻz boshida yozilmaydi.", example: { ar: "سَأَلَ", latin: "saʼala", meaning: "soʻradi" } },
  { ar: "ب", name: "Bo", latin: "b", simple: "b", inUzbek: true, how: "Oʻzbekcha «b» kabi.", example: { ar: "بَيْت", latin: "bayt", meaning: "uy" } },
  { ar: "ت", name: "To", latin: "t", simple: "t", inUzbek: true, how: "Yumshoq «t»: til uchi yuqori tishlar ildiziga tegadi.", example: { ar: "تَوْبَة", latin: "tawbah", meaning: "tavba" } },
  { ar: "ث", name: "So (Sā)", latin: "th", simple: "s", inUzbek: false, how: "Til uchi tishlar orasiga chiqarilib, havo sirgʻaltiriladi (ingliz tilidagi «think» soʻzidagi kabi). Oddiy «s» emas.", example: { ar: "ثَوَاب", latin: "thawāb", meaning: "savob" } },
  { ar: "ج", name: "Jim", latin: "j", simple: "j", inUzbek: true, how: "Oʻzbekcha «j» (jon soʻzidagi kabi).", example: { ar: "جَنَّة", latin: "jannah", meaning: "jannat" } },
  { ar: "ح", name: "Ho (Ḥā)", latin: "ḥ", simple: "h", inUzbek: false, how: "Boʻgʻizning oʻrtasidan, xirillamasdan, issiq nafas bilan aytiladi — oʻzbekcha «h» dan kuchliroq va chuqurroq.", example: { ar: "الْحَمْد", latin: "al-ḥamd", meaning: "hamd" } },
  { ar: "خ", name: "Xo", latin: "x", simple: "x", inUzbek: true, how: "Oʻzbekcha «x» (xabar soʻzidagi kabi).", example: { ar: "خَيْر", latin: "xayr", meaning: "yaxshilik" } },
  { ar: "د", name: "Dol", latin: "d", simple: "d", inUzbek: true, how: "Oʻzbekcha «d» kabi.", example: { ar: "دِين", latin: "dīn", meaning: "din" } },
  { ar: "ذ", name: "Zol (Dhāl)", latin: "dh", simple: "z", inUzbek: false, how: "Til uchi tishlar orasiga chiqarilib, ovoz bilan aytiladi (ingliz tilidagi «this» soʻzidagi kabi). Oddiy «z» emas.", example: { ar: "ذِكْر", latin: "dhikr", meaning: "zikr" } },
  { ar: "ر", name: "Ro", latin: "r", simple: "r", inUzbek: true, how: "Til uchi bir marta titraydi. Fatha va zammada yoʻgʻon, kasrada ingichka aytiladi.", example: { ar: "رَبّ", latin: "rabb", meaning: "Parvardigor" } },
  { ar: "ز", name: "Zay", latin: "z", simple: "z", inUzbek: true, how: "Oʻzbekcha «z» kabi.", example: { ar: "زَكَاة", latin: "zakāh", meaning: "zakot" } },
  { ar: "س", name: "Sin", latin: "s", simple: "s", inUzbek: true, how: "Oʻzbekcha «s» kabi, ingichka.", example: { ar: "سَلَام", latin: "salām", meaning: "tinchlik" } },
  { ar: "ش", name: "Shin", latin: "sh", simple: "sh", inUzbek: true, how: "Oʻzbekcha «sh» kabi.", example: { ar: "شُكْر", latin: "shukr", meaning: "shukr" } },
  { ar: "ص", name: "Sod (Ṣād)", latin: "ṣ", simple: "s", inUzbek: false, how: "Yoʻgʻon «s»: tilning orqa qismi tanglay tomon koʻtariladi, ogʻiz boʻshligʻi kengayadi. Keyingi unli «o» ga yaqin eshitiladi.", example: { ar: "صَلَاة", latin: "ṣalāh", meaning: "namoz" } },
  { ar: "ض", name: "Zod (Ḍād)", latin: "ḍ", simple: "d", inUzbek: false, how: "Yoʻgʻon «d»: tilning yon tomoni yuqori oziq tishlarga tegadi. Arab tiliga xos tovush.", example: { ar: "رَمَضَان", latin: "Ramaḍān", meaning: "Ramazon" } },
  { ar: "ط", name: "To (Ṭā)", latin: "ṭ", simple: "t", inUzbek: false, how: "Yoʻgʻon «t»: til uchi tishlar ildiziga kuch bilan bosiladi, tilning orqasi koʻtariladi.", example: { ar: "طَهَارَة", latin: "ṭahārah", meaning: "poklik" } },
  { ar: "ظ", name: "Zo (Ẓā)", latin: "ẓ", simple: "z", inUzbek: false, how: "Yoʻgʻon «dh»: til uchi tishlar orasida, tilning orqasi koʻtarilgan holda aytiladi.", example: { ar: "عَظِيم", latin: "ʻaẓīm", meaning: "ulugʻ" } },
  { ar: "ع", name: "Ayn", latin: "ʻ", simple: "ʼ", inUzbek: false, how: "Boʻgʻiz oʻrtasini siqib chiqariladigan ovozli tovush. Oʻzbek tilida yoʻq — ustozdan eshitib oʻrganish tavsiya etiladi.", example: { ar: "عِلْم", latin: "ʻilm", meaning: "ilm" } },
  { ar: "غ", name: "Gʻayn", latin: "gʻ", simple: "gʻ", inUzbek: true, how: "Oʻzbekcha «gʻ» (gʻalaba soʻzidagi kabi).", example: { ar: "غَفُور", latin: "gʻafūr", meaning: "kechiruvchi" } },
  { ar: "ف", name: "Fo", latin: "f", simple: "f", inUzbek: true, how: "Oʻzbekcha «f» kabi.", example: { ar: "فَجْر", latin: "fajr", meaning: "tong" } },
  { ar: "ق", name: "Qof", latin: "q", simple: "q", inUzbek: true, how: "Oʻzbekcha «q» kabi, chuqur va yoʻgʻon.", example: { ar: "قُرْآن", latin: "Qurʼān", meaning: "Qurʼon" } },
  { ar: "ك", name: "Kof", latin: "k", simple: "k", inUzbek: true, how: "Oʻzbekcha «k» kabi.", example: { ar: "كِتَاب", latin: "kitāb", meaning: "kitob" } },
  { ar: "ل", name: "Lom", latin: "l", simple: "l", inUzbek: true, how: "Ingichka «l». Faqat «Alloh» soʻzida (oldidan fatha yoki zamma kelsa) yoʻgʻon aytiladi.", example: { ar: "لَيْل", latin: "layl", meaning: "kecha" } },
  { ar: "م", name: "Mim", latin: "m", simple: "m", inUzbek: true, how: "Oʻzbekcha «m» kabi.", example: { ar: "مَسْجِد", latin: "masjid", meaning: "masjid" } },
  { ar: "ن", name: "Nun", latin: "n", simple: "n", inUzbek: true, how: "Oʻzbekcha «n» kabi.", example: { ar: "نُور", latin: "nūr", meaning: "nur" } },
  { ar: "ه", name: "Ha", latin: "h", simple: "h", inUzbek: true, how: "Yengil, nafas bilan aytiladigan «h» — boʻgʻizning eng chuqur qismidan.", example: { ar: "هُدًى", latin: "hudā", meaning: "hidoyat" } },
  { ar: "و", name: "Vov (Wāw)", latin: "w", simple: "v", inUzbek: false, how: "Lablar yumaloqlanib aytiladi (ingliz tilidagi «water» kabi). Tishlar labga tegmaydi.", example: { ar: "وُضُوء", latin: "wuḍūʼ", meaning: "tahorat" } },
  { ar: "ي", name: "Yo", latin: "y", simple: "y", inUzbek: true, how: "Oʻzbekcha «y» kabi.", example: { ar: "يَوْم", latin: "yawm", meaning: "kun" } },
];

export const VOWEL_RULES = [
  { mark: "ـَ", name: "Fatha", latin: "a", note: "Qisqa «a». Yoʻgʻon harflardan keyin «o» ga yaqin eshitiladi." },
  { mark: "ـِ", name: "Kasra", latin: "i", note: "Qisqa «i»." },
  { mark: "ـُ", name: "Zamma", latin: "u", note: "Qisqa «u»." },
  { mark: "ـَا", name: "Uzun a (madd)", latin: "ā", note: "Ikki harakat choʻzib aytiladi. Belgisiz «a» bilan adashtirmang." },
  { mark: "ـِي", name: "Uzun i", latin: "ī", note: "Ikki harakat choʻziladi." },
  { mark: "ـُو", name: "Uzun u", latin: "ū", note: "Ikki harakat choʻziladi." },
  { mark: "ـّ", name: "Shadda", latin: "qoʻsh harf", note: "Harf ikki marta talaffuz qilinadi: «rabbi», «Allāhumma»." },
  { mark: "ـْ", name: "Sukun", latin: "unlisiz", note: "Harf unlisiz, toʻxtab aytiladi: «al-ḥamd»." },
  { mark: "ـً ـٍ ـٌ", name: "Tanvin", latin: "an / in / un", note: "Soʻz oxirida «n» bilan. Toʻxtalganda «-an» → «-ā», qolganlari tushib qoladi." },
];

export const READING_RULES = [
  "«al-» artikli quyosh harflari (t, th, d, dh, r, z, s, sh, ṣ, ḍ, ṭ, ẓ, l, n) oldida keyingi harfga qoʻshilib ketadi: ar-Raḥmān, ash-shayṭān, as-salām.",
  "Soʻzlar ulab oʻqilganda soʻz boshidagi bogʻlovchi hamza (hamzat al-vasl) tushib qoladi va defis bilan koʻrsatiladi: Subḥānaka-llāhumma, rabbil-ʻālamīn.",
  "Toʻxtalgan joyda (vaqf) soʻz oxiridagi qisqa unli aytilmaydi: «al-ʻaẓīm» (al-ʻaẓīmi emas).",
  "Ta marbuta (ة) toʻxtalganda «h», ulab oʻqilganda «t» boʻladi: ṣalāh — ṣalātu l-ʻaṣr.",
  "«Allāh» soʻzidagi «l» oldidan fatha yoki zamma kelsa yoʻgʻon (Allāhu, ʻabdullāh), kasra kelsa ingichka (bismillāh, lillāh) aytiladi.",
];

/** Aniq transliteratsiyadan "oddiy" (oʻzbekcha oʻqishga qulay) shakl hosil qilish. */
export function toSimple(precise: string): string {
  return precise
    .replace(/th/g, "s")
    .replace(/Th/g, "S")
    .replace(/dh/g, "z")
    .replace(/Dh/g, "Z")
    .replace(/[āĀ]/g, (c) => (c === "ā" ? "a" : "A"))
    .replace(/[īĪ]/g, (c) => (c === "ī" ? "i" : "I"))
    .replace(/[ūŪ]/g, (c) => (c === "ū" ? "u" : "U"))
    .replace(/ḥ/g, "h").replace(/Ḥ/g, "H")
    .replace(/ṣ/g, "s").replace(/Ṣ/g, "S")
    .replace(/ḍ/g, "d").replace(/Ḍ/g, "D")
    .replace(/ṭ/g, "t").replace(/Ṭ/g, "T")
    .replace(/ẓ/g, "z").replace(/Ẓ/g, "Z")
    .replace(/(?<![gG])ʻ/g, "ʼ")
    .replace(/w/g, "v")
    .replace(/W/g, "V");
}

export function renderTranslit(precise: string, mode: "aniq" | "oddiy"): string {
  return mode === "oddiy" ? toSimple(precise) : precise;
}
