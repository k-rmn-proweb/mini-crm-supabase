-- 0001_init_schema.sql
-- Mini-CRM: domain types, tables, indexes, updated_at trigger.
-- All user tables live in the public schema; each has user_id → auth.users (the basis of RLS).
-- gen_random_uuid() is available in Supabase out of the box.

-- === Domain enum types (produce strict union types in the generated TS types) ===
create type public.client_status as enum ('lead', 'active', 'inactive');
create type public.deal_stage as enum ('new', 'negotiation', 'won', 'lost');
create type public.activity_type as enum ('call', 'email', 'meeting', 'note');

-- === Shared function: auto-set updated_at on UPDATE ===
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- === profiles (extension of auth.users) ===
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- === clients ===
create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  company    text,
  email      text,
  phone      text,
  status     public.client_status not null default 'lead',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index clients_user_id_idx on public.clients (user_id);

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

-- === deals ===
create table public.deals (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users (id) on delete cascade,
  client_id           uuid not null references public.clients (id) on delete cascade,
  title               text not null,
  amount              numeric not null default 0,
  stage               public.deal_stage not null default 'new',
  expected_close_date date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index deals_user_id_idx on public.deals (user_id);
create index deals_client_id_idx on public.deals (client_id);

create trigger deals_set_updated_at
  before update on public.deals
  for each row execute function public.set_updated_at();

-- === activities ===
create table public.activities (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  client_id  uuid not null references public.clients (id) on delete cascade,
  type       public.activity_type not null,
  content    text not null,
  created_at timestamptz not null default now()
);
create index activities_user_id_idx on public.activities (user_id);
create index activities_client_id_idx on public.activities (client_id);
