import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface UnifiedProjectTask {
  id: string;
  project_id: string;
  assigned_by: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'submitted' | 'approved' | 'returned';
  order_index: number;
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  submission_notes?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
  assignments?: UnifiedTaskAssignment[];
}

export interface UnifiedTaskAssignment {
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

export interface CreateUnifiedTaskData {
  project_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  order_index?: number;
  assigned_to: string[];
}

export interface SubmitTaskData {
  taskId: string;
  submissionNotes?: string;
}

export interface ReviewTaskData {
  taskId: string;
  status: 'approved' | 'returned';
  reviewNotes?: string;
}

export const useUnifiedProjectTasks = (projectId?: string) => {
  const client = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["unified-project-tasks", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      if (!projectId) return [];
      
      // Get tasks ordered by order_index, then by created_at
      const { data: tasks, error: tasksError } = await supabase
        .from("project_tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });
        
      if (tasksError) throw tasksError;
      
      if (!tasks || tasks.length === 0) return [];
      
      // Get assignments with profiles for each task
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
      
      return tasksWithAssignments as UnifiedProjectTask[];
    },
  });

  const createTask = useMutation({
    mutationFn: async (taskData: CreateUnifiedTaskData) => {
      if (!user) throw new Error("Not authenticated");
      
      // Get max order_index for this project
      const { data: maxOrder } = await supabase
        .from("project_tasks")
        .select("order_index")
        .eq("project_id", taskData.project_id)
        .order("order_index", { ascending: false })
        .limit(1)
        .single();
      
      const nextOrderIndex = taskData.order_index ?? ((maxOrder?.order_index || 0) + 1);
      
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
          order_index: nextOrderIndex,
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
      client.invalidateQueries({ queryKey: ["unified-project-tasks", projectId] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, title, description, due_date, priority, order_index, assigned_to }: { 
      id: string; 
      title: string; 
      description?: string; 
      due_date?: string; 
      priority: 'low' | 'medium' | 'high';
      order_index?: number;
      assigned_to: string[];
    }) => {
      // Update the task
      const updateData: any = {
        title,
        description,
        due_date,
        priority,
        updated_at: new Date().toISOString()
      };
      
      if (order_index !== undefined) {
        updateData.order_index = order_index;
      }
      
      const { data: task, error: taskError } = await supabase
        .from("project_tasks")
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single();
        
      if (taskError) throw taskError;
      
      // Delete existing assignments
      const { error: deleteError } = await supabase
        .from("project_task_assignments")
        .delete()
        .eq("task_id", id);
        
      if (deleteError) throw deleteError;
      
      // Create new assignments
      if (assigned_to.length > 0) {
        const assignments = assigned_to.map(userId => ({
          task_id: id,
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
      client.invalidateQueries({ queryKey: ["unified-project-tasks", projectId] });
    },
  });

  const submitTask = useMutation({
    mutationFn: async ({ taskId, submissionNotes }: SubmitTaskData) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data: task, error } = await supabase
        .from("project_tasks")
        .update({ 
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          submission_notes: submissionNotes,
          updated_at: new Date().toISOString()
        })
        .eq("id", taskId)
        .select("*")
        .single();
        
      if (error) throw error;
      return task;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["unified-project-tasks", projectId] });
      client.invalidateQueries({ queryKey: ["user-assigned-tasks"] });
    },
  });

  const reviewTask = useMutation({
    mutationFn: async ({ taskId, status, reviewNotes }: ReviewTaskData) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data: task, error } = await supabase
        .from("project_tasks")
        .update({ 
          status: status === 'approved' ? 'completed' : 'returned',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          review_notes: reviewNotes,
          updated_at: new Date().toISOString()
        })
        .eq("id", taskId)
        .select("*")
        .single();
        
      if (error) throw error;
      return task;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["unified-project-tasks", projectId] });
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
      client.invalidateQueries({ queryKey: ["unified-project-tasks", projectId] });
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
      client.invalidateQueries({ queryKey: ["unified-project-tasks", projectId] });
    },
  });

  return { 
    ...query, 
    createTask, 
    updateTask,
    submitTask,
    reviewTask,
    updateTaskStatus, 
    deleteTask 
  };
};

export const useUserUnifiedTasks = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-unified-tasks", user?.id],
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