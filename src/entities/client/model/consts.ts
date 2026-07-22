import type { ClientStatus } from './types'

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  lead: 'Лид',
  active: 'Активный',
  inactive: 'Неактивный',
}

export const CLIENT_STATUS_OPTIONS = (Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map(
  (value) => ({ value, label: CLIENT_STATUS_LABELS[value] }),
)
