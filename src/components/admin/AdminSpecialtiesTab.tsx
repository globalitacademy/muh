
import React, { useState } from 'react';
import { useAdminSpecialties, useCreateSpecialty, useUpdateSpecialty, useDeleteSpecialty } from '@/hooks/useSpecialties';
import { useSpecialtyModules } from '@/hooks/useSpecialtyModules';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, Plus, Edit, Trash2, Code, Shield, Palette, Network, Bot, Brain, ChevronDown, BookOpen } from 'lucide-react';
import { Specialty, CreateSpecialtyData } from '@/types/specialty';
import { Module } from '@/types/database';
import SpecialtyModuleCard from './specialty/SpecialtyModuleCard';
import ModuleFormDialog from './specialty/ModuleFormDialog';

const iconOptions = [
  { value: 'Code', label: 'Code', icon: Code },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Palette', label: 'Palette', icon: Palette },
  { value: 'Network', label: 'Network', icon: Network },
  { value: 'Bot', label: 'Bot', icon: Bot },
  { value: 'Brain', label: 'Brain', icon: Brain },
].filter(option => option.value && option.value.trim() !== '');

const colorOptions = [
  { value: 'from-blue-500 to-cyan-500', label: 'Կապույտ' },
  { value: 'from-red-500 to-orange-500', label: 'Կարմիր' },
  { value: 'from-purple-500 to-pink-500', label: 'Մանուշակագույն' },
  { value: 'from-green-500 to-emerald-500', label: 'Կանաչ' },
  { value: 'from-indigo-500 to-blue-500', label: 'Ինդիգո' },
  { value: 'from-yellow-500 to-amber-500', label: 'Դեղին' },
].filter(option => option.value && option.value.trim() !== '');

