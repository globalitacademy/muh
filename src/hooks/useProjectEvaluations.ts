import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectEvaluation {
  id: string;
  project_id: string;
  evaluator_id: string;
  subject_user_id?: string | null;
  subject_team?: string | null;
  score: number;
  rubric: any;
  comments?: string | null;
  created_at: string;
  updated_at: string;
}

export const useProjectEvaluations = (projectId?: string) => {
  const client = useQueryClient();

  const query = useQuery({
    queryKey: ["project-evaluations", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_evaluations")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as ProjectEvaluation[];
    },
  });

  useEffect(() => {
    if (!projectId) return;
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_evaluations", filter: `project_id=eq.${projectId}` },
        () => client.invalidateQueries({ queryKey: ["project-evaluations", projectId] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projectId, client]);

  const create = useMutation({
    mutationFn: async (payload: { subject_user_id?: string | null; subject_team?: string | null; score: number; comments?: string }) => {
      if (!projectId) throw new Error("Missing project id");
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id;
      if (!uid) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("project_evaluations")
        .insert({ ...payload, project_id: projectId, evaluator_id: uid, rubric: {} })
        .select("*")
        .single();
      if (error) throw error;
      return data as ProjectEvaluation;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-evaluations", projectId] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<ProjectEvaluation> & { id: string }) => {
      const { data, error } = await supabase
        .from("project_evaluations")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as ProjectEvaluation;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-evaluations", projectId] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_evaluations").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-evaluations", projectId] }),
  });

  return { ...query, create, update, remove };
};
