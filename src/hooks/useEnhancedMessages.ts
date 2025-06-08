
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  is_read: boolean;
  sent_at: string;
  sender?: {
    name: string;
    role: string;
  };
  recipient?: {
    name: string;
    role: string;
  };
  attachments?: MessageAttachment[];
}

interface MessageAttachment {
  id: string;
  filename: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  uploaded_at: string;
}

interface SendMessageData {
  recipient_id: string;
  subject?: string;
  content: string;
  attachments?: File[];
}

export const useEnhancedMessages = (userId?: string) => {
  return useQuery({
    queryKey: ['enhanced-messages', userId],
    queryFn: async (): Promise<EnhancedMessage[]> => {
      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(name, role),
          recipient:profiles!messages_recipient_id_fkey(name, role)
        `)
        .order('sent_at', { ascending: false });

      if (userId) {
        query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useMessageAttachments = (messageId: string) => {
  return useQuery({
    queryKey: ['message-attachments', messageId],
    queryFn: async (): Promise<MessageAttachment[]> => {
      const { data, error } = await supabase
        .from('message_attachments' as any)
        .select('*')
        .eq('message_id', messageId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return (data || []) as MessageAttachment[];
    },
    enabled: !!messageId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: SendMessageData): Promise<EnhancedMessage> => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: messageData.recipient_id,
          subject: messageData.subject,
          content: messageData.content,
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Handle attachments if any
      if (messageData.attachments && messageData.attachments.length > 0) {
        for (const file of messageData.attachments) {
          const fileName = `${message.id}/${file.name}`;
          
          // Upload file to Supabase storage (if storage is configured)
          // For now, we'll create placeholder entries
          await supabase
            .from('message_attachments' as any)
            .insert({
              message_id: message.id,
              filename: file.name,
              file_url: `placeholder-${fileName}`,
              file_size: file.size,
              file_type: file.type,
            });
        }
      }

      return message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string): Promise<void> => {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-messages'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

export const useSearchMessages = (searchTerm: string, userId?: string) => {
  return useQuery({
    queryKey: ['search-messages', searchTerm, userId],
    queryFn: async (): Promise<EnhancedMessage[]> => {
      if (!searchTerm.trim()) return [];

      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(name, role),
          recipient:profiles!messages_recipient_id_fkey(name, role)
        `)
        .or(`subject.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .order('sent_at', { ascending: false });

      if (userId) {
        query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!searchTerm.trim() && !!userId,
  });
};
