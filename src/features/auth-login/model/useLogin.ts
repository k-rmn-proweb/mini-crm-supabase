import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/shared/api'
import type { LoginValues } from '../lib/schema'

/** Sign in with email/password. AuthProvider picks up the session via onAuthStateChange. */
export function useLogin() {
  return useMutation({
    meta: { skipErrorToast: true },
    mutationFn: async (values: LoginValues) => {
      const { error } = await supabase.auth.signInWithPassword(values)
      if (error) {
        throw error
      }
    },
  })
}
