/**
 * Oʻzbek kirill → lotin harf almashtirish (1995-yilgi rasmiy lotin alifbosi, oʻ/gʻ uchun U+02BB).
 *
 * Bu faqat yozuvni almashtiradi — matn mazmuni, soʻz tartibi yoki tinish belgilari oʻzgarmaydi.
 * Kirill asl nusxa har doim saqlanadi va foydalanuvchiga koʻrsatilishi mumkin.
 */

const VOWELS = new Set("аеёиоуўэюяАЕЁИОУЎЭЮЯ".split(""));
const SOFT_HARD = new Set("ъьЪЬ".split(""));

const MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ё: "yo", ж: "j", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "x", ч: "ch", ш: "sh", щ: "sh", ъ: "ʼ", ы: "i", ь: "", э: "e", ю: "yu",
  я: "ya", ў: "oʻ", қ: "q", ғ: "gʻ", ҳ: "h",
};

// Latin letters that are visually identical to Cyrillic ones. Some sources contain such
// homoglyphs inside Cyrillic words (e.g. a Latin "C" in "Cомад"); they are read as Cyrillic.
const HOMOGLYPHS: Record<string, string> = {
  A: "А", a: "а", B: "В", C: "С", c: "с", E: "Е", e: "е", H: "Н", K: "К", M: "М",
  O: "О", o: "о", P: "Р", p: "р", T: "Т", X: "Х", x: "х", y: "у",
};

const isCyr = (ch: string | undefined) => !!ch && /[Ѐ-ӿ]/.test(ch);
const isUpper = (ch: string | undefined) => !!ch && ch !== ch.toLowerCase() && ch === ch.toUpperCase();
const isLetter = (ch: string | undefined) => !!ch && /\p{L}/u.test(ch);

function normalizeHomoglyphs(text: string): string {
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (HOMOGLYPHS[ch] && (isCyr(chars[i - 1]) || isCyr(chars[i + 1]))) chars[i] = HOMOGLYPHS[ch];
  }
  return chars.join("");
}

function applyCase(latin: string, upper: boolean, nextUpper: boolean): string {
  if (!upper || latin.length === 0) return latin;
  if (latin.length === 1) return latin.toUpperCase();
  // Digraphs: "Sh" in a capitalised word, "SH" in an all-caps word.
  if (nextUpper) return latin.toUpperCase().replace("ʻ", "ʻ");
  return latin[0].toUpperCase() + latin.slice(1);
}

export function cyrToLat(input: string): string {
  if (!input) return input;
  const chars = Array.from(normalizeHomoglyphs(input));
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const lower = ch.toLowerCase();
    const prev = chars[i - 1];
    const next = chars[i + 1];
    const upper = isUpper(ch);
    const nextUpper = isUpper(next) && isLetter(next);

    if (lower === "е") {
      const wordStart = !isLetter(prev);
      const afterVowel = !!prev && (VOWELS.has(prev) || SOFT_HARD.has(prev));
      out += applyCase(wordStart || afterVowel ? "ye" : "e", upper, nextUpper);
      continue;
    }
    if (lower === "ц") {
      const betweenVowels = !!prev && VOWELS.has(prev) && !!next && VOWELS.has(next);
      out += applyCase(betweenVowels ? "ts" : "s", upper, nextUpper);
      continue;
    }
    const mapped = MAP[lower];
    if (mapped === undefined) {
      out += ch;
      continue;
    }
    out += applyCase(mapped, upper, nextUpper);
  }
  return out;
}

/** True if the string contains Cyrillic letters. */
export function hasCyrillic(text: string): boolean {
  return /[Ѐ-ӿ]/.test(text);
}
