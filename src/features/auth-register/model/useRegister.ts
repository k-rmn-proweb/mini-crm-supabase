import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/shared/api'
import type { RegisterValues } from '../lib/schema'

/**
 * Регистрация. full_name уходит в user_metadata — триггер handle_new_user
 * положит его в profiles. При выключенном подтверждении email сессия создаётся сразу.
 */
export function useRegister() {
  return useMutation({
    mutationFn: async ({ fullName, email, password }: RegisterValues) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) {
        throw error
      }
    },
  })
}
