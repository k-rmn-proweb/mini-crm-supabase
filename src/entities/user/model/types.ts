import type { Session, User } from '@supabase/supabase-js'
import type { Tables } from '@/shared/api'

export type { Session, User }

/** Профиль пользователя (расширение auth.users). */
export type Profile = Tables<'profiles'>

/** Состояние аутентификации, прокидывается в context роутера. */
export type AuthState = {
  session: Session | null
  user: User | null
  isLoading: boolean
}
