import { useEffect } from 'react'
import { supabase } from '@/shared/api'
import { queryClient } from '@/shared/lib'
import { activityKeys } from '../api/keys'

/** Подписка на изменения активностей (Realtime) → инвалидация ключей → авто-рефетч. */
export function useActivitiesRealtime(userId?: string) {
  useEffect(() => {
    if (!userId) {
      return
    }
    const channel = supabase
      .channel(`activities:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities', filter: `user_id=eq.${userId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: activityKeys.all })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])
}
