import type { Metadata } from "next";
import { listContent } from "@/server/content/repo";
import { PageHeader } from "@/components/ui/card";
import { LessonList } from "@/components/learn/lesson-progress";
import { ReviewNotice } from "@/components/content/references";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Namoz akademiyasi — namozni noldan oʻrganish",
  description: "Hanafiy mazhabi asosida 8 ta darsda namoz: shartlar, tahorat, gʻusl, namoz soʻzlari, amaliy namoz, xatolar va test.",
  alternates: { canonical: "/ibodat/namoz" },
};

export default async function AcademyPage() {
  const lessons = (await listContent("lesson")).sort((a, b) => a.body.order - b.body.order);
  const minutes = lessons.reduce((s, l) => s + l.body.minutes, 0);
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Namoz akademiyasi" title="Namozni noldan oʻrganing" subtitle={`Namoz haqida hech narsa bilmaydigan kishi uchun ${lessons.length} ta bosqichma-bosqich dars (taxminan ${minutes} daqiqa). Darslar Hanafiy mazhabining asosiy kitoblariga tayanadi; har bir hukm darajasi (farz, vojib, sunnat…) alohida belgilangan.`} />
      <div className="mb-6"><ReviewNotice status={lessons[0]?.status ?? "in_review"} kind="lesson" compact /></div>
      <LessonList lessons={lessons.map((l) => ({ slug: l.slug, title: l.title, summary: l.summary ?? "", order: l.body.order, minutes: l.body.minutes }))} />
    </div>
  );
}
