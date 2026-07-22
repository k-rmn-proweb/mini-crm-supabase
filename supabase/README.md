# Supabase

Схема БД, RLS-политики и триггеры Mini-CRM.

## Как применить (SQL Editor)

В дашборде Supabase → **SQL Editor** → New query. Скопировать содержимое файлов
и выполнить **по порядку**:

1. `migrations/0001_init_schema.sql` — enum-типы, таблицы, индексы, `updated_at`-триггер.
2. `migrations/0002_rls_policies.sql` — включение RLS и политики (доступ только к своим записям).
3. `migrations/0003_profiles_trigger.sql` — авто-создание `profiles` при регистрации.
4. `seed.sql` — демо-данные (добавим позже, после создания демо-аккаунта).

## Модель данных

- `profiles` — расширение `auth.users` (`id` = `auth.users.id`).
- `clients` — клиенты пользователя (`user_id` → `auth.users`).
- `deals` — сделки (`client_id` → `clients`, `on delete cascade`).
- `activities` — активности (`client_id` → `clients`, `on delete cascade`).

Enum-типы: `client_status`, `deal_stage`, `activity_type` — дают строгие union-типы
в сгенерированных TS-типах.

## RLS

Включён на всех таблицах. Пользователь видит/меняет только записи с `user_id = auth.uid()`
(для `profiles` — `id = auth.uid()`). Используется `(select auth.uid())` для производительности.

## Генерация TS-типов

После применения схемы типы генерируются в `src/shared/api/supabase/database.types.ts`:

```bash
npx supabase gen types typescript --project-id <PROJECT_REF> > src/shared/api/supabase/database.types.ts
```

`PROJECT_REF` — из URL проекта (`https://<ref>.supabase.co`) или Project Settings → General.
