"use client";
import { useActionState, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { Field } from "@/server/admin/fields";
import { saveContentAction, transitionAction, deleteContentAction, type AdminState } from "@/server/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Ref = { title: string; author?: string; locator?: string; url?: string; kind?: string };
const input = "w-full rounded-xl border border-line bg-surface-solid px-3 py-2.5 text-[0.95rem] text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function Msg({ s }: { s: AdminState }) {
  if (!s?.error && !s?.ok) return null;
  return <p role="alert" className={cn("rounded-xl px-4 py-3 text-sm", s.error ? "bg-danger-soft text-danger" : "bg-success-soft text-success")}>{s.error ?? s.ok}</p>;
}

function fieldValue(f: Field, v: unknown): string {
  if (v === undefined || v === null) return "";
  if (f.kind === "lines") return Array.isArray(v) ? v.join("\n") : String(v);
  if (f.kind === "json") return JSON.stringify(v, null, 2);
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

export function ContentEditor({ type, fields, item, categories }: {
  type: string;
  fields: Field[];
  item: { id?: string; title: string; slug: string; category: string | null; summary: string | null; sort: number; refs: Ref[]; body: Record<string, unknown> } | null;
  categories: { slug: string; title: string }[];
}) {
  const [state, action, pending] = useActionState(saveContentAction, undefined);
  const [refs, setRefs] = useState<Ref[]>(item?.refs ?? []);
  const body = item?.body ?? {};
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="type" value={type} />
      {item?.id && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="refs" value={JSON.stringify(refs)} />
      <Msg s={state} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-medium text-fg">Sarlavha *</span><input name="title" required defaultValue={item?.title} maxLength={200} className={input} /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium text-fg">Slug (URL)</span><input name="slug" defaultValue={item?.slug} placeholder="avtomatik" pattern="[a-z0-9\-]*" className={input} /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium text-fg">Toifa / mavzu</span>
          {categories.length ? (
            <select name="category" defaultValue={item?.category ?? ""} className={input}><option value="">—</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}</select>
          ) : <input name="category" defaultValue={item?.category ?? ""} className={input} />}
        </label>
        <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-medium text-fg">Qisqa tavsif</span><textarea name="summary" defaultValue={item?.summary ?? ""} rows={2} maxLength={500} className={input} /></label>
        <label className="block"><span className="mb-1 block text-sm font-medium text-fg">Tartib</span><input name="sort" type="number" defaultValue={item?.sort ?? 0} className={input} /></label>
      </div>

      <fieldset className="space-y-4 rounded-3xl border border-line p-5">
        <legend className="px-2 text-sm font-semibold text-fg">Mazmun</legend>
        {type === "dua" && (
          <label className="block"><span className="mb-1 block text-sm font-medium text-fg">Toifalar (vergul bilan) *</span><input name="body.categories" defaultValue={Array.isArray(body.categories) ? (body.categories as string[]).join(", ") : ""} className={input} /></label>
        )}
        {fields.map((f) => {
          const v = fieldValue(f, body[f.name]);
          const label = <span className="mb-1 block text-sm font-medium text-fg">{f.label}{f.required ? " *" : ""}</span>;
          const help = f.help && <span className="mt-1 block text-xs text-muted">{f.help}</span>;
          if (f.kind === "readonly") return <div key={f.name}>{label}<p lang="ar" dir="rtl" className="ar-text rounded-xl bg-sunken px-4 py-3 text-[1.3rem]">{v}</p>{help}</div>;
          if (f.kind === "checkbox") return <label key={f.name} className="flex items-center gap-3 text-sm text-fg"><input type="checkbox" name={`body.${f.name}`} defaultChecked={body[f.name] === true} className="h-4 w-4 accent-[var(--primary)]" />{f.label}</label>;
          if (f.kind === "select") return <label key={f.name} className="block">{label}<select name={`body.${f.name}`} defaultValue={v} className={input}>{f.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>{help}</label>;
          if (f.kind === "arabic") return <label key={f.name} className="block">{label}<textarea name={`body.${f.name}`} defaultValue={v} dir="rtl" lang="ar" rows={4} className={cn(input, "ar-text !text-[1.35rem]")} />{help}</label>;
          if (["textarea", "lines"].includes(f.kind)) return <label key={f.name} className="block">{label}<textarea name={`body.${f.name}`} defaultValue={v} rows={f.kind === "lines" ? 4 : 3} className={input} />{help}</label>;
          if (f.kind === "markdown" || f.kind === "json") return <label key={f.name} className="block">{label}<textarea name={`body.${f.name}`} defaultValue={v} rows={f.kind === "markdown" ? 22 : 12} spellCheck={f.kind === "markdown"} className={cn(input, "font-mono text-[0.85rem] leading-relaxed")} />{help}{f.kind === "markdown" && <span className="mt-1 block text-xs text-muted">Belgilar: ## sarlavha, - roʻyxat, **qalin**, [havola](/yol), [[farz]], :::farz … :::, ::dua{"{slug}"}, ::hadith{"{slug}"}, ::quran{"{2:255}"}</span>}</label>;
          return <label key={f.name} className="block">{label}<input name={`body.${f.name}`} type={f.kind === "number" ? "number" : f.kind === "url" ? "url" : "text"} defaultValue={v} className={input} />{help}</label>;
        })}
      </fieldset>

      <fieldset className="space-y-3 rounded-3xl border border-line p-5">
        <legend className="px-2 text-sm font-semibold text-fg">Manbalar</legend>
        <p className="text-xs text-muted">Faqat tekshirilgan manbalarni kiriting. Sahifa raqami yoki URL bilmasangiz, uni yozmang.</p>
        {refs.map((r, i) => (
          <div key={i} className="grid gap-2 rounded-2xl bg-sunken p-3 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
            {(["title", "author", "locator", "url"] as const).map((k) => (
              <input key={k} aria-label={k} placeholder={{ title: "Manba nomi *", author: "Muallif / muassasa", locator: "Bob, raqam", url: "https://…" }[k]} value={r[k] ?? ""} onChange={(e) => setRefs((rs) => rs.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))} className={cn(input, "py-2 text-sm")} />
            ))}
            <button type="button" aria-label="Manbani olib tashlash" onClick={() => setRefs((rs) => rs.filter((_, j) => j !== i))} className="rounded-xl p-2 text-muted hover:text-danger"><Trash2 size={16} /></button>
          </div>
        ))}
        <Button type="button" variant="soft" size="sm" onClick={() => setRefs((rs) => [...rs, { title: "" }])}><Plus size={15} /> Manba qoʻshish</Button>
      </fieldset>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>{pending && <Loader2 size={16} className="animate-spin" />} Saqlash</Button>
        <span className="text-xs text-muted">Tasdiqlangan kontent tahrirlansa, u avtomatik ravishda qayta tekshiruvga tushadi.</span>
      </div>
    </form>
  );
}

export function TransitionPanel({ id, transitions }: { id: string; transitions: { action: string; label: string; tone: "primary" | "danger" | "soft" | "ghost" }[] }) {
  const [state, action, pending] = useActionState(transitionAction, undefined);
  const [chosen, setChosen] = useState<string | null>(null);
  if (!transitions.length) return <p className="text-sm text-muted">Bu holatda siz uchun mavjud amal yoʻq.</p>;
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <Msg s={state} />
      <textarea name="note" rows={3} placeholder="Izoh (rad etish va tuzatish soʻrashda majburiy)" className={input} />
      {transitions.some((t) => t.action === "approve") && (
        <label className="flex items-start gap-2.5 rounded-2xl bg-warning-soft px-3 py-2.5 text-sm text-fg">
          <input type="checkbox" name="confirm" className="mt-0.5 h-4 w-4 accent-[var(--primary)]" />
          <span>Arabcha matnni asl manba bilan, tarjima va transliteratsiyani, hukm darajalari va manbalarni shaxsan tekshirdim. Bu kontent Hanafiy mazhabi va Ahli sunna aqidasiga mos.</span>
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {transitions.map((t) => (
          <Button key={t.action} type="submit" name="action" value={t.action} variant={t.tone === "primary" ? "primary" : t.tone === "danger" ? "danger" : t.tone === "soft" ? "soft" : "ghost"} size="sm" disabled={pending} onClick={() => setChosen(t.action)}>
            {pending && chosen === t.action && <Loader2 size={14} className="animate-spin" />} {t.label}
          </Button>
        ))}
      </div>
    </form>
  );
}

export function DeleteContent({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteContentAction, undefined);
  return (
    <form action={action} onSubmit={(e) => { if (!confirm("Kontent butunlay oʻchirilsinmi? Bu amalni qaytarib boʻlmaydi.")) e.preventDefault(); }} className="space-y-2">
      <input type="hidden" name="id" value={id} />
      <Msg s={state} />
      <Button type="submit" variant="danger" size="sm" disabled={pending}><Trash2 size={14} /> Butunlay oʻchirish</Button>
    </form>
  );
}
