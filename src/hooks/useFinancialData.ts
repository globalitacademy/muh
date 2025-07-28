import { useQuery } from '@tanstack/react-query';
import { FinancialTransaction, CoursePricing, PaymentSettings } from '@/types/database';

// Placeholder hooks since these tables don't exist in the database schema
export const useFinancialTransactions = () => {
  return useQuery({
    queryKey: ['financial-transactions'],
    queryFn: async (): Promise<FinancialTransaction[]> => {
      // Return empty data since financial_transactions table doesn't exist
      return [];
    },
    enabled: false,
  });
};

export const useFinancialStats = () => {
  return useQuery({
    queryKey: ['financial-stats'],
    queryFn: async () => {
      // Return mock financial stats
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalTransactions: 0,
        pendingPayments: 0,
        completedPayments: 0,
        failedPayments: 0,
        totalStudents: 0,
        averageRevenue: 0,
      };
    },
    enabled: false,
  });
};

export const useCoursePricing = () => {
  return useQuery({
    queryKey: ['course-pricing'],
    queryFn: async (): Promise<CoursePricing[]> => {
      // Return empty data since course_pricing table doesn't exist
      return [];
    },
    enabled: false,
  });
};

export const usePaymentSettings = () => {
  return useQuery({
    queryKey: ['payment-settings'],
    queryFn: async (): Promise<PaymentSettings | null> => {
      // Return null since payment_settings table doesn't exist
      return null;
    },
    enabled: false,
  });
};

export const useRevenueAnalytics = () => {
  return useQuery({
    queryKey: ['revenue-analytics'],
    queryFn: async () => {
      // Return mock revenue analytics
      return {
        dailyRevenue: [],
        monthlyRevenue: [],
        topPayingCourses: [],
        paymentMethodBreakdown: {},
      };
    },
    enabled: false,
  });
};

// Add missing mutation hook
export const useUpdatePaymentSettings = () => {
  return {
    mutate: async (settings: any) => {
      console.log('Update payment settings:', settings);
    },
    mutateAsync: async (settings: any) => {
      console.log('Update payment settings async:', settings);
    },
    isLoading: false,
    isPending: false,
  };
};

// Export the PaymentSettings type for components
export type { PaymentSettings } from '@/types/database';