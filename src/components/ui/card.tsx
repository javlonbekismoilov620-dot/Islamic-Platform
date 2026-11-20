import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("card glass p-5 sm:p-6", className)} {...props} />;
}

export function SectionHeader({ title, subtitle, action, className }: { title: string; subtitle?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-fg">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, eyebrow, children, className }: { title: string; subtitle?: string; eyebrow?: string; children?: React.ReactNode; className?: string }) {
  return (
    <header className={cn("animate-in mb-8 pt-2 sm:mb-10", className)}>
      {eyebrow && <p className="mb-2 text-[0.8rem] font-semibold tracking-[0.08em] text-gold uppercase">{eyebrow}</p>}
      <h1 className="text-[2rem] leading-[1.1] font-bold tracking-[-0.035em] text-fg sm:text-[2.6rem]">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-fg-2">{subtitle}</p>}
      {children && <div className="mt-5">{children}</div>}
    </header>
  );
}
