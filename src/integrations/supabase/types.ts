export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      media_items: {
        Row: {
          id: string
          title: string
          type: 'image' | 'video'
          url: string
          thumbnail_url: string | null
          category: string
          description: string | null
          alt: string | null
          is_external_video: boolean
          file_size: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          type: 'image' | 'video'
          url: string
          thumbnail_url?: string | null
          category?: string
          description?: string | null
          alt?: string | null
          is_external_video?: boolean
          file_size?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          type?: 'image' | 'video'
          url?: string
          thumbnail_url?: string | null
          category?: string
          description?: string | null
          alt?: string | null
          is_external_video?: boolean
          file_size?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
