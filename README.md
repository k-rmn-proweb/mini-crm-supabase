# Mini-CRM Dashboard

A small but production-grade CRM for managing clients, deals, and activities — a simplified
single-user Pipedrive/HubSpot: **clients → deals (pipeline) → activities → analytics**.

**🔗 Live demo: [mini-crm-supabase-silk.vercel.app](https://mini-crm-supabase-silk.vercel.app/)**
→ on the login page just click **“Log in as demo”** (no sign-up needed).

> Portfolio project focused on production-grade quality — strict typing, clean architecture,
> real-time data, and server-side data handling — rather than feature count.

---

## Features

- **Auth** — email/password sign-up & login, plus a one-click demo account. Route guards
  redirect unauthenticated users; a refresh never bounces you off the current page.
- **Clients** — full CRUD with **server-side search, status filtering, and pagination**
  (the database does the work, so it scales past a handful of rows).
- **Client detail** — profile, related deals, and a chronological **activity timeline**
  (calls, emails, meetings, notes).
- **Deals pipeline** — a **Kanban board with drag & drop** (dnd-kit) across stages
  (new → negotiation → won/lost), with **optimistic updates** and smooth reordering animations.
- **Deal editing in a side drawer** — changes **auto-save on the fly** (debounced), no “Save” dance.
- **Dashboard** — KPI cards and **Recharts** analytics (deals by stage, revenue, new-clients trend).
- **Realtime** — powered by **Supabase Realtime**: open the app in two tabs and changes in one
  appear in the other instantly, with no refresh.
- **Dark mode** — theme-aware throughout (including charts and the date picker), no flash on load.
- **Polished UX** — indigo brand theming, responsive collapsible sidebar, global error toasts,
  loading/empty states.

## Tech stack

| Area           | Choice                                                                           |
| -------------- | -------------------------------------------------------------------------------- |
| Language       | **TypeScript 6** (strict, no `any`)                                              |
| UI             | **React 19**, **Tailwind CSS v4**, **shadcn/ui** (Radix)                         |
| Build          | **Vite 8**                                                                       |
| Routing        | **TanStack Router** — type-safe, file-based, `beforeLoad` auth guards            |
| Server state   | **TanStack Query** — query-key factories, `keepPreviousData`, optimistic updates |
| Client state   | **Zustand** — UI only (theme, sidebar, filters)                                  |
| Forms          | **React Hook Form** + **Zod**                                                    |
| Backend        | **Supabase** — Postgres, Auth, Row-Level Security, Realtime                      |
| Data viz / DnD | **Recharts**, **dnd-kit**, **motion** (animations)                               |
| Architecture   | **Feature-Sliced Design** — layer boundaries enforced by ESLint                  |
| Quality        | **typescript-eslint** (strict, type-checked) + **Prettier**                      |

## Engineering highlights

- **Feature-Sliced Design with enforced boundaries** — `eslint-plugin-boundaries` forbids
  upward and cross-slice imports, so the architecture can’t quietly rot.
- **Server-side data layer** — search / filter / pagination run in Postgres (`ilike`, `eq`,
  `range`, exact count), not in the browser.
- **Row-Level Security** — every table is RLS-protected; a user can only ever read/write their
  own rows. The frontend uses only the public **anon key**; data is protected by the database.
- **Optimistic mutations with rollback** — dragging a deal updates the UI immediately and
  reverts on error, with a global `MutationCache` error toast (opt-out per mutation).
- **Typed everything** — generated DB types feed domain models; router, query keys, and
  mutation meta are all statically typed.

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

## Data model

`profiles · clients · deals · activities` — all owned by a user and cascaded on delete.
Domain enums (`client_status`, `deal_stage`, `activity_type`) become strict union types in the
generated TypeScript. Schema, RLS policies, triggers, and seed data live in [`supabase/`](./supabase).

## Quick start

```bash
pnpm install
cp .env.example .env   # fill in your Supabase project URL and anon key
pnpm dev
```

Then apply the SQL in [`supabase/`](./supabase) (schema → RLS → trigger → seed) via the
Supabase SQL Editor. See [`supabase/README.md`](./supabase/README.md) for the exact order.

## Scripts

| Command          | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Dev server (Vite)                         |
| `pnpm build`     | Production build (`tsc -b && vite build`) |
| `pnpm preview`   | Preview the built bundle                  |
| `pnpm lint`      | ESLint (including FSD boundary checks)    |
| `pnpm typecheck` | Type check without emit                   |
| `pnpm format`    | Format with Prettier                      |

## Environment variables

```
VITE_SUPABASE_URL=<Supabase project URL>
VITE_SUPABASE_ANON_KEY=<anon public key>
```

The anon key is public by design — security is enforced via RLS. The service role key is
**never** used in the frontend.
