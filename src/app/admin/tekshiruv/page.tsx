import Link from "next/link";
import { adminList, requireStaffPage } from "@/server/admin/queries";
import { TYPE_LABEL } from "@/server/admin/fields";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/controls";

export const metadata = { title: "Tekshiruv navbati" };

export default async function ReviewQueue({ searchParams }: { searchParams: Promise<{ type?: string; page?: string }> }) {
  const me = await requireStaffPage("/admin/tekshiruv");
  const sp = await searchParams;
  const { rows, total } = await adminList(me.id, { status: "in_review", type: sp.type, page: Number(sp.page ?? 1) || 1 });
  return (
    <div>
      <PageHeader title="Tekshiruv navbati" subtitle={`${total} ta yozuv ulamo tekshiruvini kutmoqda (eng eskisi birinchi). Har birini ochib, arabcha matn, tarjima, transliteratsiya va manbalarni solishtiring.`}>
        <div className="flex flex-wrap gap-1.5">
          <Link href="/admin/tekshiruv" className="rounded-full bg-sunken px-3 py-1 text-sm">Barchasi</Link>
          {Object.entries(TYPE_LABEL).map(([t, l]) => <Link key={t} href={`/admin/tekshiruv?type=${t}`} className="rounded-full bg-sunken px-3 py-1 text-sm">{l}</Link>)}
        </div>
      </PageHeader>
      {rows.length === 0 ? <EmptyState title="Navbat boʻsh" text="Tekshiruvni kutayotgan kontent yoʻq." /> : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/kontent/${r.id}`} className="card glass flex items-center justify-between gap-3 p-4 hover:shadow-card">
                <span><span className="block font-medium text-fg">{r.title}</span><span className="text-xs text-muted">{TYPE_LABEL[r.type]} · yuborilgan {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("uz-UZ") : "—"}</span></span>
                {r.origin === "ai_draft" && <Badge tone="info">AI qoralama</Badge>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
