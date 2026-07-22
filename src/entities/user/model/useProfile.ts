import { useQuery } from '@tanstack/react-query'
import { userKeys } from '../api/keys'
import { fetchProfile } from '../api/api'
import { useSession } from './auth-context'

/** Current user's profile (for the header/settings). */
export function useProfile() {
  const { user } = useSession()
  const userId = user?.id

  return useQuery({
    queryKey: userKeys.profile(userId ?? ''),
    queryFn: () => {
      if (!userId) {
        throw new Error('No active session')
      }
      return fetchProfile(userId)
    },
    enabled: Boolean(userId),
  })
}
