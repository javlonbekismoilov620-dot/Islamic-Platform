import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, Target } from "lucide-react";
import { getContent, listContent } from "@/server/content/repo";
import { Markdown, headingsOf } from "@/components/content/markdown";
import { References, ReviewNotice } from "@/components/content/references";
import { CompleteLessonButton } from "@/components/learn/lesson-progress";
import { Quiz } from "@/components/learn/quiz";
import { StatusBadge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }): Promise<Metadata> {
  const l = await getContent("lesson", (await params).lesson);
  return l ? { title: `${l.body.order}-dars: ${l.title} — Namoz akademiyasi`, description: l.summary ?? undefined, alternates: { canonical: `/ibodat/namoz/${l.slug}` } } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: slug } = await params;
  const [lesson, all, quiz] = await Promise.all([getContent("lesson", slug), listContent("lesson"), getContent("quiz", `${slug}-test`)]);
  if (!lesson) notFound();
  const lessons = all.sort((a, b) => a.body.order - b.body.order);
  const i = lessons.findIndex((l) => l.slug === slug);
  const prev = lessons[i - 1], next = lessons[i + 1];
  const toc = headingsOf(lesson.body.markdown);
  const isFinal = slug === "bilimni-sinash";

  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_15rem]">
      <article className="min-w-0">
        <Link href="/ibodat/namoz" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft size={16} /> Barcha darslar</Link>
        <header className="animate-in mb-8">
          <p className="text-[0.8rem] font-semibold tracking-[0.08em] text-gold uppercase">{lesson.body.order}-dars</p>
          <h1 className="mt-2 text-[2rem] leading-tight font-bold tracking-[-0.03em] text-fg sm:text-[2.5rem]">{lesson.title}</h1>
          <p className="mt-3 text-[1.02rem] text-fg-2">{lesson.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="inline-flex items-center gap-1"><Clock size={15} /> {lesson.body.minutes} daqiqa</span>
            <StatusBadge status={lesson.status} />
          </div>
          <div className="card glass mt-6 p-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-fg"><Target size={16} className="text-primary" /> Bu darsda oʻrganasiz</p>
            <ul className="space-y-1 text-sm text-fg-2">{lesson.body.outcomes.map((o) => <li key={o}>• {o}</li>)}</ul>
          </div>
        </header>
        <ReviewNotice status={lesson.status} origin={lesson.origin} kind="lesson" />
        <Markdown source={lesson.body.markdown} className="mt-6" />

        {quiz && !isFinal && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold text-fg">Oʻzingizni tekshiring</h2>
            <Quiz quizKey={quiz.slug} title={quiz.title} questions={quiz.body.questions} />
          </section>
        )}
        {quiz && isFinal && (
          <section className="mt-8">
            <Quiz quizKey={quiz.slug} title={quiz.title} questions={quiz.body.questions} limit={15} />
          </section>
        )}

        <div className="mt-10 space-y-6">
          <CompleteLessonButton slug={lesson.slug} title={lesson.title} nextHref={next ? `/ibodat/namoz/${next.slug}` : null} />
          <References refs={lesson.refs} title="Darsning manbalari" />
          <nav className="flex gap-3" aria-label="Darslar boʻylab">
            {prev ? <Link href={`/ibodat/namoz/${prev.slug}`} className="card glass flex flex-1 items-center gap-2 p-4 text-sm"><ChevronLeft size={16} className="text-muted" /><span><span className="block text-xs text-muted">Oldingi</span>{prev.title}</span></Link> : <span className="flex-1" />}
            {next ? <Link href={`/ibodat/namoz/${next.slug}`} className="card glass flex flex-1 items-center justify-end gap-2 p-4 text-right text-sm"><span><span className="block text-xs text-muted">Keyingi</span>{next.title}</span><ChevronRight size={16} className="text-muted" /></Link> : <span className="flex-1" />}
          </nav>
        </div>
      </article>
      {toc.length > 2 && (
        <aside className="hidden lg:block">
          <nav aria-label="Dars mundarijasi" className="sticky top-28 space-y-1 text-sm">
            <p className="mb-2 font-semibold text-fg">Mundarija</p>
            {toc.map((h) => <a key={h.id} href={`#${h.id}`} className="block rounded-lg px-2 py-1 text-muted hover:bg-sunken hover:text-fg">{h.text}</a>)}
          </nav>
        </aside>
      )}
    </div>
  );
}
