import Link from "next/link";
import { cn } from "@/lib/cn";

export function DuaZikrTabs({ active }: { active: "duolar" | "zikrlar" }) {
  const tab = (href: string, label: string, on: boolean) => (
    <Link href={href} aria-current={on ? "page" : undefined} className={cn("rounded-xl px-4 py-1.5 text-sm font-medium transition-all", on ? "bg-surface-solid text-fg shadow-soft" : "text-muted hover:text-fg")}>
      {label}
    </Link>
  );
  return (
    <div className="mb-6 inline-flex rounded-2xl bg-sunken p-1">
      {tab("/duolar", "Duolar", active === "duolar")}
      {tab("/zikrlar", "Zikrlar", active === "zikrlar")}
    </div>
  );
}
