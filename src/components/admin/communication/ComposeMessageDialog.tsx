
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSendMessage } from '@/hooks/useMessages';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, X, Paperclip } from 'lucide-react';

interface ComposeMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  replyTo?: {
    recipient_id: string;
    subject?: string;
  };
}

const ComposeMessageDialog = ({ open, onOpenChange, replyTo }: ComposeMessageDialogProps) => {
  const [recipientId, setRecipientId] = useState(replyTo?.recipient_id || '');
  const [subject, setSubject] = useState(replyTo?.subject ? `Re: ${replyTo.subject}` : '');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const { toast } = useToast();
  const sendMessageMutation = useSendMessage();
  const { data: users } = useAdminUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientId || !content.trim()) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        recipient_id: recipientId,
        subject: subject.trim() || undefined,
        content: content.trim(),
        
      });

      toast({
        title: "Հաջողություն",
        description: "Հաղորդագրությունը ուղարկվեց",
      });

      // Reset form
      setRecipientId(replyTo?.recipient_id || '');
      setSubject(replyTo?.subject ? `Re: ${replyTo.subject}` : '');
      setContent('');
      setAttachments([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Սխալ",
        description: "Հաղորդագրությունը չհաջողվեց ուղարկել",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-armenian">
            {replyTo ? 'Պատասխանել հաղորդագրությանը' : 'Նոր հաղորդագրություն'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="recipient" className="font-armenian">Ստացող *</Label>
            <Select value={recipientId} onValueChange={setRecipientId} disabled={!!replyTo}>
              <SelectTrigger>
                <SelectValue placeholder="Ընտրել ստացողին..." />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} - {getRoleLabel(user.role || 'student')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="font-armenian">Թեմա</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Հաղորդագրության թեմա..."
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="font-armenian">Բովանդակություն *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Գրեք ձեր հաղորդագրությունը..."
              className="min-h-[150px]"
              required
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label className="font-armenian flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              Կցել ֆայլեր
            </Label>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
            />
            {attachments.length > 0 && (
              <div className="space-y-1">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-armenian"
            >
              Չեղարկել
            </Button>
            <Button
              type="submit"
              disabled={sendMessageMutation.isPending}
              className="font-armenian btn-modern"
            >
              <Send className="w-4 h-4 mr-2" />
              {sendMessageMutation.isPending ? 'Ուղարկվում է...' : 'Ուղարկել'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeMessageDialog;
