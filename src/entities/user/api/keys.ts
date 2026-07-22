/** Query-ключи сущности user. */
export const userKeys = {
  all: ['user'] as const,
  profile: (userId: string) => [...userKeys.all, 'profile', userId] as const,
}
