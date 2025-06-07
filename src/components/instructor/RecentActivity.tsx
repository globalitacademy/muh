
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, UserPlus, BookOpen, MessageSquare, Award } from 'lucide-react';
import { StudentProgress } from '@/hooks/useInstructorDashboard';

interface RecentActivityProps {
  recentActivity: StudentProgress[];
  isLoading: boolean;
}

const RecentActivity = ({ recentActivity, isLoading }: RecentActivityProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-armenian">Վերջին գործողություններ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate mock activities based on student data
  const activities = [
    ...recentActivity.slice(0, 3).map(student => ({
      id: `enrollment-${student.id}`,
      type: 'enrollment',
      user: student.name,
      course: student.courseName,
      time: student.enrolledDate,
      icon: UserPlus,
      color: 'text-green-600',
      bg: 'bg-green-100'
    })),
    {
      id: 'message-1',
      type: 'message',
      user: 'Անի Առաքելյան',
      course: 'JavaScript հիմունքներ',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      id: 'completion-1',
      type: 'completion',
      user: 'Դավիթ Գրիգորյան',
      course: 'React զարգացում',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      icon: Award,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    }
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'enrollment':
        return `գրանցվել է "${activity.course}" դասընթացում`;
      case 'message':
        return `հաղորդագրություն է ուղարկել "${activity.course}" դասընթացի վերաբերյալ`;
      case 'completion':
        return `ավարտել է "${activity.course}" դասընթացը`;
      default:
        return 'գործողություն';
    }
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes} րոպե առաջ`;
    if (hours < 24) return `${hours} ժամ առաջ`;
    return `${days} օր առաջ`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-armenian">Վերջին գործողություններ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`p-2 rounded-full ${activity.bg}`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium font-armenian">{activity.user}</span>
                  <Badge variant="outline" className="text-xs">
                    {activity.type === 'enrollment' ? 'Գրանցում' : 
                     activity.type === 'message' ? 'Հաղորդագրություն' : 
                     activity.type === 'completion' ? 'Ավարտում' : ''}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-armenian">
                  {getActivityText(activity)}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{getRelativeTime(activity.time)}</span>
                </div>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-armenian">Վերջին գործողություններ չկան</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
