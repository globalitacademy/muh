import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProjectDiscussion {
  id: string;
  project_id: string;
  author_id: string;
  content: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

export const useProjectDiscussions = (projectId?: string) => {
  const client = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["project-discussions", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_discussions")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as ProjectDiscussion[];
    },
  });

  useEffect(() => {
    if (!projectId) return;
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_discussions", filter: `project_id=eq.${projectId}` },
        () => client.invalidateQueries({ queryKey: ["project-discussions", projectId] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projectId, client]);

  const create = useMutation({
    mutationFn: async (payload: { content: string; parent_id?: string | null }) => {
      if (!projectId) throw new Error("Missing project id");
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id;
      if (!uid) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("project_discussions")
        .insert({ ...payload, project_id: projectId, author_id: uid })
        .select("*")
        .single();
      if (error) throw error;
      return data as ProjectDiscussion;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-discussions", projectId] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_discussions").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-discussions", projectId] }),
  });

  return { ...query, create, remove };
};
