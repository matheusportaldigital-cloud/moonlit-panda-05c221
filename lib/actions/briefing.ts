"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface BriefingFormState {
  error?: string;
  success?: boolean;
}

export async function saveBriefing(
  siteId: string,
  _prevState: BriefingFormState,
  formData: FormData
): Promise<BriefingFormState> {
  if (!siteId) {
    return { error: "Projeto inválido." };
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessão expirada. Faça login novamente." };
  }

  const briefing = {
    site_id: siteId,

    slogan: String(formData.get("slogan") ?? "").trim() || null,
    history: String(formData.get("history") ?? "").trim() || null,

    main_goal: String(formData.get("main_goal") ?? "").trim() || null,
    secondary_goals:
      String(formData.get("secondary_goals") ?? "").trim() || null,
    main_cta: String(formData.get("main_cta") ?? "").trim() || null,
    secondary_cta:
      String(formData.get("secondary_cta") ?? "").trim() || null,
    expected_conversion:
      String(formData.get("expected_conversion") ?? "").trim() || null,

    target_audience:
      String(formData.get("target_audience") ?? "").trim() || null,
    audience_profile:
      String(formData.get("audience_profile") ?? "").trim() || null,
    age_range:
      String(formData.get("age_range") ?? "").trim() || null,
    needs: String(formData.get("needs") ?? "").trim() || null,
    pains: String(formData.get("pains") ?? "").trim() || null,
    desires: String(formData.get("desires") ?? "").trim() || null,
    objections:
      String(formData.get("objections") ?? "").trim() || null,

    brand_personality:
      String(formData.get("brand_personality") ?? "").trim() || null,
    tone_of_voice:
      String(formData.get("tone_of_voice") ?? "").trim() || null,
    words_to_use:
      String(formData.get("words_to_use") ?? "").trim() || null,
    words_to_avoid:
      String(formData.get("words_to_avoid") ?? "").trim() || null,

    primary_colors:
      String(formData.get("primary_colors") ?? "").trim() || null,
    secondary_colors:
      String(formData.get("secondary_colors") ?? "").trim() || null,
    typography:
      String(formData.get("typography") ?? "").trim() || null,
    visual_style:
      String(formData.get("visual_style") ?? "").trim() || null,
    visual_references:
      String(formData.get("visual_references") ?? "").trim() || null,

    pages: String(formData.get("pages") ?? "").trim() || null,
    sections:
      String(formData.get("sections") ?? "").trim() || null,
    features:
      String(formData.get("features") ?? "").trim() || null,
    forms: String(formData.get("forms") ?? "").trim() || null,
    integrations:
      String(formData.get("integrations") ?? "").trim() || null,

    layout_notes:
      String(formData.get("layout_notes") ?? "").trim() || null,
    spacing_notes:
      String(formData.get("spacing_notes") ?? "").trim() || null,
    animations_notes:
      String(formData.get("animations_notes") ?? "").trim() || null,
    responsiveness_notes:
      String(formData.get("responsiveness_notes") ?? "").trim() || null,

    framework:
      String(formData.get("framework") ?? "").trim() || null,
    libraries:
      String(formData.get("libraries") ?? "").trim() || null,
    backend:
      String(formData.get("backend") ?? "").trim() || null,
    database:
      String(formData.get("database") ?? "").trim() || null,
    apis:
      String(formData.get("apis") ?? "").trim() || null,
    hosting:
      String(formData.get("hosting") ?? "").trim() || null,

    rules: String(formData.get("rules") ?? "").trim() || null,
  };

  const { error } = await supabase
    .from("site_briefings")
    .upsert(briefing, {
      onConflict: "site_id",
    });

  if (error) {
    return { error: error.message };
  }

  await supabase.from("activity_logs").insert({
    site_id: siteId,
    user_id: user.id,
    action: "briefing_updated",
  });

  revalidatePath(`/dashboard/${siteId}`);
  revalidatePath(`/dashboard/${siteId}/briefing`);

  return { success: true };
}
