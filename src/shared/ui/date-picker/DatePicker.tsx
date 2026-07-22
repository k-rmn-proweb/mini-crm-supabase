import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { enUS } from 'react-day-picker/locale'
import { cn } from '@/shared/utils'
import { Button } from '../button'
import { Calendar } from '../calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

type Props = {
  /** Date in 'YYYY-MM-DD' format or ''. */
  value?: string
  onChange: (value: string) => void
  id?: string
  placeholder?: string
}

function parseDate(value?: string): Date | undefined {
  if (!value) {
    return undefined
  }
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function DatePicker({ value, onChange, id, placeholder = 'Select a date' }: Props) {
  const [open, setOpen] = useState(false)
  const selected = parseDate(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn('w-full justify-start font-normal', !selected && 'text-muted-foreground')}
        >
          <CalendarIcon />
          {selected
            ? selected.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? toISODate(date) : '')
            setOpen(false)
          }}
          locale={enUS}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
