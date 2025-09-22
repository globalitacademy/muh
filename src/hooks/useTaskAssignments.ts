import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Standalone hook for task assignment operations (can be used without projectId)
export const useTaskAssignments = () => {
  const client = useQueryClient();

  const completeAssignment = useMutation({
    mutationFn: async ({ assignmentId, submissionNotes }: { assignmentId: string; submissionNotes?: string }) => {
      const { data, error } = await supabase
        .from("project_task_assignments")
        .update({ 
          completed_at: new Date().toISOString(),
          submission_notes: submissionNotes,
          updated_at: new Date().toISOString()
        })
        .eq("id", assignmentId)
        .select("*")
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all related queries
      client.invalidateQueries({ queryKey: ["user-assigned-tasks"] });
      client.invalidateQueries({ queryKey: ["project-tasks"] });
    },
  });

  return { completeAssignment };
};