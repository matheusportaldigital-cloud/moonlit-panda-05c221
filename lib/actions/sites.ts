"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface SiteFormState {
  error?: string;
  success?: boolean;
}

export async function createSite(
  _prevState: SiteFormState,
  formData: FormData
): Promise<SiteFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();

  if (!name) {
    return {
      error: "O nome do projeto é obrigatório.",
    };
  }

  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: "Sessão expirada. Faça login novamente.",
    };
  }

  /*
   * O banco possui uma função segura para criar o site.
   *
   * O "as any" aqui é somente para contornar o tipo Database antigo
   * do projeto, que ainda não conhece a função RPC criada no Supabase.
   * A segurança continua sendo feita pelo PostgreSQL.
   */
  const { data: siteId, error: createError } = await (
    supabase as any
  ).rpc("create_site_secure", {
    p_name: name,
    p_description: description || null,
    p_company_name: companyName || null,
  });

  if (createError) {
    return {
      error: createError.message,
    };
  }

  if (!siteId) {
    return {
      error: "O site não foi criado pelo banco de dados.",
    };
  }

  const { error: activityError } = await supabase
    .from("activity_logs")
    .insert({
      site_id: siteId,
      user_id: user.id,
      action: "site_created",
    });

  if (activityError) {
    console.error("Erro ao registrar atividade:", activityError);
  }

  revalidatePath("/dashboard");

  return {
    success: true,
  };
}

export async function deleteSite(siteId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("sites")
    .delete()
    .eq("id", siteId);

  if (error) {
    return {
      error: "Não foi possível excluir o site.",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
  };
}

export async function toggleFavorite(
  siteId: string,
  next: boolean
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("sites")
    .update({
      is_favorite: next,
    })
    .eq("id", siteId);

  if (error) {
    return {
      error: "Não foi possível atualizar.",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
  };
}
