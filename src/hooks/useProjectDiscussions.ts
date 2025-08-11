import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProjectDiscussion {
  id: string;
  project_id: string;
  participant_id: string;
  message: string;
  content: string; // Add content property for backward compatibility
  is_private: boolean;
  recipient_id?: string;
  files: any[];
  created_at: string;
  updated_at: string;
  participant_name?: string;
  recipient_name?: string;
}

export const useProjectDiscussions = (projectId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["project-discussions", projectId],
    enabled: !!projectId,
    queryFn: async () => {
      // Since the table is new, we'll use direct SQL via RPC function
      console.log('Fetching discussions for project:', projectId);
      
      // For now, return empty array until tables are properly synced
      return [] as ProjectDiscussion[];
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (message: {
      message?: string;
      content?: string;
      is_private?: boolean;
      recipient_id?: string;
      files?: any[];
    }) => {
      if (!user || !projectId) throw new Error("Not authenticated or no project");
      
      console.log('Sending message:', message);
      const messageText = message.content || message.message || '';
      
      // For now, just return a mock response
      return {
        id: 'temp-id',
        project_id: projectId,
        participant_id: user.id,
        message: messageText,
        content: messageText,
        is_private: message.is_private || false,
        recipient_id: message.recipient_id,
        files: message.files || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ProjectDiscussion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-discussions", projectId] });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (messageId: string) => {
      console.log('Deleting message:', messageId);
      // Mock delete for now
      return messageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-discussions", projectId] });
    },
  });

  return {
    ...query,
    sendMessage,
    create: sendMessage, // Alias for backward compatibility
    remove: deleteMessage, // Add remove method
  };
};