import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook to get project steps as tasks for students
export const useStudentProjectTasks = (userId: string) => {
  return useQuery({
    queryKey: ["student-project-tasks", userId],
    queryFn: async () => {
      // First get projects where user has approved application
      const { data: userProjects, error: projectError } = await supabase
        .from("project_applications")
        .select("project_id")
        .eq("applicant_id", userId)
        .eq("status", "approved");

      if (projectError) throw projectError;
      
      if (!userProjects || userProjects.length === 0) {
        return [];
      }

      const projectIds = userProjects.map(p => p.project_id);

      // Get project steps for those projects
      const { data: steps, error: stepsError } = await supabase
        .from("project_steps")  
        .select("*")
        .in("project_id", projectIds);

      if (stepsError) throw stepsError;

      if (!steps || steps.length === 0) {
        return [];
      }

      // Get project titles separately
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, title")
        .in("id", projectIds);

      if (projectsError) throw projectsError;

      // Create a map of project titles
      const projectTitlesMap = projects?.reduce((acc: any, project: any) => {
        acc[project.id] = project.title;
        return acc;
      }, {}) || {};

      // Transform project steps into task format  
      return steps?.map((step: any) => ({
        id: step.id,
        project_id: step.project_id,
        title: step.title,
        description: step.description,
        status: step.status,
        due_date: step.due_date,
        project_title: projectTitlesMap[step.project_id],
        type: 'project_step' as const,
        created_at: step.created_at,
        updated_at: step.updated_at
      })) || [];
    },
  });
};

// Standalone hook for task assignment operations (can be used without projectId)
export const useTaskAssignments = () => {
  const client = useQueryClient();

  const submitStep = useMutation({
    mutationFn: async ({ stepId, submissionNotes }: { stepId: string; submissionNotes?: string }) => {
      const { data, error } = await supabase
        .from("project_steps")
        .update({ 
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          submission_notes: submissionNotes,
          updated_at: new Date().toISOString()
        })
        .eq("id", stepId)
        .select("*")
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all related queries
      client.invalidateQueries({ queryKey: ["student-project-tasks"] });
      client.invalidateQueries({ queryKey: ["project-steps"] });
    },
  });

  const reviewStep = useMutation({
    mutationFn: async ({ stepId, status, reviewNotes }: { stepId: string; status: string; reviewNotes?: string }) => {
      const { data, error } = await supabase
        .from("project_steps")
        .update({ 
          status: status as any,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          review_notes: reviewNotes,
          updated_at: new Date().toISOString()
        })
        .eq("id", stepId)
        .select("*")
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all related queries
      client.invalidateQueries({ queryKey: ["student-project-tasks"] });
      client.invalidateQueries({ queryKey: ["project-steps"] });
    },
  });

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

  return { completeAssignment, submitStep, reviewStep };
};