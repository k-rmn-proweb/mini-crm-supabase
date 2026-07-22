import { useQuery } from '@tanstack/react-query'
import { clientKeys } from '../api/keys'
import { fetchClientOptions } from '../api/api'

/** Все клиенты как опции (id + name) — для выпадающих списков и подписей. */
export function useClientOptions() {
  return useQuery({
    queryKey: clientKeys.options(),
    queryFn: fetchClientOptions,
  })
}
