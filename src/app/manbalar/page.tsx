import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Clock, ExternalLink, FileCheck2, ShieldCheck } from "lucide-react";
import { getContentStats, listSources } from "@/server/content/repo";
import { getQuranMeta } from "@/server/quran";
import { PageHeader, SectionHeader } from "@/components/ui/card";
import { TYPE_LABEL } from "@/server/admin/fields";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Manbalar va tekshiruv tartibi", description: "Saytdagi Qurʼon matni, tarjimalar, hadislar va duolar qayerdan olingani, qanday tekshirilgani va ulamolar tekshiruvi jarayoni.", alternates: { canonical: "/manbalar" } };

const KIND: Record<string, string> = { quran: "Qurʼon matni", translation: "Tarjimalar", hadith: "Hadis toʻplamlari", book: "Kitoblar", dataset: "Maʼlumotlar toʻplamlari", institution: "Muassasalar", website: "Saytlar" };

export default async function SourcesPage() {
  const [stats, sources, meta] = await Promise.all([getContentStats(), listSources(), getQuranMeta()]);
  const types = [...new Set(stats.map((s) => s.type))];
  const kinds = [...new Set(sources.map((s) => s.kind))];
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Ishonch" title="Manbalar va tekshiruv tartibi" subtitle="Diniy maʼlumotning ishonchliligi dizayn va imkoniyatlardan muhimroq. Bu sahifa har bir matn qayerdan olingani va qanday tekshirilishini ochiq koʻrsatadi." />

      <section className="mb-10 grid gap-3 sm:grid-cols-3">
        {[
          { icon: <FileCheck2 size={20} />, t: "1. Manbadan aynan olish", d: "Qurʼon, tarjimalar, hadislar va duolarning arabcha matni dasturiy ravishda manbadan oʻzgartirilmasdan import qilinadi; fayllar SHA-256 xeshi bilan tekshiriladi." },
          { icon: <Clock size={20} />, t: "2. Tahririyat qoralamasi", d: "Oʻzbekcha tarjima, transliteratsiya va izohlar qoralama sifatida tayyorlanadi va «Tekshiruv kutilmoqda» belgisi bilan koʻrsatiladi." },
          { icon: <BadgeCheck size={20} />, t: "3. Ulamo tasdigʻi", d: "Tekshiruvchi ulamo matnni manba bilan solishtirib tasdiqlaydi. Muallif oʻz matnini oʻzi tasdiqlay olmaydi; har bir oʻzgarish tarixi saqlanadi." },
        ].map((s) => (
          <div key={s.t} className="card glass p-5">
            <span className="text-primary">{s.icon}</span>
            <p className="mt-2 font-semibold text-fg">{s.t}</p>
            <p className="mt-1 text-sm leading-relaxed text-fg-2">{s.d}</p>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <SectionHeader title="Joriy holat" subtitle="Kontentning tekshiruv holati (real vaqtda)" />
        <div className="overflow-x-auto rounded-3xl border border-line bg-surface">
          <table className="w-full min-w-[28rem] text-sm">
            <thead className="bg-sunken text-left"><tr><th className="px-4 py-3">Tur</th><th className="px-4 py-3 text-center">Ulamolar tasdiqlagan</th><th className="px-4 py-3 text-center">Tekshiruv kutilmoqda</th></tr></thead>
            <tbody>
              {types.map((t) => (
                <tr key={t} className="border-t border-line">
                  <td className="px-4 py-2.5 font-medium text-fg">{TYPE_LABEL[t] ?? t}</td>
                  <td className="px-4 py-2.5 text-center tabular-nums text-success">{stats.find((s) => s.type === t && s.status === "published")?.n ?? 0}</td>
                  <td className="px-4 py-2.5 text-center tabular-nums text-warning">{stats.find((s) => s.type === t && s.status === "in_review")?.n ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted">«Tekshiruv kutilmoqda» belgili matnlar fatvo yoki yakuniy hukm emas. Ular ulamolar tasdiqlagunga qadar ehtiyotkorlik bilan foydalanish uchun koʻrsatiladi.</p>
      </section>

      <section className="mb-10">
        <SectionHeader title="Qurʼon matni va tarjimalar" />
        <div className="card glass space-y-4 p-5 text-sm">
          <div>
            <p className="font-semibold text-fg">{meta.arabic.title}</p>
            <p className="mt-1 text-fg-2">{meta.arabic.license}</p>
            <p className="mt-1 font-mono text-xs break-all text-muted">SHA-256: {meta.arabic.sha256}</p>
          </div>
          {meta.translations.map((t) => (
            <div key={t.key} className="border-t border-line pt-4">
              <p className="font-semibold text-fg">{t.translator} — {t.edition}, {t.version}-versiya</p>
              <p className="mt-1 text-fg-2">{t.publisher}. Asl nashr kirill yozuvida; saytda lotin yozuviga harfma-harf oʻgirib ham koʻrsatiladi.</p>
              <p className="mt-1 text-xs text-muted">Foydalanish shartlari: {t.terms}</p>
              <a href={t.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">QuranEnc sahifasi <ExternalLink size={11} /></a>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionHeader title="Manbalar katalogi" />
        <div className="space-y-6">
          {kinds.map((k) => (
            <div key={k}>
              <p className="mb-2 text-sm font-semibold tracking-wide text-gold uppercase">{KIND[k] ?? k}</p>
              <ul className="space-y-2">
                {sources.filter((s) => s.kind === k).map((s) => (
                  <li key={s.id} className="card glass p-4 text-sm">
                    <p className="font-medium text-fg">{s.title}</p>
                    <p className="text-fg-2">{s.author}{s.publisher ? ` · ${s.publisher}` : ""}</p>
                    {s.notes && <p className="mt-1 text-xs text-muted">{s.notes}</p>}
                    {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">{new URL(s.url).host} <ExternalLink size={11} /></a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="card glass p-6">
        <h2 className="mb-2 flex items-center gap-2 font-semibold text-fg"><ShieldCheck size={18} className="text-primary" /> Tamoyillarimiz</h2>
        <ul className="list-disc space-y-1.5 ps-5 text-sm leading-relaxed text-fg-2">
          <li>Qurʼon oyatlari, hadislar, arabcha matnlar, raqamlar va baholar hech qachon «oʻylab topilmaydi» — faqat manbadan olinadi.</li>
          <li>Hadis baholari qaysi muhaddis bergani bilan birga koʻrsatiladi; zaif rivoyatlar yashirilmaydi, aniq belgilanadi.</li>
          <li>Fiqhiy hukmlar Hanafiy mazhabi asosida beriladi; boshqa mazhablardagi farqlar «Ulamolar orasida fikr farqi» belgisi bilan koʻrsatiladi.</li>
          <li>Farz, vojib, sunnat, mustahab, muboh, makruh va harom darajalari aralashtirilmaydi.</li>
          <li>Sunʼiy intellekt yordamida tayyorlangan qoralamalar ochiq belgilanadi va ulamo tasdigʻisiz «tasdiqlangan» deb koʻrsatilmaydi.</li>
          <li>Sayt fatvo bermaydi. Shaxsiy masalalar uchun <a href="https://muslim.uz" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Oʻzbekiston musulmonlari idorasi</a>ga yoki malakali ulamoga murojaat qiling.</li>
        </ul>
        <p className="mt-4 text-sm text-muted">Transliteratsiya standarti haqida — <Link href="/talaffuz" className="text-primary hover:underline">Talaffuz qoʻllanmasi</Link>.</p>
      </section>
    </div>
  );
}
