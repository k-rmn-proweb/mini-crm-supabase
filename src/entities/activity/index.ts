// Публичный API сущности activity.
export { useClientActivitiesQuery } from './model/useClientActivitiesQuery'
export { ActivityItem } from './ui/ActivityItem'
export { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_OPTIONS } from './model/consts'
export { activityKeys } from './api/keys'
export { fetchActivitiesByClient, createActivity } from './api/api'
export type { Activity, ActivityType } from './model/types'
export type { CreateActivityDto } from './api/dto'
