import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { SiteCardMenu } from "./site-card-menu";
import type { Database } from "@/types/database";

type Site = Database["public"]["Tables"]["sites"]["Row"];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(iso)
  );
}

export function SiteCard({ site }: { site: Site }) {
  const progress = Math.round((site.current_stage / 8) * 100);

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/dashboard/${site.id}`} className="min-w-0">
          <h3 className="truncate text-sm font-semibold hover:text-accent">{site.name}</h3>
          {site.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {site.description}
            </p>
          )}
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          {site.is_favorite && <Star className="h-3.5 w-3.5 fill-warn text-warn" />}
          <SiteCardMenu siteId={site.id} isFavorite={site.is_favorite} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge status={site.status} />
        <span className="font-mono text-[11px] text-muted-foreground">
          etapa {site.current_stage}/8
        </span>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex flex-wrap gap-1">
          {(site.tech_stack ?? []).slice(0, 3).map((tech) => (
            <span key={tech} className="rounded border border-border px-1.5 py-0.5 font-mono">
              {tech}
            </span>
          ))}
        </div>
        <span>atualizado {formatDate(site.updated_at)}</span>
      </div>
    </Card>
  );
}
