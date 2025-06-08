import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Topic } from '@/types/database';
import { useCreateTopic, useUpdateTopic } from '@/hooks/useAdminTopics';
import TopicContentSections, { ContentSection } from './TopicContentSections';

interface TopicFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  editingTopic?: Topic | null;
}

const TopicFormDialog = ({ isOpen, onClose, moduleId, editingTopic }: TopicFormDialogProps) => {
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();

  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    title_ru: '',
    description: '',
    description_en: '',
    description_ru: '',
    video_url: '',
    duration_minutes: 30,
    order_index: 0,
    is_free: false,
    exercises: '',
    resources: '',
    quiz_questions: '',
  });

  const [contentSections, setContentSections] = useState<ContentSection[]>([]);

  // Helper function to parse content
  const parseContent = (content: string | null): ContentSection[] => {
    if (!content) return [];
    
    try {
      const parsed = JSON.parse(content);
      if (parsed.sections && Array.isArray(parsed.sections)) {
        return parsed.sections;
      }
      // If it's old format (plain text), convert to new format
      if (typeof content === 'string' && content.trim()) {
        return [{
          id: 'section-1',
          title: 'Տեսական նյութ',
          content: content,
          order: 0
        }];
      }
    } catch (e) {
      // If parsing fails and it's a string, treat as old format
      if (typeof content === 'string' && content.trim()) {
        return [{
          id: 'section-1',
          title: 'Տեսական նյութ',
          content: content,
          order: 0
        }];
      }
    }
    return [];
  };

  useEffect(() => {
    if (editingTopic) {
      setFormData({
        title: editingTopic.title,
        title_en: editingTopic.title_en || '',
        title_ru: editingTopic.title_ru || '',
        description: editingTopic.description || '',
        description_en: editingTopic.description_en || '',
        description_ru: editingTopic.description_ru || '',
        video_url: editingTopic.video_url || '',
        duration_minutes: editingTopic.duration_minutes,
        order_index: editingTopic.order_index,
        is_free: editingTopic.is_free,
        exercises: editingTopic.exercises ? JSON.stringify(editingTopic.exercises, null, 2) : '',
        resources: editingTopic.resources ? JSON.stringify(editingTopic.resources, null, 2) : '',
        quiz_questions: editingTopic.quiz_questions ? JSON.stringify(editingTopic.quiz_questions, null, 2) : '',
      });
      
      setContentSections(parseContent(editingTopic.content));
    } else {
      setFormData({
        title: '',
        title_en: '',
        title_ru: '',
        description: '',
        description_en: '',
        description_ru: '',
        video_url: '',
        duration_minutes: 30,
        order_index: 0,
        is_free: false,
        exercises: '',
        resources: '',
        quiz_questions: '',
      });
      setContentSections([]);
    }
  }, [editingTopic, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert sections to JSON format
    const contentJson = JSON.stringify({
      sections: contentSections.sort((a, b) => a.order - b.order)
    });

    const submitData = {
      ...formData,
      module_id: moduleId,
      content: contentJson,
    };

    if (editingTopic) {
      await updateTopic.mutateAsync({
        id: editingTopic.id,
        updates: submitData,
      });
    } else {
      await createTopic.mutateAsync(submitData);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">
            {editingTopic ? 'Խմբագրել թեման' : 'Նոր թեմա ստեղծել'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="font-armenian">Հիմնական</TabsTrigger>
            <TabsTrigger value="content" className="font-armenian">Բովանդակություն</TabsTrigger>
            <TabsTrigger value="exercises" className="font-armenian">Վարժություններ</TabsTrigger>
            <TabsTrigger value="quiz" className="font-armenian">Վիկտորինա</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="font-armenian">Վերնագիր (հայերեն)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="is_free"
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_free" className="font-armenian">Անվճար թեմա</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration_minutes" className="font-armenian">Տևողություն (րոպե)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="order_index" className="font-armenian">Հերթականություն</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="font-armenian">Նկարագրություն</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="video_url" className="font-armenian">Վիդեո URL</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <TopicContentSections
                sections={contentSections}
                onChange={setContentSections}
              />
            </TabsContent>

            <TabsContent value="exercises" className="space-y-4">
              <div>
                <Label htmlFor="exercises" className="font-armenian">Վարժություններ (JSON ֆորմատով)</Label>
                <Textarea
                  id="exercises"
                  value={formData.exercises}
                  onChange={(e) => setFormData({ ...formData, exercises: e.target.value })}
                  rows={10}
                  placeholder='{"exercises": [{"title": "Վարժություն 1", "description": "..."}]}'
                />
              </div>
              <div>
                <Label htmlFor="resources" className="font-armenian">Ռեսուրսներ (JSON ֆորմատով)</Label>
                <Textarea
                  id="resources"
                  value={formData.resources}
                  onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                  rows={8}
                  placeholder='{"resources": [{"title": "Ռեսուրս 1", "url": "https://..."}]}'
                />
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="space-y-4">
              <div>
                <Label htmlFor="quiz_questions" className="font-armenian">Վիկտորինայի հարցեր (JSON ֆորմատով)</Label>
                <Textarea
                  id="quiz_questions"
                  value={formData.quiz_questions}
                  onChange={(e) => setFormData({ ...formData, quiz_questions: e.target.value })}
                  rows={12}
                  placeholder='{"questions": [{"question": "Հարց 1", "answers": ["Պատ. 1", "Պատ. 2"], "correct": 0}]}'
                />
              </div>
            </TabsContent>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={createTopic.isPending || updateTopic.isPending}
                className="font-armenian"
              >
                {(createTopic.isPending || updateTopic.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingTopic ? 'Թարմացնել' : 'Ստեղծել'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="font-armenian"
              >
                Չեղարկել
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TopicFormDialog;
