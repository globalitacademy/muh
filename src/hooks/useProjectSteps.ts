import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectStep {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  order_index: number;
  due_date?: string;
  status: "todo" | "in_progress" | "done" | "blocked";
  created_at: string;
  updated_at: string;
}

export const useProjectSteps = (projectId?: string) => {
  const client = useQueryClient();

  const query = useQuery({
    queryKey: ["project-steps", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_steps")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data || []) as ProjectStep[];
    },
  });

  useEffect(() => {
    if (!projectId) return;
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_steps", filter: `project_id=eq.${projectId}` },
        () => client.invalidateQueries({ queryKey: ["project-steps", projectId] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projectId, client]);

  const create = useMutation({
    mutationFn: async (payload: { title: string; description?: string; order_index?: number; due_date?: string; status?: ProjectStep["status"] }) => {
      if (!projectId) throw new Error("Missing project id");
      const { data, error } = await supabase
        .from("project_steps")
        .insert({ ...payload, project_id: projectId })
        .select("*")
        .single();
      if (error) throw error;
      return data as ProjectStep;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-steps", projectId] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<ProjectStep> & { id: string }) => {
      const { data, error } = await supabase
        .from("project_steps")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as ProjectStep;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-steps", projectId] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_steps").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-steps", projectId] }),
  });

  return { ...query, create, update, remove };
};
