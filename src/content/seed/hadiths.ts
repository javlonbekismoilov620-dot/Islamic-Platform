/**
 * Hadislarning oʻzbekcha tarjimasi va qisqa izohi — tahririyat qoralamasi (ulamolar tekshiruvi kutilmoqda).
 * Arabcha matn, toʻplam, raqam va baholar src/content/sources/hadith-sources.json dan olinadi.
 * Tarjima faqat koʻrsatilgan arabcha qism (matn)ga mos keladi.
 */
export type HadithText = { title: string; narrator: string; translation: string; explanation?: string };

export const HADITH_TEXTS: Record<string, HadithText> = {
  niyat: {
    title: "Amallar niyatga bogʻliq",
    narrator: "Umar ibn Xattob roziyallohu anhu",
    translation: "«Amallar faqat niyatlarga koʻradir va har bir kishiga faqat niyat qilgan narsasi bor. Kimning hijrati erishmoqchi boʻlgan dunyosi yoki uylanmoqchi boʻlgan ayoli uchun boʻlsa, uning hijrati hijrat qilgan narsasigadir».",
    explanation: "Ulamolar bu hadisni dinning asosiy qoidalaridan biri deb bilganlar: ibodatning qabul boʻlishi va savobi niyatning Alloh uchun xolis boʻlishiga bogʻliq.",
  },
  "islom-besh-ustun": {
    title: "Islom besh ustun ustiga qurilgan",
    narrator: "Abdulloh ibn Umar roziyallohu anhumo",
    translation: "«Islom besh narsa ustiga qurilgan: Allohdan oʻzga iloh yoʻq va Muhammad Allohning Rasuli deb guvohlik berish, namozni qoim qilish, zakot berish, haj qilish va Ramazon roʻzasini tutish».",
    explanation: "Bu besh amal Islomning asosiy rukunlari hisoblanadi. Ular haqida batafsil maʼlumot «Bilimlar» boʻlimida.",
  },
  "jibril-hadisi": {
    title: "Islom, iymon va ehson (Jibril hadisi)",
    narrator: "Umar ibn Xattob roziyallohu anhu",
    translation: "(Jibril alayhissalom inson qiyofasida kelib soʻradi:) «Ey Muhammad, menga Islom haqida xabar ber». Rasululloh ﷺ dedilar: «Islom — Allohdan oʻzga iloh yoʻq va Muhammad Allohning Rasuli deb guvohlik berishing, namozni qoim qilishing, zakot berishing, Ramazon roʻzasini tutishing va agar yoʻlga qodir boʻlsang, Baytullohni haj qilishingdir». U: «Toʻgʻri aytding», dedi. (Umar aytadi:) Biz undan ajablandik — ham soʻraydi, ham tasdiqlaydi. U: «Menga iymon haqida xabar ber», dedi. U zot: «Allohga, Uning farishtalariga, kitoblariga, paygʻambarlariga, oxirat kuniga iymon keltirishing va qadarga — uning yaxshisi va yomoniga iymon keltirishingdir», dedilar. U: «Toʻgʻri aytding», dedi. «Menga ehson haqida xabar ber», dedi. U zot: «Allohga Uni koʻrib turgandek ibodat qilishing; agar sen Uni koʻrmasang ham, U seni koʻrib turadi», dedilar.",
    explanation: "Bu hadis dinning uch darajasini — Islom (zohiriy amallar), iymon (eʼtiqod asoslari) va ehson (ibodatdagi ixlos va hushyorlik)ni jamlagani uchun «dinning onasi» deb ham atalgan.",
  },
  "musulmon-kim": {
    title: "Musulmon kim?",
    narrator: "Abdulloh ibn Amr roziyallohu anhumo",
    translation: "«Musulmon — musulmonlar uning tilidan va qoʻlidan salomat boʻlgan kishidir».",
  },
  "birodarga-sevgi": {
    title: "Birodaringga oʻzingga sevganni sev",
    narrator: "Anas ibn Molik roziyallohu anhu",
    translation: "«Sizlardan biringiz oʻzi uchun yaxshi koʻrgan narsani birodari uchun ham yaxshi koʻrmaguncha (komil) moʻmin boʻlmaydi».",
    explanation: "Ulamolar bu yerdagi «moʻmin boʻlmaydi» soʻzini iymonning kamoliga yetmaydi, deb sharhlaganlar.",
  },
  "din-nasihat": {
    title: "Din — nasihatdir",
    narrator: "Tamim ad-Doriy roziyallohu anhu",
    translation: "«Din — nasihat (samimiy xayrixohlik)dir». Biz: «Kim uchun?» dedik. U zot: «Alloh uchun, Uning Kitobi uchun, Uning Rasuli uchun, musulmonlarning rahbarlari va ularning omma(si) uchun», dedilar.",
  },
  "halol-va-harom": {
    title: "Halol ham ochiq, harom ham ochiq",
    narrator: "Nuʼmon ibn Bashir roziyallohu anhu",
    translation: "«Halol ochiq-ravshan, harom ham ochiq-ravshandir. Ularning orasida koʻp odamlar bilmaydigan shubhali narsalar bor. Kim shubhali narsalardan saqlansa, dinini va obroʻsini pok saqlabdi. Kim shubhali narsalarga tushsa, qoʻriqxona atrofida (podasini) boqib, unga kirib ketishiga oz qolgan choʻponga oʻxshaydi. Ogoh boʻlinglar, har bir podshohning qoʻriqxonasi bor. Ogoh boʻlinglar, Allohning Oʻz yeridagi qoʻriqxonasi — U harom qilgan narsalardir. Ogoh boʻlinglar, jasadda bir parcha goʻsht bor: u yaxshi boʻlsa, butun jasad yaxshi boʻladi, u buzilsa, butun jasad buziladi. Ogoh boʻlinglar, u — qalbdir».",
  },
  "shubhani-tark-et": {
    title: "Shubhalantirgan narsani tark et",
    narrator: "Hasan ibn Ali roziyallohu anhumo",
    translation: "«Seni shubhaga soladigan narsani tark etib, shubhaga solmaydigan narsaga oʻt».",
  },
  "taqvo-va-xulq": {
    title: "Qayerda boʻlsang ham taqvo qil",
    narrator: "Abu Zar roziyallohu anhu",
    translation: "«Qayerda boʻlsang ham Allohdan taqvo qil. Yomonlikning ortidan yaxshilik qil — u uni oʻchiradi. Odamlar bilan goʻzal xulq bilan muomala qil».",
  },
  "kuchli-mumin": {
    title: "Kuchli moʻmin",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Kuchli moʻmin Allohga zaif moʻmindan yaxshiroq va sevimliroqdir. Ikkalasida ham yaxshilik bor. Senga foyda beradigan narsaga harakat qil, Allohdan yordam soʻra va ojiz boʻlma».",
  },
  "poklik-iymon-yarmi": {
    title: "Poklik — iymonning yarmi",
    narrator: "Abu Molik al-Ashʼariy roziyallohu anhu",
    translation: "«Poklik iymonning yarmidir. «Al-ḥamdu lillāh» (soʻzi) tarozini toʻldiradi».",
    explanation: "Bu uzun hadisning boshlanishi. Hadis davomida tasbeh, namoz, sadaqa va sabrning fazilatlari ham zikr qilingan.",
  },
  "namoz-kaliti": {
    title: "Namozning kaliti — poklik",
    narrator: "Ali ibn Abu Tolib roziyallohu anhu",
    translation: "«Namozning kaliti — poklikdir. Uni harom qiluvchi (namozdan boshqa ishni man qiluvchi) — takbir, uni halol qiluvchi (namozdan chiqaruvchi) esa salomdir».",
  },
  "tahoratsiz-namoz": {
    title: "Tahoratsiz namoz qabul boʻlmaydi",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Tahorati sinib qolgan kishining namozi u tahorat olmaguncha qabul qilinmaydi».",
  },
  "tahorat-gunohlarni-yuvadi": {
    title: "Tahorat gunohlarni yuvadi",
    narrator: "Usmon ibn Affon roziyallohu anhu",
    translation: "«Kim tahorat olib, tahoratni goʻzal qilsa, uning xatolari jasadidan chiqib ketadi».",
    explanation: "Hadisning davomida xatolar hatto tirnoqlar ostidan ham chiqib ketishi aytilgan. Ulamolar bu yerdagi xatolarni kichik gunohlar deb sharhlaganlar.",
  },
  misvok: {
    title: "Misvokning fazilati",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Agar ummatimga — yoki odamlarga — mashaqqat boʻlishidan qoʻrqmaganimda, ularni har bir namoz bilan misvok ishlatishga buyurgan boʻlar edim».",
    explanation: "Hanafiy mazhabida tahorat paytida misvok ishlatish sunnat hisoblanadi.",
  },
  "besh-namoz-daryo": {
    title: "Besh vaqt namoz — eshik oldidagi daryo",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Aytinglar-chi, agar birortangizning eshigi oldida daryo boʻlsa-yu, u har kuni besh marta unda yuvinsa, uning kiridan biror narsa qoladimi?» Ular: «Uning kiridan hech narsa qolmaydi», deyishdi. U zot: «Besh vaqt namozning misoli ham shunday: Alloh ular bilan xatolarni oʻchiradi», dedilar.",
  },
  "birinchi-hisob-namoz": {
    title: "Qiyomatda birinchi soʻraladigan amal",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Qiyomat kuni bandaning amallaridan birinchi hisob qilinadigani — uning namozidir. Agar u yaxshi boʻlsa, najot topib, muvaffaq boʻladi. Agar u buzuq boʻlsa, umidsiz boʻlib, ziyon koʻradi».",
  },
  "jamoat-namozi": {
    title: "Jamoat namozining fazilati",
    narrator: "Abdulloh ibn Umar roziyallohu anhumo",
    translation: "«Jamoat namozi yolgʻiz oʻqilgan namozdan yigirma yetti daraja afzaldir».",
  },
  "meni-korganingizdek": {
    title: "Meni qanday namoz oʻqiganimni koʻrgan boʻlsangiz, shunday oʻqing",
    narrator: "Molik ibn Huvayris roziyallohu anhu",
    translation: "«…Meni qanday namoz oʻqiyotganimni koʻrgan boʻlsangizlar, shunday namoz oʻqinglar».",
    explanation: "Namozning sifati Paygʻambarimizning ﷺ amallaridan olinadi. Mazhab imomlari bu amallarni rivoyatlar asosida tartibga solganlar; «Namoz» darslarida Hanafiy mazhabi boʻyicha bayon qilingan.",
  },
  "vaqtida-oqilgan-namoz": {
    title: "Allohga eng sevimli amal",
    narrator: "Abdulloh ibn Masʼud roziyallohu anhu",
    translation: "(Soʻradim:) «Qaysi amal Allohga eng sevimli?» U zot: «Oʻz vaqtida oʻqilgan namoz», dedilar. «Keyin qaysi?» dedim. «Keyin ota-onaga yaxshilik qilish», dedilar. «Keyin qaysi?» dedim. «Alloh yoʻlida jihod», dedilar.",
  },
  "sajdada-yaqinlik": {
    title: "Banda Robbiga eng yaqin boʻladigan holat",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Banda Robbiga eng yaqin boʻladigan holat — u sajdada boʻlgan holatdir. Bas, (sajdada) duoni koʻpaytiringlar».",
    explanation: "Hanafiy mazhabida farz namozlari sajdasida faqat tasbeh aytiladi; nafl namozlarda va namozdan tashqari sajdada arabcha maʼsur duolar qilish haqida ulamolar batafsil soʻz yuritganlar.",
  },
  "namozni-tark-etish": {
    title: "Namozni tark etish haqida ogohlantirish",
    narrator: "Jobir ibn Abdulloh roziyallohu anhu",
    translation: "«Kishi bilan shirk va kufr oʻrtasida namozni tark etish (chegara) bor».",
    explanation: "Ahli sunna ulamolarining koʻpchiligi (jumladan, Hanafiylar) bu hadisni namozning farzligini inkor etmay, dangasalik bilan tark etgan kishi katta gunohkor boʻladi, lekin dindan chiqmaydi, deb tushuntirganlar. Farzligini inkor qilish esa kufrdir.",
  },
  "juma-kuni": {
    title: "Juma — eng yaxshi kun",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Quyosh chiqqan kunlarning eng yaxshisi — juma kunidir. Shu kuni Odam yaratilgan, shu kuni jannatga kiritilgan va shu kuni undan chiqarilgan».",
  },
  "ramazon-iymon-bilan": {
    title: "Ramazonni iymon bilan tutish",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Kim Ramazon roʻzasini iymon bilan va (savobini Allohdan) umid qilib tutsa, uning oʻtgan gunohlari kechiriladi».",
  },
  "ramazon-eshiklari": {
    title: "Ramazon kirganda",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Ramazon kirganda jannat eshiklari ochiladi, jahannam eshiklari yopiladi va shaytonlar kishanlanadi».",
  },
  "qadr-kechasi-qiyomi": {
    title: "Qadr kechasini ibodat bilan oʻtkazish",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Kim Qadr kechasini iymon bilan va (savobini) umid qilib ibodat bilan oʻtkazsa, uning oʻtgan gunohlari kechiriladi».",
  },
  "qadr-kechasini-izlash": {
    title: "Qadr kechasini izlang",
    narrator: "Oisha roziyallohu anho",
    translation: "«Qadr kechasini Ramazonning oxirgi oʻn kunining toq kechalarida izlanglar».",
    explanation: "Qadr kechasining aniq sanasi maʼlum emas. Koʻpchilik Ramazonning 27-kechasini umid qiladi, ammo ulamolar oxirgi oʻn kunning barcha toq kechalarida ibodat qilishni tavsiya etganlar.",
  },
  "saharlik-baraka": {
    title: "Saharlikda baraka bor",
    narrator: "Anas ibn Molik roziyallohu anhu",
    translation: "«Saharlik qilinglar, chunki saharlikda baraka bor».",
  },
  "iftorga-shoshilish": {
    title: "Iftorni kechiktirmaslik",
    narrator: "Sahl ibn Saʼd roziyallohu anhu",
    translation: "«Odamlar iftorga shoshilar ekanlar, yaxshilikda boʻladilar».",
    explanation: "Quyosh botgani aniq boʻlgach, iftorni kechiktirmaslik sunnat.",
  },
  "rozadorning-tili": {
    title: "Roʻzadorning tili va amali",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Kim yolgʻon soʻz va unga amal qilishni tark etmasa, uning taomi va ichimligini tark etishiga Allohning hojati yoʻq».",
  },
  "dushanba-payshanba": {
    title: "Dushanba va payshanba roʻzasi",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Amallar dushanba va payshanba kunlari (Allohga) koʻrsatiladi. Men amalim roʻzador holimda koʻrsatilishini yaxshi koʻraman».",
  },
  "oyning-oq-kunlari": {
    title: "Oyning «oq kunlari» roʻzasi",
    narrator: "Abu Zar roziyallohu anhu",
    translation: "«Agar oyda uch kun roʻza tutsang, oʻn uchinchi, oʻn toʻrtinchi va oʻn beshinchi kunlarni tut».",
    explanation: "Bu kunlar hijriy oyning 13, 14 va 15-kunlaridir (oy toʻlin boʻlgan kechalar).",
  },
  "arafa-va-ashuro": {
    title: "Arafa va Ashuro roʻzasi",
    narrator: "Abu Qatoda roziyallohu anhu",
    translation: "«Arafa kuni roʻzasi haqida Allohdan umid qilamanki, u oʻtgan yil va keyingi yil (gunohlari)ga kafforat boʻladi. Ashuro kuni roʻzasi haqida Allohdan umid qilamanki, u oʻtgan yil (gunohlari)ga kafforat boʻladi».",
    explanation: "Ulamolar bu kafforatni kichik gunohlarga tegishli deb sharhlaganlar. Arafa kuni roʻzasi hojilar boʻlmaganlar uchun mustahabdir.",
  },
  "shavvolning-olti-kuni": {
    title: "Shavvolning olti kuni",
    narrator: "Abu Ayyub al-Ansoriy roziyallohu anhu",
    translation: "«Kim Ramazon roʻzasini tutib, ortidan Shavvoldan olti kun roʻza tutsa, butun yil roʻza tutgandek boʻladi».",
  },
  "sadaqa-molni-kamaytirmas": {
    title: "Sadaqa molni kamaytirmaydi",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Sadaqa moldan hech narsani kamaytirmaydi. Alloh kechirimli bandaning faqat izzatini ziyoda qiladi. Kim Alloh uchun kamtarlik qilsa, Alloh uni albatta yuksaltiradi».",
  },
  "har-yaxshilik-sadaqa": {
    title: "Har bir yaxshilik sadaqadir",
    narrator: "Jobir ibn Abdulloh roziyallohu anhu",
    translation: "«Har bir yaxshilik sadaqadir».",
  },
  "tabassum-sadaqa": {
    title: "Tabassum ham sadaqa",
    narrator: "Abu Zar roziyallohu anhu",
    translation: "«Birodaringning yuziga tabassum qilishing sen uchun sadaqadir».",
  },
  "zakotni-bermaslik": {
    title: "Zakotini bermagan mol egasi",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Kimga Alloh mol bersa-yu, u molining zakotini bermasa, qiyomat kuni uning moli unga boshida yungi toʻkilgan (zahari koʻp) ilon qiyofasida keltiriladi, uning (koʻzi ustida) ikki qora nuqtasi boʻladi. U qiyomat kuni uning boʻyniga oʻraladi, soʻng uning jagʻlaridan tishlab: «Men sening molingman, men sening xazinangman», deydi».",
  },
  "haji-mabrur": {
    title: "Haji mabrurning mukofoti",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Bir umradan keyingi umragacha boʻlgan (gunohlar)ga kafforatdir. Haji mabrurning (qabul boʻlgan hajning) mukofoti esa faqat jannatdir».",
  },
  "quron-organgan": {
    title: "Qurʼonni oʻrgangan va oʻrgatgan",
    narrator: "Usmon ibn Affon roziyallohu anhu",
    translation: "«Sizlarning eng yaxshilaringiz Qurʼonni oʻrgangan va uni (boshqalarga) oʻrgatganlaringizdir».",
  },
  "quron-shafoatchi": {
    title: "Qurʼon shafoatchi boʻladi",
    narrator: "Abu Umoma al-Bohiliy roziyallohu anhu",
    translation: "«Qurʼonni oʻqinglar, chunki u qiyomat kuni oʻz egalari (uni oʻqib, amal qilganlar)ga shafoatchi boʻlib keladi».",
  },
  "har-harfga-savob": {
    title: "Qurʼonning har bir harfiga savob",
    narrator: "Abdulloh ibn Masʼud roziyallohu anhu",
    translation: "«Kim Allohning Kitobidan bir harf oʻqisa, unga bir hasana (savob) bor, hasana esa oʻn barobaridir. «Alif-Lom-Mim» bir harf demayman, balki «Alif» bir harf, «Lom» bir harf va «Mim» bir harfdir».",
  },
  "quronni-yodda-tutish": {
    title: "Qurʼonni doim takrorlab turing",
    narrator: "Abu Muso al-Ashʼariy roziyallohu anhu",
    translation: "«Qurʼonni (takrorlab) parvarish qilinglar. Jonim Uning qoʻlida boʻlgan Zotga qasamki, u bogʻlab qoʻyilgan tuyaning bogʻichidan chiqib ketishidan ham tezroq (xotiradan) chiqib ketadi».",
  },
  "ilm-yoli": {
    title: "Ilm yoʻli — jannat yoʻli",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«…Kim ilm izlab bir yoʻlga tushsa, Alloh u sababli unga jannatga boradigan yoʻlni oson qiladi».",
    explanation: "Bu uzun hadisning bir qismi. Hadisda musulmon birodarning mushkulini oson qilish va aybini yashirishning fazilati ham zikr qilingan.",
  },
  "ikki-yengil-kalima": {
    title: "Tilda yengil, tarozida ogʻir ikki kalima",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Ikki kalima borki, ular tilga yengil, tarozida ogʻir va Rahmonga sevimlidir: «Subḥānallāhil-ʻaẓīm, subḥānallāhi wa biḥamdih»».",
  },
  "eng-afzal-zikr": {
    title: "Eng afzal zikr va eng afzal duo",
    narrator: "Jobir ibn Abdulloh roziyallohu anhu",
    translation: "«Zikrning eng afzali — «Lā ilāha illallāh», duoning eng afzali — «Al-ḥamdu lillāh»».",
  },
  "namozdan-keyingi-tasbeh": {
    title: "Namozdan keyingi tasbehlar",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Kim har namozdan keyin Allohni oʻttiz uch marta tasbeh aytsa (Subḥānallāh), oʻttiz uch marta hamd aytsa (Al-ḥamdu lillāh), oʻttiz uch marta takbir aytsa (Allāhu akbar) — bu toʻqson toʻqqiz boʻladi — va yuzni toʻldirish uchun «Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʻalā kulli shayʼin qadīr» desa, uning xatolari dengiz koʻpigicha boʻlsa ham kechiriladi».",
  },
  "subhanallohi-va-bihamdihi": {
    title: "Kuniga yuz marta «Subhanallohi va bihamdihi»",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Kim bir kunda yuz marta «Subḥānallāhi wa biḥamdih» desa, uning xatolari dengiz koʻpigicha boʻlsa ham oʻchiriladi».",
  },
  "duo-ibodatdir": {
    title: "Duo — ibodatdir",
    narrator: "Nuʼmon ibn Bashir roziyallohu anhu",
    translation: "«Duo — ibodatning oʻzidir».",
  },
  "salovot-fazilati": {
    title: "Salovotning fazilati",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Kim menga bir marta salovot aytsa, Alloh unga oʻn marta salovot (rahmat) yogʻdiradi».",
  },
  "sayyidul-istigfor": {
    title: "Sayyidul-istigʻfor",
    narrator: "Shaddod ibn Avs roziyallohu anhu",
    translation: "«Istigʻforning sayyidi (eng afzali) shuki, sen: «Allohim, Sen mening Robbimsan, Sendan oʻzga iloh yoʻq. Sen meni yaratding, men Sening bandangman. Qurbim yetgancha Senga bergan ahdim va vaʼdamdaman. Qilgan ishlarimning yomonligidan Sendan panoh soʻrayman. Menga bergan neʼmatingni eʼtirof etaman, gunohimni ham eʼtirof etaman. Meni magʻfirat qil, zero gunohlarni Sendan boshqa hech kim kechirmaydi», deysan». U zot dedilar: «Kim buni kunduzi chin ishonch bilan aytib, shu kuni kech kirmasdan vafot etsa, u jannat ahlidandir».",
  },
  "tavba-qiluvchilar": {
    title: "Xatokorlarning yaxshisi — tavba qiluvchilar",
    narrator: "Anas ibn Molik roziyallohu anhu",
    translation: "«Odam bolasining hammasi xato qiluvchidir. Xato qiluvchilarning eng yaxshisi — tavba qiluvchilardir».",
  },
  "kuniga-yuz-marta-istigfor": {
    title: "Kuniga yuz marta istigʻfor",
    narrator: "Agʻar al-Muzaniy roziyallohu anhu",
    translation: "«Qalbimni (baʼzan) bir parda qoplaydi. Men kuniga yuz marta Allohdan magʻfirat soʻrayman».",
  },
  "tavba-eshigi": {
    title: "Tavba eshigi ochiq",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Kim quyosh magʻribdan chiqishidan oldin tavba qilsa, Alloh uning tavbasini qabul qiladi».",
  },
  "allohning-tavbadan-shodligi": {
    title: "Alloh bandasining tavbasidan shod boʻladi",
    narrator: "Anas ibn Molik roziyallohu anhu",
    translation: "«Alloh bandasining tavbasidan, sizlardan birortangiz choʻl-biyobonda yoʻqotib qoʻygan tuyasini topib olganidagi (shodligidan) ham koʻproq shod boʻladi».",
  },
  "yaxshi-gapir-yoki-jim-tur": {
    title: "Yaxshi gapir yoki jim tur",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Kim Allohga va oxirat kuniga iymon keltirsa, qoʻshnisiga ozor bermasin. Kim Allohga va oxirat kuniga iymon keltirsa, mehmonini hurmat qilsin. Kim Allohga va oxirat kuniga iymon keltirsa, yaxshi gapirsin yoki jim tursin».",
  },
  gazablanma: {
    title: "Gʻazablanma",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "(Bir kishi Paygʻambarimizga ﷺ:) «Menga nasihat qiling», dedi. U zot: «Gʻazablanma», dedilar.",
    explanation: "Hadisning davomida u kishi bir necha marta takror soʻragani va har safar «Gʻazablanma» degan javob olgani aytilgan.",
  },
  "rahm-qiluvchilar": {
    title: "Rahm qilganlarga Rahmon rahm qiladi",
    narrator: "Abdulloh ibn Amr roziyallohu anhumo",
    translation: "«Rahm qiluvchilarga Rahmon rahm qiladi. Yerdagilarga rahm qilinglar, osmondagi Zot sizlarga rahm qiladi».",
  },
  "komil-iymon-goʻzal-xulq": {
    title: "Iymoni komil — xulqi goʻzal",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Moʻminlarning iymoni eng komili — xulqi eng goʻzalidir. Sizlarning eng yaxshilaringiz ayollariga eng yaxshi boʻlganlaringizdir».",
  },
  "jannatga-kiritadigan-amal": {
    title: "Jannatga eng koʻp kiritadigan amal",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "(Odamlarni jannatga eng koʻp kiritadigan narsa haqida soʻralganda dedilar:) «Allohdan taqvo qilish va goʻzal xulq». Odamlarni doʻzaxga eng koʻp kiritadigan narsa haqida soʻralganda: «Ogʻiz va farj», dedilar.",
  },
  "gʻiybat-nima": {
    title: "Gʻiybat nima?",
    narrator: "Abu Hurayra roziyallohu anhu",
    translation: "«Gʻiybat nima ekanini bilasizlarmi?» Ular: «Alloh va Uning Rasuli biluvchiroq», deyishdi. U zot: «Birodaringni u yoqtirmaydigan narsa bilan eslashing», dedilar. «Agar men aytgan narsa birodarimda bor boʻlsa-chi?» deyildi. U zot: «Agar sen aytgan narsa unda bor boʻlsa, uni gʻiybat qilibsan; agar unda yoʻq boʻlsa, unga boʻhton qilibsan», dedilar.",
  },
  "jannat-onaning-oyogʻi-ostida": {
    title: "Jannat onaning oyogʻi ostida",
    narrator: "Muoviya ibn Johima as-Sulamiy roziyallohu anhu",
    translation: "(Johima jihodga chiqish uchun maslahat soʻrab kelganida Paygʻambarimiz ﷺ soʻradilar:) «Onang bormi?» U: «Ha», dedi. U zot: «Undan ajralma, chunki jannat uning oyoqlari ostidadir», dedilar.",
  },
  "qoshni-haqqi": {
    title: "Qoʻshni haqqi",
    narrator: "Abdulloh ibn Umar roziyallohu anhumo",
    translation: "«Jabroil menga qoʻshni haqida shunchalik koʻp vasiyat qildiki, hatto uni (qoʻshnini) merosxoʻr qilib qoʻyadi, deb oʻyladim».",
  },
};
