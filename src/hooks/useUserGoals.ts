import { useQuery } from '@tanstack/react-query';

// Placeholder hook since user_goals table doesn't exist
interface UserGoal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  target_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useUserGoals = () => {
  return useQuery({
    queryKey: ['user-goals'],
    queryFn: async (): Promise<UserGoal[]> => {
      return [];
    },
    enabled: false,
  });
};

export const useCreateGoal = () => {
  return {
    mutate: async (data: any) => console.log('Create goal:', data),
    isLoading: false,
  };
};

export const useUpdateGoal = () => {
  return {
    mutate: async (data: any) => console.log('Update goal:', data),
    isLoading: false,
  };
};