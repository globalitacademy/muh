import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProjectApplication {
  id: string;
  project_id: string;
  applicant_id: string;
  applicant_name?: string;
  status: string;
  cover_letter?: string | null;
  applied_at: string;
  applicant_profile?: {
    name: string;
    first_name?: string;
    last_name?: string;
  };
}

export const useProjectApplications = (projectId?: string) => {
  const client = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["project-applications", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      if (!projectId) return [];
      
      console.log('Fetching applications for project:', projectId);
      
      const { data, error } = await supabase
        .from("project_applications")
        .select("*")
        .eq("project_id", projectId);
        
      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
      
      console.log('Applications fetched:', data);
      return (data || []) as ProjectApplication[];
    },
  });

  const apply = useMutation({
    mutationFn: async (cover_letter?: string) => {
      if (!projectId) throw new Error("Missing project id");
      if (!user) throw new Error("Not authenticated");
      
      // Check if user already applied
      const { data: existingApplication } = await supabase
        .from("project_applications")
        .select("id")
        .eq("project_id", projectId)
        .eq("applicant_id", user.id)
        .single();
        
      if (existingApplication) {
        throw new Error("You have already applied to this project");
      }
      
      const { data, error } = await supabase
        .from("project_applications")
        .insert({ project_id: projectId, applicant_id: user.id, cover_letter: cover_letter || null })
        .select("*")
        .single();
      if (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
          throw new Error("You have already applied to this project");
        }
        throw error;
      }
      return data as ProjectApplication;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["project-applications", projectId] }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { data, error } = await supabase
        .from("project_applications")
        .update({ status })
        .eq("id", id)
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

  return { ...query, apply, updateStatus, remove };
};
