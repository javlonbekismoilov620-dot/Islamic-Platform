"use client";
import { useActionState } from "react";
import { saveSourceAction, deleteSourceAction, saveCategoryAction, deleteCategoryAction, setUserAction, type AdminState } from "@/server/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const input = "h-10 w-full rounded-xl border border-line bg-surface-solid px-3 text-sm text-fg";
function Msg({ s }: { s: AdminState }) {
  if (!s?.error && !s?.ok) return null;
  return <p role="alert" className={cn("rounded-xl px-3 py-2 text-xs", s.error ? "bg-danger-soft text-danger" : "bg-success-soft text-success")}>{s.error ?? s.ok}</p>;
}

type Src = { id?: string; key: string; title: string; author: string | null; kind: string; publisher: string | null; url: string | null; notes: string | null };
export function SourceForm({ src, canDelete }: { src?: Src; canDelete?: boolean }) {
  const [s, a, p] = useActionState(saveSourceAction, undefined);
  const [ds, da] = useActionState(deleteSourceAction, undefined);
  return (
    <div className="space-y-2">
      <form action={a} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {src?.id && <input type="hidden" name="id" value={src.id} />}
        <input name="key" defaultValue={src?.key} placeholder="Kalit (masalan, nur-al-iyzoh)" required className={input} aria-label="Kalit" />
        <select name="kind" defaultValue={src?.kind ?? "book"} className={input} aria-label="Turi">{["quran", "translation", "hadith", "book", "website", "dataset", "institution"].map((k) => <option key={k} value={k}>{k}</option>)}</select>
        <input name="title" defaultValue={src?.title} placeholder="Nomi" required className={cn(input, "sm:col-span-2")} aria-label="Nomi" />
        <input name="author" defaultValue={src?.author ?? ""} placeholder="Muallif / muassasa" className={input} aria-label="Muallif" />
        <input name="publisher" defaultValue={src?.publisher ?? ""} placeholder="Nashriyot" className={input} aria-label="Nashriyot" />
        <input name="url" defaultValue={src?.url ?? ""} placeholder="https://… (faqat tekshirilgan)" className={cn(input, "sm:col-span-2")} aria-label="URL" />
        <textarea name="notes" defaultValue={src?.notes ?? ""} placeholder="Izoh: nashr, versiya, litsenziya" rows={2} className={cn(input, "h-auto py-2 sm:col-span-2")} aria-label="Izoh" />
        <div className="flex items-center gap-2 sm:col-span-2"><Button type="submit" size="sm" disabled={p}>{src?.id ? "Saqlash" : "Qoʻshish"}</Button><Msg s={s} /></div>
      </form>
      {src?.id && canDelete && <form action={da}><input type="hidden" name="id" value={src.id} /><Button type="submit" variant="ghost" size="sm">Oʻchirish</Button><Msg s={ds} /></form>}
    </div>
  );
}

type Cat = { id?: string; type: string; slug: string; title: string; description: string | null; icon: string | null; sort: number };
export function CategoryForm({ cat }: { cat?: Cat }) {
  const [s, a, p] = useActionState(saveCategoryAction, undefined);
  const [ds, da] = useActionState(deleteCategoryAction, undefined);
  return (
    <div className="space-y-2">
      <form action={a} className="grid grid-cols-1 gap-2 sm:grid-cols-[8rem_1fr_1fr_6rem_5rem]">
        {cat?.id && <input type="hidden" name="id" value={cat.id} />}
        <select name="type" defaultValue={cat?.type ?? "dua"} className={input} aria-label="Turi">{["dua", "dhikr", "hadith", "article", "glossary"].map((k) => <option key={k} value={k}>{k}</option>)}</select>
        <input name="slug" defaultValue={cat?.slug} placeholder="slug" required className={input} aria-label="Slug" />
        <input name="title" defaultValue={cat?.title} placeholder="Nomi" required className={input} aria-label="Nomi" />
        <input name="icon" defaultValue={cat?.icon ?? ""} placeholder="belgi" className={input} aria-label="Belgi" />
        <input name="sort" type="number" defaultValue={cat?.sort ?? 0} className={input} aria-label="Tartib" />
        <input name="description" defaultValue={cat?.description ?? ""} placeholder="Tavsif" className={cn(input, "sm:col-span-5")} aria-label="Tavsif" />
        <div className="flex items-center gap-2 sm:col-span-5"><Button type="submit" size="sm" disabled={p}>{cat?.id ? "Saqlash" : "Qoʻshish"}</Button><Msg s={s} /></div>
      </form>
      {cat?.id && <form action={da}><input type="hidden" name="id" value={cat.id} /><Button type="submit" variant="ghost" size="sm">Oʻchirish</Button><Msg s={ds} /></form>}
    </div>
  );
}

export function UserRow({ u, self }: { u: { id: string; email: string; role: string; status: string }; self: boolean }) {
  const [s, a, p] = useActionState(setUserAction, undefined);
  return (
    <form action={a} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={u.id} />
      <select name="role" defaultValue={u.role} disabled={self} className={cn(input, "w-36")} aria-label="Rol">
        <option value="user">Foydalanuvchi</option><option value="editor">Muharrir</option><option value="reviewer">Tekshiruvchi</option><option value="admin">Administrator</option>
      </select>
      <select name="status" defaultValue={u.status} disabled={self} className={cn(input, "w-32")} aria-label="Holat"><option value="active">Faol</option><option value="disabled">Bloklangan</option></select>
      {!self && <Button type="submit" size="sm" variant="soft" disabled={p}>Saqlash</Button>}
      <Msg s={s} />
    </form>
  );
}
