import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/shared/api'
import { queryClient } from '@/shared/lib'

/** Выход. Чистит весь кеш TanStack Query, чтобы следующий юзер не увидел чужие данные. */
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
