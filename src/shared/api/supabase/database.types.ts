/**
 * Типы схемы БД Supabase.
 *
 * ЗАГЛУШКА (Фаза 0). В Фазе 1 будет перегенерирована командой:
 *   supabase gen types typescript --project-id <id> > src/shared/api/supabase/database.types.ts
 */
export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
