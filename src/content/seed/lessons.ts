/**
 * Namoz akademiyasi — Hanafiy mazhabi asosida bosqichma-bosqich darslar.
 * Tahririyat qoralamasi: barcha hukmlar ulamolar tomonidan tekshirilishi kerak.
 *
 * Maxsus belgilar (src/components/content/markdown.tsx):
 *   ::dua{slug}          — duo kartasi (arabcha, transliteratsiya, maʼno, manba)
 *   ::dhikr{slug}        — zikr kartasi
 *   ::quran{s:a} yoki ::quran{s:a-b} — oyat(lar) va tasdiqlangan tarjima
 *   ::hadith{slug}       — hadis kartasi
 *   :::farz / :::vojib / :::sunnat / :::mustahab / :::makruh / :::harom / :::eslatma / :::diqqat / :::ixtilof / :::ayollar … :::
 *   [[farz]]             — hukm belgisi
 */
export type LessonText = { slug: string; order: number; title: string; summary: string; minutes: number; outcomes: string[]; markdown: string; refs: { title: string; author?: string; locator?: string }[] };

const NUR = { title: "Nur al-iyzoh", author: "Hasan ibn Ammor ash-Shurunbuloliy (Hanafiy)" };
const QUDURIY = { title: "Muxtasar al-Quduriy", author: "Abul-Husayn Ahmad al-Quduriy (Hanafiy)" };
const HIDOYA = { title: "Al-Hidoya", author: "Burhoniddin al-Margʻinoniy (Hanafiy)" };
const RADD = { title: "Radd al-muhtor ʻalad-Durr al-muxtor", author: "Ibn Obidin (Hanafiy)" };

