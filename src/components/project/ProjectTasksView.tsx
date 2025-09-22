import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Users, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, isAfter } from "date-fns";
import { hy } from "date-fns/locale";

interface ProjectTasksViewProps {
  projectId: string;
}

interface ProjectTask {
  id: string;
  project_id: string;
  assigned_by: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  created_at: string;
  updated_at: string;
  assignments?: {
    id: string;
    task_id: string;
    assigned_to: string;
    completed_at?: string;
    submission_notes?: string;
    created_at: string;
    updated_at: string;
    profiles?: {
      name: string;
      avatar_url?: string;
    };
  }[];
}

const StudentTaskCard: React.FC<{ task: ProjectTask; userAssignment?: any }> = ({ task, userAssignment }) => {
  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-green-500/10 text-green-700 border-green-200',
      medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
      high: 'bg-red-500/10 text-red-700 border-red-200'
    };
    
    const labels = {
      low: 'Ցածր',
      medium: 'Միջին', 
      high: 'Բարձր'
    };

    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const getTaskStatusBadge = () => {
    if (userAssignment?.completed_at) {
      return (
        <Badge className="bg-green-500/10 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Կատարված
        </Badge>
      );
    }

    const isOverdue = task.due_date && isAfter(new Date(), new Date(task.due_date));
    
    if (isOverdue) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Ուշացած
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-blue-500/10 text-blue-700">
        <Clock className="w-3 h-3 mr-1" />
        Ակտիվ
      </Badge>
    );
  };

  const completedCount = task.assignments?.filter(a => a.completed_at).length || 0;
  const totalAssignments = task.assignments?.length || 0;

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              {getPriorityBadge(task.priority)}
              {getTaskStatusBadge()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {task.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{completedCount}/{totalAssignments} կատարված</span>
            </div>
            {task.due_date && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(task.due_date), { 
                    addSuffix: true,
                    locale: hy 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {userAssignment?.completed_at && (
          <div className="p-3 bg-green-50 rounded-md">
            <div className="text-sm font-medium text-green-700">
              Կատարվել է՝ {new Date(userAssignment.completed_at).toLocaleString()}
            </div>
            {userAssignment.submission_notes && (
              <div className="text-sm text-green-600 mt-1">
                Նշումներ: {userAssignment.submission_notes}
              </div>
            )}
          </div>
        )}

        {task.assignments && task.assignments.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Նշանակված ուսանողներ:</div>
            <div className="flex flex-wrap gap-2">
              {task.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                    assignment.completed_at 
                      ? 'bg-green-500/10 text-green-700' 
                      : 'bg-gray-500/10 text-gray-700'
                  }`}
                >
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={assignment.profiles?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {assignment.profiles?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{assignment.profiles?.name || 'Անանուն'}</span>
                  {assignment.completed_at && (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ProjectTasksView: React.FC<ProjectTasksViewProps> = ({ projectId }) => {
  const { user } = useAuth();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["project-tasks-view", projectId, user?.id],
    enabled: !!projectId && !!user,
    queryFn: async () => {
      if (!projectId || !user) return [];
      
      // First get the tasks for this project
      const { data: tasks, error: tasksError } = await supabase
        .from("project_tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
        
      if (tasksError) throw tasksError;
      
      if (!tasks || tasks.length === 0) return [];
      
      // Then get assignments with profiles for each task
      const tasksWithAssignments = await Promise.all(
        tasks.map(async (task) => {
          const { data: assignments, error: assignmentsError } = await supabase
            .from("project_task_assignments")
            .select("*")
            .eq("task_id", task.id);
            
          if (assignmentsError) {
            console.error('Error fetching assignments:', assignmentsError);
            return { ...task, assignments: [] };
          }
          
          // Get profiles for each assignment
          const assignmentsWithProfiles = await Promise.all(
            (assignments || []).map(async (assignment) => {
              const { data: profile } = await supabase
                .from("profiles")
                .select("name, avatar_url")
                .eq("id", assignment.assigned_to)
                .single();
                
              return {
                ...assignment,
                profiles: profile || { name: "Անանուն", avatar_url: null }
              };
            })
          );
          
          return { ...task, assignments: assignmentsWithProfiles };
        })
      );
      
      return tasksWithAssignments as ProjectTask[];
    },
  });

  // Filter tasks to show only those assigned to current user or all tasks if user can edit
  const userTasks = tasks.filter(task => 
    task.assignments?.some(assignment => assignment.assigned_to === user?.id)
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Բեռնվում է...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold">Իմ առաջադրանքները</h3>
        <p className="text-sm text-muted-foreground">
          Ձեզ նշանակված առաջադրանքները և դրանց կարգավիճակը
        </p>
      </div>

      {userTasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">Ձեզ առաջադրանքներ չեն նշանակվել</p>
            <p className="text-sm text-muted-foreground mt-1">
              Առաջադրանքները կհայտնվեն այստեղ, երբ նախագծի ղեկավարը դրանք նշանակի
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {userTasks.map((task) => {
            const userAssignment = task.assignments?.find(a => a.assigned_to === user?.id);
            return (
              <StudentTaskCard 
                key={task.id} 
                task={task} 
                userAssignment={userAssignment}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};