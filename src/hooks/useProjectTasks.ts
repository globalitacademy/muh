import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProjectTask {
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
  assignments?: ProjectTaskAssignment[];
}

export interface ProjectTaskAssignment {
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
}

export interface CreateTaskData {
  project_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  assigned_to: string[];
}

export const useProjectTasks = (projectId?: string) => {
  const client = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["project-tasks", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      if (!projectId) return [];
      
      // First get the tasks
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

  const createTask = useMutation({
    mutationFn: async (taskData: CreateTaskData) => {
      if (!user) throw new Error("Not authenticated");
      
      // Create the task
      const { data: task, error: taskError } = await supabase
        .from("project_tasks")
        .insert({
          project_id: taskData.project_id,
          assigned_by: user.id,
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.due_date,
          priority: taskData.priority || 'medium',
        })
        .select("*")
        .single();
        
      if (taskError) throw taskError;
      
      // Create assignments for each selected user
      if (taskData.assigned_to.length > 0) {
        const assignments = taskData.assigned_to.map(userId => ({
          task_id: task.id,
          assigned_to: userId,
        }));
        
        const { error: assignmentError } = await supabase
          .from("project_task_assignments")
          .insert(assignments);
          
        if (assignmentError) throw assignmentError;
      }
      
      return task;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const { data, error } = await supabase
        .from("project_tasks")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", taskId)
        .select("*")
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });

  const completeAssignment = useMutation({
    mutationFn: async ({ assignmentId, submissionNotes }: { assignmentId: string; submissionNotes?: string }) => {
      const { data, error } = await supabase
        .from("project_task_assignments")
        .update({ 
          completed_at: new Date().toISOString(),
          submission_notes: submissionNotes,
          updated_at: new Date().toISOString()
        })
        .eq("id", assignmentId)
        .select("*")
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("project_tasks")
        .delete()
        .eq("id", taskId);
        
      if (error) throw error;
      return taskId;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });

  return { 
    ...query, 
    createTask, 
    updateTaskStatus, 
    completeAssignment,
    deleteTask 
  };
};

export const useUserAssignedTasks = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-assigned-tasks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("project_task_assignments")
        .select(`
          *,
          project_tasks(
            *,
            projects(title, creator_id)
          )
        `)
        .eq("assigned_to", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
  });
};