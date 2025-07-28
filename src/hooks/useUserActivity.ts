import { useQuery } from '@tanstack/react-query';

// Placeholder hook since user_activity table doesn't exist
interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  description: string;
  duration_minutes: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export const useUserActivity = (userId?: string) => {
  return useQuery({
    queryKey: ['user-activity', userId],
    queryFn: async (): Promise<UserActivity[]> => {
      // Return empty data since user_activity table doesn't exist
      return [];
    },
    enabled: false,
  });
};

export const useTopUsersByActivity = () => {
  return useQuery({
    queryKey: ['top-users-by-activity'],
    queryFn: async (): Promise<any[]> => {
      // Return empty data since user_activity table doesn't exist
      return [];
    },
    enabled: false,
  });
};