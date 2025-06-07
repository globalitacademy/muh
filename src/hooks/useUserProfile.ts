
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  birth_date: string | null;
  address: string | null;
  language_preference: 'hy' | 'ru' | 'en' | null;
  status: 'active' | 'graduated' | 'suspended' | null;
  field_of_study: string | null;
  personal_website: string | null;
  linkedin_url: string | null;
  is_visible_to_employers: boolean | null;
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
            avatar_url: null,
            birth_date: null,
            address: null,
            language_preference: 'hy',
            status: 'active',
            field_of_study: null,
            personal_website: null,
            linkedin_url: null,
            is_visible_to_employers: false
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

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!user) throw new Error('No user found');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};
