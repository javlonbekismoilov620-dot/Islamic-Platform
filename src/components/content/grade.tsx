import { gradeSummary } from "@/content/refs";
import type { Grade } from "@/content/types";
import { Badge } from "@/components/ui/badge";

export function GradeBadge({ collection, grades, showDetail = false }: { collection?: string; grades: Grade[]; showDetail?: boolean }) {
  const g = gradeSummary(collection, grades);
  return (
    <span className="inline-flex flex-col gap-1">
      <Badge tone={g.tone === "neutral" ? "neutral" : g.tone} className="self-start">
        {g.label}
      </Badge>
      {showDetail && <span className="text-xs leading-relaxed text-muted">{g.detail}</span>}
    </span>
  );
}
