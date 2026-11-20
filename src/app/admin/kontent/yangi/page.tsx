import { notFound } from "next/navigation";
import { adminCategories, requireStaffPage } from "@/server/admin/queries";
import { FIELDS, TYPE_LABEL } from "@/server/admin/fields";
import { ContentEditor } from "@/components/admin/editor";
import { PageHeader } from "@/components/ui/card";

export const metadata = { title: "Yangi kontent" };

export default async function NewContent({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const me = await requireStaffPage("/admin/kontent/yangi");
  const type = (await searchParams).type ?? "";
  if (!FIELDS[type]) notFound();
  const cats = (await adminCategories(me.id)).filter((c) => c.type === type);
  return (
    <div>
      <PageHeader title={`Yangi: ${TYPE_LABEL[type]}`} subtitle="Kontent qoralama sifatida saqlanadi va tekshiruvchi tasdiqlamaguncha ommaga koʻrinmaydi." />
      <section className="card glass p-5 sm:p-6"><ContentEditor type={type} fields={FIELDS[type]} item={null} categories={cats.map((c) => ({ slug: c.slug, title: c.title }))} /></section>
    </div>
  );
}
