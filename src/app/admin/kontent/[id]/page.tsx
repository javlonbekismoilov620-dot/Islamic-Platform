import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Eye, ShieldAlert, ShieldCheck } from "lucide-react";
import { adminCategories, adminGet, requireStaffPage } from "@/server/admin/queries";
import { FIELDS, STATUS_TRANSITIONS, TYPE_LABEL } from "@/server/admin/fields";
import { ContentEditor, DeleteContent, TransitionPanel } from "@/components/admin/editor";
import { Badge, StatusBadge } from "@/components/ui/badge";
import type { Check } from "@/content/types";

export const metadata = { title: "Kontentni tahrirlash" };
const CAT_TYPE: Record<string, string> = { dua: "dua", hadith: "hadith", article: "article", glossary: "glossary", dhikr: "dhikr" };
const ACTION: Record<string, string> = { create: "Yaratildi", edit: "Tahrirlandi", submit: "Tekshiruvga yuborildi", approve: "Tasdiqlandi", request_changes: "Tuzatish soʻraldi", reject: "Rad etildi", archive: "Arxivlandi", restore: "Tiklandi" };

export default async function EditContent({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ yangi?: string }> }) {
  const { id } = await params;
  const me = await requireStaffPage(`/admin/kontent/${id}`);
  const data = await adminGet(me.id, id);
  if (!data) notFound();
  const { row, events, revisions, editorEmail, reviewerEmail } = data;
  const cats = (await adminCategories(me.id)).filter((c) => c.type === CAT_TYPE[row.type]);
  const transitions = (STATUS_TRANSITIONS[row.status] ?? []).filter((t) => t.roles.includes(me.role));
  const body = row.body as Record<string, unknown>;
  const checks = (body.checks as Check[] | undefined) ?? [];
  const isNew = (await searchParams).yangi;
  return (
    <div className="space-y-6">
      <Link href="/admin/kontent" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg"><ChevronLeft size={16} /> Kontent roʻyxati</Link>
      {isNew && <p className="rounded-2xl bg-success-soft px-4 py-3 text-sm text-success">Qoralama yaratildi. Tayyor boʻlgach, tekshiruvga yuboring.</p>}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{TYPE_LABEL[row.type]} · v{row.version} · {row.slug}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-[-0.02em] text-fg">{row.title}</h1>
          <div className="mt-2 flex flex-wrap gap-1.5"><StatusBadge status={row.status} />{row.origin === "ai_draft" && <Badge tone="info">AI qoralama</Badge>}</div>
        </div>
        <Link href={`/admin/kontent/${row.id}/korish`} className="inline-flex items-center gap-1.5 rounded-xl bg-sunken px-3.5 py-2 text-sm font-medium text-fg-2 hover:text-fg"><Eye size={16} /> Oldindan koʻrish</Link>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <section className="card glass p-5 sm:p-6"><ContentEditor type={row.type} fields={FIELDS[row.type] ?? []} item={{ id: row.id, title: row.title, slug: row.slug, category: row.category, summary: row.summary, sort: row.sort, refs: row.refs, body }} categories={cats.map((c) => ({ slug: c.slug, title: c.title }))} /></section>
        <aside className="space-y-4">
          <section className="card glass p-5">
            <h2 className="mb-3 font-semibold text-fg">Tekshiruv</h2>
            {row.reviewNote && <p className="mb-3 rounded-xl bg-sunken px-3 py-2 text-sm text-fg-2">Oxirgi izoh: «{row.reviewNote}»</p>}
            <dl className="mb-4 space-y-1 text-xs text-muted">
              <div>Oxirgi tahrir: {editorEmail ?? (row.origin === "ai_draft" ? "AI qoralama (seed)" : "—")}</div>
              <div>Tasdiqlagan: {reviewerEmail ?? "—"}{row.reviewedAt ? `, ${new Date(row.reviewedAt).toLocaleDateString("uz-UZ")}` : ""}</div>
            </dl>
            <TransitionPanel id={row.id} transitions={transitions} />
          </section>
          {(row.type === "dua" || row.type === "dhikr" || row.type === "hadith") && (
            <section className="card glass p-5 text-sm">
              <h2 className="mb-2 font-semibold text-fg">Arabcha matn tekshiruvi</h2>
              {row.type === "hadith" ? <p className="flex gap-2 text-success"><ShieldCheck size={16} /> Matn {String((body.dataset as { name?: string })?.name)} toʻplamidan aynan olingan.</p>
                : body.arabicVerified ? <p className="flex gap-2 text-success"><ShieldCheck size={16} /> Manba bilan avtomatik solishtirilgan.</p>
                : <p className="flex gap-2 text-warning"><ShieldAlert size={16} /> Avtomatik solishtirilmagan — qoʻlda tekshiring.</p>}
              {checks.length > 0 && <ul className="mt-2 space-y-1 text-xs text-muted">{checks.map((c, i) => <li key={i}>{c.ok ? "✓" : "✗"} {c.collection} {c.number} ({c.method === "extracted" ? "matndan kesilgan" : "matnda mavjud"})</li>)}</ul>}
            </section>
          )}
          <section className="card glass p-5">
            <h2 className="mb-3 font-semibold text-fg">Tarix</h2>
            <ol className="space-y-2 text-xs">
              {events.map((e) => <li key={e.id} className="text-fg-2"><span className="font-medium text-fg">{ACTION[e.action] ?? e.action}</span> — {e.actor ?? "tizim"}<span className="block text-muted">{new Date(e.createdAt).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}{e.note ? ` · «${e.note}»` : ""}</span></li>)}
              {!events.length && <li className="text-muted">Hali harakat yoʻq (seed kontent).</li>}
            </ol>
            {revisions.length > 0 && (
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer text-primary">Oldingi versiyalar ({revisions.length})</summary>
                <ul className="mt-2 space-y-2">{revisions.map((r) => <li key={r.id}><details><summary className="cursor-pointer text-fg-2">v{r.version} — {new Date(r.createdAt).toLocaleString("uz-UZ")}</summary><pre className="mt-1 max-h-60 overflow-auto rounded-lg bg-sunken p-2 text-[0.7rem] whitespace-pre-wrap">{JSON.stringify(r.snapshot, null, 2).slice(0, 4000)}</pre></details></li>)}</ul>
              </details>
            )}
          </section>
          {me.role === "admin" && <section className="card glass p-5"><DeleteContent id={row.id} /></section>}
        </aside>
      </div>
    </div>
  );
}
