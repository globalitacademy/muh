
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateAnnouncement } from '@/hooks/useAnnouncements';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Send } from 'lucide-react';
import { format } from 'date-fns';

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnnouncementDialog = ({ open, onOpenChange }: AnnouncementDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('general');
  const [audience, setAudience] = useState('all');
  const [priority, setPriority] = useState('medium');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();

  const { toast } = useToast();
  const createAnnouncementMutation = useCreateAnnouncement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAnnouncementMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        type,
        audience,
        priority,
        scheduled_at: scheduledDate?.toISOString(),
        expires_at: expiryDate?.toISOString(),
      });

      toast({
        title: "Հաջողություն",
        description: "Հայտարարությունը ստեղծվեց",
      });

      // Reset form
      setTitle('');
      setContent('');
      setType('general');
      setAudience('all');
      setPriority('medium');
      setScheduledDate(undefined);
      setExpiryDate(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Սխալ",
        description: "Հայտարարությունը չհաջողվեց ստեղծել",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">Նոր հայտարարություն</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-armenian">Վերնագիր *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Հայտարարության վերնագիր..."
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="font-armenian">Բովանդակություն *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Հայտարարության բովանդակություն..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type */}
            <div className="space-y-2">
              <Label className="font-armenian">Տիպ</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Ընդհանուր</SelectItem>
                  <SelectItem value="announcement">Հայտարարություն</SelectItem>
                  <SelectItem value="system">Համակարգային</SelectItem>
                  <SelectItem value="academic">Ակադեմիական</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audience */}
            <div className="space-y-2">
              <Label className="font-armenian">Լսարան</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Բոլորը</SelectItem>
                  <SelectItem value="students">Ուսանողներ</SelectItem>
                  <SelectItem value="instructors">Դասավանդողներ</SelectItem>
                  <SelectItem value="employers">Գործատուներ</SelectItem>
                  <SelectItem value="admins">Ադմիններ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="font-armenian">Կարևորություն</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Ցածր</SelectItem>
                  <SelectItem value="medium">Միջին</SelectItem>
                  <SelectItem value="high">Բարձր</SelectItem>
                  <SelectItem value="urgent">Արտակարգ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scheduled Date */}
            <div className="space-y-2">
              <Label className="font-armenian">Հրապարակման ամսաթիվ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "dd/MM/yyyy") : "Ընտրել ամսաթիվ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label className="font-armenian">Ավարտի ամսաթիվ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "dd/MM/yyyy") : "Ընտրել ամսաթիվ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
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
              disabled={createAnnouncementMutation.isPending}
              className="font-armenian btn-modern"
            >
              <Send className="w-4 h-4 mr-2" />
              {createAnnouncementMutation.isPending ? 'Ստեղծվում է...' : 'Ստեղծել'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDialog;
