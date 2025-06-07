
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  name: string | null;
  role: string | null;
  group_number: string | null;
  department: string | null;
  phone: string | null;
  bio: string | null;
  organization: string | null;
  avatar_url: string | null;
}

export const useUserProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      console.log('useUserProfile - Starting query for user:', user?.id);
      
      if (!user) {
        console.log('useUserProfile - No user found, returning null');
        return null;
      }

      console.log('useUserProfile - Fetching profile for user ID:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('useUserProfile - Error fetching user profile:', error);
        throw error;
      }

      console.log('useUserProfile - Raw data from Supabase:', data);

      if (!data) {
        console.log('useUserProfile - No profile found, creating default profile from user metadata');
        
        // Պորձենք ստեղծել պրոֆիլ օգտատերի metadata-ից
        const metadata = user.user_metadata || {};
        console.log('useUserProfile - User metadata:', metadata);

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: metadata.name || null,
            role: metadata.role || 'student',
            group_number: metadata.groupNumber || null,
            department: null,
            phone: null,
            bio: null,
            organization: null,
            avatar_url: null
          })
          .select()
          .single();

        if (insertError) {
          console.error('useUserProfile - Error creating profile:', insertError);
          throw insertError;
        }

        console.log('useUserProfile - Created new profile:', insertedProfile);
        return insertedProfile;
      }

      console.log('useUserProfile - Returning existing profile:', data);
      return data;
    },
    enabled: !!user,
    retry: 1,
  });
};
