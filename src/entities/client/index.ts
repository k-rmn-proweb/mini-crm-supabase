// Public API of the client entity.
export { useClientsQuery } from './model/useClientsQuery'
export { useClientQuery } from './model/useClientQuery'
export { useClientOptions } from './model/useClientOptions'
export { useClientStats } from './model/useClientStats'
export { useClientsRealtime } from './model/useClientsRealtime'
export { ClientStatusBadge } from './ui/ClientStatusBadge'
export { CLIENT_STATUS_LABELS, CLIENT_STATUS_OPTIONS } from './model/consts'
export { clientKeys } from './api/keys'
export {
  fetchClients,
  fetchClientOptions,
  fetchClientStats,
  fetchClientById,
  createClient,
  updateClient,
  deleteClient,
} from './api/api'
export type { Client, ClientStatus } from './model/types'
export type { CreateClientDto, UpdateClientDto, ClientsQueryParams, ClientsPage } from './api/dto'
