-- 0004_realtime.sql — enable Realtime (change stream) for the tables.
-- Add the tables to the supabase_realtime publication; RLS still applies —
-- a subscriber receives changes only for their own rows (filtered by user_id on the client).

alter publication supabase_realtime add table public.clients;
alter publication supabase_realtime add table public.deals;
alter publication supabase_realtime add table public.activities;
