import React, { useState } from 'react';
import { useAdminSpecialties, useCreateSpecialty, useUpdateSpecialty, useDeleteSpecialty } from '@/hooks/useSpecialties';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { Specialty, CreateSpecialtyData } from '@/types/specialty';
import { Module } from '@/types/database';
import SpecialtyCard from './specialty/SpecialtyCard';
import SpecialtyFormDialog from './specialty/SpecialtyFormDialog';
import ModuleFormDialog from './specialty/ModuleFormDialog';

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold font-armenian">Մասնագիտությունների կառավարում</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="font-armenian w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Նոր մասնագիտություն ավելացնել</span>
          <span className="sm:hidden">Ավելացնել</span>
        </Button>
      </div>

      <div className="space-y-4">
        {specialties?.map((specialty) => (
          <SpecialtyCard
            key={specialty.id}
            specialty={specialty}
            isExpanded={expandedSpecialties.has(specialty.id)}
            onToggle={() => toggleSpecialty(specialty.id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddModule={handleAddModule}
            onEditModule={handleEditModule}
          />
        ))}
      </div>

      <SpecialtyFormDialog
        isOpen={isCreateModalOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        editingSpecialty={editingSpecialty}
        formData={formData}
        setFormData={setFormData}
        isLoading={createSpecialty.isPending || updateSpecialty.isPending}
      />

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
