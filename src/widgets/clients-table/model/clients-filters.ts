import { create } from 'zustand'
import type { ClientStatus } from '@/entities/client'

export type StatusFilter = ClientStatus | 'all'

/**
 * UI state for the clients table filters (Zustand). The values parameterize
 * the server request. Changing the search/status resets the page to the first one.
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
