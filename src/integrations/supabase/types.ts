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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          emergency_contact: string | null
          emergency_contact_phone: string | null
          id: string
          preferred_activities: Json | null
          typical_vocal_tone: Json | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          id: string
          preferred_activities?: Json | null
          typical_vocal_tone?: Json | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          id?: string
          preferred_activities?: Json | null
          typical_vocal_tone?: Json | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_challenge_progress: {
        Row: {
          audio_response_url: string | null
          challenge_id: string
          completed_at: string
          id: string
          streak_count: number | null
          user_id: string
        }
        Insert: {
          audio_response_url?: string | null
          challenge_id: string
          completed_at?: string
          id?: string
          streak_count?: number | null
          user_id: string
        }
        Update: {
          audio_response_url?: string | null
          challenge_id?: string
          completed_at?: string
          id?: string
          streak_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "voice_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mood_history: {
        Row: {
          confidence: number | null
          context: Json | null
          id: string
          mood: string
          notes: string | null
          recorded_at: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          context?: Json | null
          id?: string
          mood: string
          notes?: string | null
          recorded_at?: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          context?: Json | null
          id?: string
          mood?: string
          notes?: string | null
          recorded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      voice_challenges: {
        Row: {
          created_at: string
          description: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      voice_entries: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          is_anonymous: boolean | null
          is_flagged: boolean | null
          location: Json | null
          mood: string | null
          topic: string | null
          transcription: string | null
          user_id: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          location?: Json | null
          mood?: string | null
          topic?: string | null
          transcription?: string | null
          user_id?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          is_flagged?: boolean | null
          location?: Json | null
          mood?: string | null
          topic?: string | null
          transcription?: string | null
          user_id?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
