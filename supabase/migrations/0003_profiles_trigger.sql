-- 0003_profiles_trigger.sql
-- Авто-создание записи в public.profiles при регистрации пользователя в auth.users.
-- full_name/avatar_url берём из user metadata (передаём при signUp: options.data.full_name).
-- security definer + пустой search_path — безопасная практика Supabase (защита от search_path hijack);
-- поэтому все объекты указываем полностью квалифицированно (public.profiles).

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
