# Mini-CRM Dashboard

A web app for managing clients and deals with an analytics dashboard.
A simplified single-user Pipedrive/HubSpot: clients → deals (pipeline) → activities → analytics.

> Portfolio project. A live demo URL will appear after deployment (Phase 8).

## Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite** — build tooling
- **Tailwind CSS v4** + **shadcn/ui** (Radix) — UI
- **TanStack Router** — type-safe routing (file-based)
- **TanStack Query** — server state (data from Supabase)
- **Zustand** — client UI state (sidebar, theme, filters)
- **React Hook Form + Zod** — forms and validation
- **Supabase** — Postgres + Auth + RLS
- **Recharts** — charts · **dnd-kit** — Kanban pipeline · **lucide-react** — icons
- **Feature-Sliced Design** — architecture (layer boundaries enforced by ESLint)
- **ESLint** (typescript-eslint strict) + **Prettier**

## Quick start

```bash
pnpm install
cp .env.example .env   # fill in your Supabase keys
pnpm dev
```

## Scripts

| Command          | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Dev server (Vite)                         |
| `pnpm build`     | Production build (`tsc -b && vite build`) |
| `pnpm preview`   | Preview the built bundle                  |
| `pnpm lint`      | ESLint (including FSD boundary checks)    |
| `pnpm typecheck` | Type check without emit                   |
| `pnpm format`    | Format with Prettier                      |

## Architecture (FSD)

Layers top to bottom, dependencies strictly one-directional:

```
app → routes → pages → widgets → features → entities → shared
```

```
src/
  app/        # providers (Query, Router), app composition
  routes/     # TanStack Router route definitions (thin wrappers over pages)
  pages/      # per-route pages
  widgets/    # large UI blocks (tables, boards, charts)
  features/   # user actions (mutations, forms, dialogs)
  entities/   # business entities (model, query hooks, base UI)
  shared/     # reusable: api (Supabase), ui (shadcn), utils, lib, config, store
```

## Environment variables

```
VITE_SUPABASE_URL=<Supabase project URL>
VITE_SUPABASE_ANON_KEY=<anon public key>
```

The anon key is public — security is enforced via RLS. The service role key is not used in the frontend.
