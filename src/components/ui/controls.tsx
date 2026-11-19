"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function Switch({ checked, onChange, label, description, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; disabled?: boolean }) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center justify-between gap-4 py-3", disabled && "opacity-50")}>
      <span>
        <span className="block text-[0.95rem] text-fg">{label}</span>
        {description && <span className="mt-0.5 block text-sm text-muted">{description}</span>}
      </span>
      <span className="relative inline-flex shrink-0">
        <input id={id} type="checkbox" role="switch" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-[31px] w-[51px] rounded-full bg-line-strong transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2" />
        <span className="pointer-events-none absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-transform duration-200 peer-checked:translate-x-[20px]" />
      </span>
    </label>
  );
}

export function Segmented<T extends string>({ value, onChange, options, label, className, size = "md" }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]; label: string; className?: string; size?: "sm" | "md" }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex rounded-2xl bg-sunken p-1", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 rounded-xl font-medium whitespace-nowrap transition-all duration-200",
              size === "sm" ? "px-3 py-1.5 text-[0.8rem]" : "px-4 py-2 text-sm",
              active ? "bg-surface-solid text-fg shadow-soft" : "text-muted hover:text-fg",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Slider({ value, onChange, min, max, step, label, format }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number; label: string; format?: (v: number) => string }) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-2">
      <div className="mb-2 flex items-center justify-between text-sm">
        <label htmlFor={id} className="text-fg">{label}</label>
        <span className="tabular-nums text-muted">{format ? format(value) : value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[var(--primary)]"
        style={{ background: `linear-gradient(to right, var(--primary) ${pct}%, var(--border-strong) ${pct}%)` }}
      />
    </div>
  );
}

export function Dialog({ open, onClose, title, children, footer, className }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="dlg-title"
      className={cn("m-auto w-[min(92vw,30rem)] rounded-[1.75rem] border border-line bg-surface-solid p-0 text-fg shadow-float backdrop:bg-black/40", className)}
    >
      {open && (
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id="dlg-title" className="text-lg font-semibold tracking-[-0.01em]">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Yopish" className="-m-1 rounded-full p-1.5 text-muted hover:bg-sunken hover:text-fg">
              <X size={18} />
            </button>
          </div>
          <div className="text-[0.95rem] text-fg-2">{children}</div>
          {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="card glass flex flex-col items-center px-6 py-12 text-center">
      {icon && <div className="mb-4 rounded-2xl bg-primary-soft p-3 text-primary">{icon}</div>}
      <p className="text-[1.05rem] font-semibold text-fg">{title}</p>
      {text && <p className="mt-1.5 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
