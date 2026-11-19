import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/card";

export const metadata: Metadata = { title: "Maxfiylik siyosati", alternates: { canonical: "/maxfiylik" } };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Maxfiylik siyosati" subtitle="Ibodat — shaxsiy ish. Biz iloji boricha kam maʼlumot yigʻamiz va uni hech kimga sotmaymiz yoki ulashmaymiz." />
      <div className="prose-uz card glass p-6 sm:p-8">
        <h2>Hisobsiz foydalanish</h2>
        <p>Saytning barcha imkoniyatlaridan roʻyxatdan oʻtmasdan foydalanish mumkin. Bu holda saqlanganlar, progress, zikr tarixi va sozlamalar faqat brauzeringizda (localStorage) saqlanadi va serverga yuborilmaydi.</p>
        <h2>Hisob yaratsangiz</h2>
        <ul>
          <li>Elektron pochta manzilingiz, ixtiyoriy ismingiz va parolingizning <strong>xeshi</strong> (parolning oʻzi emas) saqlanadi.</li>
          <li>Saqlanganlar, oʻrganish progressi, zikr tarixi, maqsadlar va sozlamalar qurilmalar orasida sinxronlash uchun saqlanadi.</li>
          <li>Kirish seansi uchun faqat xavfsiz (httpOnly) cookie ishlatiladi. Reklama yoki kuzatuv cookie-lari ishlatilmaydi.</li>
        </ul>
        <h2>Joylashuv</h2>
        <p>Namoz vaqtlari va qibla hisob-kitobi qurilmangizda bajariladi. «Joylashuvimni aniqlash» tugmasini bossangiz, koordinatalar faqat brauzeringizda saqlanadi va serverga yuborilmaydi.</p>
        <h2>Uchinchi tomon xizmatlari</h2>
        <p>Qurʼon tilovatini tinglaganingizda audio fayllar EveryAyah.com saytidan yuklanadi; bunda brauzeringiz ushbu saytga murojaat qiladi. Shriftlar va boshqa barcha resurslar shu saytning oʻzidan yuklanadi.</p>
        <h2>Huquqlaringiz</h2>
        <ul>
          <li>Profil sahifasidan barcha maʼlumotlaringizni JSON fayl sifatida yuklab olishingiz mumkin.</li>
          <li>Hisobingizni istalgan vaqtda butunlay oʻchirishingiz mumkin — barcha bogʻliq maʼlumotlar oʻchiriladi.</li>
          <li>Mehmon rejimidagi mahalliy maʼlumotlarni profil sahifasidan tozalash mumkin.</li>
        </ul>
      </div>
    </div>
  );
}
