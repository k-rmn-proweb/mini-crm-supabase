import type { router } from './router'

/**
 * Module augmentation: регистрация типов TanStack Router.
 * Даёт глобальную типобезопасность навигации (Link, useParams, useNavigate и т.д.).
 * Применяется автоматически — файл входит в program через tsconfig `include`.
 */
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
