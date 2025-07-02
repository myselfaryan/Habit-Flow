export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string
          name: string
          description: string | null
          frequency: string
          target_count: number
          category: string
          color: string
          is_active: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          frequency?: string
          target_count?: number
          category: string
          color?: string
          is_active?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          frequency?: string
          target_count?: number
          category?: string
          color?: string
          is_active?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          priority: string
          category: string
          due_date: string | null
          completed: boolean
          completed_at: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          priority?: string
          category: string
          due_date?: string | null
          completed?: boolean
          completed_at?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          priority?: string
          category?: string
          due_date?: string | null
          completed?: boolean
          completed_at?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      habit_entries: {
        Row: {
          id: string
          habit_id: string
          date: string
          count: number
          notes: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          date: string
          count?: number
          notes?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          date?: string
          count?: number
          notes?: string | null
          user_id?: string
          created_at?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          completed?: boolean
          created_at?: string
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
  }
}