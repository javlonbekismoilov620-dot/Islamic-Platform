import type { QuizQuestion } from "../types";

/** Har bir dars uchun savollar. 8-dars (yakuniy test) barcha savollarni birlashtiradi. */
export const QUIZZES: Record<string, QuizQuestion[]> = {
  "namozga-kirish": [
    { q: "Hanafiy mazhabida bomdod namozining farzi necha rakaat?", options: ["2 rakaat", "3 rakaat", "4 rakaat", "1 rakaat"], answer: 0, explain: "Bomdodning farzi 2 rakaat, undan oldin 2 rakaat sunnati muakkada oʻqiladi." },
    { q: "Shom namozining farzi necha rakaat?", options: ["2 rakaat", "3 rakaat", "4 rakaat", "5 rakaat"], answer: 1, explain: "Shomning farzi 3 rakaat, keyin 2 rakaat sunnat oʻqiladi." },
    { q: "Hanafiy mazhabida vitr namozining hukmi qanday?", options: ["Farz", "Vojib", "Mustahab", "Muboh"], answer: 1, explain: "Hanafiy mazhabida vitr — vojib. U xuftondan keyin uch rakaat oʻqiladi." },
    { q: "«Qavma» nima?", options: ["Ikki sajda orasidagi oʻtirish", "Rukuʼdan keyin tik turish", "Tashahhud uchun oʻtirish", "Namozni boshlash takbiri"], answer: 1, explain: "Qavma — rukuʼdan qad rostlab tik turish. Ikki sajda orasidagi oʻtirish «jalsa» deyiladi." },
  ],
  "namozga-tayyorgarlik": [
    { q: "Quyidagilardan qaysi biri namozning sharti emas?", options: ["Qiblaga yuzlanish", "Avratni yopish", "Rukuʼ qilish", "Vaqtning kirishi"], answer: 2, explain: "Rukuʼ — namozning ichki farzi (rukni). Qolganlari — namozning shartlari." },
    { q: "Hanafiy mazhabida erkakning avrati qayerdan qayergacha?", options: ["Kindikdan tizzagacha (tizza ham kiradi)", "Faqat tizzalar", "Koʻkrakdan oyoqqacha", "Beldan toʻpiqqacha"], answer: 0, explain: "Erkakning avrati kindikdan tizzagacha, tizza avratga kiradi." },
    { q: "Qaysi vaqtda namoz oʻqish makruh?", options: ["Bomdoddan oldin", "Quyosh chiqayotganda", "Shom vaqti kirganda", "Peshin vaqtida"], answer: 1, explain: "Quyosh chiqayotganda, zavol paytida va quyosh botayotganda namoz oʻqish makruh." },
    { q: "Niyat qayerda qilinadi?", options: ["Faqat tilda", "Qalbda — til bilan aytish shart emas", "Faqat yozma ravishda", "Niyat kerak emas"], answer: 1, explain: "Niyat qalbning ishi. Til bilan aytish qalb niyatiga yordam sifatida maqbul, ammo shart emas." },
  ],
  tahorat: [
    { q: "Hanafiy mazhabida tahoratning farzi nechta?", options: ["3 ta", "4 ta", "6 ta", "7 ta"], answer: 1, explain: "Yuzni yuvish, qoʻllarni tirsak bilan yuvish, boshning choragiga mash tortish va oyoqlarni toʻpiq bilan yuvish." },
    { q: "Boshning qancha qismiga mash tortish farz?", options: ["Butun boshga", "Toʻrtdan biriga", "Yarmiga", "Uchta tukka"], answer: 1, explain: "Hanafiy mazhabida boshning toʻrtdan biriga mash tortish farz; butun boshga tortish sunnat." },
    { q: "Hanafiy mazhabida tahoratda niyatning hukmi qanday?", options: ["Farz", "Sunnat", "Makruh", "Vojib"], answer: 1, explain: "Hanafiy mazhabida tahoratda niyat sunnat. Shofeʼiy va Hanbaliy mazhablarida esa farz." },
    { q: "Quyidagilardan qaysi biri Hanafiy mazhabida tahoratni buzadi?", options: ["Ayolga shahvatsiz tegib ketish", "Ogʻiz toʻla qusish", "Oʻtirgan holda mudrash", "Oqmay turgan qon"], answer: 1, explain: "Ogʻiz toʻla qusish tahoratni buzadi. Qolganlari Hanafiy mazhabida tahoratni buzmaydi." },
  ],
  gusl: [
    { q: "Hanafiy mazhabida gʻuslning farzi nechta?", options: ["1 ta", "2 ta", "3 ta", "4 ta"], answer: 2, explain: "Ogʻizni chayish, burunni chayish va butun badanni yuvish." },
    { q: "Quyidagilardan qaysi biri gʻuslni farz qiladi?", options: ["Juma kuni", "Hayz tugashi", "Hayit kuni", "Ehromga kirish"], answer: 1, explain: "Hayz tugashi gʻuslni farz qiladi. Juma, hayit va ehrom uchun gʻusl — sunnat." },
    { q: "Ayol gʻuslda soch oʻrimlarini yechishi shartmi (Hanafiy)?", options: ["Ha, har doim", "Yoʻq, suv soch ildiziga yetsa kifoya", "Faqat hayzdan keyin", "Faqat janobatdan keyin"], answer: 1, explain: "Hanafiy mazhabida oʻrimni yechish shart emas, suv soch ildizlariga yetishi kifoya." },
    { q: "Junub kishiga quyidagilardan qaysi biri joiz?", options: ["Namoz oʻqish", "Qurʼonni ushlash", "Zikr va salovot aytish", "Masjidga kirish"], answer: 2, explain: "Zikr, duo va salovot junub kishiga ham joiz. Qolganlari gʻusldan keyingina mumkin." },
  ],
  "namoz-sozlari": [
    { q: "Sano qachon oʻqiladi?", options: ["Rukuʼda", "Iftitoh takbiridan keyin", "Salomdan oldin", "Sajdada"], answer: 1, explain: "Sano iftitoh takbiridan keyin, qoʻllar bogʻlangach ichida oʻqiladi." },
    { q: "Rukuʼda nima deyiladi?", options: ["Subḥāna rabbiyal-aʻlā", "Subḥāna rabbiyal-ʻaẓīm", "Samiʻallāhu liman ḥamidah", "Allāhu akbar"], answer: 1, explain: "Rukuʼda «Subḥāna rabbiyal-ʻaẓīm», sajdada «Subḥāna rabbiyal-aʻlā» deyiladi." },
    { q: "Hanafiy mazhabi qaysi sahobiy rivoyat qilgan tashahhudni afzal biladi?", options: ["Abdulloh ibn Abbos", "Abdulloh ibn Masʼud", "Umar ibn Xattob", "Abu Hurayra"], answer: 1, explain: "Hanafiylar Abdulloh ibn Masʼud roziyallohu anhu rivoyat qilgan «At-taḥiyyātu lillāh» tashahhudini afzal biladi." },
    { q: "Salovoti Ibrohimiya namozning qaysi qismida oʻqiladi?", options: ["Birinchi qaʼdada", "Oxirgi qaʼdada, tashahhuddan keyin", "Qiyomda", "Rukuʼda"], answer: 1, explain: "Salovot oxirgi qaʼdada tashahhuddan keyin oʻqiladi; birinchi qaʼdada faqat tashahhud oʻqiladi." },
  ],
  "amaliy-namoz": [
    { q: "Hanafiy mazhabida erkaklar qoʻllarini qayerda bogʻlaydi?", options: ["Koʻkrak ustida", "Kindik ostida", "Qoʻllar bogʻlanmaydi", "Boʻyin ostida"], answer: 1, explain: "Erkaklar qoʻllarini kindik ostida, ayollar koʻkrak ustida bogʻlaydi." },
    { q: "Toʻrt rakaatli farz namozining 3- va 4-rakaatlarida nima oʻqiladi?", options: ["Fotiha va zam sura", "Faqat Fotiha", "Faqat zam sura", "Hech narsa"], answer: 1, explain: "Farz namozlarining oxirgi rakaatlarida faqat Fotiha oʻqiladi." },
    { q: "Hanafiy mazhabida imomga iqtido qilgan kishi nima oʻqiydi?", options: ["Fotiha va zam sura", "Faqat Fotiha", "Faqat sano (qiroat qilmaydi)", "Hech narsa"], answer: 2, explain: "Muqtadiy sano oʻqiydi, qiroat qilmaydi — imomning qiroati unga kifoya." },
    { q: "Vitr namozida qunut qachon oʻqiladi?", options: ["Uchinchi rakaatda rukuʼdan oldin", "Uchinchi rakaatda rukuʼdan keyin", "Birinchi rakaatda", "Salomdan keyin"], answer: 0, explain: "Hanafiy mazhabida qunut uchinchi rakaatda, zam suradan keyin takbir aytib, rukuʼdan oldin oʻqiladi." },
  ],
  "kop-uchraydigan-xatolar": [
    { q: "Namozda unutib gapirib yuborilsa, namoz…", options: ["Buzilmaydi", "Buziladi", "Sajdai sahv kifoya", "Makruh boʻladi, xolos"], answer: 1, explain: "Hanafiy mazhabida namozda gapirish (unutib boʻlsa ham) namozni buzadi." },
    { q: "Vojib unutib tark etilsa, nima qilinadi?", options: ["Namoz qayta oʻqiladi", "Sajdai sahv qilinadi", "Hech narsa qilinmaydi", "Sadaqa beriladi"], answer: 1, explain: "Vojib unutib tark etilsa, sajdai sahv qilinadi. Farz tark etilsa, namoz qayta oʻqiladi." },
    { q: "Namozda Allohdan qoʻrqib yigʻlash namozni…", options: ["Buzadi", "Buzmaydi", "Makruh qiladi", "Qayta oʻqishni talab qiladi"], answer: 1, explain: "Allohdan qoʻrqib yoki oxiratni eslab yigʻlash namozni buzmaydi." },
    { q: "Rukuʼ va sajdada xotirjam turish (taʼdili arkon) Hanafiy mazhabida…", options: ["Farz", "Vojib", "Mustahab", "Muboh"], answer: 1, explain: "Hanafiy mazhabida taʼdili arkon vojib; tark etilsa sajdai sahv lozim boʻladi." },
  ],
};

export const FINAL_QUIZ_SLUG = "bilimni-sinash";
