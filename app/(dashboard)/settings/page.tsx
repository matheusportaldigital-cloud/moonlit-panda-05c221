import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-lg font-semibold">Configurações</h1>

      <div className="space-y-2">
        <h2 className="text-sm font-medium">Perfil</h2>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium">Aparência</h2>
        <p className="text-sm text-muted-foreground">
          Use o botão de sol/lua na barra superior para trocar entre Claro, Escuro e Sistema.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium">Provedores de IA</h2>
        <p className="text-sm text-muted-foreground">
          A configuração de chaves para Claude, OpenAI e Gemini chega na Fase 8. Até lá, o Prompt
          Builder continua funcionando normalmente para gerar e copiar prompts manualmente.
        </p>
      </div>
    </div>
  );
}
