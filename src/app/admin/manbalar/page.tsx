import { adminSources, requireStaffPage } from "@/server/admin/queries";
import { SourceForm } from "@/components/admin/small-forms";
import { PageHeader } from "@/components/ui/card";

export const metadata = { title: "Manbalar" };

export default async function SourcesAdmin() {
  const me = await requireStaffPage("/admin/manbalar");
  const list = await adminSources(me.id);
  return (
    <div>
      <PageHeader title="Manbalar katalogi" subtitle="Saytda foydalanilgan kitob, toʻplam, tarjima va muassasalar. URL faqat haqiqiy, tekshirilgan sahifa uchun kiritiladi." />
      <section className="card glass mb-6 p-5"><h2 className="mb-3 font-semibold text-fg">Yangi manba</h2><SourceForm /></section>
      <ul className="space-y-3">
        {list.map((s) => (
          <li key={s.id} className="card glass p-5">
            <details>
              <summary className="cursor-pointer"><span className="font-medium text-fg">{s.title}</span> <span className="text-sm text-muted">— {s.author} · {s.kind}</span></summary>
              <div className="mt-4"><SourceForm src={s} canDelete={me.role === "admin"} /></div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
