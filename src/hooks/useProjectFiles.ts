import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProjectFile {
  id: string;
  project_id: string;
  uploader_id: string;
  file_path: string;
  name: string;
  mime_type?: string | null;
  size?: number | null;
  is_public: boolean;
  created_at: string;
}

export const useProjectFiles = (projectId?: string) => {
  const client = useQueryClient();

  const query = useQuery({
    queryKey: ["project-files", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_files")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as ProjectFile[];
    },
  });

  useEffect(() => {
    if (!projectId) return;
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_files", filter: `project_id=eq.${projectId}` },
        () => client.invalidateQueries({ queryKey: ["project-files", projectId] })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projectId, client]);

  const upload = useMutation({
    mutationFn: async (file: File) => {
      if (!projectId) throw new Error("Missing project id");
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id;
      if (!uid) throw new Error("Not authenticated");
      const path = `${projectId}/${uid}/${Date.now()}-${file.name}`;
      const up = await supabase.storage.from("project-files").upload(path, file, { upsert: false });
      if (up.error) throw up.error;
      const { data, error } = await supabase
        .from("project_files")
        .insert({
          project_id: projectId,
          uploader_id: uid,
          file_path: path,
          name: file.name,
          mime_type: file.type,
          size: file.size,
          is_public: false,
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as ProjectFile;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-files", projectId] }),
  });

  const togglePublic = useMutation({
    mutationFn: async ({ id, is_public }: { id: string; is_public: boolean }) => {
      const { data, error } = await supabase
        .from("project_files")
        .update({ is_public })
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as ProjectFile;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-files", projectId] }),
  });

  const remove = useMutation({
    mutationFn: async (file: ProjectFile) => {
      // delete storage first (best-effort)
      await supabase.storage.from("project-files").remove([file.file_path]);
      const { error } = await supabase.from("project_files").delete().eq("id", file.id);
      if (error) throw error;
      return file.id;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-files", projectId] }),
  });

  return { ...query, upload, togglePublic, remove };
};
