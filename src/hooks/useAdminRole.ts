
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useAdminRole = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['adminRole', user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return data;
    },
    enabled: !!user,
  });
};
