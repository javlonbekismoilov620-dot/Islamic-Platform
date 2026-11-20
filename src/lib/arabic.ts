/** Arabic text helpers: normalisation for matching/search (never used to alter displayed text). */

const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۭـ࣓-ࣿ]/g;
const PUNCT = /[،؛؟٪-٭۔.,:;!?"'«»“”‘’()[\]{}\-–—…*‎‏‌‍﴾﴿]/g;

/** Loose form: also drops alif/hamza so Uthmani spellings (سُبْحَٰنَكَ, ءَاتِنَا) match standard ones. */
const LOOSE_DROP = /[اءٰ]/g;

export function normalizeArabic(s: string, loose = false): string {
  const t = s
    .replace(DIACRITICS, "")
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(PUNCT, " ")
    .replace(/\s+/g, " ")
    .trim();
  return loose ? t.replace(LOOSE_DROP, "").replace(/\s+/g, " ").trim() : t;
}

/**
 * Normalises while keeping a map from every normalised character back to its index in the
 * original string, so a span found in normalised text can be cut verbatim from the original.
 */
export function normalizeWithMap(s: string, loose = false): { text: string; map: number[] } {
  let text = "";
  const map: number[] = [];
  let lastSpace = true;
  for (let i = 0; i < s.length; i++) {
    let ch = s[i];
    if (loose && (ch === "ٰ" || ch === "ء")) continue;
    if (DIACRITICS.test(ch)) { DIACRITICS.lastIndex = 0; continue; }
    DIACRITICS.lastIndex = 0;
    if (/[ٱأإآ]/.test(ch)) ch = "ا";
    else if (ch === "ى" || ch === "ئ") ch = "ي";
    else if (ch === "ة") ch = "ه";
    else if (ch === "ؤ") ch = "و";
    if (loose && ch === "ا") continue;
    if (PUNCT.test(ch) || /\s/.test(ch)) {
      PUNCT.lastIndex = 0;
      if (lastSpace) continue;
      ch = " ";
      lastSpace = true;
    } else {
      lastSpace = false;
    }
    PUNCT.lastIndex = 0;
    text += ch;
    map.push(i);
  }
  return { text: text.trimEnd(), map };
}

/** Finds `phrase` (any vocalisation) in `full` and returns the verbatim original span. */
export function findVerbatimSpan(full: string, start: string, end?: string, loose = false): string | null {
  const { text, map } = normalizeWithMap(full, loose);
  const s = normalizeArabic(start, loose);
  const from = text.indexOf(s);
  if (from < 0) return null;
  let toNorm: number;
  if (end) {
    const e = normalizeArabic(end, loose);
    const at = text.indexOf(e, from);
    if (at < 0) return null;
    toNorm = at + e.length - 1;
  } else {
    toNorm = from + s.length - 1;
  }
  const a = map[from];
  let b = map[toNorm];
  // include trailing diacritics of the last letter
  while (b + 1 < full.length && /[ؐ-ًؚ-ٰٟۖ-ۭ]/.test(full[b + 1])) b++;
  return full.slice(a, b + 1);
}

/** Does the (normalised) needle occur in the (normalised) haystack? */
export function arabicContains(haystack: string, needle: string): boolean {
  return normalizeArabic(haystack).includes(normalizeArabic(needle));
}
