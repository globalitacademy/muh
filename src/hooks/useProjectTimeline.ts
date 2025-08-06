import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectEvent {
  id: string;
  project_id: string;
  type: string;
  title: string;
  description?: string | null;
  event_date: string;
  metadata: any;
  created_at: string;
}

export const useProjectTimeline = (projectId?: string) => {
  const client = useQueryClient();

  const query = useQuery({
    queryKey: ["project-timeline", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_timeline_events")
        .select("*")
        .eq("project_id", projectId)
        .order("event_date", { ascending: false });
      if (error) throw error;
      return (data || []) as ProjectEvent[];
    },
  });

  useEffect(() => {
    if (!projectId) return;
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_timeline_events", filter: `project_id=eq.${projectId}` },
        () => client.invalidateQueries({ queryKey: ["project-timeline", projectId] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projectId, client]);

  const add = useMutation({
    mutationFn: async (payload: { type: string; title: string; description?: string }) => {
      const { data, error } = await supabase
        .from("project_timeline_events")
        .insert({ ...payload, project_id: projectId, metadata: {} })
        .select("*")
        .single();
      if (error) throw error;
      return data as ProjectEvent;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-timeline", projectId] }),
  });

  return { ...query, add };
};
