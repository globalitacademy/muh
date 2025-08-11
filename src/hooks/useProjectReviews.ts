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
      // Return empty array for now until table is created
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
      // Return mock data for now
      return {
        id: Date.now().toString(),
        project_id: projectId || "",
        participant_id: review.participant_id,
        reviewer_id: user?.id || "",
        rating: review.rating,
        feedback: review.feedback,
        certificate_issued: review.certificate_issued || false,
        certificate_url: review.certificate_url,
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
      // Return mock data for now
      return {
        id,
        project_id: projectId || "",
        participant_id: "",
        reviewer_id: user?.id || "",
        rating: 0,
        certificate_issued: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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