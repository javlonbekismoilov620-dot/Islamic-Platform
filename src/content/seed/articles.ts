/**
 * «Bilimlar» kutubxonasi maqolalari — tahririyat qoralamasi (ulamolar tekshiruvi kutilmoqda).
 * Qurʼon oyatlari ::quran{} orqali tasdiqlangan tarjima bilan, hadislar ::hadith{} orqali manbadagi
 * arabcha matn bilan koʻrsatiladi. Hanafiy fiqh manbalari kitob va bob darajasida keltirilgan.
 */
export type ArticleText = { slug: string; category: string; title: string; summary: string; minutes: number; keyPoints: string[]; markdown: string; refs: { title: string; author?: string; locator?: string }[] };

const NUR = { title: "Nur al-iyzoh", author: "Hasan ibn Ammor ash-Shurunbuloliy" };
const QUDURIY = { title: "Muxtasar al-Quduriy", author: "Abul-Husayn Ahmad al-Quduriy" };
const HIDOYA = { title: "Al-Hidoya", author: "Burhoniddin al-Margʻinoniy" };
const RADD = { title: "Radd al-muhtor", author: "Ibn Obidin" };
const ZUHAYLI = { title: "Al-Fiqh al-islomiy va adillatuh", author: "Vahba az-Zuhayliy" };

