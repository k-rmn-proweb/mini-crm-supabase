/**
 * Типы схемы БД Supabase.
 *
 * Составлены по нашей схеме (supabase/migrations/*.sql). Формат совместим с выводом
 * Supabase CLI — при желании перегенерировать канонический файл:
 *   supabase gen types typescript --project-id mvgkkddzeygpauphamnl > src/shared/api/supabase/database.types.ts
 * (нужен `supabase login`). Хелперы Tables/TablesInsert/TablesUpdate/Enums — как у CLI.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string
          user_id: string
          client_id: string
          type: Database['public']['Enums']['activity_type']
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          type: Database['public']['Enums']['activity_type']
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          type?: Database['public']['Enums']['activity_type']
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'activities_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
        ]
      }
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          company: string | null
          email: string | null
          phone: string | null
          status: Database['public']['Enums']['client_status']
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          company?: string | null
          email?: string | null
          phone?: string | null
          status?: Database['public']['Enums']['client_status']
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          company?: string | null
          email?: string | null
          phone?: string | null
          status?: Database['public']['Enums']['client_status']
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          id: string
          user_id: string
          client_id: string
          title: string
          amount: number
          stage: Database['public']['Enums']['deal_stage']
          expected_close_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          title: string
          amount?: number
          stage?: Database['public']['Enums']['deal_stage']
          expected_close_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          title?: string
          amount?: number
          stage?: Database['public']['Enums']['deal_stage']
          expected_close_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'deals_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'clients'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type: 'call' | 'email' | 'meeting' | 'note'
      client_status: 'lead' | 'active' | 'inactive'
      deal_stage: 'new' | 'negotiation' | 'won' | 'lost'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database['public']

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row']
export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update']
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T]
