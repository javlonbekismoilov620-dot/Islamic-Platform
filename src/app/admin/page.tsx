import Link from "next/link";
import { adminStats, requireStaffPage } from "@/server/admin/queries";
import { TYPE_LABEL } from "@/server/admin/fields";
import { STATUS_LABEL, type ContentStatus } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/card";

const ACTION: Record<string, string> = { create: "yaratdi", edit: "tahrirladi", submit: "tekshiruvga yubordi", approve: "tasdiqladi", request_changes: "tuzatish soʻradi", reject: "rad etdi", archive: "arxivladi", restore: "tikladi" };

export default async function AdminHome() {
  const me = await requireStaffPage();
  const { byStatus, recent } = await adminStats(me.id);
  const types = [...new Set(byStatus.map((r) => r.type))];
  const statuses: ContentStatus[] = ["draft", "in_review", "changes_requested", "published", "rejected", "archived"];
  const total = (s: string) => byStatus.filter((r) => r.status === s).reduce((a, b) => a + b.n, 0);
  return (
    <div>
      <PageHeader title="Boshqaruv paneli" subtitle="Diniy kontent ommaga koʻrinishidan oldin ulamo-tekshiruvchi tomonidan tasdiqlanishi kerak. Oʻz tahriringizni oʻzingiz tasdiqlay olmaysiz." />
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        <Link href="/admin/tekshiruv" className="hero p-5"><p className="text-sm opacity-80">Tekshiruv kutmoqda</p><p className="mt-1 text-3xl font-semibold tabular-nums">{total("in_review")}</p></Link>
        <div className="card glass p-5"><p className="text-sm text-muted">Tasdiqlangan</p><p className="mt-1 text-3xl font-semibold text-fg tabular-nums">{total("published")}</p></div>
        <div className="card glass p-5"><p className="text-sm text-muted">Tuzatish soʻralgan</p><p className="mt-1 text-3xl font-semibold text-fg tabular-nums">{total("changes_requested")}</p></div>
      </div>
      <section className="card glass mb-8 overflow-x-auto p-0">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-sunken text-left text-fg"><tr><th className="px-4 py-3">Tur</th>{statuses.map((s) => <th key={s} className="px-3 py-3 text-center">{STATUS_LABEL[s]}</th>)}</tr></thead>
          <tbody>
            {types.map((t) => (
              <tr key={t} className="border-t border-line">
                <td className="px-4 py-2.5 font-medium text-fg">{TYPE_LABEL[t] ?? t}</td>
                {statuses.map((s) => {
                  const n = byStatus.find((r) => r.type === t && r.status === s)?.n ?? 0;
                  return <td key={s} className="px-3 py-2.5 text-center tabular-nums">{n ? <Link href={`/admin/kontent?type=${t}&status=${s}`} className="text-primary hover:underline">{n}</Link> : <span className="text-muted">0</span>}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-fg">Soʻnggi harakatlar</h2>
        {recent.length === 0 ? <p className="text-sm text-muted">Hali harakatlar yoʻq.</p> : (
          <ul className="divide-y divide-line rounded-3xl border border-line bg-surface">
            {recent.map((r) => (
              <li key={r.id} className="px-5 py-3 text-sm">
                <span className="text-fg-2">{r.actor ?? "Tizim"} </span>
                <span className="text-muted">{ACTION[r.action] ?? r.action}: </span>
                <Link href={`/admin/kontent/${r.contentId}`} className="font-medium text-primary hover:underline">{r.title}</Link>
                {r.note && <span className="block text-xs text-muted">«{r.note}»</span>}
                <span className="block text-xs text-muted">{new Date(r.createdAt).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
