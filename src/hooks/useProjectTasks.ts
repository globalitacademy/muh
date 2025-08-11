import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled' | 'rejected' | 'pending_review';
  due_date?: string;
  assigned_to?: string;
  created_by: string;
  order_index: number;
  files: any[];
  comments: any[];
  created_at: string;
  updated_at: string;
}

export const useProjectTasks = (projectId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["project-tasks", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return (data || []) as ProjectTask[];
    },
  });

  const createTask = useMutation({
    mutationFn: async (task: Omit<ProjectTask, "id" | "created_at" | "updated_at" | "created_by">) => {
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("project_tasks")
        .insert({
          ...task,
          created_by: user.id
        })
        .select("*")
        .single();
      
      if (error) throw error;
      return data as ProjectTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectTask> & { id: string }) => {
      const { data, error } = await supabase
        .from("project_tasks")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
      
      if (error) throw error;
      return data as ProjectTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
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
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });

  return {
    ...query,
    createTask,
    updateTask,
    deleteTask,
  };
};