import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProjectReview {
  id: string;
  project_id: string;
  participant_id: string;
  reviewer_id: string;
  rating: number;
  feedback?: string;
  certificate_issued: boolean;
  certificate_url?: string;
  created_at: string;
  updated_at: string;
  participant_name?: string;
  reviewer_name?: string;
}

export const useProjectReviews = (projectId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["project-reviews", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_reviews")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Get participant and reviewer names
      const reviews = data || [];
      const userIds = [...new Set([
        ...reviews.map(r => r.participant_id),
        ...reviews.map(r => r.reviewer_id)
      ])];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, first_name, last_name")
        .in("id", userIds);

      const profileMap = new Map(
        (profiles || []).map(p => [
          p.id, 
          p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown User'
        ])
      );

      return reviews.map(review => ({
        ...review,
        participant_name: profileMap.get(review.participant_id),
        reviewer_name: profileMap.get(review.reviewer_id)
      })) as ProjectReview[];
    },
  });

  const createReview = useMutation({
    mutationFn: async (review: {
      participant_id: string;
      rating: number;
      feedback?: string;
      certificate_issued?: boolean;
      certificate_url?: string;
    }) => {
      if (!user || !projectId) throw new Error("Not authenticated or no project");
      
      const { data, error } = await supabase
        .from("project_reviews")
        .insert({
          project_id: projectId,
          reviewer_id: user.id,
          ...review
        })
        .select("*")
        .single();
      
      if (error) throw error;
      return data as ProjectReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-reviews", projectId] });
    },
  });

  const updateReview = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectReview> & { id: string }) => {
      const { data, error } = await supabase
        .from("project_reviews")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
      
      if (error) throw error;
      return data as ProjectReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-reviews", projectId] });
    },
  });

  return {
    ...query,
    createReview,
    updateReview,
  };
};