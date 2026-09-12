import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function BriefingPage({
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

  if (!site) {
    return <div>Projeto não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Briefing</h1>
        <p className="text-sm text-muted-foreground">
          Informações e contexto do projeto {site.name}.
        </p>
      </div>

      <div className="rounded-lg border border-border p-6">
        <p className="text-sm text-muted-foreground">
          O briefing deste projeto será preenchido aqui.
        </p>
      </div>
    </div>
  );
}
