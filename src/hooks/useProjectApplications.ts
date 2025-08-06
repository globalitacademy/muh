import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProjectApplication {
  id: string;
  project_id: string;
  applicant_id: string;
  status: string;
  cover_letter?: string | null;
  applied_at: string;
}

export const useProjectApplications = (projectId?: string) => {
  const client = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["project-applications", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_applications")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return (data || []) as ProjectApplication[];
    },
  });

  const apply = useMutation({
    mutationFn: async (cover_letter?: string) => {
      if (!projectId) throw new Error("Missing project id");
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("project_applications")
        .insert({ project_id: projectId, applicant_id: user.id, cover_letter: cover_letter || null })
        .select("*")
        .single();
      if (error) throw error;
      return data as ProjectApplication;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-applications", projectId] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_applications").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-applications", projectId] }),
  });

  return { ...query, apply, remove };
};
