import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** Brend belgisi: sakkiz qirrali yulduz ichidagi mehrob ravogʻi (original geometrik belgi). */
export function LogoMark({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lg-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--primary) 70%, #000)" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#lg-a)" />
      <g fill="none" stroke="var(--primary-contrast)" strokeWidth="1.6" strokeLinejoin="round" opacity="0.95">
        <path d="M24 10.5 27.6 14.4H33.6V20.4L37.5 24 33.6 27.6V33.6H27.6L24 37.5 20.4 33.6H14.4V27.6L10.5 24 14.4 20.4V14.4H20.4Z" opacity="0.55" />
        <path d="M18.5 32.5v-7c0-3 2.4-5.4 5.5-7 3.1 1.6 5.5 4 5.5 7v7" />
      </g>
      <circle cx="24" cy="15.2" r="1.3" fill="var(--gold)" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-fg">{siteConfig.name}</span>}
    </span>
  );
}
