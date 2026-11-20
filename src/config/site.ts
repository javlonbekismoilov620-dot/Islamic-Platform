/**
 * Sayt brendi va asosiy sozlamalar. Nomni oʻzgartirish uchun faqat shu faylni tahrirlang.
 */
export const siteConfig = {
  name: "Hidoyat",
  tagline: "Islomiy bilim va kundalik ibodat yoʻldoshi",
  description:
    "Qurʼoni karim, duolar, zikrlar, namoz darslari, hadislar va Hanafiy mazhabi boʻyicha islomiy bilimlar — oʻzbek tilida, manbalari koʻrsatilgan holda.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "uz_UZ",
  madhhab: "Hanafiy",
  /** Qurʼon tarjimasini standart ravishda qaysi yozuvda koʻrsatish: "lotin" yoki "kirill" (asl nashr). */
  defaultTranslationScript: "lotin" as "lotin" | "kirill",
  defaultTranslation: "sodiq",
  defaultCity: "toshkent",
  timezone: "Asia/Tashkent",
};

export type NavItem = { href: string; label: string; icon: string; match?: string[] };

export const mainNav: NavItem[] = [
  { href: "/", label: "Bosh sahifa", icon: "home" },
  { href: "/quron", label: "Qurʼon", icon: "book", match: ["/quron"] },
  { href: "/ibodat", label: "Ibodat", icon: "mosque", match: ["/ibodat", "/namoz-vaqtlari", "/qibla", "/taqvim"] },
  { href: "/duolar", label: "Duolar", icon: "hands", match: ["/duolar"] },
  { href: "/zikrlar", label: "Zikrlar", icon: "circle", match: ["/zikrlar"] },
  { href: "/bilimlar", label: "Bilimlar", icon: "library", match: ["/bilimlar", "/hadislar", "/lugat", "/talaffuz"] },
  { href: "/profil", label: "Profil", icon: "user", match: ["/profil", "/sozlamalar", "/kirish", "/royxatdan-otish"] },
];

/** Mobil pastki panel — 5 ta asosiy boʻlim. Zikrlar va Profil yuqori paneldan ochiladi. */
export const mobileTabs = ["/", "/quron", "/ibodat", "/duolar", "/bilimlar"];
