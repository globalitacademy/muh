import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { hy } from 'date-fns/locale';
import { Bell, Check, CheckCheck, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  useNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead,
  type Notification 
} from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

export const NotificationList = () => {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadNotifications = notifications.filter(n => n.status === 'unread');
  const hasUnread = unreadNotifications.length > 0;

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Բեռնվում է...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-armenian">
          Ծանուցումներ չկան
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold font-armenian">Ծանուցումներ</h3>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markAllRead.isPending}
              className="text-sm"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Բոլորը կարդացված
            </Button>
          )}
        </div>
        {hasUnread && (
          <p className="text-sm text-muted-foreground mt-1">
            {unreadNotifications.length} նոր ծանուցում
          </p>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="max-h-96">
        <div className="divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};