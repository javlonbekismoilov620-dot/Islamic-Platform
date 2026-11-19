import { BadgeCheck, Clock, FileWarning, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "primary" | "gold" | "success" | "warning" | "danger" | "info";
const tones: Record<Tone, string> = {
  neutral: "bg-sunken text-fg-2 border-line",
  primary: "bg-primary-soft text-primary border-transparent",
  gold: "bg-gold-soft text-gold border-transparent",
  success: "bg-success-soft text-success border-transparent",
  warning: "bg-warning-soft text-warning border-transparent",
  danger: "bg-danger-soft text-danger border-transparent",
  info: "bg-info-soft text-info border-transparent",
};

export function Badge({ tone = "neutral", children, className, icon }: { tone?: Tone; children: ReactNode; className?: string; icon?: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.75rem] font-medium whitespace-nowrap", tones[tone], className)}>
      {icon}
      {children}
    </span>
  );
}

export type ContentStatus = "draft" | "in_review" | "changes_requested" | "published" | "rejected" | "archived";

export const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: "Qoralama",
  in_review: "Tekshiruvda",
  changes_requested: "Tuzatish soʻralgan",
  published: "Tasdiqlangan",
  rejected: "Rad etilgan",
  archived: "Arxivlangan",
};

export function StatusBadge({ status, className }: { status: ContentStatus; className?: string }) {
  if (status === "published") return <Badge tone="success" className={className} icon={<BadgeCheck size={13} />}>Ulamolar tekshirgan</Badge>;
  if (status === "in_review") return <Badge tone="warning" className={className} icon={<Clock size={13} />}>Tekshiruv kutilmoqda</Badge>;
  if (status === "changes_requested") return <Badge tone="warning" className={className} icon={<FileWarning size={13} />}>{STATUS_LABEL[status]}</Badge>;
  if (status === "rejected") return <Badge tone="danger" className={className} icon={<ShieldAlert size={13} />}>{STATUS_LABEL[status]}</Badge>;
  return <Badge className={className}>{STATUS_LABEL[status]}</Badge>;
}

/** Shariy hukm turlari — har biri alohida rang bilan, aralashtirilmaydi. */
export const RULINGS = {
  farz: { label: "Farz", tone: "danger" as Tone, desc: "Qatʼiy dalil bilan buyurilgan; tark etish katta gunoh, inkor etish kufr." },
  vojib: { label: "Vojib", tone: "warning" as Tone, desc: "Zanniy dalil bilan buyurilgan; tark etish gunoh. Hanafiy mazhabiga xos daraja." },
  sunnat: { label: "Sunnat", tone: "primary" as Tone, desc: "Paygʻambarimiz ﷺ doimiy yoki koʻp qilgan amallar; muakkada sunnatni tark etish malomatga sabab." },
  mustahab: { label: "Mustahab", tone: "info" as Tone, desc: "Qilinsa savob, tark etilsa gunoh boʻlmaydigan maqbul amal (odob, nafl)." },
  muboh: { label: "Muboh", tone: "neutral" as Tone, desc: "Qilish ham, qilmaslik ham ixtiyoriy; savob ham, gunoh ham yoʻq." },
  makruh: { label: "Makruh", tone: "gold" as Tone, desc: "Qilinmagani maʼqul. Makruhi tahrimiy haromga yaqin, makruhi tanzihiy esa yengilroq." },
  harom: { label: "Harom", tone: "danger" as Tone, desc: "Qatʼiy man qilingan; qilish katta gunoh." },
} as const;
export type Ruling = keyof typeof RULINGS;

export function RulingBadge({ ruling, className }: { ruling: Ruling; className?: string }) {
  const r = RULINGS[ruling];
  return <Badge tone={r.tone} className={className}>{r.label}</Badge>;
}