export const ARTICLES: ArticleText[] = [
  {
    slug: "iymon-asoslari",
    category: "aqida",
    title: "Iymon asoslari",
    summary: "Ahli sunna val-jamoa aqidasidagi iymonning olti rukni va Moturidiy maktabi.",
    minutes: 6,
    keyPoints: ["Iymonning olti rukni bor", "Oʻzbekiston musulmonlari aqidada Moturidiy maktabiga ergashadi", "Iymon qalb bilan tasdiq va til bilan iqrordir"],
    refs: [
      { title: "Al-Aqida at-Tahoviya", author: "Imom Abu Jaʼfar at-Tahoviy (Hanafiy)" },
      { title: "Aqoid an-Nasafiya", author: "Imom Umar an-Nasafiy" },
      { title: "Kitob at-tavhid", author: "Imom Abu Mansur al-Moturidiy" },
    ],
    markdown: `## Iymon nima?

Hanafiy va Moturidiy ulamolar taʼrifiga koʻra, iymon — Paygʻambarimiz ﷺ Alloh tomonidan olib kelgan narsalarni qalb bilan tasdiqlash va til bilan iqror qilishdir. Amallar iymonning kamoli va mevasidir.

## Iymonning olti rukni

Jibril alayhissalom hadisida iymon quyidagicha taʼriflangan:

::hadith{jibril-hadisi}

1. **Allohga iymon** — Uning yagonaligi, sheriksizligi va barcha kamolot sifatlariga egaligiga.
2. **Farishtalarga iymon.**
3. **Kitoblarga iymon** — Tavrot, Zabur, Injil va Qurʼoni karimga.
4. **Paygʻambarlarga iymon** — birinchisi Odam alayhissalom, oxirgisi Muhammad ﷺ.
5. **Oxirat kuniga iymon** — qabr, qayta tirilish, hisob, jannat va doʻzaxga.
6. **Qadarga iymon** — yaxshi-yomon hamma narsa Allohning ilmi va irodasi bilan boʻlishiga.

::quran{2:285}

## Tavhid

::quran{112:1-4}

Ixlos surasi tavhidning asosini bayon qiladi: Alloh yagona, behojat, tugʻmagan va tugʻilmagan, Unga hech kim teng emas.

## Moturidiy maktabi

Imom Abu Mansur al-Moturidiy (Samarqand, vaf. 333 h.) Ahli sunna val-jamoa aqidasining ikki asosiy maktabidan birining asoschisidir. Hanafiy mazhabidagi musulmonlar, jumladan Oʻzbekiston musulmonlari, aqidada asosan Moturidiy maktabiga ergashadilar. Imom Umar an-Nasafiyning «Aqoid» asari ham shu yurtda yozilgan va asrlar davomida madrasalarda oʻqitilgan.

:::ixtilof
Moturidiy va Ashʼariy maktablari Ahli sunna val-jamoaning ikki maktabi boʻlib, ular orasidagi farqlar asosan nazariy masalalarda. Ikkala maktab ham bir-birini Ahli sunna deb biladi.
:::

:::eslatma
Aqida masalalari nozik. Savollaringiz boʻyicha ishonchli ulamolarga va Oʻzbekiston musulmonlari idorasi nashrlariga murojaat qiling.
:::
`,
  },
  {
    slug: "tahorat-ahkomlari",
    category: "tahorat",
    title: "Poklik (tahorat) ahkomlari",
    summary: "Najosat, tahorat, gʻusl va tayammum haqida umumiy tushuncha.",
    minutes: 6,
    keyPoints: ["Poklik — namozning kaliti", "Hadas ikki xil: kichik va katta", "Suv topilmaganda tayammum qilinadi"],
    refs: [{ ...NUR, locator: "Kitob at-tahorat" }, { ...QUDURIY, locator: "Kitob at-tahorat" }, { ...HIDOYA, locator: "Kitob at-tahorat" }],
    markdown: `## Poklikning ahamiyati

::hadith{poklik-iymon-yarmi}

::hadith{namoz-kaliti}

Islomda poklik ikki xil:

- **Hadasdan poklanish** — tahorat (kichik hadasdan) va gʻusl (katta hadasdan).
- **Najosatdan poklanish** — badan, kiyim va joyni najosatdan tozalash.

::quran{2:222}

## Tahorat

Tahoratning Hanafiy mazhabidagi toʻrt farzi, sunnatlari va uni buzadigan narsalar «Namoz akademiyasi»ning [Tahorat](/ibodat/namoz/tahorat) darsida batafsil bayon qilingan.

## Gʻusl

Janobat, hayz va nifosdan keyin gʻusl farz. Hanafiy mazhabida gʻuslning farzi uchta: ogʻizni chayish, burunni chayish va butun badanni yuvish. Batafsil — [Gʻusl](/ibodat/namoz/gusl) darsida.

## Tayammum

Suv topilmasa yoki suv ishlatish kasallikka zarar yetkazsa, pok tuproq (yoki tuproq jinsidan boʻlgan narsa) bilan tayammum qilinadi.

:::farz
Hanafiy mazhabida tayammumning farzlari: **niyat**, qoʻllarni pok tuproqqa urib **yuzga mash tortish** va qayta urib **ikki qoʻlni tirsaklar bilan mash qilish**.
:::

:::ixtilof
Tahoratda niyat Hanafiy mazhabida sunnat boʻlsa-da, tayammumda niyat farz hisoblanadi. Suv topilishi bilan tayammum bekor boʻladi.
:::

:::eslatma
Kasallik, jarohat yoki bogʻlam (jabira) holatlarida maxsus qoidalar bor. Shaxsiy holatingiz boʻyicha ulamodan soʻrang.
:::
`,
  },
  {
    slug: "namoz-ahkomlari",
    category: "namoz",
    title: "Namoz ahkomlari",
    summary: "Namozning farzligi, shartlari, rukunlari, vojib va sunnatlari — Hanafiy mazhabi boʻyicha qisqacha.",
    minutes: 7,
    keyPoints: ["Besh vaqt namoz har bir balogʻatga yetgan musulmonga farz", "Namozning 6 sharti va 6 rukni bor", "Vitr Hanafiy mazhabida vojib"],
    refs: [{ ...NUR, locator: "Kitob as-salot" }, { ...QUDURIY, locator: "Kitob as-salot" }, { ...HIDOYA, locator: "Kitob as-salot" }, { ...RADD, locator: "Kitob as-salot" }],
    markdown: `## Namozning farzligi

::quran{2:43}

::quran{4:103}

Besh vaqt namoz oqil, balogʻatga yetgan har bir musulmonga farz. Uning farzligini inkor etish kufr, dangasalik bilan tark etish esa katta gunohdir.

::hadith{namozni-tark-etish}

## Namoz nimaga olib keladi?

::quran{29:45}

## Asosiy qoidalar

- **Shartlar (6):** hadasdan poklanish, najosatdan poklanish, avratni yopish, qiblaga yuzlanish, vaqt, niyat.
- **Rukunlar (6):** iftitoh takbiri, qiyom, qiroat, rukuʼ, sajda, qaʼdai axira.
- **Vojiblar:** Fotiha, zam sura, taʼdili arkon, birinchi qaʼda, tashahhud, salom lafzi, vitrdagi qunut va boshqalar.
- **Sunnatlar:** sano, taʼavvuz, basmala, «Āmīn», oʻtish takbirlari, rukuʼ va sajda tasbehlari, salovot va boshqalar.

Har biri «Namoz akademiyasi» darslarida misollar bilan tushuntirilgan.

## Qazo namozlari

Uzr bilan yoki uzrsiz qoldirilgan farz va vojib namozlarni qazo qilish lozim. Qazo namozlarini makruh vaqtlardan boshqa istalgan vaqtda oʻqish mumkin.

:::eslatma
Koʻp yillik qazo namozlari boʻlgan kishi har kuni bir necha qazo namozi oʻqib borishi mumkin. Bunday holatda tartib va niyat qoidalarini ulamodan oʻrganing.
:::

## Musofir namozi

Hanafiy mazhabida taxminan 88–90 km (uch kunlik yoʻl) va undan uzoq masofaga safar qilgan kishi toʻrt rakaatli farz namozlarini ikki rakaat oʻqiydi (qasr). Bir joyda 15 kun va undan koʻp qolishni niyat qilsa, toʻliq oʻqiydi.

:::ixtilof
Safar masofasini zamonaviy oʻlchovlarga oʻtkazishda Hanafiy ulamolari orasida turli hisob-kitoblar bor (taxminan 77–90 km). Aniq masofa boʻyicha mahalliy diniy idoraning fatvosiga amal qiling.
:::
`,
  },
  {
    slug: "roza-ahkomlari",
    category: "roza",
    title: "Roʻza ahkomlari",
    summary: "Ramazon roʻzasining farzligi, niyat, roʻzani buzadigan narsalar, qazo va kafforat.",
    minutes: 7,
    keyPoints: ["Ramazon roʻzasi farz", "Unutib yeb-ichish roʻzani buzmaydi", "Uzrsiz qasddan buzilgan roʻza uchun qazo va kafforat lozim boʻlishi mumkin"],
    refs: [{ ...NUR, locator: "Kitob as-savm" }, { ...QUDURIY, locator: "Kitob as-savm" }, { ...HIDOYA, locator: "Kitob as-savm" }],
    markdown: `## Ramazon roʻzasi

::quran{2:183}

::quran{2:185}

Ramazon roʻzasi oqil, balogʻatga yetgan, sogʻlom va muqim har bir musulmonga farz. Roʻza — tong yorishishidan (subhi sodiq) quyosh botguncha yeyish, ichish va er-xotin yaqinligidan niyat bilan tiyilishdir.

::hadith{ramazon-iymon-bilan}

## Niyat

Ramazon roʻzasi uchun har kuni niyat qilinadi. Hanafiy mazhabida Ramazon roʻzasiga niyatni kechadan to kunning oʻrtasigacha (shariy kun oʻrtasi) qilish mumkin. Saharlikka turishning oʻzi niyatdir.

::hadith{saharlik-baraka}

## Roʻzani buzmaydigan narsalar

- Unutib yeb-ichish (eslagan zahoti toʻxtatish kerak)
- Beixtiyor qusish
- Koʻzga surma surish
- Tahoratda ogʻiz va burunni chayish (gʻargʻara qilmasdan)
- Ehtilom (uyquda janobat boʻlish)

## Roʻzani buzadigan narsalar

:::diqqat
- Qasddan yeyish yoki ichish
- Er-xotin yaqinligi
- Qasddan ogʻiz toʻla qusish
- Tomoqqa yoki ichga biror narsa (dori, tutun va h.k.) qasddan kiritish
:::

:::farz
**Kafforat.** Hanafiy mazhabida Ramazon roʻzasini uzrsiz, qasddan yeb-ichish yoki yaqinlik bilan buzgan kishiga qazo bilan birga kafforat lozim: ketma-ket 60 kun roʻza tutish; bunga qodir boʻlmasa, 60 miskinni toʻydirish.
:::

:::ixtilof
Qasddan yeb-ichish uchun kafforat Hanafiy va Molikiy mazhablarida lozim; Shofeʼiy mazhabida kafforat faqat yaqinlik uchun. Har bir holat boʻyicha ulamodan aniq soʻrash kerak.
:::

## Roʻza tutmaslikka uzrli kishilar

- **Kasal va musofir** — keyin qazosini tutadi.
- **Hayz va nifosdagi ayol** — roʻza tutmaydi, keyin qazo qiladi.
- **Homilador va emizikli ayol** — oʻziga yoki bolaga zarar xavfi boʻlsa, keyin qazo qiladi.
- **Juda keksa yoki tuzalmaydigan bemor** — har bir kun uchun fidya beradi.

::hadith{rozadorning-tili}

:::eslatma
Fidya va fitr sadaqasi miqdorlari har yili Oʻzbekiston musulmonlari idorasi tomonidan eʼlon qilinadi.
:::
`,
  },
  {
    slug: "zakot-ahkomlari",
    category: "zakot",
    title: "Zakot ahkomlari",
    summary: "Zakot kimga farz, nisob miqdori, zakot beriladigan mollar va zakot oluvchilar.",
    minutes: 6,
    keyPoints: ["Zakot — Islomning uchinchi rukni", "Nisob miqdoridagi mol ustidan bir qamariy yil oʻtsa, 2,5% zakot beriladi", "Zakot Qurʼonda sanab oʻtilgan toifalarga beriladi"],
    refs: [{ ...QUDURIY, locator: "Kitob az-zakot" }, { ...HIDOYA, locator: "Kitob az-zakot" }, { ...ZUHAYLI, locator: "Zakot bobi" }],
    markdown: `## Zakotning farzligi

::quran{2:43}

Zakot — maʼlum miqdordagi moldan maʼlum ulushni Alloh rizosi uchun haqdorlarga berishdir. U Islomning uchinchi ruknidir.

::hadith{zakotni-bermaslik}

## Zakot kimga farz?

Hanafiy mazhabida zakot quyidagi shartlar jamlangan kishiga farz:

- musulmon, oqil va balogʻatga yetgan boʻlish;
- **nisob** miqdoridagi molga toʻliq egalik;
- mol asosiy ehtiyojlardan va qarzdan ortiqcha boʻlishi;
- mol ustidan bir qamariy (hijriy) yil oʻtishi (**havl**);
- molning oʻsuvchi (savdo, naqd pul, oltin-kumush, chorva) boʻlishi.

## Nisob va miqdor

- **Oltin:** 20 misqol (koʻp hisob-kitoblarda taxminan 85 gramm).
- **Kumush:** 200 dirham (taxminan 595 gramm).
- **Naqd pul va savdo mollari:** oltin yoki kumush nisobi qiymati bilan oʻlchanadi.
- **Miqdor:** odatda molning qirqdan biri — **2,5 %**.

:::eslatma
Nisobning soʻmdagi qiymati har yili oltin va kumush narxiga qarab Oʻzbekiston musulmonlari idorasi tomonidan eʼlon qilinadi. Hisoblashda oʻsha rasmiy maʼlumotga tayaning.
:::

## Zakot oluvchilar

::quran{9:60}

:::ixtilof
Oyatda sakkiz toifa zikr qilingan. Hanafiy mazhabida «qalblari Islomga moyil qilinadiganlar» ulushi keyingi davrlarda qoʻllanmaydi, deb hisoblanadi; boshqa mazhablarda bu masalada turli qarashlar bor.
:::

## Sadaqa

::hadith{sadaqa-molni-kamaytirmas}

Fitr sadaqasi Hanafiy mazhabida nisob egasiga vojib boʻlib, hayit namozidan oldin beriladi.
`,
  },
  {
    slug: "haj-va-umra",
    category: "haj",
    title: "Haj va umra",
    summary: "Hajning farzligi, Hanafiy mazhabidagi farz va vojiblari, umra.",
    minutes: 6,
    keyPoints: ["Haj qodir kishiga umrida bir marta farz", "Hanafiy mazhabida hajning uch farzi bor", "Umra — sunnati muakkada"],
    refs: [{ ...QUDURIY, locator: "Kitob al-haj" }, { ...HIDOYA, locator: "Kitob al-haj" }, { ...NUR, locator: "Kitob al-haj" }],
    markdown: `## Hajning farzligi

::quran{3:97}

Haj — jismonan va moliyaviy qodir, yoʻli xavfsiz boʻlgan har bir musulmonga umrida bir marta farz.

::hadith{haji-mabrur}

## Hanafiy mazhabida hajning farzlari

:::farz
1. **Ehrom** — niyat va talbiya bilan hajga kirish (shart).
2. **Arafotda turish** (vuquf) — Zulhijjaning 9-kuni zavoldan 10-kuni tonggacha boʻlgan vaqtda.
3. **Ziyorat tavofi** (tavofi ifoza).
:::

## Hajning vojiblari

:::vojib
- Safo va Marva orasida saʼy
- Muzdalifada turish
- Jamaralarga tosh otish
- Sochni oldirish yoki qisqartirish
- Makkadan tashqaridan kelganlar uchun vidoʻ tavofi
:::

Vojib tark etilsa, haj durust boʻladi, ammo jarima (dam — qurbonlik) lozim boʻladi.

## Talbiya

::dua{talbiya}

## Umra

Hanafiy mazhabida umra **sunnati muakkada**. Uning farzi — ehrom va tavof; Safo-Marva saʼyi va soch oldirish — vojib.

:::eslatma
Haj va umra amallari batafsil va nozik. Safardan oldin rasmiy haj guruhi ulamolari bilan maxsus taʼlim olish tavsiya etiladi.
:::
`,
  },
  {
    slug: "halol-va-harom",
    category: "halol-harom",
    title: "Halol va harom asoslari",
    summary: "Hukm darajalari, taom, ichimlik, kasb va shubhali narsalardan saqlanish.",
    minutes: 6,
    keyPoints: ["Narsalarda asl hukm — ibohat (ruxsat)", "Harom Qurʼon va Sunnatda bayon qilingan", "Shubhalidan saqlanish taqvodir"],
    refs: [{ ...HIDOYA, locator: "Kitob al-karohiya; Kitob az-zabooih" }, { ...ZUHAYLI, locator: "Halol va harom, taomlar bobi" }],
    markdown: `## Halol va harom

::hadith{halol-va-harom}

## Hukm darajalari

Islom fiqhida amallar quyidagi hukmlarga boʻlinadi — ularni aralashtirmaslik muhim:

- [[farz]] — qatʼiy dalil bilan buyurilgan.
- [[vojib]] — zanniy dalil bilan buyurilgan (Hanafiy mazhabiga xos daraja).
- [[sunnat]] — Paygʻambarimiz ﷺ yoʻli.
- [[mustahab]] — maqbul, savobli amal.
- [[muboh]] — ruxsat etilgan, ixtiyoriy.
- [[makruh]] — qilinmagani maʼqul (tahrimiy va tanzihiy).
- [[harom]] — qatʼiy man qilingan.

## Taom va ichimlik

::quran{2:168}

::quran{5:90}

- Choʻchqa goʻshti, oʻlimtik, oqib chiqqan qon va Allohdan boshqaning nomi bilan soʻyilgan hayvon harom.
- Mast qiluvchi har qanday ichimlik harom.
- Halol hayvonlar shariy tartibda (Allohning ismi aytilib) soʻyilishi kerak.

## Kasb

Halol kasb ibodatning bir qismi. Ribo (foiz), qimor, aldov, poraxoʻrlik va oʻgʻirlik bilan topilgan daromad harom.

::quran{2:275}

## Shubhali narsalar

::hadith{shubhani-tark-et}

:::eslatma
Zamonaviy masalalar (bank mahsulotlari, oziq-ovqat qoʻshimchalari va h.k.) boʻyicha Oʻzbekiston musulmonlari idorasining fatvolariga tayaning.
:::
`,
  },
  {
    slug: "oila-va-jamiyat",
    category: "oila",
    title: "Oila va jamiyat odobi",
    summary: "Er-xotin munosabati, farzandlar tarbiyasi va ijtimoiy odob.",
    minutes: 5,
    keyPoints: ["Nikoh — sukunat, mehr va rahmat manbai", "Oila aʼzolariga yaxshi muomala iymondandir", "Jamiyatda ozor bermaslik — musulmonlik belgisi"],
    refs: [{ ...HIDOYA, locator: "Kitob an-nikoh" }, { ...ZUHAYLI, locator: "Oila huquqi bobi" }],
    markdown: `## Nikoh — Allohning oyati

::quran{30:21}

Islomda oila — mehr-muhabbat, sukunat va oʻzaro rahm-shafqat asosiga qurilgan muqaddas ittifoq.

::quran{4:19}

::hadith{komil-iymon-goʻzal-xulq}

## Farzandlar tarbiyasi

Farzandga goʻzal ism qoʻyish, uni iymon, namoz va goʻzal axloq bilan tarbiyalash ota-onaning masʼuliyatidir. Bolaga yetti yoshdan namozni oʻrgatish boshlanadi.

## Jamiyatdagi odob

::hadith{musulmon-kim}

::hadith{birodarga-sevgi}

- Kattalarni hurmat qilish, kichiklarga mehribon boʻlish.
- Vaʼdaga vafo qilish, omonatni saqlash.
- Gʻiybat, boʻhton va chaqimchilikdan saqlanish.

:::eslatma
Oilaviy muammolar va nikoh-taloq masalalari nozik huquqiy masalalardir. Bunday hollarda albatta malakali ulamo va kerak boʻlsa, oila maslahatchisiga murojaat qiling.
:::
`,
  },
  {
    slug: "islomiy-odob",
    category: "odob",
    title: "Islomiy odob",
    summary: "Salomlashish, ovqatlanish, suhbat va til odobi.",
    minutes: 5,
    keyPoints: ["Salomga undan yaxshiroq yoki oʻshandek javob qaytariladi", "Taom Bismillah bilan, oʻng qoʻl bilan yeyiladi", "Yaxshi gapirish yoki jim turish"],
    refs: [{ ...ZUHAYLI, locator: "Odoblar bobi" }, { title: "Riyozus-solihin", author: "Imom Yahyo an-Navaviy", locator: "Odob boblari" }],
    markdown: `## Salomlashish

::quran{4:86}

Salom — «As-salāmu ʻalaykum» (sizlarga salom boʻlsin). Salom berish sunnat, unga javob qaytarish esa vojib.

## Ovqatlanish odobi

- Taomni «Bismillāh» bilan boshlash va oʻng qoʻl bilan yeyish.
- Oʻz oldidagi taomdan yeyish.
- Taomni aybsitmaslik.
- Taomdan keyin Allohga hamd aytish.

::dua{taomdan-oldin-bismillah}

## Til odobi

::hadith{yaxshi-gapir-yoki-jim-tur}

::quran{49:12}

::hadith{gʻiybat-nima}

## Muomala

::hadith{tabassum-sadaqa}

::hadith{gazablanma}
`,
  },
  {
    slug: "ota-ona-haqqi",
    category: "ota-ona",
    title: "Ota-ona haqqi",
    summary: "Ota-onaga yaxshilik qilishning hukmi, fazilati va amaliy koʻrinishlari.",
    minutes: 5,
    keyPoints: ["Ota-onaga yaxshilik Allohga ibodatdan keyin zikr qilingan", "Ularga «uf» deyish ham man qilingan", "Ular vafot etgach ham ular uchun duo qilinadi"],
    refs: [{ ...ZUHAYLI, locator: "Ota-ona huquqlari" }, { title: "Al-Adab al-mufrad", author: "Imom Muhammad ibn Ismoil al-Buxoriy", locator: "Ota-onaga yaxshilik boblari" }],
    markdown: `## Qurʼonda ota-ona

::quran{17:23-24}

::quran{31:14}

Alloh taolo ota-onaga yaxshilik qilishni Oʻziga ibodat qilish bilan birga zikr qilgan. Ularga «uf» deyish ham man etilgan.

## Hadislarda

::hadith{vaqtida-oqilgan-namoz}

::hadith{jannat-onaning-oyogʻi-ostida}

## Amaliy yaxshilik

- Ularning halol buyruqlariga itoat qilish.
- Ular bilan muloyim gapirish, ovozni koʻtarmaslik.
- Ehtiyojlarini oʻz ehtiyojidan oldin qoʻyish.
- Ularni tez-tez ziyorat qilish va holidan xabar olish.
- Vafotlaridan keyin ular uchun duo va istigʻfor qilish, ularning qarindoshlari va doʻstlariga yaxshilik qilish.

::dua{robbirhamhuma}

:::diqqat
Ota-ona gunohga buyursa, bu masalada itoat qilinmaydi, lekin ular bilan muomala baribir goʻzal boʻlishi kerak (Luqmon surasi, 15-oyat).
:::
`,
  },
  {
    slug: "qoshni-haqqi",
    category: "qoshni",
    title: "Qoʻshni haqqi",
    summary: "Qoʻshnichilik odobi, qoʻshniga ozor bermaslik va yaxshilik qilish.",
    minutes: 4,
    keyPoints: ["Qoʻshniga yaxshilik qilish Qurʼonda buyurilgan", "Qoʻshniga ozor bermaslik iymondandir", "Qoʻshni musulmon boʻlmasa ham haqqi bor"],
    refs: [{ title: "Al-Adab al-mufrad", author: "Imom Muhammad ibn Ismoil al-Buxoriy", locator: "Qoʻshni boblari" }, { ...ZUHAYLI, locator: "Qoʻshnichilik huquqlari" }],
    markdown: `## Qurʼonda qoʻshni

::quran{4:36}

Oyatda yaqin qoʻshni ham, uzoq qoʻshni ham zikr qilingan. Ulamolar qoʻshnining musulmon boʻlmasa ham qoʻshnilik haqqi borligini taʼkidlaganlar.

## Hadislarda

::hadith{qoshni-haqqi}

::hadith{yaxshi-gapir-yoki-jim-tur}

## Amaliy odoblar

- Qoʻshniga salom berish, holidan xabar olish.
- Taom va sovgʻa ulashish.
- Shovqin, axlat, avtomobil qoʻyish kabi masalalarda ozor bermaslik.
- Kasal boʻlsa, yoʻqlash; musibatda yonida boʻlish.
- Aybini yashirish, sirini fosh qilmaslik.
`,
  },
  {
    slug: "islomiy-muomalalar",
    category: "muomala",
    title: "Islomiy muomalalar",
    summary: "Savdo, qarz, ribo va omonatdagi asosiy qoidalar.",
    minutes: 6,
    keyPoints: ["Savdo oʻzaro rozilik bilan boʻladi", "Ribo (foiz) harom", "Oʻlchov va tarozida aldash katta gunoh"],
    refs: [{ ...HIDOYA, locator: "Kitob al-buyuʼ" }, { ...QUDURIY, locator: "Kitob al-buyuʼ" }, { ...ZUHAYLI, locator: "Muomalalar boʻlimi" }],
    markdown: `## Savdoning asosi — rozilik

::quran{4:29}

Islomda savdo-sotiq halol, ammo u adolat, rostgoʻylik va oʻzaro rozilik asosida boʻlishi kerak.

## Ribo

::quran{2:275}

Qarz berib, ustiga shart qilingan qoʻshimcha foyda olish (ribo) harom. Zamonaviy moliyaviy mahsulotlar boʻyicha mutaxassis ulamolarning fatvolariga tayanish lozim.

## Oʻlchov va tarozi

::quran{83:1-3}

## Qarz va omonat

- Qarzni yozib qoʻyish va guvoh keltirish Qurʼonda tavsiya qilingan (Baqara surasi, 282-oyat).
- Qarzni vaqtida qaytarish, qiynalgan qarzdorga muhlat berish.
- Omonatga xiyonat qilmaslik.

::hadith{halol-va-harom}

:::eslatma
Muomala fiqhi keng va murakkab. Biznes, bank, kredit va sugʻurta masalalarida Oʻzbekiston musulmonlari idorasi fatvo xizmatiga murojaat qiling.
:::
`,
  },
  {
    slug: "tavba-shartlari",
    category: "tavba",
    title: "Tavba va uning shartlari",
    summary: "Tavbaning maʼnosi, shartlari va Allohning rahmatidan umid uzmaslik.",
    minutes: 5,
    keyPoints: ["Tavba eshigi oʻlim va qiyomat alomatlarigacha ochiq", "Tavbaning toʻrt sharti bor", "Hech bir gunoh Allohning rahmatidan katta emas"],
    refs: [{ title: "Riyozus-solihin", author: "Imom Yahyo an-Navaviy", locator: "Tavba bobi" }, { title: "Ihyou ulumid-din", author: "Imom Abu Homid al-Gʻazzoliy", locator: "Kitob at-tavba" }],
    markdown: `## Tavba nima?

Tavba — gunohdan pushaymon boʻlib, Allohga qaytishdir.

::quran{66:8}

::quran{39:53}

## Tavbaning shartlari

1. **Gunohni darhol tark etish.**
2. **Qilgan gunohidan chin dildan pushaymon boʻlish.**
3. **Unga qaytmaslikka qatʼiy azm qilish.**
4. Agar gunoh boshqa insonning haqqiga tegishli boʻlsa, **haqni egasiga qaytarish** yoki undan rozilik olish.

## Hadislarda tavba

::hadith{tavba-qiluvchilar}

::hadith{allohning-tavbadan-shodligi}

::hadith{tavba-eshigi}

## Istigʻfor duolari

::dua{sayyidul-istigfor}

::dua{astagʻfirullohal-aziym}

:::eslatma
Tavbani kechiktirmang. Gunoh takrorlansa ham, tavbani takrorlashdan charchamang — Allohning rahmati keng.
:::
`,
  },
  {
    slug: "musulmonning-kuni",
    category: "kundalik",
    title: "Musulmonning kundalik hayoti",
    summary: "Kunni ibodat va zikr bilan rejalashtirish: tongdan tungacha.",
    minutes: 5,
    keyPoints: ["Kun bomdod namozi va tong zikrlari bilan boshlanadi", "Halol mehnat ham niyat bilan ibodatga aylanadi", "Kun vitr va uyqu zikrlari bilan yakunlanadi"],
    refs: [{ title: "Al-Azkor", author: "Imom Yahyo an-Navaviy" }, { title: "Hisnul muslim", author: "Saʼid ibn Ali ibn Vahf al-Qahtoniy" }],
    markdown: `## Inson nima uchun yaratilgan?

::quran{51:56}

Musulmonning butun kuni — namoz, zikr, halol mehnat va yaxshi niyat bilan ibodatga aylanishi mumkin.

::hadith{niyat}

## Kun tartibi namunasi

1. **Tong:** uygʻonish duosi, tahorat, bomdod sunnati va farzi, [ertalabki zikrlar](/zikrlar/ertalabki-zikrlar).
2. **Kunduz:** halol mehnat yoki oʻqish — niyat bilan. Peshin namozi.
3. **Kun ikkinchi yarmi:** asr namozi, [kechki zikrlar](/zikrlar/kechki-zikrlar).
4. **Kechqurun:** shom namozi, oila bilan vaqt, xufton va vitr.
5. **Uyqudan oldin:** tahorat, uyqu duolari va [tasbeh](/zikrlar/uyqudan-oldingi-tasbeh).

## Kichik, lekin doimiy amallar

- Har kuni Qurʼondan oz boʻlsa ham oʻqish.
- Har namozdan keyin tasbehlar.
- Kuniga yuz marta istigʻfor.
- Salovotni koʻpaytirish.

::hadith{kuchli-mumin}

:::mustahab
Saytdagi [Kundalik reja](/profil) boʻlimida besh vaqt namoz, Qurʼon tilovati va zikrlaringizni belgilab borishingiz mumkin.
:::
`,
  },
];
