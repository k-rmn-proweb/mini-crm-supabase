-- 0002_rls_policies.sql
-- Row-Level Security: each user sees and modifies only their own records.
-- (select auth.uid()) instead of auth.uid() — the planner caches the value (RLS performance).

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.deals enable row level security;
alter table public.activities enable row level security;

-- profiles: a user reads/updates only their own profile (id = auth.uid()).
-- INSERT is handled by the handle_new_user trigger (security definer), so there is no insert policy.
create policy "profiles_select_own" on public.profiles
  for select using (id = (select auth.uid()));

create policy "profiles_update_own" on public.profiles
  for update using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- clients / deals / activities: full owner access to their own records (user_id = auth.uid()).
-- `for all` covers SELECT/INSERT/UPDATE/DELETE: using → read/update/delete, with check → insert/update.
create policy "clients_owner_all" on public.clients
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "deals_owner_all" on public.deals
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "activities_owner_all" on public.activities
  for all using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
