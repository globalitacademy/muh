export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      account_locks: {
        Row: {
          created_at: string | null
          email: string
          id: string
          locked_until: string
          reason: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          locked_until: string
          reason?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          locked_until?: string
          reason?: string | null
        }
        Relationships: []
      }
      failed_login_attempts: {
        Row: {
          attempted_at: string | null
          email: string
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          attempted_at?: string | null
          email: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          attempted_at?: string | null
          email?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email_verified: boolean | null
          first_name: string | null
          id: string
          last_name: string | null
          name: string
          organization: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          two_factor_enabled: boolean | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id: string
          last_name?: string | null
          name: string
          organization?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          name?: string
          organization?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string | null
          content: string
          correct_answer: Json
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          id: string
          options: Json | null
          order_index: number | null
          points: number | null
          programming_details: Json | null
          tags: string[] | null
          test_id: string
          title: string
          type: Database["public"]["Enums"]["question_type"]
        }
        Insert: {
          category?: string | null
          content: string
          correct_answer: Json
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          id?: string
          options?: Json | null
          order_index?: number | null
          points?: number | null
          programming_details?: Json | null
          tags?: string[] | null
          test_id: string
          title: string
          type: Database["public"]["Enums"]["question_type"]
        }
        Update: {
          category?: string | null
          content?: string
          correct_answer?: Json
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          id?: string
          options?: Json | null
          order_index?: number | null
          points?: number | null
          programming_details?: Json | null
          tags?: string[] | null
          test_id?: string
          title?: string
          type?: Database["public"]["Enums"]["question_type"]
        }
        Relationships: [
          {
            foreignKeyName: "questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_attempts: {
        Row: {
          answers: Json | null
          completed_at: string | null
          id: string
          ip_address: string | null
          score: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["attempt_status"] | null
          student_email: string | null
          student_name: string
          test_id: string
          time_spent: number | null
          total_points: number | null
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          ip_address?: string | null
          score?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["attempt_status"] | null
          student_email?: string | null
          student_name: string
          test_id: string
          time_spent?: number | null
          total_points?: number | null
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          id?: string
          ip_address?: string | null
          score?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["attempt_status"] | null
          student_email?: string | null
          student_name?: string
          test_id?: string
          time_spent?: number | null
          total_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          access_code: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          language: Database["public"]["Enums"]["test_language"] | null
          settings: Json | null
          status: Database["public"]["Enums"]["test_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          access_code?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          language?: Database["public"]["Enums"]["test_language"] | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["test_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          access_code?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          language?: Database["public"]["Enums"]["test_language"] | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["test_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tests_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      two_factor_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          enabled: boolean | null
          id: string
          secret: string
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          secret: string
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          secret?: string
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: string | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_locks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_reset_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_failed_attempts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      attempt_status: "in-progress" | "completed" | "abandoned"
      difficulty_level: "easy" | "medium" | "hard"
      question_type:
        | "multiple-choice"
        | "true-false"
        | "text-input"
        | "programming"
      test_language: "hy" | "ru" | "en"
      test_status: "draft" | "published" | "archived"
      user_role: "instructor" | "organization"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attempt_status: ["in-progress", "completed", "abandoned"],
      difficulty_level: ["easy", "medium", "hard"],
      question_type: [
        "multiple-choice",
        "true-false",
        "text-input",
        "programming",
      ],
      test_language: ["hy", "ru", "en"],
      test_status: ["draft", "published", "archived"],
      user_role: ["instructor", "organization"],
    },
  },
} as const
