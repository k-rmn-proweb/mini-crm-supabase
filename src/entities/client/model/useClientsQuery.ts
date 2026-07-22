import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { clientKeys } from '../api/keys'
import { fetchClients } from '../api/api'
import type { ClientsQueryParams } from '../api/dto'

/** Серверный список клиентов с поиском/фильтром/пагинацией. */
export function useClientsQuery(params: ClientsQueryParams) {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => fetchClients(params),
    // При смене страницы/фильтра показываем прошлые данные, пока грузятся новые.
    placeholderData: keepPreviousData,
  })
}
