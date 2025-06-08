
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useMarkMessageAsRead, useMessageAttachments } from '@/hooks/useEnhancedMessages';
import { User, Clock, Paperclip, Eye, Reply } from 'lucide-react';

interface Message {
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
}

interface MessageDetailDialogProps {
  message: Message | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReply?: (message: Message) => void;
}

const MessageDetailDialog = ({ message, open, onOpenChange, onReply }: MessageDetailDialogProps) => {
  const markAsReadMutation = useMarkMessageAsRead();
  const { data: attachments } = useMessageAttachments(message?.id || '');

  if (!message) return null;

  const handleMarkAsRead = () => {
    if (!message.is_read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
    onOpenChange(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Ադմին';
      case 'instructor': return 'Դասավանդող';
      case 'student': return 'Ուսանող';
      case 'employer': return 'Գործատու';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'instructor': return 'bg-edu-blue';
      case 'student': return 'bg-success-green';
      case 'employer': return 'bg-edu-orange';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">Հաղորդագրության մանրամասներ</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-edu-blue to-edu-orange flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{message.sender?.name || 'Անանուն'}</p>
                  {message.sender?.role && (
                    <Badge className={`${getRoleBadgeColor(message.sender.role)} text-white text-xs`}>
                      {getRoleLabel(message.sender.role)}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!message.is_read && (
                  <Badge variant="destructive" className="text-xs">Նոր</Badge>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(message.sent_at).toLocaleString('hy-AM')}
                </div>
              </div>
            </div>

            {message.subject && (
              <div>
                <h3 className="text-lg font-semibold">{message.subject}</h3>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Ստացող՝ {message.recipient?.name || 'Անանուն'}
            </div>
          </div>

          <Separator />

          {/* Message Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          </div>

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold font-armenian mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Կցված ֆայլեր ({attachments.length})
                </h4>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{attachment.filename}</span>
                        {attachment.file_size && (
                          <span className="text-xs text-muted-foreground">
                            ({Math.round(attachment.file_size / 1024)} KB)
                          </span>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Ներբեռնել
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {!message.is_read && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleMarkAsRead}
                  className="font-armenian"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Նշել որպես կարդացված
                </Button>
              )}
            </div>
            <Button 
              className="font-armenian btn-modern"
              onClick={handleReply}
            >
              <Reply className="w-4 h-4 mr-2" />
              Պատասխանել
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetailDialog;
