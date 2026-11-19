import type { Metadata } from "next";
import { PageHeader, SectionHeader } from "@/components/ui/card";
import { LETTERS, READING_RULES, TRANSLIT_VERSION, VOWEL_RULES, toSimple } from "@/lib/translit";
import { ReviewNotice } from "@/components/content/references";
import { Badge } from "@/components/ui/badge";
import { TranslitModeToggle } from "@/components/content/translit-toggle";

export const metadata: Metadata = {
  title: "Talaffuz qoʻllanmasi — arab tovushlari va transliteratsiya standarti",
  description: "Arab harflarining oʻzbek lotin yozuvidagi aniq transliteratsiyasi, oʻzbek tilida boʻlmagan tovushlar talaffuzi va oʻqish qoidalari.",
  alternates: { canonical: "/talaffuz" },
};

export default function PronunciationPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow={`Transliteratsiya standarti ${TRANSLIT_VERSION}`} title="Talaffuz qoʻllanmasi" subtitle="Saytdagi barcha duo va zikrlarning lotin yozuvidagi talaffuzi yagona standartga asoslangan. Oʻzbek tilida yoʻq tovushlar alohida belgilar bilan ajratilgan, shunda ularni oddiy harflar bilan adashtirmaysiz." />
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <TranslitModeToggle />
        <p className="text-sm text-muted">«Oddiy» yozuv aniq yozuvdan avtomatik hosil qilinadi — oʻqish oson, lekin tovush farqlari koʻrinmaydi.</p>
      </div>
      <ReviewNotice status="in_review" kind="article" compact />

      <section className="mt-10">
        <SectionHeader title="Harflar" subtitle="Belgilangan harflar oʻzbek tilida mavjud emas — ularga alohida eʼtibor bering" />
        <div className="overflow-x-auto rounded-3xl border border-line bg-surface">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-sunken text-fg">
              <tr><th className="px-4 py-3">Harf</th><th className="px-4 py-3">Nomi</th><th className="px-4 py-3">Aniq</th><th className="px-4 py-3">Oddiy</th><th className="px-4 py-3">Qanday aytiladi</th><th className="px-4 py-3">Misol</th></tr>
            </thead>
            <tbody>
              {LETTERS.map((l) => (
                <tr key={l.ar} className="border-t border-line align-top">
                  <td className="px-4 py-3"><span lang="ar" className="ar-inline text-[1.6rem] text-fg">{l.ar}</span></td>
                  <td className="px-4 py-3 font-medium text-fg">{l.name}{!l.inUzbek && <Badge tone="gold" className="ms-1.5">Oʻzbekchada yoʻq</Badge>}</td>
                  <td className="px-4 py-3 text-base font-semibold text-primary">{l.latin}</td>
                  <td className="px-4 py-3 text-fg-2">{l.simple}</td>
                  <td className="px-4 py-3 leading-relaxed text-fg-2">{l.how}</td>
                  <td className="px-4 py-3"><span lang="ar" className="ar-inline block text-lg text-fg">{l.example.ar}</span><span className="text-fg-2">{l.example.latin}</span><span className="block text-xs text-muted">{l.example.meaning}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader title="Unlilar va belgilar" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VOWEL_RULES.map((v) => (
            <li key={v.name} className="card glass p-5">
              <p className="flex items-center justify-between"><span className="font-semibold text-fg">{v.name}</span><span lang="ar" className="ar-inline text-2xl text-fg">{v.mark}</span></p>
              <p className="mt-1 font-semibold text-primary">{v.latin}</p>
              <p className="mt-1 text-sm text-fg-2">{v.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <SectionHeader title="Oʻqish qoidalari" />
        <ol className="card glass list-decimal space-y-3 p-6 ps-10 text-[0.95rem] leading-relaxed text-fg-2">
          {READING_RULES.map((r) => <li key={r}>{r}</li>)}
        </ol>
        <div className="card glass mt-4 p-6">
          <p className="mb-2 text-sm font-semibold text-fg">Namuna: Fotiha surasining 2-oyati</p>
          <p lang="ar" dir="rtl" className="ar-quran text-fg">ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ</p>
          <p className="mt-2 text-sm"><span className="text-muted">Aniq:</span> <span className="font-medium text-fg">Al-ḥamdu lillāhi rabbil-ʻālamīn</span></p>
          <p className="text-sm"><span className="text-muted">Oddiy:</span> <span className="font-medium text-fg">{toSimple("Al-ḥamdu lillāhi rabbil-ʻālamīn")}</span></p>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted">Transliteratsiya Qurʼon va duolarni arab yozuvisiz oʻrganishga yordam beradi, ammo u arab harflari va ustozdan eshitib oʻrganishning oʻrnini bosa olmaydi. Qurʼon tilovatida tajvid qoidalarini malakali qoridan oʻrganing.</p>
      </section>
    </div>
  );
}
