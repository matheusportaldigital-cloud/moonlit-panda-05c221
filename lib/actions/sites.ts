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

  // Confirma que existe uma sessão válida.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "Sessão expirada. Faça login novamente.",
    };
  }

  // Cria o site através da função segura do PostgreSQL.
  // O próprio banco usa auth.uid() para definir o criador.
  const { data: siteId, error: createError } = await supabase.rpc(
    "create_site_secure",
    {
      p_name: name,
      p_description: description || null,
      p_company_name: companyName || null,
    }
  );

  if (createError || !siteId) {
    return {
      error:
        createError?.message ??
        "Não foi possível criar o site. Tente novamente.",
    };
  }

  // Registra a atividade depois que o site realmente foi criado.
  const { error: activityError } = await supabase
    .from("activity_logs")
    .insert({
      site_id: siteId,
      user_id: user.id,
      action: "site_created",
    });

  // O site já foi criado. Se apenas o log falhar, não fingimos
  // que a criação falhou.
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Sessão expirada. Faça login novamente.",
    };
  }

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Sessão expirada. Faça login novamente.",
    };
  }

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
