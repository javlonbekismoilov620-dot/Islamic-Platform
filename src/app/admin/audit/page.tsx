import { notFound } from "next/navigation";
import { adminAudit, requireStaffPage } from "@/server/admin/queries";
import { PageHeader } from "@/components/ui/card";

export const metadata = { title: "Audit jurnali" };

export default async function AuditAdmin() {
  const me = await requireStaffPage("/admin/audit");
  if (me.role !== "admin") notFound();
  const rows = await adminAudit(me.id);
  return (
    <div>
      <PageHeader title="Audit jurnali" subtitle="Foydalanuvchi, manba, toifa va kontentni oʻchirish bilan bogʻliq harakatlar. Kontent tahriri tarixi har bir yozuv sahifasida." />
      <ul className="divide-y divide-line rounded-3xl border border-line bg-surface text-sm">
        {rows.map((r) => <li key={r.id} className="px-5 py-3"><span className="font-medium text-fg">{r.action}</span> <span className="text-muted">{r.targetType}:{r.targetId}</span><span className="block text-xs text-muted">{r.actor ?? "—"} · {new Date(r.createdAt).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })} {Object.keys(r.meta as object).length ? JSON.stringify(r.meta) : ""}</span></li>)}
        {!rows.length && <li className="p-6 text-center text-muted">Hali yozuvlar yoʻq.</li>}
      </ul>
    </div>
  );
}
