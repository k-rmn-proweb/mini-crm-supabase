import type { Session, User } from '@supabase/supabase-js'
import type { Tables } from '@/shared/api'

export type { Session, User }

/** User profile (extension of auth.users). */
export type Profile = Tables<'profiles'>

/** Authentication state, passed into the router context. */
export type AuthState = {
  session: Session | null
  user: User | null
  isLoading: boolean
}
