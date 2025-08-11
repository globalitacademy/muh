import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled' | 'rejected' | 'pending_review';
  priority: 'low' | 'medium' | 'high';
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
      // Return empty array for now until table is created
      return [] as ProjectTask[];
    },
  });

  const createTask = useMutation({
    mutationFn: async (task: Omit<ProjectTask, "id" | "created_at" | "updated_at">) => {
      // Return mock data for now
      return {
        id: Date.now().toString(),
        project_id: projectId || "",
        created_by: user?.id || "",
        ...task,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ProjectTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectTask> & { id: string }) => {
      // Return mock data for now
      return {
        id,
        project_id: projectId || "",
        created_by: user?.id || "",
        title: "",
        description: "",
        status: "todo" as const,
        priority: "medium" as const,
        order_index: 0,
        files: [],
        comments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates
      } as ProjectTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      // Return mock success for now
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