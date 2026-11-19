import Link from "next/link";
import { Plus } from "lucide-react";
import { adminList, requireStaffPage } from "@/server/admin/queries";
import { TYPE_LABEL } from "@/server/admin/fields";
import { STATUS_LABEL, StatusBadge, Badge, type ContentStatus } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/card";

export const metadata = { title: "Kontent" };

export default async function AdminContentList({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const me = await requireStaffPage("/admin/kontent");
  const sp = await searchParams;
  const f = { type: sp.type, status: sp.status, q: sp.q?.slice(0, 80), origin: sp.origin, page: Number(sp.page ?? 1) || 1 };
  const { rows, total, page, pages } = await adminList(me.id, f);
  const qs = (patch: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams(Object.entries({ ...f, ...patch }).filter(([, v]) => v !== undefined && v !== "" && v !== null).map(([k, v]) => [k, String(v)]));
    return `/admin/kontent?${p}`;
  };
  return (
    <div>
      <PageHeader title="Kontent" subtitle={`${total} ta yozuv`}>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_LABEL).map(([t, l]) => <Link key={t} href={`/admin/kontent/yangi?type=${t}`} className="inline-flex items-center gap-1 rounded-xl bg-sunken px-3 py-1.5 text-sm text-fg-2 hover:text-fg"><Plus size={14} /> {l}</Link>)}
        </div>
      </PageHeader>
      <form className="mb-5 flex flex-wrap gap-2" action="/admin/kontent">
        <input name="q" defaultValue={f.q} placeholder="Sarlavha yoki slug" className="h-10 min-w-[12rem] flex-1 rounded-xl border border-line bg-surface-solid px-3 text-sm" />
        <select name="type" defaultValue={f.type ?? ""} className="h-10 rounded-xl border border-line bg-surface-solid px-3 text-sm"><option value="">Barcha turlar</option>{Object.entries(TYPE_LABEL).map(([t, l]) => <option key={t} value={t}>{l}</option>)}</select>
        <select name="status" defaultValue={f.status ?? ""} className="h-10 rounded-xl border border-line bg-surface-solid px-3 text-sm"><option value="">Barcha holatlar</option>{(Object.keys(STATUS_LABEL) as ContentStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select>
        <select name="origin" defaultValue={f.origin ?? ""} className="h-10 rounded-xl border border-line bg-surface-solid px-3 text-sm"><option value="">Barcha manbalar</option><option value="ai_draft">AI qoralama</option><option value="editor">Muharrir</option><option value="import">Import</option></select>
        <button className="h-10 rounded-xl bg-primary px-4 text-sm font-medium text-on-primary">Filtrlash</button>
      </form>
      <div className="overflow-x-auto rounded-3xl border border-line bg-surface">
        <table className="w-full min-w-[44rem] text-sm">
          <thead className="bg-sunken text-left text-fg"><tr><th className="px-4 py-3">Sarlavha</th><th className="px-3 py-3">Tur</th><th className="px-3 py-3">Holat</th><th className="px-3 py-3">Kelib chiqishi</th><th className="px-3 py-3">Yangilangan</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="px-4 py-2.5"><Link href={`/admin/kontent/${r.id}`} className="font-medium text-fg hover:text-primary">{r.title}</Link><span className="block text-xs text-muted">{r.slug}</span></td>
                <td className="px-3 py-2.5 text-fg-2">{TYPE_LABEL[r.type]}</td>
                <td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
                <td className="px-3 py-2.5">{r.origin === "ai_draft" ? <Badge tone="info">AI qoralama</Badge> : <Badge>{r.origin === "editor" ? "Muharrir" : "Import"}</Badge>}</td>
                <td className="px-3 py-2.5 text-xs text-muted">{new Date(r.updatedAt).toLocaleDateString("uz-UZ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="p-8 text-center text-muted">Hech narsa topilmadi.</p>}
      </div>
      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-center gap-3 text-sm">
          {page > 1 && <Link href={qs({ page: page - 1 })} className="text-primary">‹ Oldingi</Link>}
          <span className="text-muted">{page} / {pages}</span>
          {page < pages && <Link href={qs({ page: page + 1 })} className="text-primary">Keyingi ›</Link>}
        </nav>
      )}
    </div>
  );
}
