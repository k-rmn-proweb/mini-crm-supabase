import { useQuery } from '@tanstack/react-query'
import { clientKeys } from '../api/keys'
import { fetchClients } from '../api/api'

/** Все клиенты пользователя. Фильтрация/поиск — на стороне UI (см. widgets/clients-table). */
export function useClientsQuery() {
  return useQuery({
    queryKey: clientKeys.list(),
    queryFn: fetchClients,
  })
}
