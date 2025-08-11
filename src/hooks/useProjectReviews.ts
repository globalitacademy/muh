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
      console.log('Fetching reviews for project:', projectId);
      
      // Since the table is new, return empty array for now
      return [] as ProjectReview[];
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
      
      console.log('Creating review:', review);
      // Return mock response for now
      return {
        id: 'temp-id',
        project_id: projectId,
        reviewer_id: user.id,
        ...review,
        certificate_issued: review.certificate_issued || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ProjectReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-reviews", projectId] });
    },
  });

  const updateReview = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectReview> & { id: string }) => {
      console.log('Updating review:', id, updates);
      // Return mock response for now
      return {
        id,
        ...updates
      } as ProjectReview;
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