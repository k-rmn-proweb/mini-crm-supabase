import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/shared/api'
import type { AuthState } from './types'

const AuthContext = createContext<AuthState | null>(null)

/**
 * Holds the Supabase session: reads the initial session and subscribes to changes
 * (login/logout/refresh). Exposes { session, user, isLoading }.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return
      }
      setState({ session: data.session, user: data.session?.user ?? null, isLoading: false })
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ session, user: session?.user ?? null, isLoading: false })
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext value={state}>{children}</AuthContext>
}

export function useAuth(): AuthState {
  const ctx = use(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>')
  }
  return ctx
}

/** Convenient alias for reading the session/user. */
export function useSession(): AuthState {
  return useAuth()
}
