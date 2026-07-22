import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

/**
 * Клиентское UI-состояние (Zustand).
 * ВАЖНО: только UI — сайдбар, тема, модалки. Серверные данные — в TanStack Query.
 */
type UiState = {
  theme: Theme
  /** Десктоп: сайдбар свёрнут до иконок. */
  sidebarCollapsed: boolean
  /** Мобайл: открыт drawer сайдбара. */
  mobileSidebarOpen: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  toggleSidebarCollapsed: () => void
  setMobileSidebarOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
    }),
    {
      name: 'mini-crm-ui',
      // Мобильное открытие — транзиентное, не персистим.
      partialize: (s) => ({ theme: s.theme, sidebarCollapsed: s.sidebarCollapsed }),
    },
  ),
)
