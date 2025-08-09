import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMyProjects, useCreateProject, usePublicProjects } from '@/hooks/useProjects';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useUserRole } from '@/hooks/useUserRole';
import { useUserProjectApplications } from '@/hooks/useUserProjectApplications';
import { toast } from '@/hooks/use-toast';
import { Plus, FolderKanban, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectStats from '@/components/projects/ProjectStats';

const Projects = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading } = usePublicProjects();
  const { data: userRoles } = useUserRole();
  const { data: userApplications } = useUserProjectApplications();
  const createProject = useCreateProject();
  const { uploadImage, deleteImage, uploading } = useImageUpload({ bucket: 'project-files' });

  // Form state for project creation
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [maxApplicants, setMaxApplicants] = useState<number | undefined>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [uploadedImage, setUploadedImage] = useState<{ file: File; url: string } | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const canCreate = userRoles && ['instructor', 'employer'].includes(userRoles);

  // Get unique categories and skills
  const availableCategories = useMemo(() => {
    const categories = projects?.map(p => p.category).filter(Boolean) || [];
    return [...new Set(categories)];
  }, [projects]);

  const availableSkills = useMemo(() => {
    const skills = projects?.flatMap(p => p.required_skills || []) || [];
    return [...new Set(skills)];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects?.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      const matchesSkills = selectedSkills.length === 0 || 
                           selectedSkills.some(skill => project.required_skills?.includes(skill));
      
      return matchesSearch && matchesCategory && matchesStatus && matchesSkills;
    }) || [];
  }, [projects, searchTerm, selectedCategory, selectedStatus, selectedSkills]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      setUploadedImage({ file, url });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload image', variant: 'destructive' });
    }
  };

  const handleImageDelete = async () => {
    if (uploadedImage) {
      try {
        await deleteImage(uploadedImage.url);
        setUploadedImage(null);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete image', variant: 'destructive' });
      }
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !requiredSkills.includes(skill)) {
      setRequiredSkills([...requiredSkills, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter(skill => skill !== skillToRemove));
  };

  const onCreate = async () => {
    if (!title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }

    try {
      const projectData = await createProject.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
        required_skills: requiredSkills.length > 0 ? requiredSkills : undefined,
        application_deadline: applicationDeadline ? new Date(applicationDeadline).toISOString() : undefined,
        max_applicants: maxApplicants,
        start_date: startDate ? new Date(startDate).toISOString() : undefined,
        end_date: endDate ? new Date(endDate).toISOString() : undefined,
        image_url: uploadedImage?.url,
        is_public: true
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setRequiredSkills([]);
      setApplicationDeadline('');
      setMaxApplicants(undefined);
      setStartDate('');
      setEndDate('');
      setUploadedImage(null);
      setShowCreateForm(false);

      toast({ title: 'Success', description: 'Project created successfully!' });
      navigate(`/projects/${projectData.id}`);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create project', variant: 'destructive' });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedSkills([]);
  };

  const getAppliedProjectIds = () => {
    return userApplications?.map(app => app.project_id) || [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="content-container py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
              <FolderKanban className="h-8 w-8" />
              Նախագծեր
            </h1>
            <p className="text-muted-foreground mt-2">
              Բացահայտեք և մասնակցեք հետաքրքիր նախագծերի
            </p>
          </div>
          
          {canCreate && (
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn-modern"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ստեղծել նախագիծ
            </Button>
          )}
        </div>

        {/* Project Stats */}
        {projects && projects.length > 0 && (
          <div className="mb-8">
            <ProjectStats projects={projects} userRole={userRoles} />
          </div>
        )}

        {/* Create Project Form */}
        {showCreateForm && canCreate && (
          <Card className="modern-card mb-8">
            <CardHeader>
              <CardTitle>Նոր նախագծի ստեղծում</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Վերնագիր *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Նախագծի անվանումը"
                    className="input-modern"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Կատեգորիա</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="IT, Դիզայն, Մարկետինգ..."
                    className="input-modern"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Նկարագիր</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Նախագծի մանրամասն նկարագիրը..."
                  rows={4}
                  className="input-modern"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Սկսելու ամսաթիվ</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-modern"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ավարտի ամսաթիվ</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-modern"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline">Դիմումների վերջնաժամկետ</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    className="input-modern"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxApplicants">Առավելագույն մասնակիցներ</Label>
                  <Input
                    id="maxApplicants"
                    type="number"
                    value={maxApplicants || ''}
                    onChange={(e) => setMaxApplicants(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="10"
                    className="input-modern"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label>Պահանջվող հմտություններ</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Ավելացնել հմտություն"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="input-modern"
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    Ավելացնել
                  </Button>
                </div>
                {requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {requiredSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Նկար</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="input-modern"
                />
                {uploadedImage && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={uploadedImage.url}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2"
                      onClick={handleImageDelete}
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={onCreate} 
                  disabled={createProject.isPending || uploading}
                  className="btn-modern"
                >
                  {createProject.isPending ? 'Ստեղծվում է...' : 'Ստեղծել նախագիծ'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Չեղարկել
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Projects */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProjectFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedSkills={selectedSkills}
              onSkillsChange={setSelectedSkills}
              availableCategories={availableCategories}
              availableSkills={availableSkills}
              onClear={clearFilters}
            />
          </div>

          {/* Projects Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg" />
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <Card className="modern-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Նախագծեր չեն գտնվել</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedSkills.length > 0
                      ? 'Փորձեք փոխել ֆիլտրերը կամ որոնման պայմանները'
                      : canCreate
                      ? 'Դուք առաջինն եք կարող ստեղծել նախագիծ։'
                      : 'Նախագծեր դեռ չեն ավելացվել։'
                    }
                  </p>
                  {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedSkills.length > 0) && (
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Մաքրել ֆիլտրերը
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    showActions={true}
                    isApplied={getAppliedProjectIds().includes(project.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;