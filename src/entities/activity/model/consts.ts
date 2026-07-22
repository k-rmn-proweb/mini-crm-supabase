import type { ActivityType } from './types'

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  call: 'Звонок',
  email: 'Письмо',
  meeting: 'Встреча',
  note: 'Заметка',
}

export const ACTIVITY_TYPE_OPTIONS = (Object.keys(ACTIVITY_TYPE_LABELS) as ActivityType[]).map(
  (value) => ({ value, label: ACTIVITY_TYPE_LABELS[value] }),
)
