/**
 * Zikrlar va zikr toʻplamlari. Har bir maqsadli son uchun asos koʻrsatiladi:
 *  - "hadith": son hadis matnida aniq kelgan
 *  - "optional": ixtiyoriy shaxsiy maqsad — diniy talab emas
 */
export type DhikrText = {
  title: string;
  translit: string;
  meaning: string;
  target: number | null;
  targetBasis: "hadith" | "optional";
  targetNote: string;
  virtue?: string;
  /** Fazilat yoki son keltirilgan, alohida tekshirilgan hadislar. */
  extra?: { collection: string; number: number }[];
};

export const DHIKR_TEXTS: Record<string, DhikrText> = {
  subhanalloh: {
    title: "Subḥānallāh",
    translit: "Subḥānallāh",
    meaning: "Alloh (barcha nuqson va kamchiliklardan) pokdir.",
    target: 33,
    targetBasis: "hadith",
    targetNote: "Har namozdan keyin 33 marta — Sahih Muslimdagi hadisda kelgan son. Boshqa vaqtlarda son cheklanmagan.",
    extra: [{ collection: "muslim", number: 1352 }],
  },
  alhamdulillah: {
    title: "Al-ḥamdu lillāh",
    translit: "Al-ḥamdu lillāh",
    meaning: "Hamd (barcha maqtov va shukr) Allohgadir.",
    target: 33,
    targetBasis: "hadith",
    targetNote: "Har namozdan keyin 33 marta — Sahih Muslimdagi hadisda kelgan son.",
    virtue: "Termiziy rivoyatida: duoning eng afzali «Al-ḥamdu lillāh» ekani aytilgan.",
    extra: [{ collection: "muslim", number: 1352 }],
  },
  "allohu-akbar": {
    title: "Allāhu akbar",
    translit: "Allāhu akbar",
    meaning: "Alloh eng ulugʻdir.",
    target: 33,
    targetBasis: "hadith",
    targetNote: "Har namozdan keyin 33 marta — Sahih Muslimdagi hadisda kelgan son. Uxlashdan oldin 34 marta (Sahih al-Buxoriy).",
    extra: [{ collection: "muslim", number: 1352 }, { collection: "bukhari", number: 3705 }],
  },
  astagfirulloh: {
    title: "Astagʻfirullāh",
    translit: "Astagʻfirullāh",
    meaning: "Allohdan magʻfirat soʻrayman.",
    target: 3,
    targetBasis: "hadith",
    targetNote: "Farz namozidan salom bergach uch marta — Sahih Muslimdagi rivoyatda kelgan. Boshqa vaqtlarda istagancha.",
  },
  "la-ilaha-illalloh": {
    title: "Lā ilāha illallāh",
    translit: "Lā ilāha illallāh",
    meaning: "Allohdan oʻzga iloh yoʻq.",
    target: null,
    targetBasis: "optional",
    targetNote: "Hadisda maʼlum son belgilanmagan. Oʻzingiz uchun maqsad qoʻyishingiz mumkin — bu shaxsiy odat, diniy talab emas.",
    virtue: "Termiziy rivoyatida: zikrning eng afzali «Lā ilāha illallāh» ekani aytilgan.",
  },
  "subhanallohi-va-bihamdihi": {
    title: "Subḥānallāhi wa biḥamdih",
    translit: "Subḥānallāhi wa biḥamdih",
    meaning: "Allohni hamd bilan poklab yod etaman.",
    target: 100,
    targetBasis: "hadith",
    targetNote: "Kuniga 100 marta — Sahih al-Buxoriydagi hadisda kelgan son.",
    virtue: "Sahih al-Buxoriyda: kim bir kunda yuz marta buni aytsa, xatolari dengiz koʻpigicha boʻlsa ham oʻchirilishi aytilgan.",
  },
  "subhanallohil-aziym": {
    title: "Subḥānallāhil-ʻaẓīm",
    translit: "Subḥānallāhil-ʻaẓīm",
    meaning: "Ulugʻ Alloh pokdir.",
    target: null,
    targetBasis: "optional",
    targetNote: "Hadisda son belgilanmagan.",
    virtue: "Sahih al-Buxoriyda: «Subḥānallāhil-ʻaẓīm» va «Subḥānallāhi wa biḥamdih» tilga yengil, tarozida ogʻir va Rahmonga sevimli ikki kalima ekani aytilgan.",
  },
  "la-havla-va-la-quvvata": {
    title: "Lā ḥawla wa lā quwwata illā billāh",
    translit: "Lā ḥawla wa lā quwwata illā billāh",
    meaning: "Kuch ham, quvvat ham faqat Alloh bilandir.",
    target: null,
    targetBasis: "optional",
    targetNote: "Hadisda son belgilanmagan.",
    virtue: "Sahih al-Buxoriyda: bu kalima jannat xazinalaridan bir xazina ekani aytilgan.",
    extra: [{ collection: "bukhari", number: 4205 }],
  },
  salovot: {
    title: "Salovot",
    translit: "Allāhumma ṣalli ʻalā Muḥammadin wa ʻalā āli Muḥammad",
    meaning: "Allohim, Muhammadga va Muhammad oilasiga salovot (rahmat va ulugʻlash) yogʻdir.",
    target: null,
    targetBasis: "optional",
    targetNote: "Hadisda maʼlum son belgilanmagan. Juma kuni va kechasi koʻp aytish tavsiya etilgan.",
    virtue: "Sahih Muslimda: kim Paygʻambarimizga ﷺ bir marta salovot aytsa, Alloh unga oʻn marta rahmat yogʻdirishi aytilgan.",
    extra: [{ collection: "muslim", number: 912 }],
  },
  tahlil: {
    title: "Tahlil — «Lā ilāha illallāhu waḥdah…»",
    translit: "Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʻalā kulli shayʼin qadīr",
    meaning: "Allohdan oʻzga iloh yoʻq, U yagona, Uning sherigi yoʻq. Mulk Unikidir, hamd Unga xosdir va U har narsaga qodirdir.",
    target: 100,
    targetBasis: "hadith",
    targetNote: "Kuniga 100 marta — Sahih al-Buxoriydagi hadisda kelgan son. Namozdan keyin tasbehlarni 100 ga yetkazish uchun bir marta aytiladi.",
    virtue: "Sahih al-Buxoriyda: kim buni bir kunda yuz marta aytsa, unga oʻnta qul ozod qilgan savobi berilishi, yuzta hasana yozilib, yuzta yomonligi oʻchirilishi va kech kirguncha shaytondan himoyada boʻlishi aytilgan.",
    extra: [{ collection: "bukhari", number: 3293 }],
  },
  "astagfirulloh-va-atubu-ilayh": {
    title: "Astagʻfirullāha wa atūbu ilayh",
    translit: "Astagʻfirullāha wa atūbu ilayh",
    meaning: "Allohdan magʻfirat soʻrayman va Unga tavba qilaman.",
    target: 100,
    targetBasis: "optional",
    targetNote: "Ixtiyoriy maqsad. Sahih al-Buxoriyda Paygʻambarimiz ﷺ kuniga yetmish martadan koʻproq, Sahih Muslimda esa yuz marta istigʻfor aytganlari rivoyat qilingan — bu u zotning amallari, belgilangan majburiyat emas.",
    extra: [{ collection: "muslim", number: 6858 }],
  },
};

