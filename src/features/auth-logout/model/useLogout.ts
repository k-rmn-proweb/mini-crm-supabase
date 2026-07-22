import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/shared/api'
import { queryClient } from '@/shared/lib'

/** Log out. Clears the entire TanStack Query cache so the next user won't see someone else's data. */
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
