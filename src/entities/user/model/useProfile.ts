import { useQuery } from '@tanstack/react-query'
import { userKeys } from '../api/keys'
import { fetchProfile } from '../api/api'
import { useSession } from './auth-context'

/** Профиль текущего пользователя (для шапки/настроек). */
export function useProfile() {
  const { user } = useSession()
  const userId = user?.id

  return useQuery({
    queryKey: userKeys.profile(userId ?? ''),
    queryFn: () => {
      if (!userId) throw new Error('Нет активной сессии')
      return fetchProfile(userId)
    },
    enabled: Boolean(userId),
  })
}
