
import React, { useState } from 'react';
import { useAdminModules, useCreateModule, useUpdateModule, useDeleteModule } from '@/hooks/useAdminModules';
import { useAdminSpecialties } from '@/hooks/useSpecialties';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { Module } from '@/types/database';

const AdminModulesTab = () => {
  const { data: modules, isLoading } = useAdminModules();
  const { data: specialties } = useAdminSpecialties();
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();
  const deleteModule = useDeleteModule();

  const [isCreating, setIsCreating] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration_weeks: 1,
    price: 0,
    instructor: '',
    total_lessons: 0,
    order_index: 0,
    specialty_id: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      difficulty_level: 'beginner',
      duration_weeks: 1,
      price: 0,
      instructor: '',
      total_lessons: 0,
      order_index: 0,
      specialty_id: '',
    });
    setIsCreating(false);
    setEditingModule(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingModule) {
      await updateModule.mutateAsync({
        id: editingModule.id,
        updates: formData,
      });
    } else {
      await createModule.mutateAsync(formData);
    }
    
    resetForm();
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description || '',
      category: module.category,
      difficulty_level: module.difficulty_level,
      duration_weeks: module.duration_weeks,
      price: module.price,
      instructor: module.instructor,
      total_lessons: module.total_lessons,
      order_index: module.order_index || 0,
      specialty_id: (module as any).specialty_id || '',
    });
    setIsCreating(true);
  };

  const handleDelete = async (moduleId: string) => {
    if (confirm('Վստա՞հ եք, որ ուզում եք ջնջել այս մոդուլը:')) {
      await deleteModule.mutateAsync(moduleId);
    }
  };

  // Group modules by specialty
  const groupedModules = React.useMemo(() => {
    if (!modules || !specialties) return {};
    
    let filteredModules = modules;
    if (selectedSpecialtyFilter) {
      filteredModules = modules.filter((module: any) => module.specialty_id === selectedSpecialtyFilter);
    }

    const grouped: Record<string, { specialty: any; modules: Module[] }> = {};
    
    // Group by specialty
    specialties.forEach(specialty => {
      const specialtyModules = filteredModules.filter((module: any) => module.specialty_id === specialty.id);
      if (specialtyModules.length > 0 || !selectedSpecialtyFilter) {
        grouped[specialty.id] = {
          specialty,
          modules: specialtyModules
        };
      }
    });

    // Add modules without specialty
    const modulesWithoutSpecialty = filteredModules.filter((module: any) => !module.specialty_id);
    if (modulesWithoutSpecialty.length > 0) {
      grouped['no-specialty'] = {
        specialty: { id: 'no-specialty', name: 'Առանց մասնագիտության', icon: 'BookOpen', color: 'from-gray-500 to-gray-600' },
        modules: modulesWithoutSpecialty
      };
    }

    return grouped;
  }, [modules, specialties, selectedSpecialtyFilter]);

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
        <h2 className="text-2xl font-bold font-armenian">Մոդուլների կառավարում</h2>
        <div className="flex gap-4">
          <Select value={selectedSpecialtyFilter} onValueChange={setSelectedSpecialtyFilter}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Ֆիլտրել ըստ մասնագիտության..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Բոլոր մասնագիտությունները</SelectItem>
              {specialties?.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
            className="font-armenian"
          >
            <Plus className="w-4 h-4 mr-2" />
            Նոր մոդուլ ավելացնել
          </Button>
        </div>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="font-armenian">
              {editingModule ? 'Խմբագրել մոդուլը' : 'Նոր մոդուլ ստեղծել'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="font-armenian">Վերնագիր</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="specialty_id" className="font-armenian">Մասնագիտություն</Label>
                  <Select 
                    value={formData.specialty_id} 
                    onValueChange={(value) => setFormData({ ...formData, specialty_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ընտրել մասնագիտություն..." />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties?.map((specialty) => (
                        <SelectItem key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                  <Label htmlFor="difficulty" className="font-armenian">Բարդության մակարդակ</Label>
                  <Select 
                    value={formData.difficulty_level} 
                    onValueChange={(value) => setFormData({ ...formData, difficulty_level: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Սկսնակ</SelectItem>
                      <SelectItem value="intermediate">Միջին</SelectItem>
                      <SelectItem value="advanced">Բարձր</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="instructor" className="font-armenian">Դասախոս</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="duration" className="font-armenian">Տևողություն (շաբաթ)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="font-armenian">Գին</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lessons" className="font-armenian">Դասերի քանակ</Label>
                  <Input
                    id="lessons"
                    type="number"
                    value={formData.total_lessons}
                    onChange={(e) => setFormData({ ...formData, total_lessons: parseInt(e.target.value) })}
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

              <div className="flex gap-2">
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
                  onClick={resetForm}
                  className="font-armenian"
                >
                  Չեղարկել
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Modules grouped by specialty */}
      <Accordion type="multiple" className="space-y-4">
        {Object.entries(groupedModules).map(([specialtyId, { specialty, modules: specialtyModules }]) => (
          <AccordionItem key={specialtyId} value={specialtyId}>
            <Card>
              <AccordionTrigger className="hover:no-underline">
                <CardHeader className="w-full py-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${specialty.color} flex items-center justify-center`}>
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <CardTitle className="font-armenian">{specialty.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {specialtyModules.length} մոդուլ
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="mr-4">
                      {specialtyModules.length}
                    </Badge>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 gap-4">
                    {specialtyModules.map((module) => (
                      <Card key={module.id} className="border border-border/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold font-armenian">{module.title}</h3>
                              <p className="text-muted-foreground text-sm mb-2">{module.description}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="font-medium font-armenian">Կատեգորիա:</span> {module.category}
                                </div>
                                <div>
                                  <span className="font-medium font-armenian">Դասախոս:</span> {module.instructor}
                                </div>
                                <div>
                                  <span className="font-medium font-armenian">Տևողություն:</span> {module.duration_weeks} շաբաթ
                                </div>
                                <div>
                                  <span className="font-medium font-armenian">Գին:</span> {module.price} դրամ
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(module)}
                                className="font-armenian"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDelete(module.id)}
                                className="font-armenian"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {specialtyModules.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground font-armenian">
                        Այս մասնագիտության համար մոդուլներ չեն գտնվել
                      </div>
                    )}
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>

      {Object.keys(groupedModules).length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold font-armenian mb-2">Մոդուլներ չեն գտնվել</h3>
            <p className="text-muted-foreground font-armenian">Փորձեք փոխել ֆիլտրը կամ ավելացրեք նոր մոդուլ</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminModulesTab;
