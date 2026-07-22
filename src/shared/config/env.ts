import { z } from 'zod'

/**
 * Validated environment variables.
 * Vite only injects variables prefixed with VITE_ into import.meta.env.
 * A validation error fails at startup — an explicit failure is better than a "silent" undefined.
 */
const envSchema = z.object({
  VITE_SUPABASE_URL: z.url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY is required'),
})

// Trim first: a stray newline/space (e.g. pasted into a hosting env var) would otherwise
// slip into the anon key and make an invalid `apikey`/`Authorization` header — fetch then
// throws "Failed to execute 'fetch': Invalid value" before the request is even sent.
const rawEnv = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL?.trim(),
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim(),
}

const parsed = envSchema.safeParse(rawEnv)

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n')
  throw new Error(`Invalid environment variables:\n${issues}`)
}

export const env = parsed.data
