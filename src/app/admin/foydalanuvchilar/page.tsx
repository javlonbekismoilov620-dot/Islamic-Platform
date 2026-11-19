import { notFound } from "next/navigation";
import { adminUsers, requireStaffPage } from "@/server/admin/queries";
import { UserRow } from "@/components/admin/small-forms";
import { PageHeader } from "@/components/ui/card";

export const metadata = { title: "Foydalanuvchilar" };

export default async function UsersAdmin() {
  const me = await requireStaffPage("/admin/foydalanuvchilar");
  if (me.role !== "admin") notFound();
  const list = await adminUsers(me.id);
  return (
    <div>
      <PageHeader title="Foydalanuvchilar" subtitle="Rollar: muharrir — kontent yozadi; tekshiruvchi — ulamo sifatida tasdiqlaydi; administrator — hammasini boshqaradi. Bloklangan foydalanuvchining barcha seanslari yopiladi." />
      <div className="overflow-x-auto rounded-3xl border border-line bg-surface">
        <table className="w-full min-w-[44rem] text-sm">
          <thead className="bg-sunken text-left"><tr><th className="px-4 py-3">Foydalanuvchi</th><th className="px-4 py-3">Rol va holat</th><th className="px-4 py-3">Oxirgi kirish</th></tr></thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-t border-line align-top">
                <td className="px-4 py-3"><span className="font-medium text-fg">{u.email}</span><span className="block text-xs text-muted">{u.displayName ?? "—"} · {new Date(u.createdAt).toLocaleDateString("uz-UZ")}</span></td>
                <td className="px-4 py-3"><UserRow u={u} self={u.id === me.id} /></td>
                <td className="px-4 py-3 text-xs text-muted">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
