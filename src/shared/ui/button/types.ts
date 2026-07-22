import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from './variants'

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Рендерить как дочерний элемент (Radix Slot) вместо <button>. */
    asChild?: boolean
  }
