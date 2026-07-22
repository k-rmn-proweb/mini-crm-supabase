-- 0002_rls_policies.sql
-- Row-Level Security: каждый пользователь видит и меняет только свои записи.
-- (select auth.uid()) вместо auth.uid() — планировщик кеширует значение (перф RLS).

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.deals enable row level security;
alter table public.activities enable row level security;

-- profiles: пользователь читает/меняет только свой профиль (id = auth.uid()).
-- INSERT выполняется триггером handle_new_user (security definer), поэтому политики на insert нет.
create policy "profiles_select_own" on public.profiles
  for select using (id = (select auth.uid()));

create policy "profiles_update_own" on public.profiles
  for update using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- clients / deals / activities: полный доступ владельца к своим записям (user_id = auth.uid()).
-- `for all` покрывает SELECT/INSERT/UPDATE/DELETE: using → чтение/изменение/удаление, with check → вставка/изменение.
create policy "clients_owner_all" on public.clients
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "deals_owner_all" on public.deals
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "activities_owner_all" on public.activities
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
