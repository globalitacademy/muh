import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CommunicationStats {
  totalAnnouncements: number;
  activeAnnouncements: number;
  draftAnnouncements: number;
  publishedAnnouncements: number;
}

export const useCommunicationStats = () => {
  return useQuery({
    queryKey: ['communication-stats'],
    queryFn: async (): Promise<CommunicationStats> => {
      // Get total announcements count
      const { count: totalAnnouncements } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true });

      // Get active announcements count
      const { count: activeAnnouncements } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Get draft announcements count
      const { count: draftAnnouncements } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      // Get published announcements count (same as active)
      const { count: publishedAnnouncements } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      return {
        totalAnnouncements: totalAnnouncements || 0,
        activeAnnouncements: activeAnnouncements || 0,
        draftAnnouncements: draftAnnouncements || 0,
        publishedAnnouncements: publishedAnnouncements || 0,
      };
    },
  });
};