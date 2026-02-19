import React, { useState } from 'react';
import { useAdminSpecialties, useCreateSpecialty, useUpdateSpecialty, useDeleteSpecialty } from '@/hooks/useSpecialties';
import { useSpecialtyModules } from '@/hooks/useSpecialtyModules';
import { useTopics } from '@/hooks/useTopics';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, ArrowLeft, BookOpen, Edit, Trash2, Clock, Users, Star, Lock, Unlock, FileText, HelpCircle, Link as LinkIcon } from 'lucide-react';
import { Specialty, CreateSpecialtyData } from '@/types/specialty';
import { Module, Topic } from '@/types/database';
import { iconOptions } from './specialty/SpecialtyConstants';
import SpecialtyFormDialog from './specialty/SpecialtyFormDialog';
import ModuleFormDialog from './specialty/ModuleFormDialog';
import TopicFormDialog from './specialty/TopicFormDialog';
import UpdateTopicContentButton from './specialty/UpdateTopicContentButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDeleteModule, useUpdateModule } from '@/hooks/useAdminModules';
import { useDeleteTopic } from '@/hooks/useAdminTopics';


type View =
{type: 'specialties';} |
{type: 'modules';specialty: Specialty;} |
{type: 'topics';specialty: Specialty;module: Module;};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':return 'bg-green-500/15 text-green-700 dark:text-green-300';
    case 'inactive':return 'bg-red-500/15 text-red-700 dark:text-red-300';
    case 'coming_soon':return 'bg-muted text-muted-foreground';
    default:return 'bg-green-500/15 text-green-700 dark:text-green-300';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':return '\u0531\u056F\u057F\u056B\u057E';
    case 'inactive':return '\u0548\u0579 \u0561\u056F\u057F\u056B\u057E';
    case 'coming_soon':return '\u0547\u0578\u0582\u057F\u0578\u057E';
    default:return '\u0531\u056F\u057F\u056B\u057E';
  }
};

const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'beginner':return 'bg-primary text-white';
    case 'intermediate':return 'bg-edu-orange text-white';
    case 'advanced':return 'bg-destructive text-white';
    default:return 'bg-muted-foreground text-white';
  }
};

const getDifficultyLabel = (level: string) => {
  switch (level) {
    case 'beginner':return '\u054D\u056F\u057D\u0576\u0561\u056F';
    case 'intermediate':return '\u0544\u056B\u057B\u056B\u0576';
    case 'advanced':return '\u0532\u0561\u0580\u0571\u0580\u0561\u056F\u0561\u0580\u0563';
    default:return level;
  }
};

