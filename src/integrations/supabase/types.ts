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
      admin_audit_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          audience: string
          content: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          priority: string
          published_at: string | null
          scheduled_at: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          audience?: string
          content: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          priority?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          audience?: string
          content?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          priority?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificate_templates: {
        Row: {
          created_at: string
          design_config: Json | null
          id: string
          is_active: boolean | null
          name: string
          template_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          design_config?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          template_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          design_config?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_data: Json | null
          created_at: string
          id: string
          issued_at: string
          module_id: string | null
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certificate_data?: Json | null
          created_at?: string
          id?: string
          issued_at?: string
          module_id?: string | null
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certificate_data?: Json | null
          created_at?: string
          id?: string
          issued_at?: string
          module_id?: string | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_certificates_module_id"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_certificates_template_id"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "certificate_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_certificates_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          content: string | null
          created_at: string
          email_type: string
          error_message: string | null
          id: string
          sent_at: string | null
          status: string
          subject: string | null
          updated_at: string
          user_email: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          email_type: string
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_email: string
        }
        Update: {
          content?: string | null
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_email?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          created_at: string
          enrolled_at: string
          id: string
          module_id: string
          progress_percentage: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          enrolled_at?: string
          id?: string
          module_id: string
          progress_percentage?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          enrolled_at?: string
          id?: string
          module_id?: string
          progress_percentage?: number
          updated_at?: string
          user_id?: string
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
      exam_registrations: {
        Row: {
          completed_at: string | null
          created_at: string
          exam_id: string
          id: string
          registered_at: string
          score: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          exam_id: string
          id?: string
          registered_at?: string
          score?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          exam_id?: string
          id?: string
          registered_at?: string
          score?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_registrations_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          exam_date: string | null
          id: string
          is_active: boolean
          max_score: number
          module_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          exam_date?: string | null
          id?: string
          is_active?: boolean
          max_score?: number
          module_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          exam_date?: string | null
          id?: string
          is_active?: boolean
          max_score?: number
          module_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
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
      instructor_groups: {
        Row: {
          created_at: string
          group_number: string
          id: string
          instructor_id: string
        }
        Insert: {
          created_at?: string
          group_number: string
          id?: string
          instructor_id: string
        }
        Update: {
          created_at?: string
          group_number?: string
          id?: string
          instructor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_instructor_groups_instructor_id"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applicant_id: string
          applied_at: string
          cover_letter: string | null
          created_at: string
          id: string
          job_posting_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          applicant_id: string
          applied_at?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_posting_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          applicant_id?: string
          applied_at?: string
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_posting_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          created_at: string
          description: string | null
          employer_id: string
          expires_at: string | null
          id: string
          is_active: boolean
          is_remote: boolean
          location: string | null
          posting_type: Database["public"]["Enums"]["job_posting_type"]
          requirements: string | null
          salary_range: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employer_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_remote?: boolean
          location?: string | null
          posting_type?: Database["public"]["Enums"]["job_posting_type"]
          requirements?: string | null
          salary_range?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employer_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_remote?: boolean
          location?: string | null
          posting_type?: Database["public"]["Enums"]["job_posting_type"]
          requirements?: string | null
          salary_range?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      module_instructors: {
        Row: {
          created_at: string
          group_number: string | null
          id: string
          instructor_id: string
          is_primary: boolean | null
          module_id: string
        }
        Insert: {
          created_at?: string
          group_number?: string | null
          id?: string
          instructor_id: string
          is_primary?: boolean | null
          module_id: string
        }
        Update: {
          created_at?: string
          group_number?: string | null
          id?: string
          instructor_id?: string
          is_primary?: boolean | null
          module_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_module_instructors_instructor_id"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_module_instructors_module_id"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
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
          difficulty_level: Database["public"]["Enums"]["difficulty_level"]
          duration_weeks: number
          icon: string | null
          id: string
          image_url: string | null
          instructor: string
          instructor_en: string | null
          instructor_ru: string | null
          is_active: boolean
          order_index: number | null
          price: number
          rating: number | null
          specialty_id: string | null
          status: Database["public"]["Enums"]["module_status"]
          students_count: number
          title: string
          title_en: string | null
          title_ru: string | null
          total_lessons: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_ru?: string | null
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"]
          duration_weeks?: number
          icon?: string | null
          id?: string
          image_url?: string | null
          instructor: string
          instructor_en?: string | null
          instructor_ru?: string | null
          is_active?: boolean
          order_index?: number | null
          price?: number
          rating?: number | null
          specialty_id?: string | null
          status?: Database["public"]["Enums"]["module_status"]
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
          difficulty_level?: Database["public"]["Enums"]["difficulty_level"]
          duration_weeks?: number
          icon?: string | null
          id?: string
          image_url?: string | null
          instructor?: string
          instructor_en?: string | null
          instructor_ru?: string | null
          is_active?: boolean
          order_index?: number | null
          price?: number
          rating?: number | null
          specialty_id?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          students_count?: number
          title?: string
          title_en?: string | null
          title_ru?: string | null
          total_lessons?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_enabled: boolean
          frequency: string
          id: string
          push_enabled: boolean
          quiet_hours_enabled: boolean
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          sms_enabled: boolean
          types_config: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_enabled?: boolean
          frequency?: string
          id?: string
          push_enabled?: boolean
          quiet_hours_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean
          types_config?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_enabled?: boolean
          frequency?: string
          id?: string
          push_enabled?: boolean
          quiet_hours_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean
          types_config?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: Database["public"]["Enums"]["notification_priority"]
          read_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_access_code_usage: {
        Row: {
          access_code_id: string
          id: string
          ip_address: string | null
          metadata: Json | null
          module_id: string | null
          session_duration_minutes: number | null
          session_ended_at: string | null
          session_started_at: string | null
          used_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_code_id: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module_id?: string | null
          session_duration_minutes?: number | null
          session_ended_at?: string | null
          session_started_at?: string | null
          used_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_code_id?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module_id?: string | null
          session_duration_minutes?: number | null
          session_ended_at?: string | null
          session_started_at?: string | null
          used_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_access_code_usage_access_code_id_fkey"
            columns: ["access_code_id"]
            isOneToOne: false
            referencedRelation: "partner_access_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_access_codes: {
        Row: {
          activity_duration_minutes: number
          code: string
          created_at: string
          current_uses: number
          description: string | null
          expires_at: string
          id: string
          is_active: boolean
          max_uses: number
          metadata: Json | null
          module_id: string | null
          name: string
          partner_id: string
          status: Database["public"]["Enums"]["access_code_status"]
          updated_at: string
        }
        Insert: {
          activity_duration_minutes?: number
          code: string
          created_at?: string
          current_uses?: number
          description?: string | null
          expires_at: string
          id?: string
          is_active?: boolean
          max_uses?: number
          metadata?: Json | null
          module_id?: string | null
          name: string
          partner_id: string
          status?: Database["public"]["Enums"]["access_code_status"]
          updated_at?: string
        }
        Update: {
          activity_duration_minutes?: number
          code?: string
          created_at?: string
          current_uses?: number
          description?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean
          max_uses?: number
          metadata?: Json | null
          module_id?: string | null
          name?: string
          partner_id?: string
          status?: Database["public"]["Enums"]["access_code_status"]
          updated_at?: string
        }
        Relationships: []
      }
      partner_course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          created_at: string
          enrolled_at: string | null
          enrollment_status: string | null
          id: string
          notes: string | null
          partner_id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string
          enrolled_at?: string | null
          enrollment_status?: string | null
          id?: string
          notes?: string | null
          partner_id: string
          student_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string
          enrolled_at?: string | null
          enrollment_status?: string | null
          id?: string
          notes?: string | null
          partner_id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "partner_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_courses: {
        Row: {
          application_deadline: string | null
          course_type: string | null
          created_at: string
          current_students: number | null
          curriculum: Json | null
          description: string | null
          description_en: string | null
          description_ru: string | null
          duration_weeks: number | null
          end_date: string | null
          id: string
          image_url: string | null
          institution_id: string | null
          is_active: boolean | null
          max_students: number | null
          partner_id: string
          price: number | null
          requirements: string | null
          start_date: string | null
          status: string | null
          title: string
          title_en: string | null
          title_ru: string | null
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          course_type?: string | null
          created_at?: string
          current_students?: number | null
          curriculum?: Json | null
          description?: string | null
          description_en?: string | null
          description_ru?: string | null
          duration_weeks?: number | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          institution_id?: string | null
          is_active?: boolean | null
          max_students?: number | null
          partner_id: string
          price?: number | null
          requirements?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          title_en?: string | null
          title_ru?: string | null
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          course_type?: string | null
          created_at?: string
          current_students?: number | null
          curriculum?: Json | null
          description?: string | null
          description_en?: string | null
          description_ru?: string | null
          duration_weeks?: number | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          institution_id?: string | null
          is_active?: boolean | null
          max_students?: number | null
          partner_id?: string
          price?: number | null
          requirements?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          title_en?: string | null
          title_ru?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_courses_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "partner_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_institutions: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          institution_name: string
          institution_type: string | null
          is_active: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          partner_id: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          institution_name: string
          institution_type?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          partner_id: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          institution_name?: string
          institution_type?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          partner_id?: string
          updated_at?: string
          website_url?: string | null
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
          address: string | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          cover_photo_url: string | null
          created_at: string | null
          department: string | null
          email_verified: boolean | null
          field_of_study: string | null
          first_name: string | null
          group_number: string | null
          id: string
          is_visible_to_employers: boolean | null
          language_preference: string | null
          last_name: string | null
          linkedin_url: string | null
          name: string
          organization: string | null
          personal_website: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          department?: string | null
          email_verified?: boolean | null
          field_of_study?: string | null
          first_name?: string | null
          group_number?: string | null
          id: string
          is_visible_to_employers?: boolean | null
          language_preference?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          name: string
          organization?: string | null
          personal_website?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          department?: string | null
          email_verified?: boolean | null
          field_of_study?: string | null
          first_name?: string | null
          group_number?: string | null
          id?: string
          is_visible_to_employers?: boolean | null
          language_preference?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          name?: string
          organization?: string | null
          personal_website?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      project_discussions: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          parent_id: string | null
          project_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          project_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          project_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_evaluations: {
        Row: {
          comments: string | null
          created_at: string
          evaluator_id: string
          id: string
          project_id: string
          rubric: Json
          score: number
          subject_team: string | null
          subject_user_id: string | null
          updated_at: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          evaluator_id: string
          id?: string
          project_id: string
          rubric?: Json
          score: number
          subject_team?: string | null
          subject_user_id?: string | null
          updated_at?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          evaluator_id?: string
          id?: string
          project_id?: string
          rubric?: Json
          score?: number
          subject_team?: string | null
          subject_user_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          created_at: string
          file_path: string
          id: string
          is_public: boolean
          mime_type: string | null
          name: string
          project_id: string
          size: number | null
          uploader_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          is_public?: boolean
          mime_type?: string | null
          name: string
          project_id: string
          size?: number | null
          uploader_id: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          is_public?: boolean
          mime_type?: string | null
          name?: string
          project_id?: string
          size?: number | null
          uploader_id?: string
        }
        Relationships: []
      }
      project_members: {
        Row: {
          added_at: string
          id: string
          project_id: string
          role: Database["public"]["Enums"]["project_member_role"]
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          project_id: string
          role?: Database["public"]["Enums"]["project_member_role"]
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["project_member_role"]
          user_id?: string
        }
        Relationships: []
      }
      project_steps: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          order_index: number
          project_id: string
          status: Database["public"]["Enums"]["project_step_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          order_index?: number
          project_id: string
          status?: Database["public"]["Enums"]["project_step_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          order_index?: number
          project_id?: string
          status?: Database["public"]["Enums"]["project_step_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_timeline_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          metadata: Json
          project_id: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          metadata?: Json
          project_id: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          metadata?: Json
          project_id?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          creator_id: string
          creator_role: Database["public"]["Enums"]["user_role"]
          description: string | null
          end_date: string | null
          id: string
          is_public: boolean
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          creator_role: Database["public"]["Enums"]["user_role"]
          description?: string | null
          end_date?: string | null
          id?: string
          is_public?: boolean
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          creator_role?: Database["public"]["Enums"]["user_role"]
          description?: string | null
          end_date?: string | null
          id?: string
          is_public?: boolean
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
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
      specialties: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          description_en: string | null
          description_ru: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          name_en: string | null
          name_ru: string | null
          order_index: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_ru?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          name_en?: string | null
          name_ru?: string | null
          order_index?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_ru?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          name_en?: string | null
          name_ru?: string | null
          order_index?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
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
      topics: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          description_en: string | null
          description_ru: string | null
          duration_minutes: number
          exercises: Json | null
          id: string
          is_free: boolean
          module_id: string
          order_index: number
          quiz_questions: Json | null
          resources: Json | null
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
          duration_minutes?: number
          exercises?: Json | null
          id?: string
          is_free?: boolean
          module_id: string
          order_index?: number
          quiz_questions?: Json | null
          resources?: Json | null
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
          duration_minutes?: number
          exercises?: Json | null
          id?: string
          is_free?: boolean
          module_id?: string
          order_index?: number
          quiz_questions?: Json | null
          resources?: Json | null
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
      user_applications: {
        Row: {
          application_type: string
          created_at: string
          department: string | null
          email: string
          group_number: string | null
          id: string
          name: string
          organization: string | null
          phone: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role: string
          status: string
          submitted_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          application_type?: string
          created_at?: string
          department?: string | null
          email: string
          group_number?: string | null
          id?: string
          name: string
          organization?: string | null
          phone?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role: string
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          application_type?: string
          created_at?: string
          department?: string | null
          email?: string
          group_number?: string | null
          id?: string
          name?: string
          organization?: string | null
          phone?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role?: string
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean
          completion_date: string | null
          created_at: string
          id: string
          module_id: string
          progress_percentage: number
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completion_date?: string | null
          created_at?: string
          id?: string
          module_id: string
          progress_percentage?: number
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completion_date?: string | null
          created_at?: string
          id?: string
          module_id?: string
          progress_percentage?: number
          topic_id?: string
          updated_at?: string
          user_id?: string
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
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
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
      approve_user_application: {
        Args: { application_id: string; admin_id: string }
        Returns: undefined
      }
      check_access_code_status: {
        Args: { p_code: string }
        Returns: Json
      }
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
      create_notification: {
        Args: {
          p_user_id: string
          p_type: Database["public"]["Enums"]["notification_type"]
          p_title: string
          p_message: string
          p_priority?: Database["public"]["Enums"]["notification_priority"]
          p_action_url?: string
          p_metadata?: Json
        }
        Returns: string
      }
      generate_access_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin_or_instructor: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_project_member: {
        Args: { p_project_id: string; p_user_id: string }
        Returns: boolean
      }
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      mark_notification_read: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      use_access_code: {
        Args: { p_code: string; p_user_id?: string; p_module_id?: string }
        Returns: Json
      }
    }
    Enums: {
      access_code_status: "active" | "inactive" | "expired" | "exhausted"
      application_status: "pending" | "reviewed" | "accepted" | "rejected"
      attempt_status: "in-progress" | "completed" | "abandoned"
      difficulty_level:
        | "easy"
        | "medium"
        | "hard"
        | "beginner"
        | "intermediate"
        | "advanced"
      job_posting_type: "job" | "internship" | "project"
      module_status: "draft" | "active" | "archived" | "coming_soon"
      notification_priority: "low" | "normal" | "high" | "urgent"
      notification_status: "unread" | "read" | "archived"
      notification_type:
        | "course_enrollment"
        | "course_completion"
        | "assignment_due"
        | "exam_reminder"
        | "grade_published"
        | "message_received"
        | "announcement"
        | "application_status"
        | "payment_confirmation"
        | "certificate_issued"
        | "system_alert"
        | "instructor_assignment"
        | "partner_course_update"
      project_member_role: "participant" | "mentor"
      project_step_status: "todo" | "in_progress" | "done" | "blocked"
      question_type:
        | "multiple-choice"
        | "true-false"
        | "text-input"
        | "programming"
      test_language: "hy" | "ru" | "en"
      test_status: "draft" | "published" | "archived"
      user_role:
        | "instructor"
        | "organization"
        | "admin"
        | "student"
        | "guest"
        | "employer"
        | "partner"
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
      access_code_status: ["active", "inactive", "expired", "exhausted"],
      application_status: ["pending", "reviewed", "accepted", "rejected"],
      attempt_status: ["in-progress", "completed", "abandoned"],
      difficulty_level: [
        "easy",
        "medium",
        "hard",
        "beginner",
        "intermediate",
        "advanced",
      ],
      job_posting_type: ["job", "internship", "project"],
      module_status: ["draft", "active", "archived", "coming_soon"],
      notification_priority: ["low", "normal", "high", "urgent"],
      notification_status: ["unread", "read", "archived"],
      notification_type: [
        "course_enrollment",
        "course_completion",
        "assignment_due",
        "exam_reminder",
        "grade_published",
        "message_received",
        "announcement",
        "application_status",
        "payment_confirmation",
        "certificate_issued",
        "system_alert",
        "instructor_assignment",
        "partner_course_update",
      ],
      project_member_role: ["participant", "mentor"],
      project_step_status: ["todo", "in_progress", "done", "blocked"],
      question_type: [
        "multiple-choice",
        "true-false",
        "text-input",
        "programming",
      ],
      test_language: ["hy", "ru", "en"],
      test_status: ["draft", "published", "archived"],
      user_role: [
        "instructor",
        "organization",
        "admin",
        "student",
        "guest",
        "employer",
        "partner",
      ],
    },
  },
} as const
