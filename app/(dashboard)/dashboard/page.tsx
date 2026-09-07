import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { SiteCard } from "@/components/sites/site-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();

  // A RLS garante que só voltam sites onde o usuário atual está em site_members.
  const { data: sites, error } = await supabase
    .from("sites")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Meus Sites</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus projetos e continue de onde parou.
          </p>
        </div>
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href="/dashboard/new">
            <Plus className="h-4 w-4" /> Novo Site
          </Link>
        </Button>
      </div>

      {error && (
        <p className="rounded border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          Não foi possível carregar seus sites agora. Tente novamente.
        </p>
      )}

      {!error && sites && sites.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded border border-dashed border-border py-20 text-center">
          <h2 className="text-sm font-medium">Você ainda não criou nenhum site.</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie seu primeiro projeto para começar.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/dashboard/new">
              <Plus className="h-4 w-4" /> Criar site
            </Link>
          </Button>
        </div>
      )}

      {sites && sites.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}
    </div>
  );
}
