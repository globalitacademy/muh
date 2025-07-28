import { useQuery } from '@tanstack/react-query';

// Placeholder hook since notifications table doesn't exist
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => [],
    enabled: false,
  });
};