// Публичный API сущности activity.
export { useClientActivitiesQuery } from './model/useClientActivitiesQuery'
export { useRecentActivitiesQuery } from './model/useRecentActivitiesQuery'
export { ActivityItem } from './ui/ActivityItem'
export { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_OPTIONS } from './model/consts'
export { activityKeys } from './api/keys'
export { fetchActivitiesByClient, fetchRecentActivities, createActivity } from './api/api'
export type { Activity, ActivityType } from './model/types'
export type { CreateActivityDto } from './api/dto'
