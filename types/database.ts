// Tipos espelhando supabase/migrations/0001_schema.sql.
// Quando o schema mudar, gere a versão oficial com:
//   npx supabase gen types typescript --project-id SEU_PROJECT_ID > types/database.ts

export type SiteStatus =
  | "planejamento"
  | "design"
  | "desenvolvimento"
  | "revisao"
  | "finalizado"
  | "pausado";

export type TaskStatus = "todo" | "em_andamento" | "concluido";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      sites: {
        Row: {
          id: string;
          name: string;
          company_name: string | null;
          description: string | null;
          niche: string | null;
          status: SiteStatus;
          current_stage: number;
          priority: number;
          is_favorite: boolean;
          tech_stack: string[] | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["sites"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["sites"]["Row"]>;
        Relationships: [];
      };
      site_members: {
        Row: {
          site_id: string;
          user_id: string;
          role: "owner" | "editor";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_members"]["Row"]> & {
          site_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_members"]["Row"]>;
        Relationships: [];
      };
      site_briefings: {
        Row: {
          site_id: string;
          slogan: string | null;
          history: string | null;
          main_goal: string | null;
          secondary_goals: string | null;
          main_cta: string | null;
          secondary_cta: string | null;
          expected_conversion: string | null;
          target_audience: string | null;
          audience_profile: string | null;
          age_range: string | null;
          needs: string | null;
          pains: string | null;
          desires: string | null;
          objections: string | null;
          brand_personality: string | null;
          tone_of_voice: string | null;
          words_to_use: string | null;
          words_to_avoid: string | null;
          primary_colors: string | null;
          secondary_colors: string | null;
          typography: string | null;
          visual_style: string | null;
          visual_references: string | null;
          pages: string | null;
          sections: string | null;
          features: string | null;
          forms: string | null;
          integrations: string | null;
          layout_notes: string | null;
          spacing_notes: string | null;
          animations_notes: string | null;
          responsiveness_notes: string | null;
          framework: string | null;
          libraries: string | null;
          backend: string | null;
          database: string | null;
          apis: string | null;
          hosting: string | null;
          rules: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_briefings"]["Row"]> & {
          site_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_briefings"]["Row"]>;
        Relationships: [];
      };
      site_pages: {
        Row: {
          id: string;
          site_id: string;
          name: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_pages"]["Row"]> & {
          site_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_pages"]["Row"]>;
        Relationships: [];
      };
      site_links: {
        Row: {
          id: string;
          site_id: string;
          label: string;
          url: string;
          kind: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_links"]["Row"]> & {
          site_id: string;
          label: string;
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_links"]["Row"]>;
        Relationships: [];
      };
      prompt_templates: {
        Row: {
          id: string;
          name: string;
          ai_target: string | null;
          objective: string | null;
          body: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["prompt_templates"]["Row"]> & {
          name: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["prompt_templates"]["Row"]>;
        Relationships: [];
      };
      site_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          seed_briefing: Record<string, unknown>;
          seed_pages: unknown[];
          seed_rules: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_templates"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_templates"]["Row"]>;
        Relationships: [];
      };
      site_prompts: {
        Row: {
          id: string;
          site_id: string;
          title: string;
          ai_target: string;
          objective: string;
          is_favorite: boolean;
          current_version: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_prompts"]["Row"]> & {
          site_id: string;
          title: string;
          ai_target: string;
          objective: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_prompts"]["Row"]>;
        Relationships: [];
      };
      prompt_versions: {
        Row: {
          id: string;
          prompt_id: string;
          version_number: number;
          content: string;
          note: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["prompt_versions"]["Row"]> & {
          prompt_id: string;
          version_number: number;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["prompt_versions"]["Row"]>;
        Relationships: [];
      };
      site_references: {
        Row: {
          id: string;
          site_id: string;
          title: string;
          url: string | null;
          image_url: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_references"]["Row"]> & {
          site_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_references"]["Row"]>;
        Relationships: [];
      };
      site_files: {
        Row: {
          id: string;
          site_id: string;
          storage_path: string;
          file_name: string;
          file_size: number | null;
          mime_type: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_files"]["Row"]> & {
          site_id: string;
          storage_path: string;
          file_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_files"]["Row"]>;
        Relationships: [];
      };
      site_tasks: {
        Row: {
          id: string;
          site_id: string;
          title: string;
          description: string | null;
          status: TaskStatus;
          priority: number;
          assignee_id: string | null;
          due_date: string | null;
          tags: string[] | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_tasks"]["Row"]> & {
          site_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_tasks"]["Row"]>;
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: string;
          site_id: string;
          user_id: string | null;
          action: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["activity_logs"]["Row"]> & {
          site_id: string;
          action: string;
        };
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Row"]>;
        Relationships: [];
      };
      ai_providers: {
        Row: {
          id: string;
          name: string;
          is_configured: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ai_providers"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["ai_providers"]["Row"]>;
        Relationships: [];
      };
      ai_usage_logs: {
        Row: {
          id: string;
          site_id: string | null;
          provider_id: string | null;
          user_id: string | null;
          tokens_used: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ai_usage_logs"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["ai_usage_logs"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      site_status: SiteStatus;
      task_status: TaskStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
