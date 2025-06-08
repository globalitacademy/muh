
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Topic } from '@/types/database';
import { CreateTopicData, UpdateTopicData, useCreateTopic, useUpdateTopic } from '@/hooks/useAdminTopics';

interface TopicFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  editingTopic?: Topic | null;
}

const TopicFormDialog = ({
  isOpen,
  onClose,
  moduleId,
  editingTopic
}: TopicFormDialogProps) => {
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();
  
  const [formData, setFormData] = useState<CreateTopicData>({
    module_id: moduleId,
    title: '',
    title_en: '',
    title_ru: '',
    description: '',
    description_en: '',
    description_ru: '',
    content: '',
    video_url: '',
    duration_minutes: 30,
    order_index: 0,
    is_free: false,
    exercises: null,
    quiz_questions: null,
    resources: null,
  });

  const [exercises, setExercises] = useState<string>('');
  const [quizQuestions, setQuizQuestions] = useState<string>('');
  const [resources, setResources] = useState<string>('');

  useEffect(() => {
    if (editingTopic) {
      setFormData({
        module_id: editingTopic.module_id || moduleId,
        title: editingTopic.title || '',
        title_en: editingTopic.title_en || '',
        title_ru: editingTopic.title_ru || '',
        description: editingTopic.description || '',
        description_en: editingTopic.description_en || '',
        description_ru: editingTopic.description_ru || '',
        content: editingTopic.content || '',
        video_url: editingTopic.video_url || '',
        duration_minutes: editingTopic.duration_minutes || 30,
        order_index: editingTopic.order_index || 0,
        is_free: editingTopic.is_free || false,
        exercises: editingTopic.exercises,
        quiz_questions: editingTopic.quiz_questions,
        resources: editingTopic.resources,
      });
      
      setExercises(editingTopic.exercises ? JSON.stringify(editingTopic.exercises, null, 2) : '');
      setQuizQuestions(editingTopic.quiz_questions ? JSON.stringify(editingTopic.quiz_questions, null, 2) : '');
      setResources(editingTopic.resources ? JSON.stringify(editingTopic.resources, null, 2) : '');
    } else {
      resetForm();
    }
  }, [editingTopic, moduleId]);

  const resetForm = () => {
    setFormData({
      module_id: moduleId,
      title: '',
      title_en: '',
      title_ru: '',
      description: '',
      description_en: '',
      description_ru: '',
      content: '',
      video_url: '',
      duration_minutes: 30,
      order_index: 0,
      is_free: false,
      exercises: null,
      quiz_questions: null,
      resources: null,
    });
    setExercises('');
    setQuizQuestions('');
    setResources('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        exercises: exercises.trim() ? JSON.parse(exercises) : null,
        quiz_questions: quizQuestions.trim() ? JSON.parse(quizQuestions) : null,
        resources: resources.trim() ? JSON.parse(resources) : null,
      };

      if (editingTopic) {
        await updateTopic.mutateAsync({
          id: editingTopic.id,
          updates: submitData as UpdateTopicData,
        });
      } else {
        await createTopic.mutateAsync(submitData);
      }
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      // Handle JSON parsing errors
    }
  };

  const isLoading = createTopic.isPending || updateTopic.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">
            {editingTopic ? 'Խմբագրել թեման' : 'Նոր թեմա ստեղծել'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="font-armenian">Հիմնական</TabsTrigger>
              <TabsTrigger value="content" className="font-armenian">Բովանդակություն</TabsTrigger>
              <TabsTrigger value="exercises" className="font-armenian">Վարժություններ</TabsTrigger>
              <TabsTrigger value="resources" className="font-armenian">Ռեսուրսներ</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title" className="font-armenian">Վերնագիր (հայերեն)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title_en" className="font-armenian">Վերնագիր (անգլերեն)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="title_ru" className="font-armenian">Վերնագիր (ռուսերեն)</Label>
                  <Input
                    id="title_ru"
                    value={formData.title_ru}
                    onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="font-armenian">Նկարագրություն (հայերեն)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description_en" className="font-armenian">Նկարագրություն (անգլերեն)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="description_ru" className="font-armenian">Նկարագրություն (ռուսերեն)</Label>
                  <Textarea
                    id="description_ru"
                    value={formData.description_ru}
                    onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration_minutes" className="font-armenian">Տևողություն (րոպե)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="order_index" className="font-armenian">Հերթականություն</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_free"
                    checked={formData.is_free}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}
                  />
                  <Label htmlFor="is_free" className="font-armenian">Անվճար թեմա</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="video_url" className="font-armenian">Վիդեո URL</Label>
                <Input
                  id="video_url"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="content" className="font-armenian">Բովանդակություն</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={15}
                  placeholder="Մուտքագրեք թեմայի բովանդակությունը..."
                />
              </div>
            </TabsContent>

            <TabsContent value="exercises" className="space-y-4">
              <div>
                <Label htmlFor="quiz" className="font-armenian">Վիկտորինա (JSON ֆորմատ)</Label>
                <Textarea
                  id="quiz"
                  value={quizQuestions}
                  onChange={(e) => setQuizQuestions(e.target.value)}
                  rows={10}
                  placeholder='{"questions": [{"question": "Հարց 1", "options": ["Տարբերակ 1", "Տարբերակ 2"], "correct": 0}]}'
                />
              </div>
              <div>
                <Label htmlFor="exercises_json" className="font-armenian">Վարժություններ (JSON ֆորմատ)</Label>
                <Textarea
                  id="exercises_json"
                  value={exercises}
                  onChange={(e) => setExercises(e.target.value)}
                  rows={10}
                  placeholder='{"exercises": [{"title": "Վարժություն 1", "description": "Նկարագրություն", "solution": "Լուծում"}]}'
                />
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div>
                <Label htmlFor="resources_json" className="font-armenian">Ռեսուրսներ (JSON ֆորմատ)</Label>
                <Textarea
                  id="resources_json"
                  value={resources}
                  onChange={(e) => setResources(e.target.value)}
                  rows={12}
                  placeholder='{"links": [{"title": "Օգտակար հղում", "url": "https://example.com"}], "files": [{"title": "PDF ֆայլ", "url": "path/to/file.pdf"}]}'
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="font-armenian"
            >
              {isLoading && (
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