export type DhikrSetStep = { ref: string; kind: "dua" | "dhikr"; count: number };
export type DhikrSetText = { slug: string; title: string; summary: string; note: string; steps: DhikrSetStep[]; refs: { collection: string; number: number }[] };

export const DHIKR_SETS: DhikrSetText[] = [
  {
    slug: "namozdan-keyingi-zikrlar",
    title: "Namozdan keyingi zikrlar",
    summary: "Farz namozidan salom bergandan keyin aytiladigan zikrlar ketma-ketligi.",
    note: "Sonlar Sahih Muslimdagi rivoyatlarda kelgan. Oyatul Kursiy oʻqish ham Hisnul muslimda keltirilgan; uni qoʻshish ixtiyoriy.",
    steps: [
      { ref: "astagfirulloh", kind: "dhikr", count: 3 },
      { ref: "allohumma-antas-salom", kind: "dua", count: 1 },
      { ref: "oyatul-kursi", kind: "dua", count: 1 },
      { ref: "subhanalloh", kind: "dhikr", count: 33 },
      { ref: "alhamdulillah", kind: "dhikr", count: 33 },
      { ref: "allohu-akbar", kind: "dhikr", count: 33 },
      { ref: "tahlil", kind: "dhikr", count: 1 },
    ],
    refs: [{ collection: "muslim", number: 1334 }, { collection: "muslim", number: 1352 }],
  },
  {
    slug: "ertalabki-zikrlar",
    title: "Ertalabki zikrlar",
    summary: "Bomdod namozidan keyin aytiladigan asosiy zikrlar.",
    note: "Sonlar har bir duoning manbasida koʻrsatilgan. «Subḥānallāhi wa biḥamdih»ning 100 soni kun davomida bajarilishi mumkin.",
    steps: [
      { ref: "oyatul-kursi", kind: "dua", count: 1 },
      { ref: "ixlos-surasi", kind: "dua", count: 3 },
      { ref: "falaq-surasi", kind: "dua", count: 3 },
      { ref: "nos-surasi", kind: "dua", count: 3 },
      { ref: "asbahna-va-asbahal-mulk", kind: "dua", count: 1 },
      { ref: "allohumma-bika-asbahna", kind: "dua", count: 1 },
      { ref: "sayyidul-istigfor", kind: "dua", count: 1 },
      { ref: "bismillahillazi-la-yazurru", kind: "dua", count: 3 },
      { ref: "allohumma-afini-fi-badani", kind: "dua", count: 3 },
      { ref: "subhanallohi-va-bihamdihi", kind: "dhikr", count: 100 },
    ],
    refs: [{ collection: "abudawud", number: 5082 }, { collection: "tirmidhi", number: 3388 }],
  },
  {
    slug: "kechki-zikrlar",
    title: "Kechki zikrlar",
    summary: "Asr namozidan keyin yoki kech kirganda aytiladigan asosiy zikrlar.",
    note: "Sonlar har bir duoning manbasida koʻrsatilgan.",
    steps: [
      { ref: "oyatul-kursi", kind: "dua", count: 1 },
      { ref: "ixlos-surasi", kind: "dua", count: 3 },
      { ref: "falaq-surasi", kind: "dua", count: 3 },
      { ref: "nos-surasi", kind: "dua", count: 3 },
      { ref: "amsayna-va-amsal-mulk", kind: "dua", count: 1 },
      { ref: "allohumma-bika-amsayna", kind: "dua", count: 1 },
      { ref: "sayyidul-istigfor", kind: "dua", count: 1 },
      { ref: "bismillahillazi-la-yazurru", kind: "dua", count: 3 },
      { ref: "auzu-bikalimatillahit-tammat", kind: "dua", count: 1 },
    ],
    refs: [{ collection: "abudawud", number: 5082 }, { collection: "tirmidhi", number: 3388 }],
  },
  {
    slug: "uyqudan-oldingi-tasbeh",
    title: "Uyqudan oldingi tasbeh",
    summary: "Paygʻambarimiz ﷺ Ali va Fotima roziyallohu anhumoga oʻrgatgan tasbeh.",
    note: "Sahih al-Buxoriyda: toʻshakka yotganda 34 marta takbir, 33 marta tasbeh va 33 marta tahmid aytish xizmatkordan yaxshiroq ekani aytilgan.",
    steps: [
      { ref: "subhanalloh", kind: "dhikr", count: 33 },
      { ref: "alhamdulillah", kind: "dhikr", count: 33 },
      { ref: "allohu-akbar", kind: "dhikr", count: 34 },
    ],
    refs: [{ collection: "bukhari", number: 3705 }],
  },
];
