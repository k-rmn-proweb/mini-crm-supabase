# Supabase

Mini-CRM database schema, RLS policies, and triggers.

## How to apply (SQL Editor)

In the Supabase dashboard → **SQL Editor** → New query. Copy the contents of the files
and run them **in order**:

1. `migrations/0001_init_schema.sql` — enum types, tables, indexes, `updated_at` trigger.
2. `migrations/0002_rls_policies.sql` — enabling RLS and policies (access to your own records only).
3. `migrations/0003_profiles_trigger.sql` — auto-create `profiles` on sign-up.
4. `seed.sql` — demo data (added later, after creating the demo account).

## Data model

- `profiles` — extension of `auth.users` (`id` = `auth.users.id`).
- `clients` — a user's clients (`user_id` → `auth.users`).
- `deals` — deals (`client_id` → `clients`, `on delete cascade`).
- `activities` — activities (`client_id` → `clients`, `on delete cascade`).

Enum types: `client_status`, `deal_stage`, `activity_type` — produce strict union types
in the generated TS types.

## RLS

Enabled on all tables. A user sees/modifies only records with `user_id = auth.uid()`
(for `profiles` — `id = auth.uid()`). `(select auth.uid())` is used for performance.

## Generating TS types

Database types live in `src/shared/api/supabase/database.types.ts` (generated, do not edit by hand).
Regenerate after any schema change:

```bash
supabase login   # once (stores the token locally)
pnpm db:types    # supabase gen types → database.types.ts
```

The `db:types` script already includes the project's `--project-id`.
