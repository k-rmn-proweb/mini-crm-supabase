import { z } from 'zod'

/**
 * Валидированные переменные окружения.
 * Vite подставляет только переменные с префиксом VITE_ в import.meta.env.
 * Ошибка валидации падает на старте — лучше явный сбой, чем «тихий» undefined.
 */
const envSchema = z.object({
  VITE_SUPABASE_URL: z.url('VITE_SUPABASE_URL должен быть валидным URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY обязателен'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n')
  throw new Error(`Некорректные переменные окружения:\n${issues}`)
}

export const env = parsed.data
