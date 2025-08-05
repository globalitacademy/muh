import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { hy } from 'date-fns/locale';
import { 
  Book, 
  GraduationCap, 
  Calendar, 
  MessageSquare, 
  Award, 
  CreditCard, 
  AlertTriangle,
  Briefcase,
  Users,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMarkNotificationRead, type Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'course_enrollment':
      return <Book className="h-4 w-4" />;
    case 'course_completion':
      return <GraduationCap className="h-4 w-4" />;
    case 'assignment_due':
    case 'exam_reminder':
      return <Calendar className="h-4 w-4" />;
    case 'message_received':
      return <MessageSquare className="h-4 w-4" />;
    case 'certificate_issued':
      return <Award className="h-4 w-4" />;
    case 'payment_confirmation':
      return <CreditCard className="h-4 w-4" />;
    case 'instructor_assignment':
      return <Users className="h-4 w-4" />;
    case 'partner_course_update':
      return <Briefcase className="h-4 w-4" />;
    case 'system_alert':
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'destructive';
    case 'high':
      return 'destructive';
    case 'normal':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'secondary';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'course_enrollment':
      return 'Դասընթացի գրանցում';
    case 'course_completion':
      return 'Դասընթացի ավարտ';
    case 'assignment_due':
      return 'Առաջադրանքի ժամկետ';
    case 'exam_reminder':
      return 'Քննության հիշեցում';
    case 'grade_published':
      return 'Գնահատական';
    case 'message_received':
      return 'Նոր հաղորդագրություն';
    case 'announcement':
      return 'Հայտարարություն';
    case 'application_status':
      return 'Դիմում';
    case 'payment_confirmation':
      return 'Վճարման հաստատում';
    case 'certificate_issued':
      return 'Վկայական';
    case 'system_alert':
      return 'Համակարգային ծանուցում';
    case 'instructor_assignment':
      return 'Դասավանդողի նշանակում';
    case 'partner_course_update':
      return 'Գործընկերային դասընթաց';
    default:
      return 'Ծանուցում';
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const markRead = useMarkNotificationRead();
  const isUnread = notification.status === 'unread';

  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnread) {
      markRead.mutate(notification.id);
    }
  };

  const handleItemClick = () => {
    // Mark as read when clicked
    if (isUnread) {
      markRead.mutate(notification.id);
    }
    
    // Navigate to action URL if available
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };

  return (
    <div
      className={cn(
        'p-4 hover:bg-muted/50 cursor-pointer transition-colors',
        isUnread && 'bg-muted/30'
      )}
      onClick={handleItemClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          'p-2 rounded-full',
          notification.priority === 'urgent' || notification.priority === 'high' 
            ? 'bg-destructive/10 text-destructive' 
            : 'bg-primary/10 text-primary'
        )}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={cn(
                'text-sm font-medium leading-tight',
                isUnread && 'font-semibold'
              )}>
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {notification.message}
              </p>
            </div>
            
            {isUnread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkRead}
                className="h-auto p-1 text-primary hover:text-primary"
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant={getPriorityColor(notification.priority)}
                className="text-xs"
              >
                {getTypeLabel(notification.type)}
              </Badge>
              {notification.priority === 'urgent' && (
                <Badge variant="destructive" className="text-xs">
                  Տուժանակի
                </Badge>
              )}
            </div>
            
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: hy,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};