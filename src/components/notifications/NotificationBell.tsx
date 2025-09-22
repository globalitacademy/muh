import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeferredQuery } from '@/hooks/useDeferredQuery';
import { supabase } from '@/integrations/supabase/client';
import { NotificationList } from './NotificationList';

// Use deferred loading for notifications to avoid blocking critical path
const useUnreadNotifications = () => {
  return useDeferredQuery(
    ['notifications', 'unread'],
    async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('status', 'unread')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    2000, // Delay notifications loading by 2 seconds
    { staleTime: 60 * 1000 } // Cache for 1 minute
  );
};

export const NotificationBell = () => {
  const { data: unreadNotifications = [] } = useUnreadNotifications();
  const unreadCount = unreadNotifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <NotificationList />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};