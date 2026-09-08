"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface SiteFormState {
  error?: string;
  success?: boolean;
}

// Cria um site de verdade no Postgres. Só retorna sucesso depois que o
// banco confirma -- nunca antes (ver regra "contra perda de dados").
export async function createSite(
  _prevState: SiteFormState,
  formData: FormData
): Promise<SiteFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();

  if (!name) {
    return { error: "O nome do projeto é obrigatório." };
  }

const supabase = createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

  if (!user) return { error: "Sessão expirada. Faça login novamente." };

if (!user) return { error: "Sessão expirada. Faça login novamente." };

const { data: debugAuth, error: debugError } = await supabase.rpc(
  "debug_auth_uid"
);

return {
  error: `DEBUG | user.id=${user.id} | auth.uid=${debugAuth} | rpc_error=${debugError?.message ?? "none"}`,
};

  if (!user) {
    return { error: "Sessão expirada. Faça login novamente." };
  }

  const { data, error } = await supabase
    .from("sites")
    .insert({
      name,
      description: description || null,
      company_name: companyName || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Não foi possível salvar. Tente novamente." };
  }

  await supabase.from("activity_logs").insert({
    site_id: data.id,
    user_id: user.id,
    action: "site_created",
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteSite(siteId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("sites").delete().eq("id", siteId);
  if (error) {
    return { error: "Não foi possível excluir o site." };
  }
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleFavorite(siteId: string, next: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("sites")
    .update({ is_favorite: next })
    .eq("id", siteId);
  if (error) {
    return { error: "Não foi possível atualizar." };
  }
  revalidatePath("/dashboard");
  return { success: true };
}
