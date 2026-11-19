/**
 * Islomiy taqvimdagi muhim kunlar. Hijriy sanalar hisobga koʻra koʻrsatiladi; amaldagi sana
 * Oʻzbekistonda oy koʻrinishiga (hilol)ga qarab Oʻzbekiston musulmonlari idorasi tomonidan eʼlon qilinadi.
 */
export type EventText = { slug: string; title: string; hijriMonth: number; hijriDay: number; days?: number; kind: "eid" | "fast" | "night" | "month" | "day"; moonDependent: boolean; fasting?: "farz" | "sunnat" | "mustahab" | "harom" | "makruh" | null; description: string; hadith?: string };

export const EVENTS: EventText[] = [
  { slug: "hijriy-yangi-yil", title: "Hijriy yangi yil", hijriMonth: 1, hijriDay: 1, kind: "day", moonDependent: true, description: "Muharram oyining birinchi kuni — hijriy yilning boshlanishi. Hijriy taqvim Paygʻambarimizning ﷺ Makkadan Madinaga hijratidan boshlanadi." },
  { slug: "ashuro", title: "Ashuro kuni", hijriMonth: 1, hijriDay: 10, kind: "fast", moonDependent: true, fasting: "mustahab", description: "Muharramning 10-kuni. Bu kuni roʻza tutish mustahab; Hanafiy ulamolari faqat bir kun emas, 9-kun yoki 11-kun bilan qoʻshib tutishni tavsiya qilganlar.", hadith: "arafa-va-ashuro" },
  { slug: "mavlid", title: "Mavlid kechasi", hijriMonth: 3, hijriDay: 12, kind: "day", moonDependent: true, description: "Robiul-avval oyi — Paygʻambarimiz ﷺ tugʻilgan oy. Mashhur rivoyatlarga koʻra 12-kun; tugʻilgan kunning aniq sanasi haqida tarixchilar orasida turli qavllar bor. Oʻzbekistonda bu kunlarda Paygʻambarimiz siyratlari eslanadi." },
  { slug: "rajab-oyi", title: "Rajab oyining boshlanishi", hijriMonth: 7, hijriDay: 1, kind: "month", moonDependent: true, description: "Rajab — urush qilish man etilgan toʻrt hurmatli oyning biri (Zulqaʼda, Zulhijja, Muharram va Rajab)." },
  { slug: "isro-va-meroj", title: "Isro va Meʼroj kechasi", hijriMonth: 7, hijriDay: 27, kind: "night", moonDependent: true, description: "Mashhur qavlga koʻra Rajabning 27-kechasi. Isro va Meʼroj voqeasi Qurʼon va sahih hadislarda kelgan, ammo aniq sanasi haqida ulamolar orasida turli qavllar bor. Besh vaqt namoz shu kechada farz qilingan." },
  { slug: "baroat-kechasi", title: "Baroat kechasi", hijriMonth: 8, hijriDay: 15, kind: "night", moonDependent: true, description: "Shaʼbonning 15-kechasi. Bu kechaning fazilati haqidagi rivoyatlar va ularning darajalari haqida ulamolar orasida bahs bor; koʻp Hanafiy ulamolari bu kechani ibodat bilan oʻtkazishni maqbul koʻrganlar." },
  { slug: "ramazon-boshlanishi", title: "Ramazon oyining boshlanishi", hijriMonth: 9, hijriDay: 1, days: 30, kind: "month", moonDependent: true, fasting: "farz", description: "Ramazon roʻzasi farz. Roʻzaning boshlanish sanasi Oʻzbekistonda oy koʻrinishi asosida Oʻzbekiston musulmonlari idorasi tomonidan eʼlon qilinadi.", hadith: "ramazon-eshiklari" },
  { slug: "qadr-kechasi", title: "Qadr kechasi (umid qilingan)", hijriMonth: 9, hijriDay: 27, kind: "night", moonDependent: true, description: "Qadr kechasi Ramazonning oxirgi oʻn kunidagi toq kechalardan birida. Koʻpchilik 27-kechani umid qiladi; aniq sanasi maʼlum emas.", hadith: "qadr-kechasini-izlash" },
  { slug: "ramazon-hayiti", title: "Ramazon hayiti (Iyd al-Fitr)", hijriMonth: 10, hijriDay: 1, kind: "eid", moonDependent: true, fasting: "harom", description: "Shavvolning birinchi kuni. Hayit namozi Hanafiy mazhabida vojib. Hayit kuni roʻza tutish harom. Fitr sadaqasi hayit namozidan oldin beriladi." },
  { slug: "shavvol-olti-kun", title: "Shavvolning olti kuni", hijriMonth: 10, hijriDay: 2, days: 6, kind: "fast", moonDependent: true, fasting: "mustahab", description: "Hayitdan keyin Shavvol oyida olti kun roʻza tutish mustahab; ketma-ket yoki boʻlib tutish mumkin.", hadith: "shavvolning-olti-kuni" },
  { slug: "zulhijja-oyining-avvali", title: "Zulhijjaning birinchi oʻn kuni", hijriMonth: 12, hijriDay: 1, days: 9, kind: "month", moonDependent: true, description: "Yilning eng fazilatli kunlaridan. Bu kunlarda zikr, roʻza va yaxshi amallarni koʻpaytirish tavsiya etiladi." },
  { slug: "arafa-kuni", title: "Arafa kuni", hijriMonth: 12, hijriDay: 9, kind: "fast", moonDependent: true, fasting: "mustahab", description: "Hojilar Arafotda turadigan kun. Haj qilmayotganlar uchun bu kuni roʻza tutish mustahab. Shu kunning bomdodidan boshlab tashriq takbirlari aytiladi.", hadith: "arafa-va-ashuro" },
  { slug: "qurbon-hayiti", title: "Qurbon hayiti (Iyd al-Adho)", hijriMonth: 12, hijriDay: 10, days: 3, kind: "eid", moonDependent: true, fasting: "harom", description: "Zulhijjaning 10-kuni. Hayit namozi vojib. Nisob egasiga qurbonlik qilish Hanafiy mazhabida vojib; qurbonlik 10, 11 va 12-kunlarda qilinadi. Hayit va tashriq kunlarida (10–13) roʻza tutish harom." },
];

/** Har oy takrorlanadigan va haftalik nafl roʻzalar. */
export const RECURRING_FASTS = [
  { title: "Oyning «oq kunlari»", days: [13, 14, 15], fasting: "mustahab" as const, hadith: "oyning-oq-kunlari", description: "Har hijriy oyning 13, 14 va 15-kunlari." },
  { title: "Dushanba va payshanba", weekdays: [1, 4], fasting: "mustahab" as const, hadith: "dushanba-payshanba", description: "Haftaning dushanba va payshanba kunlari." },
];