export const LESSONS: LessonText[] = [
  {
    slug: "namozga-kirish",
    order: 1,
    title: "Namozga kirish",
    summary: "Namoz nima, nega oʻqiladi, besh vaqt namoz va ularning rakaatlari, asosiy atamalar.",
    minutes: 8,
    outcomes: ["Namozning Islomdagi oʻrnini tushunish", "Besh vaqt namoz va rakaatlar sonini bilish", "Asosiy atamalarni oʻrganish"],
    refs: [{ ...QUDURIY, locator: "Kitob as-salot" }, { ...NUR, locator: "Kitob as-salot, namoz vaqtlari va nafl namozlar boblari" }],
    markdown: `## Namoz nima?

Namoz (arabcha *ṣalāh*) — Allohga Uning Rasuli ﷺ koʻrsatgan tartibda, maʼlum soʻzlar va harakatlar bilan qilinadigan ibodatdir. U takbir bilan boshlanib, salom bilan tugaydi.

Namoz Islomning besh ustunidan biri, iymondan keyingi eng ulugʻ amaldir. Balogʻatga yetgan, aqli raso har bir musulmonga kuniga besh vaqt namoz [[farz]].

::hadith{islom-besh-ustun}

## Nega namoz oʻqiymiz?

- **Alloh buyurgani uchun.** Qurʼoni karimda namoz koʻp oʻrinlarda buyurilgan.
- **Banda bilan Robbi orasidagi bogʻliqlik.** Namozda inson kuniga besh marta Allohning huzurida turadi.
- **Gunohlardan poklanish.** Paygʻambarimiz ﷺ besh vaqt namozni eshik oldidan oqib oʻtadigan daryoga oʻxshatganlar.

::hadith{besh-namoz-daryo}

- **Qiyomatdagi birinchi hisob.** Bandadan birinchi soʻraladigan amal — namoz.

::hadith{birinchi-hisob-namoz}

## Besh vaqt namoz

Hanafiy mazhabida kunlik namozlar va ularning rakaatlari quyidagicha:

| Namoz | Farzdan oldin | Farz | Farzdan keyin |
|---|---|---|---|
| **Bomdod** (Fajr) | 2 rakaat sunnat (muakkada) | **2 rakaat** | — |
| **Peshin** (Zuhr) | 4 rakaat sunnat (muakkada) | **4 rakaat** | 2 rakaat sunnat (muakkada) |
| **Asr** | 4 rakaat sunnat (gʻayri muakkada) | **4 rakaat** | — |
| **Shom** (Magʻrib) | — | **3 rakaat** | 2 rakaat sunnat (muakkada) |
| **Xufton** (Ishoʼ) | 4 rakaat sunnat (gʻayri muakkada) | **4 rakaat** | 2 rakaat sunnat (muakkada), soʻng **3 rakaat vitr** |

:::vojib
**Vitr namozi** Hanafiy mazhabida vojibdir. U xuftondan keyin, tong otguncha oʻqiladi va uch rakaatdan iborat.
:::

:::eslatma
**Sunnati muakkada** — Paygʻambarimiz ﷺ doimiy oʻqigan sunnat namozlar; uzrsiz tark etish malomatga sabab boʻladi. **Gʻayri muakkada** sunnatlar esa ba'zan tark etilgan; ularni oʻqish katta savob, tark etish gunoh emas.
:::

## Hukm darajalari

Namoz darslarida hukmlarni farqlab oʻrganish muhim. Hanafiy mazhabida amallar quyidagi darajalarga boʻlinadi:

- [[farz]] — qatʼiy dalil bilan sobit; tark etilsa namoz buziladi.
- [[vojib]] — zanniy dalil bilan sobit; unutib tark etilsa sajdai sahv qilinadi, qasddan tark etilsa namoz qayta oʻqiladi.
- [[sunnat]] — Paygʻambarimiz ﷺ odati; tark etish namozni buzmaydi, lekin savobni kamaytiradi.
- [[mustahab]] — odob; qilinsa savob, tark etilsa gunoh emas.
- [[makruh]] — qilinmagani maʼqul; namoz savobini kamaytiradi.

## Asosiy atamalar

| Atama | Maʼnosi |
|---|---|
| **Rakaat** | Namozning bir qiyom, bir rukuʼ va ikki sajdadan iborat boʻlagi |
| **Takbiri tahrima** | Namozni boshlovchi «Allāhu akbar» |
| **Qiyom** | Tik turish |
| **Qiroat** | Qurʼondan oʻqish |
| **Rukuʼ** | Belni egib, qoʻllarni tizzaga qoʻyish |
| **Qavma** | Rukuʼdan keyin tik turish |
| **Sajda** | Peshona, burun, qoʻllar, tizzalar va oyoq barmoqlarini yerga qoʻyish |
| **Jalsa** | Ikki sajda orasidagi oʻtirish |
| **Qaʼda** | Tashahhud uchun oʻtirish |
| **Salom** | Namozdan chiqish uchun oʻng va chapga salom berish |
| **Imom / muqtadiy / munfarid** | Namozni boshqaruvchi / imomga ergashuvchi / yolgʻiz oʻquvchi |
`,
  },
  {
    slug: "namozga-tayyorgarlik",
    order: 2,
    title: "Namozga tayyorgarlik: shartlar",
    summary: "Namozning shartlari: poklik, avratni yopish, qibla, vaqt va niyat.",
    minutes: 10,
    outcomes: ["Namozning olti shartini bilish", "Erkak va ayol avratini farqlash", "Namoz vaqtlari va makruh vaqtlarni bilish"],
    refs: [{ ...NUR, locator: "Kitob as-salot, namoz shartlari bobi" }, { ...QUDURIY, locator: "Kitob as-salot" }, { ...HIDOYA, locator: "Kitob as-salot, namozdan oldingi shartlar bobi" }],
    markdown: `## Namozning shartlari

Shartlar — namozdan oldin va namoz davomida mavjud boʻlishi kerak boʻlgan narsalar. Ulardan biri boʻlmasa, namoz durust boʻlmaydi. Oʻzbekistondagi koʻp darsliklarda ular «namozning tashqi farzlari» deb ham ataladi.

:::farz
1. **Hadasdan poklanish** — tahoratli boʻlish (kichik hadas) va gʻusl qilish lozim boʻlsa, gʻusl qilish (katta hadas).
2. **Najasdan poklanish** — badan, kiyim va namoz oʻqiladigan joyning najosatdan pok boʻlishi.
3. **Avratni yopish.**
4. **Qiblaga yuzlanish.**
5. **Vaqt** — namozni oʻz vaqti kirganidan keyin oʻqish.
6. **Niyat** — qaysi namozni oʻqiyotganini qalbdan bilish.
:::

:::eslatma
Niyat — qalbning ishi. Uni til bilan ham aytish Hanafiy ulamolari tomonidan qalb niyatiga yordam sifatida maqbul koʻrilgan, lekin shart emas. Muhimi — qaysi namoz (masalan, «bugungi peshinning farzi») ekanini qalbdan bilish.
:::

## Poklik

Tahorat va gʻusl keyingi darslarda batafsil oʻrganiladi. Bu yerda najosat haqida qisqacha:

- Kiyim yoki badanga tekkan najosat namozdan oldin yuvib tashlanadi.
- Hanafiy mazhabida **ogʻir najosat** (masalan, siydik, qon) bir dirham miqdoridan (taxminan kaft chuqurchasi kattaligi) oshsa, namoz durust boʻlmaydi; undan kam boʻlsa, namoz durust, ammo yuvmasdan oʻqish makruh.

:::ixtilof
Najosat miqdorlari va turlari boʻyicha mazhablar orasida farqlar bor. Bu yerda Hanafiy mazhabidagi qoida keltirildi. Shubhali holatlarda malakali ulamodan soʻrang.
:::

## Avrat

| | Namozda yopilishi shart boʻlgan joy |
|---|---|
| **Erkak** | Kindikdan tizzagacha (tizza avratga kiradi) |
| **Ayol** | Yuz, ikki kaft va oyoqlardan boshqa butun badan |

:::ayollar
Ayolning sochi ham avratga kiradi; roʻmolning sochni toʻliq yopishi shart. Kiyim badan rangini koʻrsatadigan darajada yupqa boʻlmasligi kerak.
:::

:::ixtilof
Ayol oyoqlarining (tovon va oyoq usti) namozda avrat ekan-yoʻqligi haqida Hanafiy ulamolari orasida turli qavllar bor; koʻpchilik kitoblarda avrat emasligi tanlangan. Yopib oʻqish ehtiyotliroqdir.
:::

## Qibla

Qibla — Makkai mukarramadagi Kaʼba tomoni. Oʻzbekistondan Kaʼba taxminan **janubi-gʻarb** tomonda joylashgan. Aniq yoʻnalishni saytimizdagi [Qibla](/qibla) vositasi orqali aniqlash mumkin.

Qiblani aniqlash imkoni boʻlmasa, kishi oʻylab-izlanib (taharriy) bir tomonni tanlaydi va oʻsha tomonga oʻqiydi. Namozdan keyin xato bilinsa, namoz qayta oʻqilmaydi.

## Namoz vaqtlari

| Namoz | Vaqti boshlanishi | Vaqti tugashi |
|---|---|---|
| **Bomdod** | Tong yorishishi (subhi sodiq) | Quyosh chiqishi |
| **Peshin** | Quyosh zavoldan (tikkadan) ogʻishi | Har narsaning soyasi (zavol soyasidan tashqari) ikki baravar boʻlishi |
| **Asr** | Peshin vaqti tugashi | Quyosh botishi |
| **Shom** | Quyosh botishi | Shafaq yoʻqolishi |
| **Xufton** | Shafaq yoʻqolishi | Tong yorishishi |

:::ixtilof
**Asr vaqti.** Imom Abu Hanifa rahimahullohning qavliga koʻra, Asr soya ikki baravar boʻlganda kiradi; Imom Abu Yusuf va Imom Muhammad (Sohibayn) qavliga koʻra, bir baravar boʻlganda. Oʻzbekistondagi namoz jadvallarida asosan birinchi qavl qoʻllanadi.

**Shafaq.** Imom Abu Hanifa qavliga koʻra shom vaqti oq shafaq yoʻqolguncha, Sohibayn qavliga koʻra qizil shafaq yoʻqolguncha davom etadi.
:::

:::makruh
**Namoz oʻqish makruh boʻlgan vaqtlar:** quyosh chiqayotganda, quyosh tikkada turganda (zavol paytida) va quyosh botayotganda. Bu vaqtlarda nafl namoz va qazo namozi oʻqilmaydi. Faqat oʻsha kunning asri quyosh botayotganda ham oʻqib tugatiladi (lekin kechiktirish makruh).
:::

Shahringiz uchun aniq vaqtlarni [Namoz vaqtlari](/namoz-vaqtlari) sahifasida koʻrishingiz mumkin. Hisoblash usuli Oʻzbekiston musulmonlari idorasining rasmiy jadvalidan farq qilishi mumkin — oʻsha sahifada daqiqa tuzatishlarini kiritsa boʻladi.
`,
  },
  {
    slug: "tahorat",
    order: 3,
    title: "Tahorat (vuzu)",
    summary: "Tahoratning farzlari, sunnatlari, odoblari, bosqichma-bosqich tartibi va tahoratni buzadigan narsalar.",
    minutes: 12,
    outcomes: ["Hanafiy mazhabidagi tahoratning 4 farzini bilish", "Tahoratni sunnatga muvofiq olish", "Tahoratni buzadigan va buzmaydigan narsalarni farqlash"],
    refs: [{ ...NUR, locator: "Kitob at-tahorat: tahorat farzlari, sunnatlari, odoblari va tahoratni buzuvchilar boblari" }, { ...QUDURIY, locator: "Kitob at-tahorat" }, { ...HIDOYA, locator: "Kitob at-tahorat" }],
    markdown: `## Tahorat nima?

Tahorat (arabcha *wuḍūʼ*) — namoz va boshqa ibodatlar uchun maʼlum aʼzolarni yuvish va mash qilish orqali poklanishdir. Tahoratsiz namoz qabul boʻlmaydi.

::hadith{tahoratsiz-namoz}

Tahoratning asosi Qurʼoni karimdagi quyidagi oyatdir:

::quran{5:6}

## Tahoratning farzlari

Hanafiy mazhabida tahoratning farzi **toʻrtta**:

:::farz
1. **Yuzni yuvish** — peshonadagi soch chiqqan joydan iyak ostigacha, bir quloq yumshogʻidan ikkinchisigacha.
2. **Ikki qoʻlni tirsaklar bilan qoʻshib yuvish.**
3. **Boshning toʻrtdan biriga mash tortish** — hoʻl qoʻl bilan.
4. **Ikki oyoqni toʻpiqlar bilan qoʻshib yuvish.**
:::

Bu toʻrt amaldan biri — hatto tirnoq uchidek joy quruq qolsa ham — tahorat durust boʻlmaydi.

## Tahoratning sunnatlari

:::sunnat
- Niyat qilish
- «Bismillāh» bilan boshlash
- Avval qoʻllarni bilaklargacha uch marta yuvish
- Misvok ishlatish (yoki barmoq bilan tishlarni tozalash)
- Ogʻizni uch marta chayish
- Burunga uch marta suv olib, tozalash
- Har bir aʼzoni uch martadan yuvish
- Butun boshga bir marta mash tortish
- Quloqlarga mash tortish
- Soqol va barmoqlar orasini xilol qilish (suv yetkazish)
- Tartibga rioya qilish (oyatdagi ketma-ketlik)
- Aʼzolarni ketma-ket, oraliq qoldirmay yuvish
:::

:::ixtilof
Hanafiy mazhabida **niyat** va **tartib** tahoratda sunnat hisoblanadi, farz emas. Shofeʼiy va Hanbaliy mazhablarida esa ular farzdir. Shuning uchun niyat qilish va tartibga rioya qilishni tark etmaslik maʼqul.
:::

:::mustahab
- Qiblaga yuzlanib oʻtirish
- Oʻng aʼzolardan boshlash
- Boʻyinga qoʻl orqasi bilan mash tortish (Hanafiy ulamolari mustahab sanagan)
- Tahorat paytida dunyo gaplarini gapirmaslik
- Tahoratdan keyin shahodat duosini oʻqish
:::

:::makruh
- Suvni isrof qilish
- Suvni yuzga qattiq sepish
- Aʼzolarni uch martadan ortiq yuvish
- Najosatli joyda tahorat olish
:::

## Bosqichma-bosqich tartib

1. **Niyat qiling** va «Bismillāh» deng.
2. **Qoʻllarni** bilaklargacha uch marta yuving, barmoqlar orasini ham.
3. **Ogʻizni** uch marta chaying (roʻzador boʻlmasangiz, gʻargʻara qiling).
4. **Burunga** oʻng qoʻl bilan uch marta suv tortib, chap qoʻl bilan qoqib tozalang.
5. **Yuzni** uch marta yuving — peshonadan iyak ostigacha, quloqdan quloqqacha.
6. **Oʻng qoʻlni**, soʻng **chap qoʻlni** tirsaklar bilan birga uch martadan yuving.
7. **Boshga mash** torting: hoʻl qoʻllarni peshonadan ensaga, soʻng ensadan peshonaga yurgizing. Keyin koʻrsatkich barmoqlar bilan quloq ichiga, bosh barmoqlar bilan quloq orqasiga mash torting. Qoʻl orqasi bilan boʻyinga mash tortish mustahab.
8. **Oʻng oyoqni**, soʻng **chap oyoqni** toʻpiqlar bilan birga uch martadan yuving, barmoqlar orasini chap qoʻlning kichik barmogʻi bilan xilol qiling.
9. Tahoratdan keyin quyidagi duoni oʻqing:

::dua{tahoratdan-keyin}

## Tahoratni buzadigan narsalar

:::diqqat
Hanafiy mazhabida quyidagilar tahoratni buzadi:

1. Old yoki orqa yoʻldan biror narsa chiqishi (siydik, najas, yel va h.k.).
2. Badandan qon, yiring yoki zardob chiqib, jarohat atrofiga oqishi.
3. Ogʻiz toʻla qusish.
4. Yonboshlab yoki biror narsaga suyanib, (suyanchiq olinsa yiqiladigan holatda) uxlash.
5. Hushdan ketish, aqldan ozish, mast boʻlish.
6. Rukuʼ va sajdasi bor namozda qahqaha bilan (atrofdagilar eshitadigan darajada) kulish — bu namozni ham, tahoratni ham buzadi.
:::

## Tahoratni buzmaydigan narsalar (Hanafiy mazhabida)

- Ayolning badaniga (shahvatsiz) tegib ketish
- Oʻz avratiga qoʻl tegizish
- Jarohatdan chiqib, oqmay turgan qon
- Ogʻiz toʻlmaydigan miqdorda qusish
- Oʻtirgan holda (oʻtirgʻich yerga mahkam tekkan holda) mudrash

:::ixtilof
Ayolga tegish va oʻz avratiga qoʻl tegizish Shofeʼiy mazhabida tahoratni buzadi; Hanafiy mazhabida buzmaydi. Har bir musulmon oʻz mazhabi qoidasiga amal qiladi.
:::

## Qisqa xulosa

::hadith{tahorat-gunohlarni-yuvadi}
`,
  },
  {
    slug: "gusl",
    order: 4,
    title: "Gʻusl",
    summary: "Gʻusl qachon farz boʻladi, Hanafiy mazhabidagi uch farzi, sunnatga muvofiq tartibi va keng tarqalgan xatolar.",
    minutes: 10,
    outcomes: ["Gʻusl lozim boʻladigan holatlarni bilish", "Gʻuslning uch farzini bilish", "Gʻuslni toʻgʻri tartibda bajarish"],
    refs: [{ ...NUR, locator: "Kitob at-tahorat, gʻusl bobi" }, { ...QUDURIY, locator: "Kitob at-tahorat, gʻusl" }, { ...RADD, locator: "Kitob at-tahorat, gʻusl farzlari" }],
    markdown: `## Gʻusl nima?

Gʻusl — butun badanni maʼlum tartibda yuvib, katta hadasdan poklanishdir. Katta hadasli (junub) kishi gʻusl qilmaguncha namoz oʻqiy olmaydi.

## Gʻusl qachon farz boʻladi?

:::farz
1. **Janobat** — er-xotin yaqinligidan keyin yoki shahvat bilan maniy chiqqanda (uyquda ham).
2. **Hayz** (oylik odat) tugaganda.
3. **Nifos** (tugʻruqdan keyingi qon) tugaganda.
:::

:::sunnat
Quyidagi holatlarda gʻusl qilish sunnat: juma namozi uchun, ikki hayit namozi uchun, ehromga kirishda va Arafa kuni (hojilar uchun).
:::

## Gʻuslning farzlari

Hanafiy mazhabida gʻuslning farzi **uchta**:

:::farz
1. **Ogʻizni chayish** — suv ogʻizning hamma joyiga yetishi.
2. **Burunni chayish** — suvni burunning yumshoq joyigacha yetkazish.
3. **Butun badanni yuvish** — hech bir joyi, hatto igna uchidek joy ham quruq qolmasligi.
:::

:::diqqat
Kindik ichi, quloq teshiklari (tashqi qismi), soch ildizlari, qoʻltiq ostlari va barmoqlar orasiga suv yetishiga eʼtibor bering. Tirnoq boʻyogʻi (lak) kabi suv oʻtkazmaydigan qatlamni avval olib tashlash shart.
:::

## Sunnatga muvofiq tartib

1. **Niyat qiling** va «Bismillāh» deng.
2. **Qoʻllarni** bilaklargacha yuving.
3. **Avratni yuving** va badanda najosat boʻlsa, uni ketkazing.
4. **Namozdagidek toʻliq tahorat oling.** Agar suv yigʻiladigan joyda turgan boʻlsangiz, oyoqlarni oxirida yuvasiz.
5. **Boshga uch marta** suv quying.
6. **Oʻng yelkaga uch marta**, soʻng **chap yelkaga uch marta** suv quying.
7. Butun badanni **ishqalab** yuving.
8. Oxirida (kerak boʻlsa) oyoqlarni yuving.

:::ayollar
Hanafiy mazhabida ayol soch oʻrimlarini yechishi shart emas — suv soch ildizlariga yetsa kifoya. Ammo soch ochiq boʻlsa, uni toʻliq hoʻllash kerak.
:::

## Keng tarqalgan xatolar

- Ogʻiz va burunni chayishni unutish (Hanafiy mazhabida bu — farz).
- Badanning baʼzi joylarini (quloq orqasi, kindik, oyoq barmoqlari orasi) quruq qoldirish.
- Tirnoq boʻyogʻi yoki boshqa suv oʻtkazmaydigan qatlam bilan gʻusl qilish.
- Gʻusl kerak boʻlgan holatni «uyalib» kechiktirib, namozni qazo qilish.

## Junub kishiga nima mumkin emas?

:::harom
Gʻusl qilmaguncha: namoz oʻqish, Qurʼonni ushlash, Qurʼon tilovat qilish, masjidga kirish va Kaʼbani tavof qilish mumkin emas.
:::

:::eslatma
Zikr qilish, duo oʻqish va salovot aytish junub kishiga ham joiz. Qurʼon oyatlarini duo niyatida oʻqish masalasida ulamolar batafsil soʻz yuritgan.
:::
`,
  },
  {
    slug: "namoz-sozlari",
    order: 5,
    title: "Namoz soʻzlarini oʻrganish",
    summary: "Takbir, sano, taʼavvuz, basmala, Fotiha, zam sura, tasbehlar, tashahhud, salovot, duo va salom.",
    minutes: 20,
    outcomes: ["Namozda aytiladigan barcha soʻzlarni tartib bilan bilish", "Har birining maʼnosini tushunish", "Toʻgʻri talaffuzni mashq qilish"],
    refs: [{ ...NUR, locator: "Kitob as-salot, namoz sifati bobi" }, { ...QUDURIY, locator: "Kitob as-salot, namoz sifati bobi" }],
    markdown: `## Qanday oʻrganish kerak?

Namoz soʻzlarini quyidagi tartibda oʻrganing. Har birining arabcha matni, oʻzbek lotin yozuvidagi talaffuzi va maʼnosi berilgan. Oʻzbek tilida boʻlmagan tovushlarni [Talaffuz qoʻllanmasi](/talaffuz)dan oʻrganing va iloji boricha ustoz yoki qorining oʻqishidan eshitib takrorlang.

:::diqqat
Namozda Qurʼon va zikrlar faqat **arab tilida** oʻqiladi. Transliteratsiya — faqat oʻrganish vositasi. Arab harflarini oʻrganib borish tavsiya etiladi.
:::

## 1. Takbir

Namoz «Allāhu akbar» bilan boshlanadi va har bir harakatga oʻtishda takbir aytiladi.

::dua{takbir}

## 2. Sano

Iftitoh takbiridan keyin qoʻllar bogʻlanib, ichida oʻqiladi.

::dua{sano}

## 3. Taʼavvuz va basmala

::dua{taavvuz}

::dua{basmala}

## 4. Fotiha surasi

Har rakaatda oʻqiladi. Fotiha oʻqish Hanafiy mazhabida [[vojib]].

::quran{1:1-7}

Fotihadan keyin ichida «Āmīn» deyiladi.

## 5. Zam sura

Farz namozlarining birinchi ikki rakaatida, vitr, sunnat va nafl namozlarining barcha rakaatlarida Fotihadan keyin kamida uch qisqa oyat yoki bir uzun oyat oʻqiladi ([[vojib]]). Yangi oʻrganuvchilar uchun qisqa suralar:

::quran{112:1-4}

::quran{108:1-3}

::quran{103:1-3}

Boshqa qisqa suralarni [Qurʼon](/quron) boʻlimida transliteratsiyasi bilan oʻrganishingiz mumkin: Fil, Quraysh, Moʼun, Kofirun, Nasr, Masad, Falaq va Nos.

## 6. Rukuʼ tasbehi

::dua{ruku-tasbehi}

## 7. Rukuʼdan turishda

::dua{tasmi-va-tahmid}

## 8. Sajda tasbehi

::dua{sajda-tasbehi}

## 9. Tashahhud (Attahiyyot)

Har bir qaʼdada (ikkinchi rakaatdan keyin va oxirgi rakaatda) oʻqiladi.

::dua{tashahhud}

## 10. Salovot

Oxirgi qaʼdada tashahhuddan keyin oʻqiladi.

::dua{salovoti-ibrohimiya}

## 11. Salomdan oldingi duo

Salovotdan keyin arabcha maʼsur duolardan biri oʻqiladi. Quyidagi ikkisi keng tarqalgan:

::dua{robbana-atina}

::dua{abu-bakr-duosi}

## 12. Salom

::dua{salom-berish}

:::mustahab
Har bir soʻzni maʼnosini tushunib aytishga harakat qiling — bu namozdagi xushuʼ (qalb hozirligi)ga yordam beradi.
:::
`,
  },
  {
    slug: "amaliy-namoz",
    order: 6,
    title: "Amaliy namoz: bosqichma-bosqich",
    summary: "Ikki, uch va toʻrt rakaatli namozlar tartibi, erkak va ayol orasidagi farqlar, jamoat, juma va vitr namozlari.",
    minutes: 22,
    outcomes: ["Ikki rakaatli namozni boshidan oxirigacha oʻqish", "Uch va toʻrt rakaatli namozlar tartibini bilish", "Jamoat, juma va vitr namozining xususiyatlarini bilish"],
    refs: [{ ...NUR, locator: "Kitob as-salot: namoz sifati, vojiblari, sunnatlari, vitr, jumʼa va sajdai sahv boblari" }, { ...QUDURIY, locator: "Kitob as-salot" }, { ...HIDOYA, locator: "Kitob as-salot, namoz sifati bobi" }],
    markdown: `## Namozning ichki farzlari (rukunlar)

:::farz
1. **Iftitoh takbiri** (takbiri tahrima)
2. **Qiyom** — qodir boʻlgan kishi uchun tik turish
3. **Qiroat** — Qurʼondan kamida bir oyat oʻqish
4. **Rukuʼ**
5. **Ikki sajda**
6. **Qaʼdai axira** — oxirgi oʻtirishda tashahhud miqdori oʻtirish
:::

:::eslatma
Iftitoh takbiri Hanafiy mazhabida aslida namozning sharti hisoblanadi, lekin namozga ulangani uchun koʻp darsliklarda ichki farzlar qatorida sanaladi.
:::

## Namozning muhim vojiblari

:::vojib
- Fotiha surasini oʻqish
- Farzning birinchi ikki rakaatida (va boshqa namozlarning barcha rakaatlarida) Fotihadan keyin zam sura oʻqish
- Rukuʼ va sajdalarda, qavma va jalsada xotirjam turish (taʼdili arkon)
- Birinchi qaʼda (uch va toʻrt rakaatli namozlarda)
- Har bir qaʼdada tashahhud oʻqish
- Ovozli namozlarda imomning ovoz chiqarib, ovozsiz namozlarda ichida oʻqishi
- «As-salām» lafzi bilan namozdan chiqish
- Vitrda qunut oʻqish
:::

Vojib unutib tark etilsa, namoz oxirida **sajdai sahv** qilinadi.

## Ikki rakaatli namoz (masalan, bomdod farzi) — erkaklar uchun

**Birinchi rakaat**

1. **Niyat.** Qiblaga yuzlanib turing, oyoqlar orasi taxminan toʻrt barmoq. Qaysi namozni oʻqiyotganingizni qalbdan niyat qiling.
2. **Iftitoh takbiri.** Ikki qoʻlni koʻtarib, bosh barmoqlarni quloq yumshogʻiga tekkizing, kaftlar qiblaga qaragan holda «Allāhu akbar» deng.
3. **Qoʻllarni bogʻlash.** Oʻng kaftni chap qoʻl ustiga qoʻyib, oʻng qoʻlning bosh va kichik barmoqlari bilan chap bilakni ushlang. Qoʻllar **kindik ostida** bogʻlanadi.
4. Ichida **sano**, **taʼavvuz** va **basmala** oʻqing.
5. **Fotiha** oʻqing, oxirida ichida «Āmīn» deng.
6. **Zam sura** oʻqing (masalan, Ixlos).
7. **Rukuʼ.** «Allāhu akbar» deb egiling. Bel va bosh bir tekis, barmoqlarni ochib tizzalarni ushlang. Kamida uch marta «Subḥāna rabbiyal-ʻaẓīm» deng.
8. **Qavma.** «Samiʻallāhu liman ḥamidah» deb tik turing (yolgʻiz oʻqiyotgan boʻlsangiz, ketidan «Rabbanā lakal-ḥamd» deng). Toʻliq tik turib, bir lahza xotirjam boʻling.
9. **Sajda.** «Allāhu akbar» deb avval tizzalarni, soʻng qoʻllarni, soʻng burun va peshonani yerga qoʻying. Qoʻllar quloqlar roʻparasida, tirsaklar biqindan ajratilgan, qorin sondan uzoq. Oyoq barmoqlari qiblaga qaragan. Kamida uch marta «Subḥāna rabbiyal-aʻlā» deng.
10. **Jalsa.** «Allāhu akbar» deb boshni koʻtarib, chap oyoqni yotqizib ustiga oʻtiring, oʻng oyoqni tik qoʻying. Bir lahza xotirjam oʻtiring.
11. **Ikkinchi sajda** — birinchisidek.

**Ikkinchi rakaat**

12. «Allāhu akbar» deb, imkon qadar qoʻllar bilan yerga tayanmay, oyoq uchlariga turib **qiyomga** qayting.
13. Ichida **basmala**, soʻng **Fotiha** va **zam sura** oʻqing.
14. Rukuʼ, qavma va ikki sajdani birinchi rakaatdagidek bajaring.
15. **Qaʼda.** Jalsadagidek oʻtirib, qoʻllarni tizzalar ustiga qoʻying. **Tashahhud**, **salovot** va **duo** oʻqing.
16. **Salom.** Avval oʻngga, soʻng chapga yuzni burib «As-salāmu ʻalaykum wa raḥmatullāh» deng.

:::eslatma
Tashahhudda «Ashhadu an lā ilāha» deganda oʻng qoʻlning koʻrsatkich barmogʻini koʻtarib, «illallāh» deganda tushirish Hanafiy ulamolari tomonidan sunnat sifatida qayd etilgan.
:::

## Uch rakaatli namoz (shom farzi)

- Birinchi ikki rakaat — yuqoridagidek.
- Ikkinchi rakaatdan keyin **birinchi qaʼda**: faqat tashahhud oʻqiladi ([[vojib]]), salovot oʻqilmaydi, darhol uchinchi rakaatga turiladi.
- Uchinchi rakaatda farz namozida faqat **Fotiha** oʻqiladi (zam sura qoʻshilmaydi).
- Soʻng oxirgi qaʼda: tashahhud, salovot, duo va salom.

## Toʻrt rakaatli namoz (peshin, asr, xufton farzi)

- Birinchi ikki rakaat va birinchi qaʼda — shomdagidek.
- Uchinchi va toʻrtinchi rakaatlarda farz namozida faqat **Fotiha** oʻqiladi.
- Toʻrtinchi rakaatdan keyin oxirgi qaʼda: tashahhud, salovot, duo va salom.

:::eslatma
**Sunnat va nafl** namozlarida barcha rakaatlarda Fotihadan keyin zam sura oʻqiladi.
:::

## Erkak va ayol namozidagi farqlar

:::ayollar
Hanafiy mazhabida ayollar namozi asosan erkaklarnikidek, ammo quyidagi farqlar bor:

| | Erkak | Ayol |
|---|---|---|
| Takbirda qoʻllar | Quloq yumshogʻigacha | Yelka barobarigacha, kaftlar roʻmol ichida qolishi mumkin |
| Qoʻllarni bogʻlash | Kindik ostida, bilakni ushlab | Koʻkrak ustida, oʻng kaft chap qoʻl ustida (ushlamasdan) |
| Rukuʼ | Bel toʻliq tekis, barmoqlar ochiq | Ozgina egiladi, barmoqlar jips |
| Sajda | Tirsaklar biqindan, qorin sondan ajralgan | Yigʻilib, bilaklar yerga yotqizilgan, qorin songa tegib turadi |
| Oʻtirish | Chap oyoq ustiga oʻtirib, oʻngi tik | Ikki oyoqni oʻng tomonga chiqarib, yerga oʻtiradi |
| Qiroat | Ovozli namozlarda (imom) ovoz chiqaradi | Ovozini begona erkaklar eshitadigan darajada koʻtarmaydi |

Bu farqlarning asosi — ayol uchun koʻproq yopiqlik (sitr)dir.
:::

## Jamoat namozi

::hadith{jamoat-namozi}

- Imomga iqtido qilgan kishi (muqtadiy) faqat **sanoni** oʻqiydi; Fotiha va zam surani oʻqimaydi, imomning qiroatini jim eshitadi.
- Rukuʼ, sajda va boshqa harakatlarni imomdan keyin bajaradi, undan oldin oʻtmaydi.
- Tasbehlar, tashahhud, salovot va duolarni oʻzi ichida oʻqiydi.

:::ixtilof
Imom ortida Fotiha oʻqish masalasida mazhablar ixtilof qilgan. Hanafiy mazhabida muqtadiy qiroat qilmaydi — imomning qiroati unga kifoya qiladi. Shofeʼiy mazhabida esa muqtadiy ham Fotiha oʻqiydi.
:::

## Juma namozi

::hadith{juma-kuni}

- Juma namozi peshin vaqtida, xutba bilan, jamoat bilan oʻqiladigan **ikki rakaat farz** namozdir.
- U oqil, balogʻatga yetgan, muqim (musofir boʻlmagan), sogʻlom erkaklarga farz.
- Ayollarga juma farz emas; agar ular juma namozida qatnashsa, peshin oʻrniga oʻtadi.
- Jumadan oldin toʻrt rakaat va keyin toʻrt rakaat sunnat oʻqiladi.

:::ixtilof
Juma farzidan keyingi sunnat Imom Abu Hanifa qavliga koʻra toʻrt rakaat; Imom Abu Yusuf qavliga koʻra olti rakaat (toʻrt, soʻng ikki). Oʻzbekistonda koʻp masjidlarda har ikkala amal ham uchraydi.
:::

## Vitr namozi

:::vojib
Vitr — uch rakaat, bir salom bilan oʻqiladi. Har uch rakaatda Fotiha va zam sura oʻqiladi. Ikkinchi rakaatdan keyin birinchi qaʼda (faqat tashahhud) boʻladi. Uchinchi rakaatda zam suradan keyin takbir aytib, qoʻllar quloqqacha koʻtariladi, qayta bogʻlanib, **qunut duosi** oʻqiladi, soʻng rukuʼga boriladi.
:::

::dua{qunut-duosi}

## Sajdai sahv

Namozda bir vojib unutib tark etilsa yoki kechiktirilsa:

1. Oxirgi qaʼdada tashahhudni oʻqing.
2. Faqat **oʻng tomonga** salom bering.
3. Ikki marta sajda qiling (har birida tasbeh bilan).
4. Qayta oʻtirib, tashahhud, salovot va duo oʻqing.
5. Ikki tomonga salom berib, namozni tugating.

:::diqqat
Farz (rukun) tark etilsa, sajdai sahv yetarli emas — namoz qayta oʻqiladi. Vojib qasddan tark etilsa ham namozni qayta oʻqish lozim.
:::
`,
  },
  {
    slug: "kop-uchraydigan-xatolar",
    order: 7,
    title: "Koʻp uchraydigan xatolar va savollar",
    summary: "Yangi oʻrganuvchilarning keng tarqalgan xatolari, namozni buzadigan va buzmaydigan narsalar, koʻp beriladigan savollar.",
    minutes: 12,
    outcomes: ["Namozni buzadigan narsalarni bilish", "Makruh amallardan saqlanish", "Koʻp uchraydigan savollarga javob topish"],
    refs: [{ ...NUR, locator: "Kitob as-salot: namozni buzuvchilar va makruhlari boblari" }, { ...QUDURIY, locator: "Kitob as-salot" }, { ...RADD, locator: "Kitob as-salot, namozni buzuvchilar bobi" }],
    markdown: `## Yangi oʻrganuvchilarning keng tarqalgan xatolari

- **Shoshilish.** Rukuʼ va sajdada, ayniqsa qavma va jalsada xotirjam turmaslik. Taʼdili arkon Hanafiy mazhabida [[vojib]].
- **Fotihani notoʻgʻri oʻqish.** Harflarni almashtirib yuborish (masalan, «ḥ» oʻrniga «h», «ʻ» ni tushirib qoldirish) maʼnoni oʻzgartirishi mumkin. Ustozdan eshitib oʻrganing.
- **Sajdada burun yoki oyoq barmoqlarini yerdan koʻtarish.**
- **Qoʻllarni notoʻgʻri koʻtarish yoki bogʻlash.**
- **Imomdan oldin harakat qilish.**
- **Tahoratni shoshib, quruq joy qoldirib olish.**

## Namozni buzadigan narsalar

:::harom
Quyidagilar namozni buzadi — namozni qaytadan oʻqish kerak:

- Namozda gapirish (oz yoki koʻp, unutib boʻlsa ham)
- Yeyish yoki ichish
- Koʻrgan kishi namozda emas deb oʻylaydigan darajadagi koʻp harakat (amali kasir)
- Koʻkrakni qibladan burish
- Atrofdagilar eshitadigan darajada kulish (qahqaha tahoratni ham buzadi)
- Biror farzni (rukunni) tark etish
- Qiroatda maʼnoni buzadigan darajadagi xato
- Avratdan bir aʼzoning toʻrtdan biri bir rukun miqdori ochiq qolishi
- Uzrsiz «oh», «voy» kabi ovoz chiqarib nolish
:::

## Namozni buzmaydigan narsalar

- Koʻz bilan atrofga qarash (makruh, lekin buzmaydi)
- Allohdan qoʻrqib yoki oxiratni eslab yigʻlash
- Kam harakat (masalan, kiyimni bir qoʻl bilan toʻgʻrilash)
- Namozda xayol boshqa narsaga ketib qolishi — savobni kamaytiradi, ammo namoz durust

## Makruh amallar

:::makruh
- Kiyim yoki badan bilan oʻynash, barmoqlarni qisirlatish
- Koʻzni yumib oʻqish (zarurat boʻlmasa)
- Esnaganda ogʻizni yopmaslik
- Bevl yoki hojat bosib turgan holda namoz oʻqish
- Tirik jon suratlari tushirilgan kiyimda oʻqish
- Osmonga qarash
- Sajdada bilaklarni yerga yotqizish (erkaklar uchun)
:::

## Koʻp beriladigan savollar

**Namozni unutib qoldirsam, nima qilaman?**
Esingizga tushishi bilan uni qazo qilib oʻqing. Qazo namozlarini makruh vaqtlardan boshqa istalgan vaqtda oʻqish mumkin.

**Namoz ichida tahoratim sinsa-chi?**
Namoz buziladi. Tahorat olib, namozni qaytadan oʻqing. (Jamoat namozida «binoʼ» qilish masalasi bor — buni ulamodan oʻrganing.)

**Rakaatlar sonida adashsam-chi?**
Agar bu birinchi marta boʻlsa, namozni qaytadan boshlash tavsiya etiladi. Agar koʻp boʻlib tursa, gumoningiz kuchli tomonga amal qilasiz; gumon teng boʻlsa, ozini olib, har rakaat oxirida oʻtirasiz va oxirida sajdai sahv qilasiz.

**Arab tilini bilmasam, namoz oʻqiy olamanmi?**
Ha. Namoz soʻzlarini arabcha talaffuzi bilan yod oling, maʼnosini oʻzbek tilida oʻrganing. Oʻrganish davomida bilganingizcha oʻqiyverasiz va oʻrganishni davom ettirasiz.

**Kasal boʻlsam, qanday oʻqiyman?**
Tik tura olmasangiz, oʻtirib; oʻtira olmasangiz, yonboshlab yoki chalqancha yotib, imo-ishora bilan oʻqiysiz. Namoz hech qachon butunlay soqit boʻlmaydi, faqat qulay shaklga oʻtadi.

:::eslatma
Bu yerda umumiy qoidalar keltirildi. Shaxsiy holatingizga oid savollar boʻyicha malakali ulamo yoki Oʻzbekiston musulmonlari idorasining fatvo xizmatiga murojaat qiling.
:::
`,
  },
  {
    slug: "bilimni-sinash",
    order: 8,
    title: "Bilimingizni sinang",
    summary: "Barcha darslar boʻyicha test, takrorlash mashqlari va natijalarni kuzatish.",
    minutes: 10,
    outcomes: ["Oʻrganilgan bilimlarni mustahkamlash", "Zaif tomonlarni aniqlash", "Darslarni takrorlash"],
    refs: [{ ...NUR, locator: "Kitob at-tahorat va Kitob as-salot" }],
    markdown: `## Test haqida

Quyidagi test oldingi yetti darsning asosiy mavzularini qamrab oladi. Har bir savoldan keyin toʻgʻri javob va uning izohi koʻrsatiladi.

- Natijangiz brauzeringizda (hisobga kirgan boʻlsangiz, profilingizda ham) saqlanadi.
- Testni istalgancha qayta topshirishingiz mumkin — eng yaxshi natija saqlanadi.
- Xato qilgan savollaringiz boʻyicha tegishli darsni takrorlang.

:::eslatma
Test — oʻrganishga yordam vositasi. U ilmiy daraja yoki ruxsatnoma bermaydi.
:::
`,
  },
];
