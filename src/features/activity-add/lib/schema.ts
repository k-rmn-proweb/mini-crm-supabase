import { z } from 'zod'

export const activityFormSchema = z.object({
  type: z.enum(['call', 'email', 'meeting', 'note']),
  content: z.string().min(1, 'Enter text'),
})

export type ActivityFormValues = z.infer<typeof activityFormSchema>
