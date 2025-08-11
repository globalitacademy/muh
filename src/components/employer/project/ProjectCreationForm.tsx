import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useImageUpload } from "@/hooks/useImageUpload";

const projectSchema = z.object({
  project_type: z.enum(['project', 'job', 'internship']),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  application_deadline: z.date().optional(),
  category: z.string().min(1, "Category is required"),
  organization: z.string().min(1, "Organization is required"),
  requirements: z.string().optional(),
  max_applicants: z.number().min(1).optional(),
  is_public: z.boolean().default(true),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectCreationFormProps {
  onSubmit: (data: ProjectFormData & { 
    required_skills: string[];
    useful_resources: Array<{ title: string; url: string }>;
    timeline: Array<{ phase: string; description: string; weeks: number }>;
    task_list: Array<{ title: string; description: string; required: boolean }>;
    cover_image_url?: string;
  }) => void;
  isLoading?: boolean;
}

export const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [resources, setResources] = useState<Array<{ title: string; url: string }>>([]);
  const [timeline, setTimeline] = useState<Array<{ phase: string; description: string; weeks: number }>>([]);
  const [taskList, setTaskList] = useState<Array<{ title: string; description: string; required: boolean }>>([]);
  const [coverImage, setCoverImage] = useState<string>("");
  
  const { uploadImage, uploading } = useImageUpload({ bucket: "project-files" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      is_public: true,
      project_type: 'project'
    }
  });

  const projectType = watch('project_type');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        setCoverImage(url);
      } catch (error) {
        toast.error("Failed to upload image");
      }
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const addResource = () => {
    setResources([...resources, { title: "", url: "" }]);
  };

  const updateResource = (index: number, field: string, value: string) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  };

  const removeResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const addTimelinePhase = () => {
    setTimeline([...timeline, { phase: "", description: "", weeks: 1 }]);
  };

  const updateTimelinePhase = (index: number, field: string, value: string | number) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], [field]: value };
    setTimeline(updated);
  };

  const removeTimelinePhase = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  const addTask = () => {
    setTaskList([...taskList, { title: "", description: "", required: true }]);
  };

  const updateTask = (index: number, field: string, value: string | boolean) => {
    const updated = [...taskList];
    updated[index] = { ...updated[index], [field]: value };
    setTaskList(updated);
  };

  const removeTask = (index: number) => {
    setTaskList(taskList.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data: ProjectFormData) => {
    onSubmit({
      ...data,
      required_skills: requiredSkills,
      useful_resources: resources.filter(r => r.title && r.url),
      timeline: timeline.filter(t => t.phase && t.description),
      task_list: taskList.filter(t => t.title),
      cover_image_url: coverImage || undefined,
    });
  };

  const resetForm = () => {
    reset();
    setRequiredSkills([]);
    setSkillInput("");
    setResources([]);
    setTimeline([]);
    setTaskList([]);
    setCoverImage("");
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New {projectType.charAt(0).toUpperCase() + projectType.slice(1)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project_type">Type</Label>
              <select {...register("project_type")} className="w-full p-2 border rounded-md">
                <option value="project">Project</option>
                <option value="job">Job</option>
                <option value="internship">Internship</option>
              </select>
              {errors.project_type && (
                <p className="text-sm text-destructive">{errors.project_type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input {...register("title")} placeholder="Enter title" />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input {...register("category")} placeholder="e.g., Web Development, Data Science" />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input {...register("organization")} placeholder="Organization or company name" />
              {errors.organization && (
                <p className="text-sm text-destructive">{errors.organization.message}</p>
              )}
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <Label htmlFor="cover_image">Cover Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded-md"
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
            {coverImage && (
              <div className="mt-2">
                <img src={coverImage} alt="Cover" className="w-32 h-32 object-cover rounded-md" />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              {...register("description")} 
              placeholder="Provide a detailed description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea 
              {...register("requirements")} 
              placeholder="List the requirements and qualifications"
              rows={3}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch('start_date') ? format(watch('start_date'), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watch('start_date')}
                    onSelect={(date) => setValue('start_date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch('end_date') ? format(watch('end_date'), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watch('end_date')}
                    onSelect={(date) => setValue('end_date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch('application_deadline') ? format(watch('application_deadline'), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watch('application_deadline')}
                    onSelect={(date) => setValue('application_deadline', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <Label>Required Skills</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Max Applicants */}
          <div>
            <Label htmlFor="max_applicants">Maximum Applicants (optional)</Label>
            <Input 
              type="number" 
              {...register("max_applicants", { valueAsNumber: true })} 
              placeholder="Leave empty for unlimited"
            />
          </div>

          {/* Useful Resources */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Useful Resources</Label>
              <Button type="button" onClick={addResource} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Resource
              </Button>
            </div>
            {resources.map((resource, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={resource.title}
                  onChange={(e) => updateResource(index, 'title', e.target.value)}
                  placeholder="Resource title"
                />
                <Input
                  value={resource.url}
                  onChange={(e) => updateResource(index, 'url', e.target.value)}
                  placeholder="URL"
                />
                <Button type="button" onClick={() => removeResource(index)} variant="outline" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Timeline</Label>
              <Button type="button" onClick={addTimelinePhase} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Phase
              </Button>
            </div>
            {timeline.map((phase, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <Input
                  value={phase.phase}
                  onChange={(e) => updateTimelinePhase(index, 'phase', e.target.value)}
                  placeholder="Phase name"
                />
                <Input
                  value={phase.description}
                  onChange={(e) => updateTimelinePhase(index, 'description', e.target.value)}
                  placeholder="Description"
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={phase.weeks}
                    onChange={(e) => updateTimelinePhase(index, 'weeks', parseInt(e.target.value) || 1)}
                    placeholder="Weeks"
                    min="1"
                  />
                  <Button type="button" onClick={() => removeTimelinePhase(index)} variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Task List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Implementation Steps</Label>
              <Button type="button" onClick={addTask} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            </div>
            {taskList.map((task, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={task.title}
                  onChange={(e) => updateTask(index, 'title', e.target.value)}
                  placeholder="Task title"
                />
                <Input
                  value={task.description}
                  onChange={(e) => updateTask(index, 'description', e.target.value)}
                  placeholder="Task description"
                />
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Required</Label>
                  <Switch
                    checked={task.required}
                    onCheckedChange={(checked) => updateTask(index, 'required', checked)}
                  />
                  <Button type="button" onClick={() => removeTask(index)} variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Public Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={watch('is_public')}
              onCheckedChange={(checked) => setValue('is_public', checked)}
            />
            <Label>Make this {projectType} public</Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : `Create ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}`}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};