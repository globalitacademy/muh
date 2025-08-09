import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface UserProjectApplication {
  id: string;
  project_id: string;
  applicant_id: string;
  status: string;
  cover_letter?: string | null;
  applied_at: string;
}

export const useUserProjectApplications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-project-applications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("project_applications")
        .select("*")
        .eq("applicant_id", user.id);
      
      if (error) throw error;
      return (data || []) as UserProjectApplication[];
    },
  });
};