const AdminSpecialtiesTab = () => {
  const { data: specialties, isLoading } = useAdminSpecialties();
  const createSpecialty = useCreateSpecialty();
  const updateSpecialty = useUpdateSpecialty();
  const deleteSpecialty = useDeleteSpecialty();

  const [view, setView] = useState<View>({ type: 'specialties' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [moduleFormOpen, setModuleFormOpen] = useState(false);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const [formData, setFormData] = useState<CreateSpecialtyData>({
    name: '', name_en: '', name_ru: '',
    description: '', description_en: '', description_ru: '',
    icon: 'Code', color: 'from-blue-500 to-cyan-500',
    order_index: 0, status: 'active'
  });

  const resetForm = () => {
    setFormData({
      name: '', name_en: '', name_ru: '',
      description: '', description_en: '', description_ru: '',
      icon: 'Code', color: 'from-blue-500 to-cyan-500',
      order_index: 0, status: 'active'
    });
    setIsCreateModalOpen(false);
    setEditingSpecialty(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSpecialty) {
      await updateSpecialty.mutateAsync({ id: editingSpecialty.id, updates: formData });
    } else {
      await createSpecialty.mutateAsync(formData);
    }
    resetForm();
  };

  const handleEdit = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setFormData({
      name: specialty.name || '', name_en: specialty.name_en || '', name_ru: specialty.name_ru || '',
      description: specialty.description || '', description_en: specialty.description_en || '', description_ru: specialty.description_ru || '',
      icon: specialty.icon || 'Code', color: specialty.color || 'from-blue-500 to-cyan-500',
      order_index: specialty.order_index || 0, status: specialty.status || 'active'
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (specialtyId: string) => {
    if (confirm('\u054E\u057D\u057F\u0561\u0570 \u0565\u0584, \u0578\u0580 \u0578\u0582\u0566\u0578\u0582\u0574 \u0565\u0584 \u057B\u0576\u057B\u0565\u056C \u0561\u0575\u057D \u0574\u0561\u057D\u0576\u0561\u0563\u056B\u057F\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568:')) {
      await deleteSpecialty.mutateAsync(specialtyId);
    }
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

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.value === iconName);
    return iconOption ? iconOption.icon : iconOptions[0].icon;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>);

  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      {view.type !== 'specialties' &&
      <Button
        variant="ghost"
        onClick={() => {
          if (view.type === 'topics') setView({ type: 'modules', specialty: view.specialty });else
          setView({ type: 'specialties' });
        }}
        className="font-armenian gap-2">

          <ArrowLeft className="w-4 h-4" />
          {view.type === 'modules' ? '\u0544\u0561\u057D\u0576\u0561\u0563\u056B\u057F\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580' : view.specialty.name}
        </Button>
      }

      {view.type === 'specialties' &&
      <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold font-armenian">{'\u0544\u0561\u057D\u0576\u0561\u0563\u056B\u057F\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580\u056B \u056F\u0561\u057C\u0561\u057E\u0561\u0580\u0578\u0582\u0574'}</h2>
            <Button onClick={() => setIsCreateModalOpen(true)} className="font-armenian w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{'\u0546\u0578\u0580 \u0574\u0561\u057D\u0576\u0561\u0563\u056B\u057F\u0578\u0582\u0569\u0575\u0578\u0582\u0576 \u0561\u057E\u0565\u056C\u0561\u0581\u0576\u0565\u056C'}</span>
              <span className="sm:hidden">{'\u0531\u057E\u0565\u056C\u0561\u0581\u0576\u0565\u056C'}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties?.map((specialty) => {
            const IconComp = getIconComponent(specialty.icon);
            return (
              <Card
                key={specialty.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border/50 overflow-hidden"
                onClick={() => setView({ type: 'modules', specialty })}>

                  <CardContent className="p-6 flex flex-col gap-4 h-full">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-r ${specialty.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComp className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg font-armenian truncate">{specialty.name}</h3>
                        <p className="text-sm text-muted-foreground font-armenian line-clamp-2 mt-1">{specialty.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(specialty.status)}`}>
                        {getStatusLabel(specialty.status)}
                      </span>
                      <span className="text-xs text-muted-foreground font-armenian">{'\u0540\u0565\u0580\u0569\u055D'} {specialty.order_index}</span>
                    </div>
                    <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(specialty)} className="font-armenian flex-1">
                        <Edit className="w-4 h-4 mr-1" /> {'\u053D\u0574\u0562\u0561\u0563\u0580\u0565\u056C'}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(specialty.id)} className="font-armenian flex-1">
                        <Trash2 className="w-4 h-4 mr-1" /> {'\u054B\u0576\u057B\u0565\u056C'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>);

          })}
          </div>
        </>
      }

      {view.type === 'modules' &&
      <ModulesView
        specialty={view.specialty}
        onSelectModule={(module) => setView({ type: 'topics', specialty: view.specialty, module })}
        onAddModule={() => handleAddModule(view.specialty.id)}
        onEditModule={handleEditModule} />

      }

      {view.type === 'topics' &&
      <TopicsView module={view.module} />
      }

      <SpecialtyFormDialog
        isOpen={isCreateModalOpen}
        onClose={resetForm}
        onSubmit={handleSubmit}
        editingSpecialty={editingSpecialty}
        formData={formData}
        setFormData={setFormData}
        isLoading={createSpecialty.isPending || updateSpecialty.isPending} />

      <ModuleFormDialog
        isOpen={moduleFormOpen}
        onClose={() => setModuleFormOpen(false)}
        specialtyId={selectedSpecialtyId}
        editingModule={editingModule} />

    </div>);

};

// ─── MODULES VIEW ───
const ModulesView = ({ specialty, onSelectModule, onAddModule, onEditModule




}: {specialty: Specialty;onSelectModule: (module: Module) => void;onAddModule: () => void;onEditModule: (module: Module) => void;}) => {
  const { data: modules, isLoading } = useSpecialtyModules(specialty.id);
  const deleteModule = useDeleteModule();
  const updateModule = useUpdateModule();

  const handleDelete = async (e: React.MouseEvent, moduleId: string) => {
    e.stopPropagation();
    if (confirm('\u054E\u057D\u057F\u0561\u057E\u0561\u057E\u0561\u0584 \u0565\u0584, \u0578\u0580 \u0578\u0582\u0566\u0578\u0582\u0574 \u0565\u0584 \u057B\u0576\u057B\u0565\u056C \u0561\u0575\u057D \u0574\u0578\u0564\u0578\u0582\u056C\u0568:')) {
      await deleteModule.mutateAsync(moduleId);
    }
  };

  const handleStatusChange = async (moduleId: string, newStatus: string) => {
    await updateModule.mutateAsync({
      id: moduleId,
      updates: { status: newStatus as 'draft' | 'active' | 'archived' | 'coming_soon' }
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold font-armenian">{specialty.name} — {'\u0544\u0578\u0564\u0578\u0582\u056C\u0576\u0565\u0580'}</h2>
        <Button onClick={onAddModule} className="font-armenian">
          <Plus className="w-4 h-4 mr-2" /> {'\u0546\u0578\u0580 \u0574\u0578\u0564\u0578\u0582\u056C \u0561\u057E\u0565\u056C\u0561\u0581\u0576\u0565\u056C'}
        </Button>
      </div>

      {!modules || modules.length === 0 ?
      <div className="text-center py-12 text-muted-foreground font-armenian">
          {'\u0531\u0575\u057D \u0574\u0561\u057D\u0576\u0561\u0563\u056B\u057F\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0578\u0582\u0574 \u0564\u0565\u057C \u0574\u0578\u0564\u0578\u0582\u056C\u0576\u0565\u0580 \u0579\u056F\u0561\u0576'}
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) =>
        <Card
          key={module.id}
          className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-border/50 overflow-hidden"
          onClick={() => onSelectModule(module)}>

              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div>
                  <h3 className="font-bold text-lg font-armenian">{module.title}</h3>
                  {module.description &&
              <p className="text-sm text-muted-foreground font-armenian line-clamp-2 mt-1">{module.description}</p>
              }
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={getDifficultyColor(module.difficulty_level)}>
                    {getDifficultyLabel(module.difficulty_level)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" /> {module.duration_weeks} {'\u0577\u0561\u0562\u0561\u0569'}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" /> {module.total_lessons} {'\u0564\u0561\u057D'}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" /> {module.students_count}
                  </div>
                  {module.rating &&
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-warning-yellow text-warning-yellow" /> {module.rating}
                    </div>
              }
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-edu-blue">{module.price}{'\u058E'}</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Select value={module.status} onValueChange={(v) => handleStatusChange(module.id, v)}>
                      <SelectTrigger className="h-7 text-xs w-28 font-armenian">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{'\u054D\u0587\u0561\u0563\u056B\u0580'}</SelectItem>
                        <SelectItem value="active">{'\u0531\u056F\u057F\u056B\u057E'}</SelectItem>
                        <SelectItem value="coming_soon">{'\u0547\u0578\u0582\u057F\u0578\u057E'}</SelectItem>
                        <SelectItem value="archived">{'\u0531\u0580\u056D\u056B\u057E'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" onClick={() => onEditModule(module)} className="font-armenian flex-1">
                    <Edit className="w-4 h-4 mr-1" /> {'\u053D\u0574\u0562\u0561\u0563\u0580\u0565\u056C'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={(e) => handleDelete(e, module.id)} className="font-armenian flex-1">
                    <Trash2 className="w-4 h-4 mr-1" /> {'\u054B\u0576\u057B\u0565\u056C'}
                  </Button>
                </div>
              </CardContent>
            </Card>
        )}
        </div>
      }
    </>);

};

// ─── TOPIC CONTENT PREVIEW ───
const TopicContentPreview = ({ content }: {content: string;}) => {
  const parsed = React.useMemo(() => {
    try {
      const data = JSON.parse(content);
      if (data?.sections && Array.isArray(data.sections)) {
        return data.sections.map((s: any) => s.title).filter(Boolean);
      }
    } catch {



      // Not JSON, treat as plain text
    }return null;}, [content]);
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4" />
        <span className="text-sm font-medium font-armenian">{'\u0532\u0578\u057E\u0561\u0576\u0564\u0561\u056F\u0578\u0582\u0569\u0575\u0578\u0582\u0576'}:</span>
      </div>
      <div className="p-3 bg-muted rounded text-sm max-h-40 overflow-y-auto space-y-1">
        {parsed ?
        <ul className="list-disc list-inside space-y-1 font-armenian text-muted-foreground">
            {parsed.map((title: string, i: number) =>
          <li key={i} className="text-left">{title}</li>
          )}
          </ul> :

        <p className="text-muted-foreground font-armenian">
            {content.substring(0, 300)}{content.length > 300 && '...'}
          </p>
        }
      </div>
    </div>);

};

// ─── TOPICS VIEW ───
const TopicsView = ({ module }: {module: Module;}) => {
  const { data: topics, isLoading } = useTopics(module.id);
  const deleteTopic = useDeleteTopic();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const handleDeleteTopic = async (topicId: string) => {
    if (confirm('\u054E\u057D\u057F\u0561\u057E\u0561\u057E\u0561\u0584 \u0565\u0584, \u0578\u0580 \u0578\u0582\u0566\u0578\u0582\u0574 \u0565\u0584 \u057B\u0576\u057B\u0565\u056C \u0561\u0575\u057D \u0569\u0565\u0574\u0561\u0576:')) {
      await deleteTopic.mutateAsync(topicId);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-2">
        <UpdateTopicContentButton />
        <Button onClick={() => {setEditingTopic(null);setIsFormOpen(true);}} className="font-armenian">
          <Plus className="w-4 h-4 mr-1" /> {'\u0546\u0578\u0580 \u0569\u0565\u0574\u0561'}
        </Button>
      </div>
      <h2 className="text-xl md:text-2xl font-bold font-armenian">{module.title} — {'\u0539\u0565\u0574\u0561\u0576\u0565\u0580'}</h2>

      {!topics || topics.length === 0 ?
      <div className="text-center py-12 text-muted-foreground font-armenian">
          {'\u0531\u0575\u057D \u0574\u0578\u0564\u0578\u0582\u056C\u0578\u0582\u0574 \u0564\u0565\u057C \u0569\u0565\u0574\u0561\u0576\u0565\u0580 \u0579\u056F\u0561\u0576'}
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic, index) =>
          <Card key={topic.id} className="group border-t-4 border-t-primary border border-border/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden flex flex-col">
              <CardContent className="p-5 flex flex-col gap-3 h-full">
                {/* Row 1: index + lock + title */}
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-primary min-w-[1.5rem] mt-0.5">{index + 1}.</span>
                  {topic.is_free
                    ? <Unlock className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    : <Lock className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />}
                  <span className="font-semibold font-armenian leading-snug">{topic.title}</span>
                </div>

                {/* Row 2: badge + duration */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={topic.is_free ? 'secondary' : 'default'}>
                    {topic.is_free ? '\u0531\u0576\u057E\u0573\u0561\u0580' : '\u054E\u0573\u0561\u0580\u0578\u057E\u056B'}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {topic.duration_minutes}{'\u0580'}
                  </div>
                </div>

                {/* Content section */}
                <div className="flex-1 space-y-2 min-h-0">
                  {topic.description &&
                  <p className="text-sm text-muted-foreground font-armenian line-clamp-3">{topic.description}</p>
                  }
                  {topic.video_url &&
                  <div className="flex items-center gap-2">
                      <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <a href={topic.video_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-armenian truncate">
                        {'\u0534\u056B\u057F\u0565\u056C \u057E\u056B\u0564\u0565\u0578\u0576'}
                      </a>
                    </div>
                  }
                  {topic.content && <TopicContentPreview content={topic.content} />}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    {topic.exercises && <div className="flex items-center gap-1"><FileText className="w-3 h-3" /><span className="font-armenian">{'\u054E\u0561\u0580\u056A\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580'}</span></div>}
                    {topic.quiz_questions && <div className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /><span className="font-armenian">{'\u054E\u056B\u056F\u057F\u0578\u0580\u056B\u0576\u0561'}</span></div>}
                    {topic.resources && <div className="flex items-center gap-1"><LinkIcon className="w-3 h-3" /><span className="font-armenian">{'\u054C\u0565\u057D\u0578\u0582\u0580\u057D\u0576\u0565\u0580'}</span></div>}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto pt-2">
                  <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation();setEditingTopic(topic);setIsFormOpen(true);}} className="font-armenian flex-1">
                    <Edit className="w-3 h-3 mr-1" /> {'\u053D\u0574\u0562\u0561\u0563\u0580\u0565\u056C'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={(e) => {e.stopPropagation();handleDeleteTopic(topic.id);}} disabled={deleteTopic.isPending} className="font-armenian flex-1">
                    <Trash2 className="w-3 h-3 mr-1" /> {'\u054B\u0576\u057B\u0565\u056C'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      }

      <TopicFormDialog isOpen={isFormOpen} onClose={() => {setIsFormOpen(false);setEditingTopic(null);}} moduleId={module.id} editingTopic={editingTopic} />
    </>);

};

export default AdminSpecialtiesTab;