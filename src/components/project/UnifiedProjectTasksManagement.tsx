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
import { CalendarIcon, Plus, Trash2, Edit3, Users, Clock, CheckCircle, AlertTriangle, Send, Eye, ArrowUp, ArrowDown, CheckSquare } from "lucide-react";
import { useUnifiedProjectTasks, UnifiedProjectTask, CreateUnifiedTaskData, SubmitTaskData, ReviewTaskData } from "@/hooks/useUnifiedProjectTasks";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import { hy } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";

interface UnifiedProjectTasksManagementProps {
  projectId: string;
}

interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  order_index?: number;
  assigned_to: string[];
}

const CreateTaskDialog: React.FC<{ projectId: string; onTaskCreated: () => void }> = ({ projectId, onTaskCreated }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    assigned_to: []
  });

  const { createTask } = useUnifiedProjectTasks(projectId);

  // Get project applicants and members
  const { data: applicants = [] } = useQuery({
    queryKey: ['project-applicants', projectId],
    queryFn: async () => {
      const { data: applications, error } = await supabase
        .from('project_applications')
        .select('applicant_id')
        .eq('project_id', projectId)
        .eq('status', 'approved');
      
      if (error) throw error;
      if (!applications || applications.length === 0) return [];
      
      const applicantIds = applications.map(app => app.applicant_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', applicantIds);
        
      if (profilesError) throw profilesError;
      
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
        order_index: formData.order_index,
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
        <Button className="bg-edu-blue hover:bg-edu-blue/90">
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
            <Label htmlFor="order_index">Հերթականություն (ոչ պարտադիր)</Label>
            <Input
              id="order_index"
              type="number"
              value={formData.order_index || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, order_index: e.target.value ? parseInt(e.target.value) : undefined }))}
              placeholder="Թողնել դատարկ ավտոմատ համարակալման համար"
            />
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

const TaskSubmissionDialog: React.FC<{ task: UnifiedProjectTask; onSubmit: (data: SubmitTaskData) => void }> = ({ task, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ taskId: task.id, submissionNotes });
    setSubmissionNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Send className="w-4 h-4 mr-1" />
          Ներկայացնել
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ներկայացնել առաջադրանքը</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="submission_notes">Ներկայացման նշումներ</Label>
            <Textarea
              id="submission_notes"
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Ավելացրեք նշումներ ձեր կատարած աշխատանքի վերաբերյալ..."
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Ներկայացնել
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

const TaskReviewDialog: React.FC<{ task: UnifiedProjectTask; onReview: (data: ReviewTaskData) => void }> = ({ task, onReview }) => {
  const [open, setOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'returned'>('approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReview({ taskId: task.id, status: reviewStatus, reviewNotes });
    setReviewNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4 mr-1" />
          Գնահատել
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Գնահատել առաջադրանքը</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Ուսանողի ներկայացրած նշումները:</h4>
            <p className="text-sm text-muted-foreground">
              {task.submission_notes || 'Նշումներ չկան'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Գնահատման արդյունք</Label>
              <Select value={reviewStatus} onValueChange={(value: 'approved' | 'returned') => setReviewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Հաստատել</SelectItem>
                  <SelectItem value="returned">Վերադարձնել ուղղման</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="review_notes">Գնահատման նշումներ</Label>
              <Textarea
                id="review_notes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Ավելացրեք ձեր գնահատականը և առաջարկությունները..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {reviewStatus === 'approved' ? 'Հաստատել' : 'Վերադարձնել'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Չեղարկել
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UnifiedTaskCard: React.FC<{ 
  task: UnifiedProjectTask; 
  onDelete: (id: string) => void; 
  onUpdate: () => void;
  onSubmit: (data: SubmitTaskData) => void;
  onReview: (data: ReviewTaskData) => void;
  isCreator: boolean;
  currentUserId?: string;
}> = ({ task, onDelete, onUpdate, onSubmit, onReview, isCreator, currentUserId }) => {
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
      overdue: 'bg-red-500/10 text-red-700',
      submitted: 'bg-purple-500/10 text-purple-700',
      approved: 'bg-green-500/10 text-green-700',
      returned: 'bg-orange-500/10 text-orange-700'
    };
    
    const labels = {
      pending: 'Սպասում է',
      in_progress: 'Իրականացվում է',
      completed: 'Կատարված',
      overdue: 'Ուշացած',
      submitted: 'Ներկայացված',
      approved: 'Հաստատված',
      returned: 'Վերադարձված'
    };

    const icons = {
      pending: Clock,
      in_progress: Users,
      completed: CheckCircle,
      overdue: AlertTriangle,
      submitted: Send,
      approved: CheckCircle,
      returned: AlertTriangle
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
  const isAssigned = task.assignments?.some(a => a.assigned_to === currentUserId);
  const canSubmit = isAssigned && ['pending', 'in_progress', 'returned'].includes(task.status);
  const canReview = isCreator && task.status === 'submitted';

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {task.order_index > 0 && (
              <Badge variant="secondary" className="text-xs">
                #{task.order_index}
              </Badge>
            )}
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {task.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {getPriorityBadge(task.priority)}
                {getStatusBadge(task.status)}
                {isOverdue && !['completed', 'approved'].includes(task.status) && (
                  <Badge variant="destructive">Ուշացած</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-1">
            {canSubmit && (
              <TaskSubmissionDialog task={task} onSubmit={onSubmit} />
            )}
            {canReview && (
              <TaskReviewDialog task={task} onReview={onReview} />
            )}
            {isCreator && (
              <>
                <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                  <Edit3 className="w-4 h-4" />
                </Button>
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
              </>
            )}
          </div>
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
            <div className="space-y-2">
              {task.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`p-3 rounded-lg border ${
                    assignment.completed_at 
                      ? 'bg-green-500/5 border-green-200' 
                      : 'bg-gray-500/5 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={assignment.profiles?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {assignment.profiles?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{assignment.profiles?.name || 'Անանուն'}</span>
                    {assignment.completed_at && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Ներկայացվել է</span>
                      </div>
                    )}
                  </div>
                  
                  {assignment.completed_at && (
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>
                        Ներկայացման ամսաթիվ: {format(new Date(assignment.completed_at), 'dd.MM.yyyy HH:mm', { locale: hy })}
                      </div>
                      {assignment.submission_notes && (
                        <div className="mt-2">
                          <div className="font-medium">Ներկայացման նշումներ:</div>
                          <div className="bg-white/50 p-2 rounded mt-1 text-foreground">
                            {assignment.submission_notes}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show submission details for task-level submissions */}
        {task.submitted_at && (
          <div className="p-3 rounded-lg bg-blue-500/5 border-blue-200">
            <div className="text-sm font-medium text-blue-700 mb-1">
              Ներկայացված է: {format(new Date(task.submitted_at), 'dd.MM.yyyy HH:mm', { locale: hy })}
            </div>
            {task.submission_notes && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Նշումներ:</span> {task.submission_notes}
              </div>
            )}
          </div>
        )}

        {/* Show review details */}
        {task.reviewed_at && (
          <div className="p-3 rounded-lg bg-green-500/5 border-green-200">
            <div className="text-sm font-medium text-green-700 mb-1">
              Գնահատված է: {format(new Date(task.reviewed_at), 'dd.MM.yyyy HH:mm', { locale: hy })}
            </div>
            {task.review_notes && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Գնահատման նշումներ:</span> {task.review_notes}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const UnifiedProjectTasksManagement: React.FC<UnifiedProjectTasksManagementProps> = ({ projectId }) => {
  const { user } = useAuth();
  const { data: tasks = [], isLoading, refetch } = useUnifiedProjectTasks(projectId);
  const { deleteTask, submitTask, reviewTask } = useUnifiedProjectTasks(projectId);

  // Check if current user is project creator
  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('creator_id')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const isCreator = project?.creator_id === user?.id;

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

  const handleSubmitTask = async (data: SubmitTaskData) => {
    try {
      await submitTask.mutateAsync(data);
      toast({
        title: "Հաջողություն",
        description: "Առաջադրանքը ներկայացվել է",
      });
    } catch (error) {
      toast({
        title: "Սխալ",
        description: "Առաջադրանքը չհաջողվեց ներկայացնել",
        variant: "destructive",
      });
    }
  };

  const handleReviewTask = async (data: ReviewTaskData) => {
    try {
      await reviewTask.mutateAsync(data);
      toast({
        title: "Հաջողություն",
        description: data.status === 'approved' ? "Առաջադրանքը հաստատվել է" : "Առաջադրանքը վերադարձվել է ուղղման",
      });
    } catch (error) {
      toast({
        title: "Սխալ",
        description: "Գնահատումը չհաջողվեց պահպանել",
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
          <h3 className="text-xl font-bold">Առաջադրանքներ և քայլեր</h3>
          <p className="text-sm text-muted-foreground">
            Միավորված տեսք նախագծի բոլոր առաջադրանքների և քայլերի
          </p>
        </div>
        {isCreator && (
          <CreateTaskDialog projectId={projectId} onTaskCreated={refetch} />
        )}
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">Առաջադրանքներ դեռ չկան</p>
            <p className="text-sm text-muted-foreground mt-1">
              Ստեղծեք առաջին առաջադրանքը ուսանողների համար
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <UnifiedTaskCard 
              key={task.id} 
              task={task} 
              onDelete={handleDeleteTask} 
              onUpdate={refetch}
              onSubmit={handleSubmitTask}
              onReview={handleReviewTask}
              isCreator={isCreator}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};