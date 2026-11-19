import { cyrToLat, hasCyrillic } from "./uz-script";
import { normalizeArabic } from "./arabic";

const APOS = /[ʻʼ'‘’`´ʹʺ]/g;

/**
 * Oʻzbek lotin/kirill imlosidagi farqlarni bir xil shaklga keltiradi:
 * Qurʼon/Quron/Kuran, namoz/namaz, hadis/xadis, Alloh/Allah, roʻza/roza/ро́за va h.k.
 */
export function normUz(input: string): string {
  let s = input;
  if (hasCyrillic(s)) s = cyrToLat(s);
  s = s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  s = s.replace(APOS, "");
  s = s
    .replace(/th/g, "s")
    .replace(/dh/g, "z")
    .replace(/x/g, "h")
    .replace(/q/g, "k")
    .replace(/w/g, "v")
    .replace(/iy/g, "i")
    .replace(/o/g, "a")
    .replace(/([a-z])\1+/g, "$1");
  return s.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function tokenize(input: string): string[] {
  return normUz(input).split(" ").filter((t) => t.length > 0);
}

export function isArabicQuery(q: string) {
  return /[؀-ۿ]/.test(q);
}

export function normAr(q: string) {
  return normalizeArabic(q, true);
}
