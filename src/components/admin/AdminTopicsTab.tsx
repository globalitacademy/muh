
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, BookOpen, Play, FileText, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Topic {
  id: string;
  module_id: string;
  title: string;
  title_en?: string;
  title_ru?: string;
  description?: string;
  description_en?: string;
  description_ru?: string;
  content?: string;
  video_url?: string;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  exercises?: any;
  resources?: any;
  quiz_questions?: any;
  created_at: string;
  updated_at: string;
  modules?: {
    id: string;
    title: string;
    category: string;
  };
}

const AdminTopicsTab = () => {
  const queryClient = useQueryClient();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  // Fetch modules for dropdown
  const { data: modules } = useQuery({
    queryKey: ['adminModules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('id, title, category')
        .order('title');
      if (error) throw error;
      return data;
    },
  });

  // Fetch topics
  const { data: topics, isLoading } = useQuery({
    queryKey: ['adminTopics', selectedModuleId],
    queryFn: async () => {
      let query = supabase
        .from('topics')
        .select(`
          *,
          modules (
            id,
            title,
            category
          )
        `)
        .order('order_index');

      if (selectedModuleId) {
        query = query.eq('module_id', selectedModuleId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Topic[];
    },
  });

  const [formData, setFormData] = useState({
    module_id: '',
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
    exercises: '',
    resources: '',
    quiz_questions: '',
  });

  const createTopic = useMutation({
    mutationFn: async (topicData: any) => {
      const { exercises, resources, quiz_questions, ...rest } = topicData;
      const processedData = {
        ...rest,
        exercises: exercises ? JSON.parse(exercises) : null,
        resources: resources ? JSON.parse(resources) : null,
        quiz_questions: quiz_questions ? JSON.parse(quiz_questions) : null,
      };

      const { data, error } = await supabase
        .from('topics')
        .insert([processedData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTopics'] });
      toast.success('Թեման հաջողությամբ ստեղծվել է');
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating topic:', error);
      toast.error('Թեմայի ստեղծման սխալ');
    },
  });

  const updateTopic = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { exercises, resources, quiz_questions, ...rest } = updates;
      const processedData = {
        ...rest,
        exercises: exercises ? JSON.parse(exercises) : null,
        resources: resources ? JSON.parse(resources) : null,
        quiz_questions: quiz_questions ? JSON.parse(quiz_questions) : null,
      };

      const { data, error } = await supabase
        .from('topics')
        .update(processedData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTopics'] });
      toast.success('Թեման հաջողությամբ թարմացվել է');
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating topic:', error);
      toast.error('Թեմայի թարմացման սխալ');
    },
  });

  const deleteTopic = useMutation({
    mutationFn: async (topicId: string) => {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTopics'] });
      toast.success('Թեման հաջողությամբ ջնջվել է');
    },
    onError: (error) => {
      console.error('Error deleting topic:', error);
      toast.error('Թեմայի ջնջման սխալ');
    },
  });

  const resetForm = () => {
    setFormData({
      module_id: '',
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
      exercises: '',
      resources: '',
      quiz_questions: '',
    });
    setIsCreateModalOpen(false);
    setEditingTopic(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTopic) {
      await updateTopic.mutateAsync({
        id: editingTopic.id,
        updates: formData,
      });
    } else {
      await createTopic.mutateAsync(formData);
    }
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setFormData({
      module_id: topic.module_id,
      title: topic.title,
      title_en: topic.title_en || '',
      title_ru: topic.title_ru || '',
      description: topic.description || '',
      description_en: topic.description_en || '',
      description_ru: topic.description_ru || '',
      content: topic.content || '',
      video_url: topic.video_url || '',
      duration_minutes: topic.duration_minutes,
      order_index: topic.order_index,
      is_free: topic.is_free,
      exercises: topic.exercises ? JSON.stringify(topic.exercises, null, 2) : '',
      resources: topic.resources ? JSON.stringify(topic.resources, null, 2) : '',
      quiz_questions: topic.quiz_questions ? JSON.stringify(topic.quiz_questions, null, 2) : '',
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (topicId: string) => {
    if (confirm('Վստա՞հ եք, որ ուզում եք ջնջել այս թեման:')) {
      await deleteTopic.mutateAsync(topicId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-armenian">Թեմաների կառավարում</h2>
        <div className="flex gap-4">
          <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Ընտրել մոդուլ..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Բոլոր մոդուլները</SelectItem>
              {modules?.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="font-armenian"
          >
            <Plus className="w-4 h-4 mr-2" />
            Նոր թեմա ավելացնել
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {topics?.map((topic) => (
          <Card key={topic.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold font-armenian">{topic.title}</h3>
                    {topic.is_free && <Badge variant="secondary">Անվճար</Badge>}
                  </div>
                  
                  {topic.modules && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Մոդուլ: {topic.modules.title}
                    </p>
                  )}
                  
                  {topic.description && (
                    <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-medium font-armenian">Հերթ:</span> {topic.order_index}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium font-armenian">Տևողություն:</span> {topic.duration_minutes} րոպե
                    </div>
                    {topic.video_url && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Play className="w-4 h-4" />
                        <span className="font-armenian">Վիդեո</span>
                      </div>
                    )}
                    {topic.content && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <FileText className="w-4 h-4" />
                        <span className="font-armenian">Բովանդակություն</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(topic)}
                    className="font-armenian"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(topic.id)}
                    className="font-armenian"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                    <Label htmlFor="module_id" className="font-armenian">Մոդուլ</Label>
                    <Select 
                      value={formData.module_id} 
                      onValueChange={(value) => setFormData({ ...formData, module_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ընտրել մոդուլ..." />
                      </SelectTrigger>
                      <SelectContent>
                        {modules?.map((module) => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <Label htmlFor="description" className="font-armenian">Նկարագրություն (հայերեն)</Label>
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
                <div>
                  <Label htmlFor="content" className="font-armenian">Թեմայի բովանդակություն</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    placeholder="Մուտքագրեք թեմայի մանրամասն բովանդակությունը..."
                  />
                </div>
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
                  onClick={resetForm}
                  className="font-armenian"
                >
                  Չեղարկել
                </Button>
              </div>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTopicsTab;
