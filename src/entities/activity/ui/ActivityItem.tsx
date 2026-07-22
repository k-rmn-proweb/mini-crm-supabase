import { Calendar, Mail, Phone, StickyNote, type LucideIcon } from 'lucide-react'
import { formatDate } from '@/shared/utils'
import { ACTIVITY_TYPE_LABELS } from '../model/consts'
import type { Activity, ActivityType } from '../model/types'

const ICONS: Record<ActivityType, LucideIcon> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: StickyNote,
}

export function ActivityItem({ activity }: { activity: Activity }) {
  const Icon = ICONS[activity.type]

  return (
    <li className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{ACTIVITY_TYPE_LABELS[activity.type]}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDate(activity.created_at)}
          </span>
        </div>
        <p className="text-sm break-words text-muted-foreground">{activity.content}</p>
      </div>
    </li>
  )
}
