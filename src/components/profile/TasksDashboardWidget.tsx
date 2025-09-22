import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Clock, CheckCircle, AlertTriangle, ArrowRight, Calendar } from 'lucide-react';
import { useUserAssignedTasks } from '@/hooks/useProjectTasks';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { hy } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export const TasksDashboardWidget: React.FC = () => {
  const { data: assignedTasks = [], isLoading } = useUserAssignedTasks();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Իմ առաջադրանքները
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  const pendingTasks = assignedTasks.filter(task => !task.completed_at);
  const completedTasks = assignedTasks.filter(task => task.completed_at);
  const overdueTasks = pendingTasks.filter(task => {
    const taskData = task.project_tasks;
    return taskData?.due_date && isAfter(new Date(), new Date(taskData.due_date));
  });

  const upcomingTasks = pendingTasks
    .filter(task => {
      const taskData = task.project_tasks;
      return taskData?.due_date && !isAfter(new Date(), new Date(taskData.due_date));
    })
    .sort((a, b) => {
      const dateA = new Date(a.project_tasks?.due_date || 0);
      const dateB = new Date(b.project_tasks?.due_date || 0);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Իմ առաջադրանքները
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard?tab=tasks')}
            className="text-sm"
          >
            Տեսնել բոլորը
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{pendingTasks.length}</div>
            <div className="text-xs text-muted-foreground">Ընթացիկ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
            <div className="text-xs text-muted-foreground">Ուշացած</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-xs text-muted-foreground">Կատարված</div>
          </div>
        </div>

        {/* Urgent/Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm font-medium text-red-600">
              <AlertTriangle className="w-4 h-4" />
              Ուշացած առաջադրանքներ
            </div>
            {overdueTasks.slice(0, 2).map((task) => {
              const taskData = task.project_tasks;
              const project = taskData?.projects;
              
              return (
                <div key={task.id} className="p-2 bg-red-50 border border-red-200 rounded-md">
                  <div className="text-sm font-medium text-red-900">{taskData?.title}</div>
                  <div className="text-xs text-red-700">
                    {project?.title} • Ժամկետ՝ {taskData?.due_date && formatDistanceToNow(new Date(taskData.due_date), { addSuffix: true, locale: hy })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && overdueTasks.length === 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
              <Clock className="w-4 h-4" />
              Մոտակա ժամկետով առաջադրանքներ
            </div>
            {upcomingTasks.map((task) => {
              const taskData = task.project_tasks;
              const project = taskData?.projects;
              
              return (
                <div key={task.id} className="p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-900">{taskData?.title}</div>
                      <div className="text-xs text-blue-700">{project?.title}</div>
                    </div>
                    {taskData?.priority && (
                      <Badge 
                        className={`text-xs ${
                          taskData.priority === 'high' 
                            ? 'bg-red-500/10 text-red-700' 
                            : taskData.priority === 'medium' 
                              ? 'bg-yellow-500/10 text-yellow-700' 
                              : 'bg-green-500/10 text-green-700'
                        }`}
                      >
                        {taskData.priority === 'high' ? 'Բարձր' : taskData.priority === 'medium' ? 'Միջին' : 'Ցածր'}
                      </Badge>
                    )}
                  </div>
                  {taskData?.due_date && (
                    <div className="text-xs text-blue-600 mt-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {formatDistanceToNow(new Date(taskData.due_date), { addSuffix: true, locale: hy })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* No tasks state */}
        {assignedTasks.length === 0 && (
          <div className="text-center py-4">
            <ClipboardList className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Առաջադրանքներ դեռ չեն նշանակվել</p>
          </div>
        )}

        {/* All completed state */}
        {assignedTasks.length > 0 && pendingTasks.length === 0 && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium text-green-700">Բոլոր առաջադրանքները կատարված են!</p>
            <p className="text-xs text-muted-foreground">Շնորհավորանքներ՝ լավ աշխատանքի համար</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};