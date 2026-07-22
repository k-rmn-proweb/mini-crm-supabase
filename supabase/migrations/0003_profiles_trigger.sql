-- 0003_profiles_trigger.sql
-- Auto-create a public.profiles row when a user signs up in auth.users.
-- full_name/avatar_url come from user metadata (passed at signUp: options.data.full_name).
-- security definer + empty search_path — the safe Supabase practice (protects against search_path hijacking);
-- so all objects are fully qualified (public.profiles).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
