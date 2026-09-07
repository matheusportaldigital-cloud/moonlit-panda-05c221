-- ============================================================
-- 0001_schema.sql
-- Schema inicial do "Central de Produção de Sites"
-- Execute no SQL editor do seu projeto Supabase (ou via CLI: supabase db push)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- profiles: espelha auth.users com dados de exibição
-- ------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- cria o profile automaticamente quando um usuário é criado no Auth
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ------------------------------------------------------------
-- sites: o projeto de site em si
-- ------------------------------------------------------------
create type site_status as enum (
  'planejamento', 'design', 'desenvolvimento', 'revisao', 'finalizado', 'pausado'
);

create table if not exists sites (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  company_name text,
  description text,
  niche text,
  status site_status not null default 'planejamento',
  current_stage smallint not null default 1 check (current_stage between 1 and 8),
  priority smallint not null default 2 check (priority between 1 and 3),
  is_favorite boolean not null default false,
  tech_stack text[] default '{}',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sites_created_by_idx on sites(created_by);

-- ------------------------------------------------------------
-- site_members: define QUEM pode acessar cada site (base da RLS)
-- ------------------------------------------------------------
create table if not exists site_members (
  site_id uuid not null references sites(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now(),
  primary key (site_id, user_id)
);

-- adiciona automaticamente o criador do site como owner
create or replace function handle_new_site()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.site_members (site_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_site_created on sites;
create trigger on_site_created
  after insert on sites
  for each row execute procedure handle_new_site();

-- ------------------------------------------------------------
-- site_briefings: 1:1 com sites
-- ------------------------------------------------------------
create table if not exists site_briefings (
  site_id uuid primary key references sites(id) on delete cascade,
  -- identidade
  slogan text,
  history text,
  -- objetivo
  main_goal text,
  secondary_goals text,
  main_cta text,
  secondary_cta text,
  expected_conversion text,
  -- publico
  target_audience text,
  audience_profile text,
  age_range text,
  needs text,
  pains text,
  desires text,
  objections text,
  -- marca
  brand_personality text,
  tone_of_voice text,
  words_to_use text,
  words_to_avoid text,
  -- identidade visual
  primary_colors text,
  secondary_colors text,
  typography text,
  visual_style text,
  visual_references text,
  -- estrutura
  pages text,
  sections text,
  features text,
  forms text,
  integrations text,
  -- design
  layout_notes text,
  spacing_notes text,
  animations_notes text,
  responsiveness_notes text,
  -- desenvolvimento
  framework text,
  libraries text,
  backend text,
  database text,
  apis text,
  hosting text,
  -- regras livres
  rules text,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- site_pages / site_links
-- ------------------------------------------------------------
create table if not exists site_pages (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid not null references sites(id) on delete cascade,
  name text not null,
  description text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists site_pages_site_id_idx on site_pages(site_id);

create table if not exists site_links (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid not null references sites(id) on delete cascade,
  label text not null,
  url text not null,
  kind text default 'other',
  created_at timestamptz not null default now()
);
create index if not exists site_links_site_id_idx on site_links(site_id);

-- ------------------------------------------------------------
-- prompt_templates / site_templates (independentes de um site)
-- ------------------------------------------------------------
create table if not exists prompt_templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  ai_target text,
  objective text,
  body text not null,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists site_templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  seed_briefing jsonb default '{}',
  seed_pages jsonb default '[]',
  seed_rules text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- site_prompts + prompt_versions
-- ------------------------------------------------------------
create table if not exists site_prompts (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid not null references sites(id) on delete cascade,
  title text not null,
  ai_target text not null,
  objective text not null,
  is_favorite boolean not null default false,
  current_version integer not null default 1,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_prompts_site_id_idx on site_prompts(site_id);

create table if not exists prompt_versions (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid not null references site_prompts(id) on delete cascade,
  version_number integer not null,
  content text not null,
  note text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique (prompt_id, version_number)
);
create index if not exists prompt_versions_prompt_id_idx on prompt_versions(prompt_id);

-- ------------------------------------------------------------
-- site_references / site_files / site_tasks
-- ------------------------------------------------------------
create table if not exists site_references (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid not null references sites(id) on delete cascade,
  title text not null,
  url text,
  image_url text,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists site_references_site_id_idx on site_references(site_id);

create table if not exists site_files (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid not null references sites(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  file_size bigint,
  mime_type text,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists site_files_site_id_idx on site_files(site_id);

create type task_status as enum ('todo', 'em_andamento', 'concluido');

create table if not exists site_tasks (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid not null references sites(id) on delete cascade,
  title text not null,
  description text,
  status task_status not null default 'todo',
  priority smallint not null default 2 check (priority between 1 and 3),
  assignee_id uuid references profiles(id),
  due_date date,
  tags text[] default '{}',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_tasks_site_id_idx on site_tasks(site_id);

-- ------------------------------------------------------------
-- activity_logs
-- ------------------------------------------------------------
create table if not exists activity_logs (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid not null references sites(id) on delete cascade,
  user_id uuid references profiles(id),
  action text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);
create index if not exists activity_logs_site_id_idx on activity_logs(site_id, created_at desc);

-- ------------------------------------------------------------
-- ai_providers / ai_usage_logs (preparação para Fase 8)
-- ------------------------------------------------------------
create table if not exists ai_providers (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  is_configured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists ai_usage_logs (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid references sites(id) on delete set null,
  provider_id uuid references ai_providers(id),
  user_id uuid references profiles(id),
  tokens_used integer,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- updated_at automático
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['sites','site_briefings','site_prompts','site_tasks'] loop
    execute format('drop trigger if exists set_updated_at on %I;', t);
    execute format('create trigger set_updated_at before update on %I for each row execute procedure set_updated_at();', t);
  end loop;
end $$;