const AdminSpecialtiesTab = () => {
  const { data: specialties, isLoading } = useAdminSpecialties();
  const createSpecialty = useCreateSpecialty();
  const updateSpecialty = useUpdateSpecialty();
  const deleteSpecialty = useDeleteSpecialty();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [expandedSpecialties, setExpandedSpecialties] = useState<Set<string>>(new Set());
  const [moduleFormOpen, setModuleFormOpen] = useState(false);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>('');
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  // Add the missing formData state
  const [formData, setFormData] = useState<CreateSpecialtyData>({
    name: '',
    name_en: '',
    name_ru: '',
    description: '',
    description_en: '',
    description_ru: '',
    icon: 'Code',
    color: 'from-blue-500 to-cyan-500',
    order_index: 0,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      name_en: '',
      name_ru: '',
      description: '',
      description_en: '',
      description_ru: '',
      icon: 'Code',
      color: 'from-blue-500 to-cyan-500',
      order_index: 0,
    });
    setIsCreateModalOpen(false);
    setEditingSpecialty(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSpecialty) {
      await updateSpecialty.mutateAsync({
        id: editingSpecialty.id,
        updates: formData,
      });
    } else {
      await createSpecialty.mutateAsync(formData);
    }
    
    resetForm();
  };

  const handleEdit = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setFormData({
      name: specialty.name || '',
      name_en: specialty.name_en || '',
      name_ru: specialty.name_ru || '',
      description: specialty.description || '',
      description_en: specialty.description_en || '',
      description_ru: specialty.description_ru || '',
      icon: specialty.icon || 'Code',
      color: specialty.color || 'from-blue-500 to-cyan-500',
      order_index: specialty.order_index || 0,
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (specialtyId: string) => {
    if (confirm('Վստա՞հ եք, որ ուզում եք ջնջել այս մասնագիտությունը:')) {
      await deleteSpecialty.mutateAsync(specialtyId);
    }
  };

  const toggleSpecialty = (specialtyId: string) => {
    const newExpanded = new Set(expandedSpecialties);
    if (newExpanded.has(specialtyId)) {
      newExpanded.delete(specialtyId);
    } else {
      newExpanded.add(specialtyId);
    }
    setExpandedSpecialties(newExpanded);
  };

  const handleAddModule = (specialtyId: string) => {
    setSelectedSpecialtyId(specialtyId);
    setEditingModule(null);
    setModuleFormOpen(true);
  };

  const handleEditModule = (module: Module) => {
    setSelectedSpecialtyId(module.specialty_id || '');
    setEditingModule(module);
    setModuleFormOpen(true);
  };

  const handleAddTopic = (moduleId: string) => {
    // TODO: Implement topic creation
    console.log('Add topic for module:', moduleId);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Code;
  };

  const SpecialtyModulesSection = ({ 
    specialtyId, 
    onAddModule, 
    onEditModule, 
    onAddTopic 
  }: {
    specialtyId: string;
    onAddModule: () => void;
    onEditModule: (module: Module) => void;
    onAddTopic: (moduleId: string) => void;
  }) => {
    const { data: modules, isLoading } = useSpecialtyModules(specialtyId);

    if (isLoading) {
      return <div className="text-center py-4 font-armenian">Բեռնում...</div>;
    }

    return (
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 font-armenian">
            <BookOpen className="w-5 h-5" />
            Մոդուլներ ({modules?.length || 0})
          </h3>
          <Button onClick={onAddModule} className="font-armenian">
            <Plus className="w-4 h-4 mr-2" />
            Նոր մոդուլ ավելացնել
          </Button>
        </div>
        
        {!modules || modules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-armenian">
            Այս մասնագիտությունում դեռ մոդուլներ չկան
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((module) => (
              <SpecialtyModuleCard
                key={module.id}
                module={module}
                onEdit={onEditModule}
                onAddTopic={onAddTopic}
              />
            ))}
          </div>
        )}
      </div>
    );
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
        <h2 className="text-2xl font-bold font-armenian">Մասնագիտությունների կառավարում</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="font-armenian"
        >
          <Plus className="w-4 h-4 mr-2" />
          Նոր մասնագիտություն ավելացնել
        </Button>
      </div>

      <div className="space-y-4">
        {specialties?.map((specialty) => {
          const IconComponent = getIconComponent(specialty.icon);
          const isExpanded = expandedSpecialties.has(specialty.id);
          
          return (
            <Card key={specialty.id} className="group">
              <Collapsible open={isExpanded} onOpenChange={() => toggleSpecialty(specialty.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${specialty.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="font-armenian text-xl">{specialty.name}</CardTitle>
                          <p className="text-sm text-muted-foreground font-armenian mt-1">{specialty.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <div className="text-xs text-muted-foreground font-armenian">
                          Հերթ՝ {specialty.order_index}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${specialty.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} font-armenian`}>
                          {specialty.is_active ? 'Ակտիվ' : 'Ոչ ակտիվ'}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(specialty)}
                          className="font-armenian"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Խմբագրել
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(specialty.id)}
                          className="font-armenian"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Ջնջել
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <SpecialtyModulesSection 
                      specialtyId={specialty.id}
                      onAddModule={() => handleAddModule(specialty.id)}
                      onEditModule={handleEditModule}
                      onAddTopic={handleAddTopic}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Create/Edit Specialty Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-armenian">
              {editingSpecialty ? 'Խմբագրել մասնագիտությունը' : 'Նոր մասնագիտություն ստեղծել'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name" className="font-armenian">Անուն (հայերեն)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name_en" className="font-armenian">Անուն (անգլերեն)</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="name_ru" className="font-armenian">Անուն (ռուսերեն)</Label>
                <Input
                  id="name_ru"
                  value={formData.name_ru}
                  onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
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
                <Label htmlFor="icon" className="font-armenian">Պատկերակ</Label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => {
                    console.log('Icon value selected:', value);
                    if (value && value.trim() !== '') {
                      setFormData({ ...formData, icon: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => {
                      const IconComponent = option.icon;
                      if (!option.value || option.value.trim() === '') {
                        console.error('Empty icon option value detected:', option);
                        return null;
                      }
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color" className="font-armenian">Գույն</Label>
                <Select 
                  value={formData.color} 
                  onValueChange={(value) => {
                    console.log('Color value selected:', value);
                    if (value && value.trim() !== '') {
                      setFormData({ ...formData, color: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => {
                      if (!option.value || option.value.trim() === '') {
                        console.error('Empty color option value detected:', option);
                        return null;
                      }
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded bg-gradient-to-r ${option.value}`}></div>
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
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
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={createSpecialty.isPending || updateSpecialty.isPending}
                className="font-armenian"
              >
                {(createSpecialty.isPending || updateSpecialty.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingSpecialty ? 'Թարմացնել' : 'Ստեղծել'}
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
        </DialogContent>
      </Dialog>

      {/* Module Form Dialog */}
      <ModuleFormDialog
        isOpen={moduleFormOpen}
        onClose={() => setModuleFormOpen(false)}
        specialtyId={selectedSpecialtyId}
        editingModule={editingModule}
      />
    </div>
  );
};

export default AdminSpecialtiesTab;
