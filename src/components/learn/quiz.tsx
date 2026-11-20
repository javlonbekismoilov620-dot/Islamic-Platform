"use client";
import { useMemo, useState } from "react";
import { Check, RotateCcw, Trophy, X } from "lucide-react";
import type { QuizQuestion } from "@/content/types";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function shuffle<T>(arr: T[], seed: number) {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Quiz({ quizKey, title, questions, limit }: { quizKey: string; title: string; questions: QuizQuestion[]; limit?: number }) {
  const [seed, setSeed] = useState(1);
  const qs = useMemo(() => (limit ? shuffle(questions, seed).slice(0, limit) : questions), [questions, limit, seed]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [learning, setLearning] = useStore("learning");
  const q = qs[idx];

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
    else setWrong((w) => [...w, idx]);
  };
  const next = () => {
    if (idx + 1 >= qs.length) {
      setDone(true);
      const final = score;
      setLearning((l) => {
        const prev = l.quiz[quizKey];
        return prev && prev.best >= final ? l : { ...l, quiz: { ...l.quiz, [quizKey]: { best: final, total: qs.length, at: Date.now() } } };
      });
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  };
  const restart = () => { setSeed((s) => s + 1); setIdx(0); setPicked(null); setScore(0); setWrong([]); setDone(false); };

  if (done) {
    const best = learning.quiz[quizKey]?.best ?? score;
    return (
      <section className="card glass p-6 text-center sm:p-8" aria-live="polite">
        <Trophy size={34} className="mx-auto text-gold" />
        <p className="mt-3 text-xl font-semibold text-fg">Natija: {score} / {qs.length}</p>
        <p className="mt-1 text-sm text-muted">Eng yaxshi natijangiz: {best} / {qs.length}</p>
        {wrong.length > 0 && (
          <div className="mx-auto mt-5 max-w-lg space-y-2 text-left">
            <p className="text-sm font-medium text-fg">Takrorlash uchun:</p>
            {wrong.map((w) => (
              <div key={w} className="rounded-2xl bg-sunken px-4 py-3 text-sm">
                <p className="font-medium text-fg">{qs[w].q}</p>
                <p className="mt-1 text-fg-2">Toʻgʻri javob: <span className="text-primary">{qs[w].options[qs[w].answer]}</span></p>
                <p className="mt-1 text-muted">{qs[w].explain}</p>
              </div>
            ))}
          </div>
        )}
        <Button className="mt-6" onClick={restart}><RotateCcw size={16} /> Qayta topshirish</Button>
      </section>
    );
  }

  return (
    <section className="card glass p-5 sm:p-7" aria-label={title}>
      <div className="mb-4 flex items-center justify-between text-sm">
        <p className="font-medium text-fg">{title}</p>
        <p className="text-muted tabular-nums">{idx + 1} / {qs.length}</p>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(idx / qs.length) * 100}%` }} /></div>
      <p className="text-[1.08rem] font-semibold text-fg">{q.q}</p>
      <ul className="mt-4 space-y-2" role="list">
        {q.options.map((o, i) => {
          const isRight = picked !== null && i === q.answer;
          const isWrong = picked === i && i !== q.answer;
          return (
            <li key={i}>
              <button type="button" onClick={() => answer(i)} disabled={picked !== null} className={cn("flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-[0.95rem] transition-colors", isRight ? "border-success bg-success-soft text-fg" : isWrong ? "border-danger bg-danger-soft text-fg" : "border-line hover:bg-sunken", picked !== null && !isRight && !isWrong && "opacity-60")}>
                {o}
                {isRight && <Check size={18} className="text-success" />}
                {isWrong && <X size={18} className="text-danger" />}
              </button>
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <div className="mt-4 rounded-2xl bg-sunken px-4 py-3 text-sm text-fg-2" aria-live="polite">
          <span className="font-medium text-fg">{picked === q.answer ? "Toʻgʻri! " : "Notoʻgʻri. "}</span>{q.explain}
        </div>
      )}
      <div className="mt-5 flex justify-end">
        <Button onClick={next} disabled={picked === null}>{idx + 1 >= qs.length ? "Natijani koʻrish" : "Keyingi savol"}</Button>
      </div>
    </section>
  );
}
