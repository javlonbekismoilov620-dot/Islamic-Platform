import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { AlertTriangle, Info, Scale, ShieldAlert, Sparkles, Users } from "lucide-react";
import { getContent } from "@/server/content/repo";
import { getVerses } from "@/server/quran";
import { DuaCard, HadithCard, VerseEmbed } from "./cards";
import { DhikrInline } from "./dhikr-inline";
import { WuduSteps } from "./wudu-steps";
import { RULINGS, RulingBadge, type Ruling } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { parseMarkdown, slugId, type Block } from "./markdown-parse";
export { parseMarkdown, slugId };

/**
 * Xavfsiz Markdown renderer: HTML qabul qilmaydi, faqat React elementlarini yaratadi (XSS yoʻq).
 * Qoʻllab-quvvatlanadi: ##, ###, roʻyxatlar, jadval, iqtibos, :::callout, ::embed{}, **qalin**, *kursiv*, [havola](url), [[hukm]].
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*?\*|\[\[[a-z]+\]\]|\[[^\]]+\]\([^)\s]+\))/g;

function safeHref(url: string): string | null {
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try {
    const u = new URL(url);
    return u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export function Inline({ text }: { text: string }) {
  const parts = text.split(INLINE).filter((p) => p !== "");
  return (
    <>
      {parts.map((p, k) => {
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={k}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("[[") && p.endsWith("]]")) {
          const r = p.slice(2, -2) as Ruling;
          return r in RULINGS ? <RulingBadge key={k} ruling={r} className="mx-0.5 align-[1px]" /> : <Fragment key={k}>{p}</Fragment>;
        }
        if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={k}>{p.slice(1, -1)}</em>;
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(p);
        if (link) {
          const href = safeHref(link[2]);
          if (!href) return <Fragment key={k}>{link[1]}</Fragment>;
          return href.startsWith("/") ? (
            <Link key={k} href={href}>{link[1]}</Link>
          ) : (
            <a key={k} href={href} target="_blank" rel="noopener noreferrer">{link[1]}</a>
          );
        }
        return <Fragment key={k}>{p}</Fragment>;
      })}
    </>
  );
}

const CALLOUTS: Record<string, { title: string; cls: string; icon: ReactNode }> = {
  farz: { title: "Farz", cls: "border-danger/25 bg-danger-soft", icon: <ShieldAlert size={17} className="text-danger" /> },
  vojib: { title: "Vojib", cls: "border-warning/25 bg-warning-soft", icon: <ShieldAlert size={17} className="text-warning" /> },
  sunnat: { title: "Sunnat", cls: "border-primary/20 bg-primary-soft", icon: <Sparkles size={17} className="text-primary" /> },
  mustahab: { title: "Mustahab (odob)", cls: "border-info/20 bg-info-soft", icon: <Sparkles size={17} className="text-info" /> },
  makruh: { title: "Makruh", cls: "border-gold/25 bg-gold-soft", icon: <AlertTriangle size={17} className="text-gold" /> },
  harom: { title: "Harom / namozni buzadi", cls: "border-danger/25 bg-danger-soft", icon: <AlertTriangle size={17} className="text-danger" /> },
  muboh: { title: "Muboh", cls: "border-line bg-sunken", icon: <Info size={17} className="text-muted" /> },
  eslatma: { title: "Eslatma", cls: "border-info/20 bg-info-soft", icon: <Info size={17} className="text-info" /> },
  diqqat: { title: "Diqqat", cls: "border-warning/25 bg-warning-soft", icon: <AlertTriangle size={17} className="text-warning" /> },
  ixtilof: { title: "Ulamolar orasida fikr farqi", cls: "border-gold/25 bg-gold-soft", icon: <Scale size={17} className="text-gold" /> },
  ayollar: { title: "Ayollar uchun", cls: "border-primary/20 bg-primary-soft", icon: <Users size={17} className="text-primary" /> },
};

function collectEmbeds(blocks: Block[], out: { kind: string; ref: string }[] = []) {
  for (const b of blocks) {
    if (b.t === "embed") out.push({ kind: b.kind, ref: b.ref });
    if (b.t === "callout") collectEmbeds(b.blocks, out);
  }
  return out;
}

type EmbedMap = Map<string, ReactNode>;

async function resolveEmbeds(blocks: Block[]): Promise<EmbedMap> {
  const embeds = collectEmbeds(blocks);
  const map: EmbedMap = new Map();
  await Promise.all(
    embeds.map(async (e) => {
      const key = `${e.kind}:${e.ref}`;
      if (map.has(key)) return;
      if (e.kind === "quran") {
        const v = await getVerses(e.ref);
        map.set(key, v ? <VerseEmbed data={v} /> : <MissingEmbed what={`Qurʼon ${e.ref}`} />);
      } else if (e.kind === "dua") {
        const d = await getContent("dua", e.ref.replace(/[ʻʼ]/g, ""));
        map.set(key, d ? <div className="my-6"><DuaCard dua={d} compact /></div> : <MissingEmbed what={`duo «${e.ref}»`} />);
      } else if (e.kind === "hadith") {
        const h = await getContent("hadith", e.ref.replace(/[ʻʼ]/g, ""));
        map.set(key, h ? <div className="my-6"><HadithCard hadith={h} compact /></div> : <MissingEmbed what={`hadis «${e.ref}»`} />);
      } else if (e.kind === "steps") {
        map.set(key, e.ref === "wudu" ? <WuduSteps /> : <MissingEmbed what={`«${e.ref}» bosqichlari`} />);
      } else if (e.kind === "dhikr") {
        const z = await getContent("dhikr", e.ref);
        map.set(key, z ? <DhikrInline dhikr={z} /> : <MissingEmbed what={`zikr «${e.ref}»`} />);
      }
    }),
  );
  return map;
}

function MissingEmbed({ what }: { what: string }) {
  return <p className="my-4 rounded-xl bg-sunken px-4 py-3 text-sm text-muted">Bu yerda {what} boʻlishi kerak edi, lekin u hozircha mavjud emas yoki nashr qilinmagan.</p>;
}

function RenderBlocks({ blocks, embeds }: { blocks: Block[]; embeds: EmbedMap }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h2": return <h2 key={i} id={slugId(b.text)}><Inline text={b.text} /></h2>;
          case "h3": return <h3 key={i}><Inline text={b.text} /></h3>;
          case "p": return <p key={i}><Inline text={b.text} /></p>;
          case "quote": return <blockquote key={i}><Inline text={b.text} /></blockquote>;
          case "ul": return <ul key={i}>{b.items.map((it, k) => <li key={k}><Inline text={it} /></li>)}</ul>;
          case "ol": return <ol key={i}>{b.items.map((it, k) => <li key={k}><Inline text={it} /></li>)}</ol>;
          case "table":
            return (
              <div key={i} className="my-5 overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-[28rem] border-collapse text-left text-[0.92rem]">
                  <thead className="bg-sunken text-fg">
                    <tr>{b.rows[0]?.map((c, k) => <th key={k} className="px-4 py-2.5 font-semibold"><Inline text={c} /></th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.slice(1).map((r, k) => (
                      <tr key={k} className="border-t border-line">{r.map((c, j) => <td key={j} className="px-4 py-2.5 align-top"><Inline text={c} /></td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout": {
            const c = CALLOUTS[b.kind] ?? CALLOUTS.eslatma;
            return (
              <aside key={i} className={cn("my-5 rounded-2xl border px-5 py-4 [&_p]:my-1.5 [&_ol]:my-1.5 [&_ul]:my-1.5", c.cls)}>
                <p className="!mt-0 flex items-center gap-2 font-semibold text-fg">{c.icon}{c.title}</p>
                <RenderBlocks blocks={b.blocks} embeds={embeds} />
              </aside>
            );
          }
          case "embed": return <div key={i} className="not-prose">{embeds.get(`${b.kind}:${b.ref}`)}</div>;
        }
      })}
    </>
  );
}


export function headingsOf(src: string) {
  return parseMarkdown(src).filter((b): b is { t: "h2"; text: string } => b.t === "h2").map((b) => ({ id: slugId(b.text), text: b.text.replace(/\*\*/g, "") }));
}

export async function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = parseMarkdown(source);
  const embeds = await resolveEmbeds(blocks);
  return (
    <div className={cn("prose-uz", className)}>
      <RenderBlocks blocks={blocks} embeds={embeds} />
    </div>
  );
}
