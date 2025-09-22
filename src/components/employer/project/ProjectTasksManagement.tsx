import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Plus, Trash2, Users, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useProjectTasks, ProjectTask } from "@/hooks/useProjectTasks";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import { hy } from "date-fns/locale";

interface ProjectTasksManagementProps {
  projectId: string;
}

interface CreateTaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  assigned_to: string[];
}

const CreateTaskDialog: React.FC<{ projectId: string; onTaskCreated: () => void }> = ({ projectId, onTaskCreated }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTaskFormData>({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    assigned_to: []
  });

  const { createTask } = useProjectTasks(projectId);

  // Get project applicants and members
  const { data: applicants = [] } = useQuery({
    queryKey: ['project-applicants', projectId],
    queryFn: async () => {
      // First get approved applications
      const { data: applications, error } = await supabase
        .from('project_applications')
        .select('applicant_id')
        .eq('project_id', projectId)
        .eq('status', 'approved');
      
      if (error) throw error;
      
      if (!applications || applications.length === 0) return [];
      
      // Then get profiles for these applicants
      const applicantIds = applications.map(app => app.applicant_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', applicantIds);
        
      if (profilesError) throw profilesError;
      
      // Combine data
      return applications.map(app => ({
        applicant_id: app.applicant_id,
        profiles: profiles?.find(profile => profile.id === app.applicant_id) || null
      }));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Սխալ",
        description: "Նշեք առաջադրանքի անվանումը",
        variant: "destructive",
      });
      return;
    }

    if (formData.assigned_to.length === 0) {
      toast({
        title: "Սխալ", 
        description: "Ընտրեք առնվազն մեկ ուսանող",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTask.mutateAsync({
        project_id: projectId,
        title: formData.title,
        description: formData.description || undefined,
        due_date: formData.due_date || undefined,
        priority: formData.priority,
        assigned_to: formData.assigned_to
      });

      toast({
        title: "Հաջողություն",
        description: "Առաջադրանքը ստեղծվել է",
      });

      setFormData({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        assigned_to: []
      });
      setOpen(false);
      onTaskCreated();
    } catch (error) {
      toast({
        title: "Սխալ",
        description: "Առաջադրանքը չհաջողվեց ստեղծել",
        variant: "destructive",
      });
    }
  };

  const handleUserToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_to: prev.assigned_to.includes(userId)
        ? prev.assigned_to.filter(id => id !== userId)
        : [...prev.assigned_to, userId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Նոր առաջադրանք
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ստեղծել նոր առաջադրանք</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Անվանում *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Առաջադրանքի անվանումը"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Նկարագրություն</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Առաջադրանքի մանրամասն նկարագրությունը"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="due_date">Կատարման ժամկետ</Label>
              <Input
                id="due_date"
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="priority">Կարևորություն</Label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Ցածր</SelectItem>
                  <SelectItem value="medium">Միջին</SelectItem>
                  <SelectItem value="high">Բարձր</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Նշանակել ուսանողներին *</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
              {applicants.length === 0 ? (
                <p className="text-sm text-muted-foreground">Հաստատված ուսանողներ չկան</p>
              ) : (
                applicants.map((applicant) => (
                  <div key={applicant.applicant_id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${applicant.applicant_id}`}
                      checked={formData.assigned_to.includes(applicant.applicant_id)}
                      onCheckedChange={() => handleUserToggle(applicant.applicant_id)}
                    />
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={applicant.profiles?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {applicant.profiles?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <Label htmlFor={`user-${applicant.applicant_id}`} className="text-sm cursor-pointer">
                      {applicant.profiles?.name || 'Անանուն'}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={createTask.isPending} className="flex-1">
              {createTask.isPending ? "Ստեղծվում է..." : "Ստեղծել"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Չեղարկել
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TaskCard: React.FC<{ task: ProjectTask; onDelete: (id: string) => void }> = ({ task, onDelete }) => {
  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-green-500/10 text-green-700 border-green-200',
      medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
      high: 'bg-red-500/10 text-red-700 border-red-200'
    };
    
    const labels = {
      low: 'Ցածր',
      medium: 'Միջին', 
      high: 'Բարձր'
    };

    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-gray-500/10 text-gray-700',
      in_progress: 'bg-blue-500/10 text-blue-700',
      completed: 'bg-green-500/10 text-green-700',
      overdue: 'bg-red-500/10 text-red-700'
    };
    
    const labels = {
      pending: 'Սպասում է',
      in_progress: 'Իրականացվում է',
      completed: 'Կատարված',
      overdue: 'Ուշացած'
    };

    const icons = {
      pending: Clock,
      in_progress: Users,
      completed: CheckCircle,
      overdue: AlertTriangle
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        <Icon className="w-3 h-3 mr-1" />
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const isOverdue = task.due_date && isAfter(new Date(), new Date(task.due_date));
  const completedCount = task.assignments?.filter(a => a.completed_at).length || 0;
  const totalAssignments = task.assignments?.length || 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              {getPriorityBadge(task.priority)}
              {getStatusBadge(task.status)}
              {isOverdue && task.status !== 'completed' && (
                <Badge variant="destructive">Ուշացած</Badge>
              )}
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ջնջե՞լ առաջադրանքը</AlertDialogTitle>
                <AlertDialogDescription>
                  Այս գործողությունը չի կարելի հետ գցել։ Առաջադրանքը և բոլոր դրա հետ կապված նշանակումները կջնջվեն:
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Ջնջել
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {task.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{completedCount}/{totalAssignments} կատարված</span>
            </div>
            {task.due_date && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(task.due_date), { 
                    addSuffix: true,
                    locale: hy 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {task.assignments && task.assignments.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Նշանակված ուսանողներ:</Label>
            <div className="flex flex-wrap gap-2">
              {task.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                    assignment.completed_at 
                      ? 'bg-green-500/10 text-green-700' 
                      : 'bg-gray-500/10 text-gray-700'
                  }`}
                >
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={assignment.profiles?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {assignment.profiles?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{assignment.profiles?.name || 'Անանուն'}</span>
                  {assignment.completed_at && (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ProjectTasksManagement: React.FC<ProjectTasksManagementProps> = ({ projectId }) => {
  const { data: tasks = [], isLoading, refetch } = useProjectTasks(projectId);
  const { deleteTask } = useProjectTasks(projectId);

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync(taskId);
      toast({
        title: "Հաջողություն",
        description: "Առաջադրանքը ջնջվել է",
      });
    } catch (error) {
      toast({
        title: "Սխալ",
        description: "Առաջադրանքը չհաջողվեց ջնջել",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Բեռնվում է...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Առաջադրանքներ</h3>
          <p className="text-sm text-muted-foreground">
            Կառավարեք նախագծի առաջադրանքները և հետևեք կատարման ընթացքին
          </p>
        </div>
        <CreateTaskDialog projectId={projectId} onTaskCreated={refetch} />
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">Առաջադրանքներ դեռ չկան</p>
            <p className="text-sm text-muted-foreground mt-1">
              Ստեղծեք առաջին առաջադրանքը ուսանողների համար
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={handleDeleteTask} />
          ))}
        </div>
      )}
    </div>
  );
};