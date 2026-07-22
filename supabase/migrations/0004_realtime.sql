-- 0004_realtime.sql — включить Realtime (поток изменений) для таблиц.
-- Добавляем таблицы в публикацию supabase_realtime; RLS продолжает действовать —
-- подписчик получает изменения только своих строк (фильтр по user_id на клиенте).

alter publication supabase_realtime add table public.clients;
alter publication supabase_realtime add table public.deals;
alter publication supabase_realtime add table public.activities;
