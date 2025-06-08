
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CommunicationStats {
  totalMessages: number;
  unreadMessages: number;
  sentNotifications: number;
  activeAnnouncements: number;
}

export const useCommunicationStats = () => {
  return useQuery({
    queryKey: ['communication-stats'],
    queryFn: async (): Promise<CommunicationStats> => {
      const user = (await supabase.auth.getUser()).data.user;
      
      // Get total messages count
      const { count: totalMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      // Get unread messages count for current user
      const { count: unreadMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user?.id)
        .eq('is_read', false);

      // Get sent notifications count (this month)
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const { count: sentNotifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonth.toISOString());

      // Get active announcements count
      const { count: activeAnnouncements } = await supabase
        .from('announcements' as any)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      return {
        totalMessages: totalMessages || 0,
        unreadMessages: unreadMessages || 0,
        sentNotifications: sentNotifications || 0,
        activeAnnouncements: activeAnnouncements || 0,
      };
    },
  });
};
