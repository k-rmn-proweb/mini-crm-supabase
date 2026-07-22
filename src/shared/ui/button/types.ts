import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from './variants'

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /** Render as a child element (Radix Slot) instead of <button>. */
    asChild?: boolean
  }
