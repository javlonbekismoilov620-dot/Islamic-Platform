import type { Metadata } from "next";
import { listContent } from "@/server/content/repo";
import { PageHeader } from "@/components/ui/card";
import { HijriCalendar } from "@/components/calendar/hijri-calendar";
import { EVENTS, RECURRING_FASTS } from "@/content/seed/events";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Hijriy taqvim — Ramazon, hayitlar va muborak kunlar", description: "Hijriy va milodiy taqvim, Ramazon, Ramazon va Qurbon hayitlari, Arafa, Ashuro, Qadr kechasi hamda nafl roʻzalar.", alternates: { canonical: "/taqvim" } };

export default async function CalendarPage() {
  const items = await listContent("event");
  const events = items.map((e) => ({ slug: e.slug, title: e.title, ...e.body, hadith: EVENTS.find((x) => x.slug === e.slug)?.hadith }));
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Taqvim" title="Hijriy taqvim" subtitle="Sanalar Ummul-Quro jadvali asosida hisoblangan. Oʻzbekistonda oy boshlanishi hilolni koʻrish bilan belgilanadi, shuning uchun 1–2 kun farq boʻlishi mumkin — moslash tugmalaridan foydalaning." />
      <HijriCalendar events={events} />
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-fg">Doimiy nafl roʻzalar</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {RECURRING_FASTS.map((r) => (
            <li key={r.title} className="card glass p-5">
              <p className="font-semibold text-fg">{r.title}</p>
              <p className="mt-1 text-sm text-fg-2">{r.description} Hukmi: mustahab.</p>
              <a href={`/hadislar/${r.hadith}`} className="mt-2 inline-block text-xs font-medium text-primary hover:underline">Tegishli hadis →</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
