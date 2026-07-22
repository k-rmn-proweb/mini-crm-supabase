import { useEffect } from 'react'
import { supabase } from '@/shared/api'
import { queryClient } from '@/shared/lib'
import { clientKeys } from '../api/keys'

/** Subscribe to client changes (Realtime) → invalidate keys → auto-refetch. */
export function useClientsRealtime(userId?: string) {
  useEffect(() => {
    if (!userId) {
      return
    }
    const channel = supabase
      .channel(`clients:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients', filter: `user_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: clientKeys.all })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])
}
