
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  // Join fields
  user_name?: string;
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
  // Join fields
  course_title?: string;
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

export const useFinancialTransactions = () => {
  return useQuery({
    queryKey: ['financial-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          profiles!financial_transactions_user_id_fkey(name),
          modules!financial_transactions_course_id_fkey(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(transaction => ({
        ...transaction,
        user_name: transaction.profiles?.name || 'Unknown User',
        course_title: transaction.modules?.title || 'Unknown Course'
      })) as FinancialTransaction[];
    },
  });
};

export const useCoursePricing = () => {
  return useQuery({
    queryKey: ['course-pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_pricing')
        .select(`
          *,
          modules!course_pricing_course_id_fkey(title)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(pricing => ({
        ...pricing,
        course_title: pricing.modules?.title || 'Unknown Course'
      })) as CoursePricing[];
    },
  });
};

export const usePaymentSettings = () => {
  return useQuery({
    queryKey: ['payment-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data as PaymentSettings;
    },
  });
};

export const useFinancialStats = () => {
  return useQuery({
    queryKey: ['financial-stats'],
    queryFn: async () => {
      // Get total revenue
      const { data: totalRevenueData, error: totalError } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('payment_status', 'completed')
        .eq('transaction_type', 'payment');

      if (totalError) throw totalError;

      const totalRevenue = totalRevenueData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

      // Get monthly revenue
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: monthlyRevenueData, error: monthlyError } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('payment_status', 'completed')
        .eq('transaction_type', 'payment')
        .gte('transaction_date', `${currentMonth}-01`)
        .lt('transaction_date', `${currentMonth}-32`);

      if (monthlyError) throw monthlyError;

      const monthlyRevenue = monthlyRevenueData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

      // Get pending payments
      const { data: pendingData, error: pendingError } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('payment_status', 'pending')
        .eq('transaction_type', 'payment');

      if (pendingError) throw pendingError;

      const pendingPayments = pendingData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

      // Get student count
      const { data: studentsData, error: studentsError } = await supabase
        .from('financial_transactions')
        .select('user_id')
        .eq('payment_status', 'completed')
        .eq('transaction_type', 'payment');

      if (studentsError) throw studentsError;

      const uniqueStudents = new Set(studentsData?.map(t => t.user_id)).size;

      const averageRevenue = uniqueStudents > 0 ? totalRevenue / uniqueStudents : 0;

      return {
        totalRevenue,
        monthlyRevenue,
        pendingPayments,
        totalStudents: uniqueStudents,
        averageRevenue
      };
    },
  });
};

export const useUpdatePaymentSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: Partial<PaymentSettings>) => {
      const { data, error } = await supabase
        .from('payment_settings')
        .update(settings)
        .eq('provider', 'idram')
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-settings'] });
      toast({
        title: "Հաջողություն",
        description: "Վճարային կարգավորումները թարմացվել են",
      });
    },
    onError: (error) => {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց թարմացնել կարգավորումները",
        variant: "destructive",
      });
    },
  });
};

export const useCreateCoursePricing = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (pricing: Omit<CoursePricing, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('course_pricing')
        .insert(pricing)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-pricing'] });
      toast({
        title: "Հաջողություն",
        description: "Նոր գնային քաղաքականություն ստեղծվել է",
      });
    },
    onError: (error) => {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ստեղծել գնային քաղաքականություն",
        variant: "destructive",
      });
    },
  });
};
