import { cn } from "@/lib/utils";
import type { SiteStatus } from "@/types/database";

const STATUS_LABEL: Record<SiteStatus, string> = {
  planejamento: "Planejamento",
  design: "Design",
  desenvolvimento: "Desenvolvimento",
  revisao: "Revisão",
  finalizado: "Finalizado",
  pausado: "Pausado",
};

const STATUS_CLASS: Record<SiteStatus, string> = {
  planejamento: "bg-muted-foreground/15 text-muted-foreground",
  design: "bg-accent/15 text-accent",
  desenvolvimento: "bg-accent/15 text-accent",
  revisao: "bg-warn/15 text-warn",
  finalizado: "bg-success/15 text-success",
  pausado: "bg-danger/15 text-danger",
};

export function StatusBadge({ status }: { status: SiteStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        STATUS_CLASS[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
