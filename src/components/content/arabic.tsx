import { cn } from "@/lib/cn";

export function Arabic({ text, variant = "text", className }: { text: string; variant?: "quran" | "text"; className?: string }) {
  return (
    <p lang="ar" dir="rtl" className={cn(variant === "quran" ? "ar-quran" : "ar-text", "text-fg", className)}>
      {text}
    </p>
  );
}
