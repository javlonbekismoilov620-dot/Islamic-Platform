/**
 * Duolarning arabcha matni qayerdan olinishi va qaysi manba bilan solishtirilishi.
 *  - hisn:   "Hisnul muslim" (Saʼid al-Qahtoniy) harakatli matni (rn0x/Adhkar-json) — start/end bilan kesiladi
 *  - quran:  Tanzil Uthmani matni (oyat raqamlari bilan)
 *  - hadith: hadis toʻplami matnidan aynan kesish
 *  - manual: maʼlumotlar toʻplamlarida mavjud emas — QOʻLDA TEKSHIRISH TALAB QILINADI
 * `check` — arabcha matn shu hadis matni ichida borligini avtomatik tekshirish.
 */
export type ArabicSpec =
  | { kind: "hisn"; start: string; end?: string }
  | { kind: "quran"; s: number; a: number; to?: number; start?: string; end?: string }
  | { kind: "hadith"; collection: string; number: number; start: string; end?: string }
  | { kind: "hadith-lines"; collection: string; number: number; lines: { label: string; start: string; end?: string }[] }
  | { kind: "manual"; text: string; note: string };

export type DuaPick = { id: string; arabic: ArabicSpec; check?: { collection: string; number: number }[] };

export const DUA_SELECTION: DuaPick[] = [
  // Ertalab / kechqurun
  { id: "asbahna-va-asbahal-mulk", arabic: { kind: "hisn", start: "أصبحنا وأصبح الملك لله", end: "وعذاب في القبر" } },
  { id: "amsayna-va-amsal-mulk", arabic: { kind: "hadith-lines", collection: "muslim", number: 6908, lines: [{ label: "", start: "أمسينا وأمسى الملك لله", end: "وحده لا شريك له" }, { label: "", start: "له الملك وله الحمد وهو على كل شيء قدير رب أسألك", end: "وعذاب في القبر" }] } },
  { id: "allohumma-bika-asbahna", arabic: { kind: "hadith", collection: "tirmidhi", number: 3391, start: "اللهم بك أصبحنا وبك أمسينا", end: "وإليك المصير" } },
  { id: "allohumma-bika-amsayna", arabic: { kind: "hadith", collection: "tirmidhi", number: 3391, start: "اللهم بك أمسينا وبك أصبحنا", end: "وإليك النشور" } },
  { id: "bismillahillazi-la-yazurru", arabic: { kind: "hisn", start: "بسم الله الذي لا يضر مع اسمه شيء", end: "وهو السميع العليم" }, check: [{ collection: "tirmidhi", number: 3388 }, { collection: "abudawud", number: 5088 }] },
  { id: "roziytu-billahi-robban", arabic: { kind: "hisn", start: "رضيت بالله ربا", end: "نبيا" } },
  { id: "allohumma-afini-fi-badani", arabic: { kind: "hisn", start: "اللهم عافني في بدني", end: "لا إله إلا أنت" }, check: [{ collection: "abudawud", number: 5090 }] },
  { id: "auzu-bikalimatillahit-tammat", arabic: { kind: "hisn", start: "أعوذ بكلمات الله التامات من شر ما خلق" }, check: [{ collection: "muslim", number: 6878 }] },
  { id: "sayyidul-istigfor", arabic: { kind: "hadith", collection: "bukhari", number: 6306, start: "اللهم أنت ربي لا إله إلا أنت", end: "فإنه لا يغفر الذنوب إلا أنت" } },
  { id: "oyatul-kursi", arabic: { kind: "quran", s: 2, a: 255 } },
  { id: "ixlos-surasi", arabic: { kind: "quran", s: 112, a: 1, to: 4 } },
  { id: "falaq-surasi", arabic: { kind: "quran", s: 113, a: 1, to: 5 } },
  { id: "nos-surasi", arabic: { kind: "quran", s: 114, a: 1, to: 6 } },
  // Uyqu
  { id: "bismika-allohumma-amutu", arabic: { kind: "hadith", collection: "bukhari", number: 6324, start: "باسمك اللهم أموت وأحيا" } },
  { id: "allohumma-qini-azabaka", arabic: { kind: "hisn", start: "اللهم قني عذابك يوم تبعث عبادك" }, check: [{ collection: "abudawud", number: 5045 }] },
  { id: "bismika-robbi-vazatu", arabic: { kind: "hadith", collection: "bukhari", number: 6320, start: "باسمك رب وضعت جنبي", end: "بما تحفظ به عبادك الصالحين" } },
  { id: "alhamdulillahillazi-ahyana", arabic: { kind: "hisn", start: "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور" }, check: [{ collection: "bukhari", number: 6312 }] },
  // Taom
  { id: "taomdan-oldin-bismillah", arabic: { kind: "hadith", collection: "abudawud", number: 3767, start: "بسم الله أوله وآخره" } },
  { id: "alhamdulillahillazi-atamani", arabic: { kind: "hisn", start: "الحمد لله الذي أطعمني هذا", end: "من غير حول مني ولا قوة" }, check: [{ collection: "tirmidhi", number: 3458 }] },
  { id: "hamdan-kasiran-tayyiban", arabic: { kind: "hadith", collection: "bukhari", number: 5458, start: "الحمد لله كثيرا طيبا مباركا فيه", end: "ربنا" } },
  // Uy, masjid, kiyim, hojatxona
  { id: "uydan-chiqishda", arabic: { kind: "hadith", collection: "tirmidhi", number: 3426, start: "بسم الله توكلت على الله لا حول ولا قوة إلا بالله" } },
  { id: "masjidga-kirishda", arabic: { kind: "hadith", collection: "muslim", number: 1652, start: "اللهم افتح لي أبواب رحمتك" } },
  { id: "masjiddan-chiqishda", arabic: { kind: "hadith", collection: "muslim", number: 1652, start: "اللهم إني أسألك من فضلك" } },
  { id: "kiyim-kiyganda", arabic: { kind: "hisn", start: "الحمد لله الذي كساني هذا", end: "من غير حول مني ولا قوة" } },
  { id: "hojatxonaga-kirishda", arabic: { kind: "hadith", collection: "bukhari", number: 142, start: "اللهم إني أعوذ بك من الخبث والخبائث" } },
  { id: "hojatxonadan-chiqqanda", arabic: { kind: "hadith", collection: "tirmidhi", number: 7, start: "غفرانك" } },
  // Safar
  { id: "ulovga-minganda", arabic: { kind: "hisn", start: "سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون" } },
  { id: "safar-duosi", arabic: { kind: "hadith", collection: "muslim", number: 3275, start: "سبحان الذي سخر لنا هذا", end: "والأهل" } },
  { id: "safardan-qaytganda", arabic: { kind: "hisn", start: "آيبون تائبون عابدون لربنا حامدون" }, check: [{ collection: "muslim", number: 3275 }] },
  // Tavba
  { id: "astagʻfirullohal-aziym", arabic: { kind: "hisn", start: "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه" }, check: [{ collection: "tirmidhi", number: 3577 }] },
  { id: "robbigʻfirli-va-tub-alayya", arabic: { kind: "hadith", collection: "tirmidhi", number: 3434, start: "رب اغفر لي وتب علي إنك أنت التواب" } },
  { id: "robbana-zolamna", arabic: { kind: "quran", s: 7, a: 23, start: "ربنا ظلمنا أنفسنا" } },
  { id: "abu-bakr-duosi", arabic: { kind: "hadith", collection: "bukhari", number: 834, start: "اللهم إني ظلمت نفسي ظلما كثيرا", end: "إنك أنت الغفور الرحيم" } },
  // Shukr
  { id: "robbi-avzigʻniy", arabic: { kind: "quran", s: 27, a: 19, start: "رب أوزعني" } },
  { id: "allohumma-ainni-ala-zikrika", arabic: { kind: "hadith", collection: "abudawud", number: 1522, start: "اللهم أعني على ذكرك وشكرك وحسن عبادتك" } },
  // Ota-ona
  { id: "robbirhamhuma", arabic: { kind: "quran", s: 17, a: 24, start: "رب ارحمهما" } },
  { id: "robbanagʻfirli-va-livolidayya", arabic: { kind: "quran", s: 14, a: 41 } },
  { id: "nuh-duosi", arabic: { kind: "quran", s: 71, a: 28 } },
  // Ilm
  { id: "robbi-zidni-ilma", arabic: { kind: "quran", s: 20, a: 114, start: "رب زدني علما" } },
  { id: "robbishroh-li-sodri", arabic: { kind: "quran", s: 20, a: 25, to: 28, start: "رب اشرح لي صدري" } },
  { id: "ilman-nafia", arabic: { kind: "hadith", collection: "ibnmajah", number: 925, start: "اللهم إني أسألك علما نافعا", end: "وعملا متقبلا" } },
  { id: "foydasiz-ilmdan-panoh", arabic: { kind: "hadith", collection: "muslim", number: 6906, start: "اللهم إني أعوذ بك من علم لا ينفع", end: "ومن دعوة لا يستجاب لها" } },
  // Qiyinchilik
  { id: "gʻam-va-qaygʻudan-panoh", arabic: { kind: "hadith", collection: "bukhari", number: 6369, start: "اللهم إني أعوذ بك من الهم والحزن", end: "وغلبة الرجال" } },
  { id: "karb-duosi", arabic: { kind: "hadith", collection: "bukhari", number: 6346, start: "لا إله إلا الله العظيم الحليم", end: "ورب العرش الكريم" } },
  { id: "yunus-duosi", arabic: { kind: "quran", s: 21, a: 87, start: "لا إله إلا أنت سبحانك" } },
  { id: "hasbunallohu", arabic: { kind: "quran", s: 3, a: 173, start: "حسبنا الله ونعم الوكيل" } },
  { id: "musibat-duosi", arabic: { kind: "hadith", collection: "muslim", number: 2126, start: "إنا لله وإنا إليه راجعون اللهم أجرني في مصيبتي", end: "خيرا منها" } },
  // Kasallik
  { id: "bemor-uchun-ruqya", arabic: { kind: "hadith", collection: "bukhari", number: 5675, start: "أذهب البأس رب الناس", end: "شفاء لا يغادر سقما" } },
  { id: "ogʻriq-uchun", arabic: { kind: "hadith", collection: "muslim", number: 5737, start: "أعوذ بالله وقدرته من شر ما أجد وأحاذر" } },
  { id: "bemorni-yoqlaganda", arabic: { kind: "hadith", collection: "bukhari", number: 3616, start: "لا بأس طهور إن شاء الله" } },
  // Kundalik
  { id: "aksirganda", arabic: { kind: "hadith-lines", collection: "bukhari", number: 6224, lines: [{ label: "Aksa urgan kishi aytadi", start: "الحمد لله" }, { label: "Eshitgan kishi javob beradi", start: "يرحمك الله" }, { label: "Aksa urgan kishi qaytaradi", start: "يهديكم الله ويصلح بالكم" }] } },
  { id: "majlis-kafforati", arabic: { kind: "hadith", collection: "tirmidhi", number: 3433, start: "سبحانك اللهم وبحمدك أشهد أن لا إله إلا أنت أستغفرك وأتوب إليك" } },
  { id: "gʻazablanganda", arabic: { kind: "hadith", collection: "bukhari", number: 6115, start: "أعوذ بالله من الشيطان الرجيم" }, check: [{ collection: "muslim", number: 6646 }] },
  { id: "yangi-oy-koʻrilganda", arabic: { kind: "hadith", collection: "tirmidhi", number: 3451, start: "اللهم أهلله علينا", end: "ربي وربك الله" } },
  // Ramazon
  { id: "iftor-zahabaz-zamau", arabic: { kind: "hadith", collection: "abudawud", number: 2357, start: "ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله" } },
  { id: "iftor-allohumma-laka-sumtu", arabic: { kind: "hadith", collection: "abudawud", number: 2358, start: "اللهم لك صمت وعلى رزقك أفطرت" } },
  { id: "qadr-kechasi-duosi", arabic: { kind: "hadith", collection: "tirmidhi", number: 3513, start: "اللهم إنك عفو", end: "فاعف عني" } },
  // Haj
  { id: "talbiya", arabic: { kind: "hadith", collection: "bukhari", number: 1549, start: "لبيك اللهم لبيك", end: "والملك لا شريك لك" } },
  { id: "robbana-atina", arabic: { kind: "quran", s: 2, a: 201, start: "ربنا آتنا في الدنيا حسنة" } },
  { id: "arafa-kuni-duosi", arabic: { kind: "hadith", collection: "tirmidhi", number: 3585, start: "لا إله إلا الله وحده لا شريك له", end: "وهو على كل شيء قدير" } },
  // Namoz
  { id: "sano", arabic: { kind: "hadith", collection: "tirmidhi", number: 243, start: "سبحانك اللهم وبحمدك وتبارك اسمك وتعالى جدك ولا إله غيرك" } },
  { id: "ruku-tasbehi", arabic: { kind: "hadith", collection: "muslim", number: 1814, start: "سبحان ربي العظيم" } },
  { id: "sajda-tasbehi", arabic: { kind: "hadith", collection: "muslim", number: 1814, start: "سبحان ربي الأعلى" } },
  { id: "tasmi-va-tahmid", arabic: { kind: "hadith-lines", collection: "bukhari", number: 795, lines: [{ label: "Ruku’dan turayotganda (tasmiʼ)", start: "سمع الله لمن حمده" }, { label: "Qad rostlaganda (tahmid)", start: "اللهم ربنا ولك الحمد" }] } },
  { id: "tashahhud", arabic: { kind: "hadith", collection: "bukhari", number: 831, start: "التحيات لله والصلوات والطيبات", end: "وأشهد أن محمدا عبده ورسوله" } },
  { id: "salovoti-ibrohimiya", arabic: { kind: "hadith", collection: "bukhari", number: 3370, start: "اللهم صل على محمد وعلى آل محمد", end: "إنك حميد مجيد اللهم بارك على محمد وعلى آل محمد كما باركت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد" } },
  { id: "allohumma-antas-salom", arabic: { kind: "hadith", collection: "muslim", number: 1334, start: "اللهم أنت السلام ومنك السلام", end: "ذا الجلال والإكرام" } },
  { id: "tahoratdan-keyin", arabic: { kind: "hadith", collection: "muslim", number: 554, start: "أشهد أن لا إله إلا الله وحده لا شريك له", end: "وأشهد أن محمدا عبده ورسوله" } },
  { id: "azondan-keyin", arabic: { kind: "hadith", collection: "bukhari", number: 614, start: "اللهم رب هذه الدعوة التامة", end: "الذي وعدته" } },
  {
    id: "qunut-duosi",
    arabic: {
      kind: "manual",
      text: "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ كُلَّهُ نَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ، اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَى وَنَحْفِدُ نَرْجُو رَحْمَتَكَ وَنَخْشَى عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ",
      note: "Hanafiy mazhabidagi vitr qunuti. Ushbu toʻplamlarda (Kutubi sitta) mavjud emas; Ibn Abu Shayba va Bayhaqiy rivoyatlari hamda Hanafiy fiqh kitoblari bilan qoʻlda solishtirilishi shart.",
    },
  },
];
