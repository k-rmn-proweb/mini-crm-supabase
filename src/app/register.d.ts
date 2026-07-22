import type { router } from './router'

/**
 * Module augmentation: registers TanStack Router types.
 * Provides global type safety for navigation (Link, useParams, useNavigate, etc.).
 * Applied automatically — the file is part of the program via tsconfig `include`.
 */
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
