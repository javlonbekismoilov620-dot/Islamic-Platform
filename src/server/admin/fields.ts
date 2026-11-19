/** Kontent turlari uchun tahrirlash maydonlari (sxemaga asoslangan forma). */
export type FieldKind = "text" | "textarea" | "arabic" | "number" | "select" | "lines" | "markdown" | "json" | "checkbox" | "readonly" | "url";
export type Field = { name: string; label: string; kind: FieldKind; options?: { value: string; label: string }[]; help?: string; required?: boolean };

const RULING_OPTS = [{ value: "", label: "—" }, ...["farz", "vojib", "sunnat", "mustahab", "muboh", "makruh", "harom"].map((v) => ({ value: v, label: v }))];

export const TYPE_LABEL: Record<string, string> = {
  dua: "Duo", dhikr: "Zikr", hadith: "Hadis", article: "Maqola", lesson: "Namoz darsi", quiz: "Test", glossary: "Atama", event: "Taqvim sanasi",
};

export const FIELDS: Record<string, Field[]> = {
  dua: [
    { name: "arabic", label: "Arabcha matn", kind: "arabic", required: true, help: "Oʻzgartirilsa, avtomatik solishtirish natijasi bekor qilinadi va qayta tekshiruv talab etiladi." },
    { name: "translit", label: "Transliteratsiya (T1 aniq standart)", kind: "textarea", required: true, help: "Qatorlar arabcha qatorlarga mos boʻlishi kerak." },
    { name: "meaning", label: "Oʻzbekcha maʼnosi", kind: "textarea", required: true },
    { name: "occasion", label: "Qachon aytiladi", kind: "textarea", required: true },
    { name: "categories", label: "Toifalar (vergul bilan)", kind: "text", help: "Birinchisi — asosiy toifa" },
    { name: "count", label: "Takrorlash soni", kind: "number" },
    { name: "countNote", label: "Son asosi", kind: "textarea", help: "Son hadisda kelganmi yoki ixtiyoriymi — aniq yozing." },
    { name: "virtue", label: "Fazilati", kind: "textarea" },
    { name: "note", label: "Izoh", kind: "textarea" },
    { name: "audioUrl", label: "Tekshirilgan audio havolasi (https)", kind: "url" },
  ],
  dhikr: [
    { name: "arabic", label: "Arabcha matn", kind: "arabic" },
    { name: "translit", label: "Transliteratsiya", kind: "textarea" },
    { name: "meaning", label: "Maʼnosi", kind: "textarea" },
    { name: "target", label: "Maqsadli son", kind: "number" },
    { name: "targetBasis", label: "Son asosi", kind: "select", options: [{ value: "hadith", label: "Hadisda kelgan" }, { value: "optional", label: "Ixtiyoriy" }] },
    { name: "targetNote", label: "Son haqida izoh", kind: "textarea", required: true },
    { name: "virtue", label: "Fazilati", kind: "textarea" },
    { name: "steps", label: "Toʻplam qadamlari (JSON)", kind: "json", help: "Faqat toʻplamlar uchun: [{title, arabic, translit, meaning, count}]" },
  ],
  hadith: [
    { name: "matn", label: "Arabcha matn (manbadan, oʻzgartirilmaydi)", kind: "readonly" },
    { name: "narrator", label: "Roviy", kind: "text", required: true },
    { name: "translation", label: "Oʻzbekcha tarjima", kind: "textarea", required: true },
    { name: "explanation", label: "Izoh", kind: "textarea" },
  ],
  article: [
    { name: "minutes", label: "Oʻqish vaqti (daqiqa)", kind: "number" },
    { name: "keyPoints", label: "Asosiy fikrlar (har qatorda bittadan)", kind: "lines" },
    { name: "markdown", label: "Matn (Markdown)", kind: "markdown", required: true },
  ],
  lesson: [
    { name: "order", label: "Tartib raqami", kind: "number", required: true },
    { name: "minutes", label: "Davomiyligi (daqiqa)", kind: "number" },
    { name: "outcomes", label: "Natijalar (har qatorda bittadan)", kind: "lines" },
    { name: "markdown", label: "Dars matni (Markdown)", kind: "markdown", required: true },
  ],
  quiz: [
    { name: "lesson", label: "Dars (slug)", kind: "text" },
    { name: "questions", label: "Savollar (JSON)", kind: "json", required: true, help: "[{q, options: [], answer: 0, explain}]" },
  ],
  glossary: [
    { name: "arabic", label: "Arabcha yozilishi", kind: "arabic" },
    { name: "translit", label: "Transliteratsiya", kind: "text" },
    { name: "definition", label: "Izoh", kind: "textarea", required: true },
    { name: "ruling", label: "Hukm turi", kind: "select", options: RULING_OPTS },
  ],
  event: [
    { name: "hijriMonth", label: "Hijriy oy (1–12)", kind: "number", required: true },
    { name: "hijriDay", label: "Hijriy kun (1–30)", kind: "number", required: true },
    { name: "days", label: "Davomiyligi (kun)", kind: "number" },
    { name: "kind", label: "Turi", kind: "select", options: ["eid", "fast", "night", "month", "day"].map((v) => ({ value: v, label: v })) },
    { name: "moonDependent", label: "Oy koʻrinishiga bogʻliq", kind: "checkbox" },
    { name: "fasting", label: "Roʻza hukmi", kind: "select", options: [{ value: "", label: "—" }, ...["farz", "sunnat", "mustahab", "makruh", "harom"].map((v) => ({ value: v, label: v }))] },
    { name: "description", label: "Tavsif", kind: "textarea", required: true },
  ],
};

export const STATUS_TRANSITIONS: Record<string, { action: string; label: string; to: string; roles: string[]; tone: "primary" | "danger" | "soft" | "ghost" }[]> = {
  draft: [{ action: "submit", label: "Tekshiruvga yuborish", to: "in_review", roles: ["editor", "reviewer", "admin"], tone: "primary" }, { action: "archive", label: "Arxivlash", to: "archived", roles: ["reviewer", "admin"], tone: "ghost" }],
  in_review: [
    { action: "approve", label: "Tasdiqlash va nashr qilish", to: "published", roles: ["reviewer", "admin"], tone: "primary" },
    { action: "request_changes", label: "Tuzatish soʻrash", to: "changes_requested", roles: ["reviewer", "admin"], tone: "soft" },
    { action: "reject", label: "Rad etish", to: "rejected", roles: ["reviewer", "admin"], tone: "danger" },
  ],
  changes_requested: [{ action: "submit", label: "Qayta tekshiruvga yuborish", to: "in_review", roles: ["editor", "reviewer", "admin"], tone: "primary" }],
  rejected: [{ action: "submit", label: "Qayta tekshiruvga yuborish", to: "in_review", roles: ["editor", "reviewer", "admin"], tone: "soft" }, { action: "archive", label: "Arxivlash", to: "archived", roles: ["reviewer", "admin"], tone: "ghost" }],
  published: [{ action: "archive", label: "Nashrdan olish (arxiv)", to: "archived", roles: ["reviewer", "admin"], tone: "ghost" }],
  archived: [{ action: "restore", label: "Qoralamaga qaytarish", to: "draft", roles: ["editor", "reviewer", "admin"], tone: "soft" }],
};
