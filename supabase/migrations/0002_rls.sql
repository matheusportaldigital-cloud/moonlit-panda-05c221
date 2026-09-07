-- ============================================================
-- 0002_rls.sql
-- Row Level Security: acesso a QUALQUER dado de um site exige
-- uma linha correspondente em site_members. Nunca confiamos em
-- um user_id enviado pelo frontend -- sempre auth.uid() do token.
-- ============================================================

alter table profiles enable row level security;
alter table sites enable row level security;
alter table site_members enable row level security;
alter table site_briefings enable row level security;
alter table site_pages enable row level security;
alter table site_links enable row level security;
alter table prompt_templates enable row level security;
alter table site_templates enable row level security;
alter table site_prompts enable row level security;
alter table prompt_versions enable row level security;
alter table site_references enable row level security;
alter table site_files enable row level security;
alter table site_tasks enable row level security;
alter table activity_logs enable row level security;
alter table ai_providers enable row level security;
alter table ai_usage_logs enable row level security;

-- helper: o usuário atual é membro do site?
create or replace function is_site_member(check_site_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from site_members
    where site_id = check_site_id and user_id = auth.uid()
  );
$$;

-- profiles: cada um vê o próprio, e vê os profiles de quem divide algum site
create policy "profiles_select" on profiles for select
  using (
    id = auth.uid()
    or exists (
      select 1 from site_members sm1
      join site_members sm2 on sm1.site_id = sm2.site_id
      where sm1.user_id = auth.uid() and sm2.user_id = profiles.id
    )
  );
create policy "profiles_update_own" on profiles for update
  using (id = auth.uid());

-- sites: só quem é membro
create policy "sites_select" on sites for select
  using (is_site_member(id));
create policy "sites_insert" on sites for insert
  with check (created_by = auth.uid());
create policy "sites_update" on sites for update
  using (is_site_member(id));
create policy "sites_delete" on sites for delete
  using (is_site_member(id));

-- site_members: só quem já é membro do site enxerga/gerencia a lista
create policy "site_members_select" on site_members for select
  using (is_site_member(site_id));
create policy "site_members_insert" on site_members for insert
  with check (is_site_member(site_id));
create policy "site_members_delete" on site_members for delete
  using (is_site_member(site_id));

-- tabelas filhas simples (mesma regra: precisa ser membro do site)
create policy "site_briefings_all" on site_briefings for all
  using (is_site_member(site_id)) with check (is_site_member(site_id));

create policy "site_pages_all" on site_pages for all
  using (is_site_member(site_id)) with check (is_site_member(site_id));

create policy "site_links_all" on site_links for all
  using (is_site_member(site_id)) with check (is_site_member(site_id));

create policy "site_prompts_all" on site_prompts for all
  using (is_site_member(site_id)) with check (is_site_member(site_id));

create policy "prompt_versions_all" on prompt_versions for all
  using (is_site_member((select site_id from site_prompts where id = prompt_id)))
  with check (is_site_member((select site_id from site_prompts where id = prompt_id)));

create policy "site_references_all" on site_references for all
  using (is_site_member(site_id)) with check (is_site_member(site_id));

create policy "site_files_all" on site_files for all
  using (is_site_member(site_id)) with check (is_site_member(site_id));

create policy "site_tasks_all" on site_tasks for all
  using (is_site_member(site_id)) with check (is_site_member(site_id));

create policy "activity_logs_select" on activity_logs for select
  using (is_site_member(site_id));
create policy "activity_logs_insert" on activity_logs for insert
  with check (is_site_member(site_id));

-- templates: qualquer usuário autenticado (não há conceito de "dono" exclusivo,
-- já que só existem 2 usuários e ambos compartilham a biblioteca)
create policy "prompt_templates_all" on prompt_templates for all
  using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "site_templates_all" on site_templates for all
  using (auth.uid() is not null) with check (auth.uid() is not null);

-- ai_providers / ai_usage_logs: leitura para autenticados; logs por membro do site
create policy "ai_providers_select" on ai_providers for select
  using (auth.uid() is not null);
create policy "ai_usage_logs_select" on ai_usage_logs for select
  using (site_id is null or is_site_member(site_id));
create policy "ai_usage_logs_insert" on ai_usage_logs for insert
  with check (site_id is null or is_site_member(site_id));

-- ------------------------------------------------------------
-- Storage: bucket "site-files" privado, mesma regra de acesso
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-files', 'site-files', false)
on conflict (id) do nothing;

create policy "site_files_storage_all" on storage.objects for all
  using (
    bucket_id = 'site-files'
    and is_site_member((storage.foldername(name))[1]::uuid)
  )
  with check (
    bucket_id = 'site-files'
    and is_site_member((storage.foldername(name))[1]::uuid)
  );
