import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Project {
  id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_public: boolean;
  status: string;
  creator_id: string;
  creator_role: string;
  image_url?: string | null;
  category?: string | null;
  required_skills?: string[] | null;
  resources?: any;
  application_deadline?: string | null;
  max_applicants?: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: "participant" | "mentor";
  added_at: string;
}

export const useMyProjects = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["projects", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [] as Project[];

      // Projects I created
      const { data: created, error: err1 } = await supabase
        .from("projects")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (err1) throw err1;

      // Find project_ids where I'm a member
      const { data: memberships, error: err2 } = await supabase
        .from("project_members")
        .select("project_id")
        .eq("user_id", user.id);
      if (err2) throw err2;

      const memberProjectIds = (memberships || []).map((m) => m.project_id);

      let memberProjects: Project[] = [];
      if (memberProjectIds.length) {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .in("id", memberProjectIds)
          .order("created_at", { ascending: false });
        if (error) throw error;
        memberProjects = data || [];
      }

      const mapById: Record<string, Project> = {};
      [...(created || []), ...memberProjects].forEach((p) => (mapById[p.id] = p));
      return Object.values(mapById);
    },
  });
};

export const useProject = (projectId?: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();
      if (error) throw error;
      return data as Project | null;
    },
  });
};

export const useCreateProject = () => {
  const client = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (payload: Pick<Project, "title" | "description" | "start_date" | "end_date" | "is_public" | "image_url" | "category" | "required_skills" | "resources" | "application_deadline" | "max_applicants">) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("projects")
        .insert({
          ...payload,
          creator_id: user.id,
          creator_role: "instructor",
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & Partial<Pick<Project, "title" | "description" | "start_date" | "end_date" | "status" | "category" | "required_skills" | "resources" | "application_deadline" | "max_applicants" | "image_url" | "is_public">>) => {
      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
