export interface Module {
  id: string;
  title: string;
  title_en?: string;
  title_ru?: string;
  description?: string;
  description_en?: string;
  description_ru?: string;
  image_url?: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  price: number;
  instructor: string;
  instructor_en?: string;
  instructor_ru?: string;
  category: string;
  total_lessons: number;
  students_count: number;
  rating?: number;
  is_active: boolean;
  order_index?: number;
  specialty_id?: string; // Added missing property
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  module_id: string;
  title: string;
  title_en?: string;
  title_ru?: string;
  description?: string;
  description_en?: string;
  description_ru?: string;
  content?: string;
  video_url?: string;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  exercises?: any; // Added missing property
  quiz_questions?: any; // Added missing property
  resources?: any; // Added missing property
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  module_id: string;
  topic_id: string;
  completed: boolean;
  completion_date?: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  module_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'instructor' | 'student' | 'guest';
  organization?: string;
  avatar_url?: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  course_id?: string;
  amount: number;
  currency: string;
  transaction_type: string;
  payment_method: string;
  payment_status: string;
  idram_transaction_id?: string;
  idram_order_id?: string;
  transaction_date: string;
  description?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  user_name?: string; // Add missing fields for compatibility
  course_title?: string;
}

export interface CoursePricing {
  id: string;
  course_id: string;
  base_price: number;
  currency: string;
  discount_percentage: number;
  final_price: number;
  is_active: boolean;
  valid_from: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
  course_title?: string; // Add missing field for compatibility
}

export interface PaymentSettings {
  id: string;
  provider: string;
  is_active: boolean;
  test_mode: boolean;
  configuration: {
    merchant_id: string;
    secret_key: string;
    callback_url: string;
    success_url: string;
    fail_url: string;
  };
  created_at: string;
  updated_at: string;
}
