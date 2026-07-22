import { create } from 'zustand'
import type { ClientStatus } from '@/entities/client'

export type StatusFilter = ClientStatus | 'all'

/**
 * UI-состояние фильтров таблицы клиентов (Zustand). Значения параметризуют
 * серверный запрос. При смене поиска/статуса страница сбрасывается на первую.
 */
type ClientsFiltersState = {
  search: string
  status: StatusFilter
  page: number
  setSearch: (search: string) => void
  setStatus: (status: StatusFilter) => void
  setPage: (page: number) => void
}

export const useClientsFilters = create<ClientsFiltersState>((set) => ({
  search: '',
  status: 'all',
  page: 0,
  setSearch: (search) => set({ search, page: 0 }),
  setStatus: (status) => set({ status, page: 0 }),
  setPage: (page) => set({ page }),
}))
