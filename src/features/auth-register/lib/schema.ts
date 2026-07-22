import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Enter your name'),
  email: z.email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
})

export type RegisterValues = z.infer<typeof registerSchema>
