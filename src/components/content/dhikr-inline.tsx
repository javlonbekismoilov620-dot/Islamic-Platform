import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Content } from "@/content/types";
import { Arabic } from "./arabic";
import { Translit } from "./text";

export function DhikrInline({ dhikr }: { dhikr: Content<"dhikr"> }) {
  const b = dhikr.body;
  return (
    <div className="card glass my-6 p-5">
      <p className="font-semibold text-fg">{dhikr.title}</p>
      {b.arabic && <Arabic text={b.arabic} className="mt-2" />}
      {b.translit && <Translit text={b.translit} />}
      {b.meaning && <p className="mt-2 text-fg-2">{b.meaning}</p>}
      <Link href={`/zikrlar/${dhikr.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Hisoblagichda zikr qilish <ChevronRight size={15} />
      </Link>
    </div>
  );
}
