"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function AdminNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const path = usePathname();
  const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap", active ? "bg-primary-soft text-primary" : "text-fg-2 hover:bg-sunken")}>
      {icon} {label}
    </Link>
  );
}
