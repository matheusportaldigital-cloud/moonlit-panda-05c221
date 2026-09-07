# Central de Produção de Sites — Fase 1 (Fundação)

Ferramenta privada (não é SaaS de clientes) para centralizar briefing, contexto e
prompts dos sites que vocês dois produzem, evitando reexplicar tudo toda vez que
trocam de IA (Claude, ChatGPT, Lovable, Gemini, Cursor).

Esta entrega é a **Fase 1**: autenticação real, banco real, RLS real, layout,
sidebar e o CRUD de "Meus Sites" (criar / listar / favoritar / excluir), tudo
persistido de verdade no Supabase — nada de mock, array local ou localStorage.

## O que já funciona de ponta a ponta

- Login com Supabase Auth (sessão em cookie, renovada pelo middleware)
- Proteção de rota: acessar `/dashboard` sem sessão redireciona para `/login`
- Criar site → grava em `sites` no Postgres, aparece na lista após refresh,
  sobrevive a fechar o navegador e abrir de novo
- Favoritar / excluir site → `UPDATE` / `DELETE` reais, com confirmação antes de excluir
- RLS: cada site só é visível para quem está em `site_members`
- Dark / Light / Sistema

## O que ainda é placeholder (fases seguintes, conforme o seu plano)

Briefing completo, Prompt Builder, versionamento, templates, referências,
upload de arquivos, tarefas, histórico e busca global (Ctrl+K) — as telas
existem como esqueleto/empty state para a navegação já ficar completa, mas a
lógica entra nas Fases 3 a 9.

## 1. Criar o projeto no Supabase

1. Crie uma conta/projeto em https://supabase.com
2. Em **Project Settings → API**, copie a `Project URL` e a `anon public key`
3. Cole em um `.env.local` (copie de `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

## 2. Rodar as migrations

No **SQL Editor** do painel do Supabase, execute nesta ordem:

1. `supabase/migrations/0001_schema.sql` — cria todas as tabelas, enums, triggers
2. `supabase/migrations/0002_rls.sql` — ativa RLS e cria as políticas + bucket de storage

(Se preferir a CLI: `supabase link` e depois `supabase db push`.)

## 3. Criar os 2 usuários autorizados

Não existe tela pública de cadastro (de propósito — só vocês dois usam isso).
Em **Authentication → Users → Add user**, crie as duas contas com email/senha.
O trigger `handle_new_user` já cria o `profile` correspondente automaticamente.

## 4. Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000 — vai cair em `/login`.

## 5. Deploy

Suba o repositório para o GitHub e importe no Vercel. Configure as mesmas duas
variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
no painel do projeto na Vercel. Nenhum dado fica em memória do servidor — tudo
que importa está no Supabase, então o deploy é stateless.

## Testando a regra de persistência (a mais importante do projeto)

1. Crie um site → confirme que aparece na lista
2. Recarregue a página → precisa continuar lá
3. Feche o navegador, abra de novo, faça login → precisa continuar lá
4. Favorite / exclua → recarregue → a mudança precisa ter persistido
5. Abra o painel do Supabase → tabela `sites` → confirme que a linha existe de verdade

Se qualquer um desses passos falhar, é bug de persistência — não é esperado
que nada "pareça" salvo sem estar de fato gravado no Postgres.

## Estrutura

```
app/            rotas (App Router) — (auth) e (dashboard) são route groups
components/     ui/ (primitivas), layout/ (sidebar, topbar), sites/, auth/
lib/actions/    Server Actions (única porta de escrita no banco)
lib/supabase/   clients (browser/server) + middleware de sessão
types/          tipos gerados a mão a partir do schema SQL
supabase/       migrations SQL
```
