import { useEffect } from 'react'
import { supabase } from '@/shared/api'
import { queryClient } from '@/shared/lib'
import { dealKeys } from '../api/keys'

/** Subscribe to deal changes (Realtime) → invalidate keys → auto-refetch. */
export function useDealsRealtime(userId?: string) {
  useEffect(() => {
    if (!userId) {
      return
    }
    const channel = supabase
      .channel(`deals:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deals', filter: `user_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: dealKeys.all })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])
}
