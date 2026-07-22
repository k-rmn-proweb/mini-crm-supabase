# Mini-CRM Dashboard

Веб-приложение для управления клиентами и сделками с аналитическим дашбордом.
Упрощённый Pipedrive/HubSpot для одного пользователя: клиенты → сделки (воронка) → активности → аналитика.

> Портфолио-проект. Живой демо-URL появится после деплоя (Фаза 8).

## Стек

- **React 19** + **TypeScript** (strict mode)
- **Vite** — сборка
- **Tailwind CSS v4** + **shadcn/ui** (Radix) — UI
- **TanStack Router** — типобезопасный роутинг (file-based)
- **TanStack Query** — серверное состояние (данные из Supabase)
- **Zustand** — клиентское UI-состояние (сайдбар, тема, фильтры)
- **React Hook Form + Zod** — формы и валидация
- **Supabase** — Postgres + Auth + RLS
- **Recharts** — графики · **dnd-kit** — Kanban-воронка · **lucide-react** — иконки
- **Feature-Sliced Design** — архитектура (границы слоёв под контролем ESLint)
- **ESLint** (typescript-eslint strict) + **Prettier**

## Быстрый старт

```bash
pnpm install
cp .env.example .env   # заполнить ключами Supabase
pnpm dev
```

## Скрипты

| Команда          | Назначение                                 |
| ---------------- | ------------------------------------------ |
| `pnpm dev`       | Dev-сервер (Vite)                          |
| `pnpm build`     | Production-сборка (`tsc -b && vite build`) |
| `pnpm preview`   | Предпросмотр собранного бандла             |
| `pnpm lint`      | ESLint (включая контроль границ FSD)       |
| `pnpm typecheck` | Проверка типов без эмита                   |
| `pnpm format`    | Форматирование Prettier                    |

## Архитектура (FSD)

Слои сверху вниз, зависимости строго однонаправленные:

```
app → routes → pages → widgets → features → entities → shared
```

```
src/
  app/        # провайдеры (Query, Router), композиция приложения
  routes/     # определения маршрутов TanStack Router (тонкие обёртки над pages)
  pages/      # страницы под роут
  widgets/    # крупные блоки UI (таблицы, доски, графики)
  features/   # действия пользователя (мутации, формы, диалоги)
  entities/   # бизнес-сущности (модель, query-хуки, базовый UI)
  shared/     # переиспользуемое: api (Supabase), ui (shadcn), utils, lib, config, store
```

## Переменные окружения

```
VITE_SUPABASE_URL=<url проекта Supabase>
VITE_SUPABASE_ANON_KEY=<anon public key>
```

Anon key публичный — безопасность обеспечивается через RLS. Service role key во фронтенде не используется.
