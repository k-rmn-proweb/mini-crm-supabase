import { Slot } from 'radix-ui'
import { cn } from '@/shared/lib/utils'
import { buttonVariants } from './variants'
import type { ButtonProps } from './types'

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
