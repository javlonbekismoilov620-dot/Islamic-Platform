"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User } from "lucide-react";
import { mainNav, mobileTabs, type NavItem } from "@/config/site";
import { Logo } from "@/components/ui/logo";
import { TasbihIcon } from "@/components/ui/icons";
import { NavIcon } from "./nav-icon";
import { cn } from "@/lib/cn";

function isActive(item: NavItem, path: string) {
  if (item.href === "/") return path === "/";
  return (item.match ?? [item.href]).some((m) => path === m || path.startsWith(m + "/"));
}

export function TopNav() {
  const path = usePathname() ?? "/";
  if (path.startsWith("/admin")) return null;
  return (
    <div className="no-print sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <nav aria-label="Asosiy menyu" className="glass-strong mx-auto flex h-[var(--nav-h)] max-w-6xl items-center justify-between rounded-[1.4rem] px-3 sm:px-4">
        <Link href="/" aria-label="Bosh sahifa" className="rounded-xl px-1.5 py-1">
          <Logo />
        </Link>
        <ul className="hidden items-center gap-0.5 lg:flex">
          {mainNav.filter((n) => n.href !== "/profil").map((item) => {
            const active = isActive(item, path);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("rounded-xl px-3.5 py-2 text-[0.92rem] font-medium transition-colors", active ? "bg-primary-soft text-primary" : "text-fg-2 hover:bg-sunken hover:text-fg")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-1">
          <Link href="/zikrlar" aria-label="Zikrlar" className="rounded-full p-2.5 text-fg-2 hover:bg-sunken hover:text-fg lg:hidden">
            <TasbihIcon size={21} />
          </Link>
          <Link href="/qidiruv" aria-label="Qidiruv" className={cn("rounded-full p-2.5 hover:bg-sunken hover:text-fg", path.startsWith("/qidiruv") ? "text-primary" : "text-fg-2")}>
            <Search size={21} strokeWidth={1.75} />
          </Link>
          <Link href="/profil" aria-label="Profil" className={cn("rounded-full p-2.5 hover:bg-sunken hover:text-fg", isActive(mainNav[6], path) ? "text-primary" : "text-fg-2")}>
            <User size={21} strokeWidth={1.75} />
          </Link>
        </div>
      </nav>
    </div>
  );
}

export function BottomTabs() {
  const path = usePathname() ?? "/";
  if (path.startsWith("/admin")) return null;
  const items = mobileTabs.map((h) => mainNav.find((n) => n.href === h)!);
  return (
    <nav aria-label="Pastki menyu" className="no-print fixed inset-x-0 bottom-0 z-40 px-3 pb-safe lg:hidden">
      <ul className="glass-strong mx-auto mb-2 flex h-[var(--tab-h)] max-w-md items-stretch justify-around rounded-[1.6rem] px-1">
        {items.map((item) => {
          const active = isActive(item, path);
          return (
            <li key={item.href} className="flex flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-[0.68rem] font-medium transition-colors", active ? "text-primary" : "text-muted hover:text-fg")}
              >
                <span className={cn("rounded-full px-3 py-1 transition-colors", active && "bg-primary-soft")}>
                  <NavIcon name={item.icon} size={21} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
