import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/shared/api'
import type { RegisterValues } from '../lib/schema'

/**
 * Sign up. full_name goes into user_metadata — the handle_new_user trigger
 * puts it into profiles. With email confirmation disabled, the session is created immediately.
 */
export function useRegister() {
  return useMutation({
    meta: { skipErrorToast: true },
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
