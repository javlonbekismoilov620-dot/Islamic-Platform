"use client";
import Link from "next/link";
import { Check, CircleCheck, Clock, Lock } from "lucide-react";
import { useHydrated, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

export type LessonLite = { slug: string; title: string; summary: string; order: number; minutes: number };

export function LessonList({ lessons }: { lessons: LessonLite[] }) {
  const [learning] = useStore("learning");
  const hydrated = useHydrated();
  const done = hydrated ? learning.completed : [];
  const nextIdx = lessons.findIndex((l) => !done.includes(l.slug));
  return (
    <ol className="relative space-y-3 before:absolute before:top-6 before:bottom-6 before:left-[1.65rem] before:w-px before:bg-line">
      {lessons.map((l, i) => {
        const isDone = done.includes(l.slug);
        const isNext = i === nextIdx;
        const quiz = hydrated ? learning.quiz[`${l.slug}-test`] : undefined;
        return (
          <li key={l.slug} className="relative">
            <Link href={`/ibodat/namoz/${l.slug}`} className={cn("card glass group flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-card sm:p-5", isNext && "ring-2 ring-primary/30")}>
              <span className={cn("relative z-10 flex h-[2.3rem] w-[2.3rem] shrink-0 items-center justify-center rounded-full text-sm font-semibold", isDone ? "bg-primary text-on-primary" : isNext ? "bg-primary-soft text-primary ring-2 ring-primary" : "bg-surface-solid text-muted ring-1 ring-line")}>
                {isDone ? <Check size={17} strokeWidth={3} /> : l.order}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-fg">{l.title}</span>
                <span className="mt-0.5 block text-sm text-muted">{l.summary}</span>
                <span className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted">
                  <span className="inline-flex items-center gap-1"><Clock size={12} /> {l.minutes} daqiqa</span>
                  {quiz && <span className="inline-flex items-center gap-1 text-primary"><CircleCheck size={12} /> Test: {quiz.best}/{quiz.total}</span>}
                  {isNext && <span className="font-medium text-primary">Navbatdagi dars</span>}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function CompleteLessonButton({ slug, title, nextHref }: { slug: string; title: string; nextHref: string | null }) {
  const [learning, setLearning] = useStore("learning");
  const [, setHistory] = useStore("history");
  const hydrated = useHydrated();
  const done = hydrated && learning.completed.includes(slug);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant={done ? "soft" : "primary"}
        onClick={() => {
          setLearning((l) => ({ ...l, completed: done ? l.completed.filter((x) => x !== slug) : [...l.completed, slug] }));
          if (!done) {
            setHistory((h) => [{ kind: "lesson" as const, ref: slug, title, at: Date.now() }, ...h.filter((x) => x.ref !== slug)].slice(0, 100));
            toast("Dars tugallandi. Barakalloh!");
          }
        }}
      >
        {done ? <><CircleCheck size={17} /> Tugallangan</> : <><Check size={17} /> Darsni tugalladim</>}
      </Button>
      {nextHref && <Link href={nextHref} className="text-sm font-medium text-primary hover:underline">Keyingi darsga oʻtish →</Link>}
    </div>
  );
}

export function LockedNote() {
  return <p className="flex items-center gap-2 text-sm text-muted"><Lock size={14} /> Darslarni istalgan tartibda oʻqish mumkin, ammo ketma-ketlikda oʻrganish tavsiya etiladi.</p>;
}
