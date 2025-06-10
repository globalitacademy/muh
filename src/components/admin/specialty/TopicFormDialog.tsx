
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Topic } from '@/types/database';
import { useCreateTopic, useUpdateTopic } from '@/hooks/useAdminTopics';
import TopicFormTabs from './TopicFormTabs';
import { ContentSection } from './TopicContentSections';

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

  const handleFormDataChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

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
        
        <form onSubmit={handleSubmit}>
          <TopicFormTabs
            formData={formData}
            onFormDataChange={handleFormDataChange}
            contentSections={contentSections}
            onContentSectionsChange={setContentSections}
          />

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
      </DialogContent>
    </Dialog>
  );
};

export default TopicFormDialog;
