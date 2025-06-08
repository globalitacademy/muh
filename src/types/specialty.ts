
export interface Specialty {
  id: string;
  name: string;
  name_en?: string;
  name_ru?: string;
  description?: string;
  description_en?: string;
  description_ru?: string;
  icon: string;
  color: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSpecialtyData {
  name: string;
  name_en?: string;
  name_ru?: string;
  description?: string;
  description_en?: string;
  description_ru?: string;
  icon: string;
  color: string;
  order_index: number;
}

export interface UpdateSpecialtyData extends Partial<CreateSpecialtyData> {}
