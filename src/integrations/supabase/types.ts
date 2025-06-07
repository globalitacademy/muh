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
      availability: {
        Row: {
          capacity: number
          created_at: string | null
          date: string
          end_time: string
          id: string
          service_id: string | null
          start_time: string
        }
        Insert: {
          capacity: number
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          service_id?: string | null
          start_time: string
        }
        Update: {
          capacity?: number
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          service_id?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_services: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          price: number
          quantity: number
          service_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          price: number
          quantity: number
          service_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          price?: number
          quantity?: number
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_services_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string | null
          customer_id: string | null
          group_size: number
          group_type: string
          id: string
          preferred_date: string
          preferred_time: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          group_size: number
          group_type: string
          id?: string
          preferred_date: string
          preferred_time: string
          status: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          group_size?: number
          group_type?: string
          id?: string
          preferred_date?: string
          preferred_time?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          description: string | null
          entry_fee: number | null
          guide_required: boolean | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          entry_fee?: number | null
          guide_required?: boolean | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          entry_fee?: number | null
          guide_required?: boolean | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          enrolled_at: string
          id: string
          module_id: string | null
          progress_percentage: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          enrolled_at?: string
          id?: string
          module_id?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          enrolled_at?: string
          id?: string
          module_id?: string | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      excursion_destinations: {
        Row: {
          destination_id: string | null
          entry_fee: number
          excursion_id: string | null
          guide_required: boolean | null
          id: string
          visit_duration: number
          visit_order: number
        }
        Insert: {
          destination_id?: string | null
          entry_fee: number
          excursion_id?: string | null
          guide_required?: boolean | null
          id?: string
          visit_duration: number
          visit_order: number
        }
        Update: {
          destination_id?: string | null
          entry_fee?: number
          excursion_id?: string | null
          guide_required?: boolean | null
          id?: string
          visit_duration?: number
          visit_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "excursion_destinations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "excursion_destinations_excursion_id_fkey"
            columns: ["excursion_id"]
            isOneToOne: false
            referencedRelation: "excursions"
            referencedColumns: ["id"]
          },
        ]
      }
      excursions: {
        Row: {
          created_at: string | null
          departure_date: string
          departure_time: string
          id: string
          return_time: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          departure_date: string
          departure_time: string
          id?: string
          return_time: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          departure_date?: string
          departure_time?: string
          id?: string
          return_time?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      food_arrangements: {
        Row: {
          excursion_id: string | null
          id: string
          menu_description: string | null
          per_person_cost: number
          restaurant_address: string | null
          restaurant_name: string
        }
        Insert: {
          excursion_id?: string | null
          id?: string
          menu_description?: string | null
          per_person_cost: number
          restaurant_address?: string | null
          restaurant_name: string
        }
        Update: {
          excursion_id?: string | null
          id?: string
          menu_description?: string | null
          per_person_cost?: number
          restaurant_address?: string | null
          restaurant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_arrangements_excursion_id_fkey"
            columns: ["excursion_id"]
            isOneToOne: false
            referencedRelation: "excursions"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category: string
          created_at: string
          description: string | null
          description_en: string | null
          description_ru: string | null
          difficulty_level: string
          duration_weeks: number
          id: string
          image_url: string | null
          instructor: string
          instructor_en: string | null
          instructor_ru: string | null
          is_active: boolean | null
          price: number
          rating: number | null
          students_count: number
          title: string
          title_en: string | null
          title_ru: string | null
          total_lessons: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_ru?: string | null
          difficulty_level: string
          duration_weeks?: number
          id?: string
          image_url?: string | null
          instructor: string
          instructor_en?: string | null
          instructor_ru?: string | null
          is_active?: boolean | null
          price?: number
          rating?: number | null
          students_count?: number
          title: string
          title_en?: string | null
          title_ru?: string | null
          total_lessons?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_ru?: string | null
          difficulty_level?: string
          duration_weeks?: number
          id?: string
          image_url?: string | null
          instructor?: string
          instructor_en?: string | null
          instructor_ru?: string | null
          is_active?: boolean | null
          price?: number
          rating?: number | null
          students_count?: number
          title?: string
          title_en?: string | null
          title_ru?: string | null
          total_lessons?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          group_number: string | null
          id: string
          name: string | null
          organization: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          group_number?: string | null
          id: string
          name?: string | null
          organization?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          group_number?: string | null
          id?: string
          name?: string | null
          organization?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          rating: number
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          rating: number
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          provider_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          provider_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          provider_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          description_en: string | null
          description_ru: string | null
          duration_minutes: number | null
          id: string
          is_free: boolean | null
          module_id: string | null
          order_index: number
          title: string
          title_en: string | null
          title_ru: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_ru?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          module_id?: string | null
          order_index?: number
          title: string
          title_en?: string | null
          title_ru?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_ru?: string | null
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          module_id?: string | null
          order_index?: number
          title?: string
          title_en?: string | null
          title_ru?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      transportation: {
        Row: {
          excursion_id: string | null
          id: string
          is_available: boolean | null
          seats_count: number
          transport_type: string
        }
        Insert: {
          excursion_id?: string | null
          id?: string
          is_available?: boolean | null
          seats_count: number
          transport_type: string
        }
        Update: {
          excursion_id?: string | null
          id?: string
          is_available?: boolean | null
          seats_count?: number
          transport_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transportation_excursion_id_fkey"
            columns: ["excursion_id"]
            isOneToOne: false
            referencedRelation: "excursions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completion_date: string | null
          created_at: string
          id: string
          module_id: string | null
          progress_percentage: number | null
          topic_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string
          id?: string
          module_id?: string | null
          progress_percentage?: number | null
          topic_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string
          id?: string
          module_id?: string | null
          progress_percentage?: number | null
          topic_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "instructor" | "student" | "employer"
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
    Enums: {
      app_role: ["admin", "instructor", "student", "employer"],
    },
  },
} as const
