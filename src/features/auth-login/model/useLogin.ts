import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/shared/api'
import type { LoginValues } from '../lib/schema'

/** Вход по email/паролю. Сессию подхватит AuthProvider через onAuthStateChange. */
export function useLogin() {
  return useMutation({
    mutationFn: async (values: LoginValues) => {
      const { error } = await supabase.auth.signInWithPassword(values)
      if (error) {
        throw error
      }
    },
  })
}
