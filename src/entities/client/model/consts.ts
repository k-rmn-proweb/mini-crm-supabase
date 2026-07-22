import type { ClientStatus } from './types'

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  lead: 'Lead',
  active: 'Active',
  inactive: 'Inactive',
}

export const CLIENT_STATUS_OPTIONS = (Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map(
  (value) => ({ value, label: CLIENT_STATUS_LABELS[value] }),
)
