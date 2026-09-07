import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/sites/status-badge";

export const dynamic = "force-dynamic";

export default async function SiteDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // A RLS decide sozinha: se o usuário não for membro deste site, a query
  // simplesmente não retorna a linha (não é um erro 403 explícito).
  const { data: site } = await supabase.from("sites").select("*").eq("id", params.id).single();

  if (!site) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold">{site.name}</h1>
        <StatusBadge status={site.status} />
      </div>
      {site.description && <p className="max-w-xl text-sm text-muted-foreground">{site.description}</p>}

      <div className="flex flex-wrap gap-2 border-b border-border pb-3 text-sm">
        {["Visão Geral", "Briefing", "Prompts", "Design", "Conteúdo", "Referências", "Arquivos", "Tarefas", "Histórico"].map(
          (tab, i) => (
            <span
              key={tab}
              className={
                i === 0
                  ? "rounded bg-accent/15 px-2.5 py-1 text-accent"
                  : "rounded px-2.5 py-1 text-muted-foreground"
              }
            >
              {tab}
            </span>
          )
        )}
      </div>

      <div className="rounded border border-dashed border-border p-6 text-sm text-muted-foreground">
        Briefing, Prompt Builder, versionamento, referências, arquivos e tarefas deste projeto
        chegam nas próximas fases (Fase 3 em diante). Esta página já lê o site real do Supabase —
        etapa atual: <span className="font-mono">{site.current_stage}/8</span>.
      </div>
    </div>
  );
}
