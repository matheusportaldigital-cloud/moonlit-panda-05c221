import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/sites/status-badge";

export const dynamic = "force-dynamic";

export default async function SiteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: site } = await supabase
    .from("sites")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!site) notFound();

  const tabs = [
    { label: "Visão Geral", href: `/dashboard/${site.id}` },
    { label: "Briefing", href: `/dashboard/${site.id}/briefing` },
    { label: "Prompts", href: `/dashboard/${site.id}/prompts` },
    { label: "Design", href: `/dashboard/${site.id}/design` },
    { label: "Conteúdo", href: `/dashboard/${site.id}/conteudo` },
    { label: "Referências", href: `/dashboard/${site.id}/referencias` },
    { label: "Arquivos", href: `/dashboard/${site.id}/arquivos` },
    { label: "Tarefas", href: `/dashboard/${site.id}/tarefas` },
    { label: "Histórico", href: `/dashboard/${site.id}/historico` },
  ];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold">{site.name}</h1>
        <StatusBadge status={site.status} />
      </div>

      {site.description && (
        <p className="max-w-xl text-sm text-muted-foreground">
          {site.description}
        </p>
      )}

      {/* Abas */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3 text-sm">
        {tabs.map((tab, index) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={
              index === 0
                ? "rounded bg-accent/15 px-2.5 py-1 text-accent"
                : "rounded px-2.5 py-1 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
            }
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Conteúdo da visão geral */}
      <div className="rounded border border-dashed border-border p-6 text-sm text-muted-foreground">
        <p>
          Este é o painel central do projeto.
        </p>

        <p className="mt-2">
          O projeto está conectado ao Supabase e os dados são persistidos no
          banco de dados.
        </p>

        <p className="mt-2">
          Etapa atual:{" "}
          <span className="font-mono">{site.current_stage}/8</span>.
        </p>

        <div className="mt-6">
          <Link
            href={`/dashboard/${site.id}/briefing`}
            className="inline-flex rounded bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Abrir Briefing
          </Link>
        </div>
      </div>
    </div>
  );
}
