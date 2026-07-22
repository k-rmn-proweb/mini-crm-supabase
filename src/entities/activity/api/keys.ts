/** Query keys of the activity entity. */
export const activityKeys = {
  all: ['activities'] as const,
  byClient: (clientId: string) => [...activityKeys.all, 'byClient', clientId] as const,
  recent: () => [...activityKeys.all, 'recent'] as const,
}
