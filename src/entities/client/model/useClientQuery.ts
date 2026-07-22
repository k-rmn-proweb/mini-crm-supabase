import { useQuery } from '@tanstack/react-query'
import { clientKeys } from '../api/keys'
import { fetchClientById } from '../api/api'

/** A single client by id (for the client card). */
export function useClientQuery(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => fetchClientById(id),
  })
}
