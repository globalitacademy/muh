import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Module } from '@/types/database';
import { useCreateModule, useUpdateModule } from '@/hooks/useAdminModules';
import EnhancedRichTextEditor from '@/components/ui/enhanced-rich-text-editor';

interface ModuleFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  specialtyId: string;
  editingModule?: Module | null;
}

interface ModuleFormData {
  title: string;
  title_en: string;
  title_ru: string;
  description: string;
  description_en: string;
  description_ru: string;
  category: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  price: number;
  instructor: string;
  instructor_en: string;
  instructor_ru: string;
  total_lessons: number;
  order_index: number;
}

const ModuleFormDialog = ({ isOpen, onClose, specialtyId, editingModule }: ModuleFormDialogProps) => {
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();

  const [formData, setFormData] = useState<ModuleFormData>({
    title: '',
    title_en: '',
    title_ru: '',
    description: '',
    description_en: '',
    description_ru: '',
    category: '',
    difficulty_level: 'beginner',
    duration_weeks: 1,
    price: 0,
    instructor: '',
    instructor_en: '',
    instructor_ru: '',
    total_lessons: 0,
    order_index: 0,
  });

  useEffect(() => {
    if (editingModule) {
      setFormData({
        title: editingModule.title || '',
        title_en: editingModule.title_en || '',
        title_ru: editingModule.title_ru || '',
        description: editingModule.description || '',
        description_en: editingModule.description_en || '',
        description_ru: editingModule.description_ru || '',
        category: editingModule.category || '',
        difficulty_level: editingModule.difficulty_level || 'beginner',
        duration_weeks: editingModule.duration_weeks || 1,
        price: Number(editingModule.price) || 0,
        instructor: editingModule.instructor || '',
        instructor_en: editingModule.instructor_en || '',
        instructor_ru: editingModule.instructor_ru || '',
        total_lessons: editingModule.total_lessons || 0,
        order_index: editingModule.order_index || 0,
      });
    } else {
      setFormData({
        title: '',
        title_en: '',
        title_ru: '',
        description: '',
        description_en: '',
        description_ru: '',
        category: '',
        difficulty_level: 'beginner',
        duration_weeks: 1,
        price: 0,
        instructor: '',
        instructor_en: '',
        instructor_ru: '',
        total_lessons: 0,
        order_index: 0,
      });
    }
  }, [editingModule, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingModule) {
        await updateModule.mutateAsync({
          id: editingModule.id,
          updates: formData,
        });
      } else {
        await createModule.mutateAsync({
          ...formData,
          specialty_id: specialtyId,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving module:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-armenian">
            {editingModule ? 'Խմբագրել մոդուլը' : 'Նոր մոդուլ ստեղծել'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <EnhancedRichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Մուտքագրեք մոդուլի նկարագրությունը..."
              height={200}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description_en" className="font-armenian">Նկարագրություն (անգլերեն)</Label>
              <EnhancedRichTextEditor
                value={formData.description_en}
                onChange={(value) => setFormData({ ...formData, description_en: value })}
                placeholder="Enter module description in English..."
                height={150}
              />
            </div>
            <div>
              <Label htmlFor="description_ru" className="font-armenian">Նկարագրություն (ռուսերեն)</Label>
              <EnhancedRichTextEditor
                value={formData.description_ru}
                onChange={(value) => setFormData({ ...formData, description_ru: value })}
                placeholder="Введите описание модуля на русском..."
                height={150}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="category" className="font-armenian">Կատեգորիա</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="difficulty_level" className="font-armenian">Բարդության աստիճան</Label>
              <Select 
                value={formData.difficulty_level} 
                onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                  setFormData({ ...formData, difficulty_level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Սկսնակ</SelectItem>
                  <SelectItem value="intermediate">Միջին</SelectItem>
                  <SelectItem value="advanced">Բարձրակարգ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration_weeks" className="font-armenian">Տևողություն (շաբաթ)</Label>
              <Input
                id="duration_weeks"
                type="number"
                value={formData.duration_weeks}
                onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) || 1 })}
                required
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="price" className="font-armenian">Գին (դրամ)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="instructor" className="font-armenian">Դասախոս (հայերեն)</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="instructor_en" className="font-armenian">Դասախոս (անգլերեն)</Label>
              <Input
                id="instructor_en"
                value={formData.instructor_en}
                onChange={(e) => setFormData({ ...formData, instructor_en: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="instructor_ru" className="font-armenian">Դասախոս (ռուսերեն)</Label>
              <Input
                id="instructor_ru"
                value={formData.instructor_ru}
                onChange={(e) => setFormData({ ...formData, instructor_ru: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_lessons" className="font-armenian">Ընդհանուր դասերի քանակ</Label>
              <Input
                id="total_lessons"
                type="number"
                value={formData.total_lessons}
                onChange={(e) => setFormData({ ...formData, total_lessons: parseInt(e.target.value) || 0 })}
                required
                min="0"
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
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={createModule.isPending || updateModule.isPending}
              className="font-armenian"
            >
              {(createModule.isPending || updateModule.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingModule ? 'Թարմացնել' : 'Ստեղծել'}
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

export default ModuleFormDialog;
