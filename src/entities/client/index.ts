// Публичный API сущности client.
export { useClientsQuery } from './model/useClientsQuery'
export { useClientQuery } from './model/useClientQuery'
export { ClientStatusBadge } from './ui/ClientStatusBadge'
export { CLIENT_STATUS_LABELS, CLIENT_STATUS_OPTIONS } from './model/consts'
export { clientKeys } from './api/keys'
export { fetchClients, fetchClientById, createClient, updateClient, deleteClient } from './api/api'
export type { Client, ClientStatus } from './model/types'
export type { CreateClientDto, UpdateClientDto } from './api/dto'
