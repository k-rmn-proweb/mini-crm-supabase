import { create } from 'zustand'
import type { ClientStatus } from '@/entities/client'

export type StatusFilter = ClientStatus | 'all'

/**
 * UI-состояние фильтров таблицы клиентов (Zustand).
 * Серверные данные — в TanStack Query; здесь только поиск и выбранный статус.
 */
type ClientsFiltersState = {
  search: string
  status: StatusFilter
  setSearch: (search: string) => void
  setStatus: (status: StatusFilter) => void
}

export const useClientsFilters = create<ClientsFiltersState>((set) => ({
  search: '',
  status: 'all',
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
}))
