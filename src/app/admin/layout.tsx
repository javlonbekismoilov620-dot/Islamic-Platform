import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, FileText, FolderTree, LayoutDashboard, Library, ScrollText, Users } from "lucide-react";
import { requireStaffPage } from "@/server/admin/queries";
import { Logo } from "@/components/ui/logo";
import { AdminNavLink } from "@/components/admin/nav-link";

export const metadata: Metadata = { title: { default: "Boshqaruv paneli", template: "%s — Boshqaruv paneli" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ROLE: Record<string, string> = { editor: "Muharrir", reviewer: "Tekshiruvchi", admin: "Administrator" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await requireStaffPage();
  const items = [
    { href: "/admin", label: "Umumiy", icon: <LayoutDashboard size={17} /> },
    { href: "/admin/tekshiruv", label: "Tekshiruv navbati", icon: <ClipboardCheck size={17} /> },
    { href: "/admin/kontent", label: "Kontent", icon: <FileText size={17} /> },
    { href: "/admin/manbalar", label: "Manbalar", icon: <Library size={17} /> },
    ...(me.role === "admin" ? [
      { href: "/admin/kategoriyalar", label: "Toifalar", icon: <FolderTree size={17} /> },
      { href: "/admin/foydalanuvchilar", label: "Foydalanuvchilar", icon: <Users size={17} /> },
      { href: "/admin/audit", label: "Audit jurnali", icon: <ScrollText size={17} /> },
    ] : []),
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="card glass p-4">
          <Link href="/" className="mb-4 block"><Logo /></Link>
          <p className="mb-3 truncate text-xs text-muted">{me.email} · {ROLE[me.role]}</p>
          <nav className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col" aria-label="Boshqaruv menyusi">
            {items.map((i) => <AdminNavLink key={i.href} href={i.href} icon={i.icon} label={i.label} />)}
          </nav>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
