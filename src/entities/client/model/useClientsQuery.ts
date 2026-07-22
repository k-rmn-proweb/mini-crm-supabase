import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { clientKeys } from '../api/keys'
import { fetchClients } from '../api/api'
import type { ClientsQueryParams } from '../api/dto'

/** Server-side client list with search/filter/pagination. */
export function useClientsQuery(params: ClientsQueryParams) {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => fetchClients(params),
    // On page/filter change, show previous data while the new data loads.
    placeholderData: keepPreviousData,
  })
}
