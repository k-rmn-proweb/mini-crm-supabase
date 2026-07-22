import { useQuery } from '@tanstack/react-query'
import { clientKeys } from '../api/keys'
import { fetchClientOptions } from '../api/api'

/** All clients as options (id + name) — for dropdowns and labels. */
export function useClientOptions() {
  return useQuery({
    queryKey: clientKeys.options(),
    queryFn: fetchClientOptions,
  })
}
