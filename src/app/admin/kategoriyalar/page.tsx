import { notFound } from "next/navigation";
import { adminCategories, requireStaffPage } from "@/server/admin/queries";
import { CategoryForm } from "@/components/admin/small-forms";
import { PageHeader } from "@/components/ui/card";

export const metadata = { title: "Toifalar" };

export default async function CategoriesAdmin() {
  const me = await requireStaffPage("/admin/kategoriyalar");
  if (me.role !== "admin") notFound();
  const cats = await adminCategories(me.id);
  return (
    <div>
      <PageHeader title="Toifalar" subtitle="Duo toifalari, hadis mavzulari va bilimlar boʻlimlari. Ichida kontent bor toifani oʻchirib boʻlmaydi." />
      <section className="card glass mb-6 p-5"><h2 className="mb-3 font-semibold text-fg">Yangi toifa</h2><CategoryForm /></section>
      <ul className="space-y-2">{cats.map((c) => <li key={c.id} className="card glass p-4"><details><summary className="cursor-pointer text-sm"><span className="font-medium text-fg">{c.title}</span> <span className="text-muted">({c.type}/{c.slug})</span></summary><div className="mt-3"><CategoryForm cat={c} /></div></details></li>)}</ul>
    </div>
  );
}
