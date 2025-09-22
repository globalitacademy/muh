import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarIcon, CheckCircle, Clock, AlertTriangle, Users, FileText, FolderKanban } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTaskAssignments, useStudentProjectTasks } from '@/hooks/useTaskAssignments';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { hy } from 'date-fns/locale';

interface TaskCompletionDialogProps {
  assignmentId: string;
  taskTitle: string;
  onComplete: (assignmentId: string, notes?: string) => void;
}

const TaskCompletionDialog: React.FC<TaskCompletionDialogProps> = ({ 
  assignmentId, 
  taskTitle, 
  onComplete 
}) => {
  const [open, setOpen] = useState(false);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(assignmentId, submissionNotes);
      setOpen(false);
      setSubmissionNotes('');
      toast({
        title: "Հաջողություն",
        description: "Առաջադրանքը նշվել է որպես կատարված",
      });
    } catch (error) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց կատարել գործողությունը",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Ներկայացնել առաջադրանքը
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ներկայացնել առաջադրանքը</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Առաջադրանք:</Label>
            <p className="text-sm text-muted-foreground mt-1">{taskTitle}</p>
          </div>
          
          <div>
            <Label htmlFor="submission-notes">Լրացուցիչ նշումներ (ոչ պարտադիր)</Label>
            <Textarea
              id="submission-notes"
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Նկարագրեք ինչպես եք կատարել առաջադրանքը, ինչ բարդություններ եք հանդիպել, ինչ արդյունքներ եք ստացել..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Ուղարկվում է..." : "Ներկայացնել"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Չեղարկել
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const TasksTab: React.FC = () => {
  const { user } = useAuth();
  const { data: projectSteps = [], isLoading } = useStudentProjectTasks(user?.id || "");
  const { submitStep } = useTaskAssignments();

  const handleSubmitTask = async (taskId: string, submissionNotes?: string) => {
    try {
      await submitStep.mutateAsync({ stepId: taskId, submissionNotes });
      toast({
        title: "Հաջողություն", 
        description: "Առաջադրանքը ներկայացվել է գնահատման",
      });
    } catch (error) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ներկայացնել առաջադրանքը",
        variant: "destructive",
      });
    }
  };

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

  const getStatusBadge = (task: any) => {
    switch (task.status) {
      case 'completed':
        return (
          <Badge className="bg-green-500/10 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Կատարված
          </Badge>
        );
      case 'submitted':
        return (
          <Badge className="bg-blue-500/10 text-blue-700">
            <Clock className="w-3 h-3 mr-1" />
            Ներկայացված
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Մերժված
          </Badge>
        );
      case 'returned':
        return (
          <Badge className="bg-orange-500/10 text-orange-700">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Վերադարձված
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-gray-500/10 text-gray-700">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Չեղարկված
          </Badge>
        );
      default:
        const isOverdue = task.due_date && isAfter(new Date(), new Date(task.due_date));
        
        if (isOverdue) {
          return (
            <Badge variant="destructive">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Ուշացած
            </Badge>
          );
        }
        
        return (
          <Badge className="bg-blue-500/10 text-blue-700">
            <Clock className="w-3 h-3 mr-1" />
            Ընթացքում
          </Badge>
        );
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

  const pendingTasks = projectSteps.filter(task => !['completed', 'cancelled'].includes(task.status));
  const completedTasks = projectSteps.filter(task => ['completed', 'cancelled'].includes(task.status));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Ընթացիկ առաջադրանքներ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center text-blue-600 mb-2">
              {pendingTasks.length}
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Սպասող կատարման
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Կատարված առաջադրանքներ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-center text-green-600 mb-2">
              {completedTasks.length}
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Բարեհաջող ավարտված
            </p>
          </CardContent>
        </Card>
      </div>

      {pendingTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Ընթացիկ առաջադրանքներ
          </h3>
          <div className="space-y-4">
            {pendingTasks.map((task) => {
              const isOverdue = task?.due_date && isAfter(new Date(), new Date(task.due_date));

              return (
                <Card key={task.id} className={`group hover:shadow-lg transition-all duration-200 ${isOverdue ? 'border-destructive/50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderKanban className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">{task?.project_title}</span>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {task?.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(task)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {task?.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {task?.due_date && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            Ժամկետ՝ {formatDistanceToNow(new Date(task.due_date), { 
                              addSuffix: true,
                              locale: hy 
                            })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Նախագիծ՝ {task?.project_title}</span>
                      </div>
                    </div>

                    {!['completed', 'submitted', 'cancelled'].includes(task.status) && (
                      <div className="pt-2">
                        <TaskCompletionDialog
                          assignmentId={task.id}
                          taskTitle={task?.title || 'Առաջադրանք'}
                          onComplete={handleSubmitTask}
                        />
                      </div>
                    )}
                    
                    {task.status === 'submitted' && (
                      <div className="pt-2">
                        <Badge className="bg-blue-500/10 text-blue-700">
                          <Clock className="w-3 h-3 mr-1" />
                          Սպասում է գնահատման
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Կատարված առաջադրանքներ
          </h3>
          <div className="space-y-4">
            {completedTasks.map((task) => {
              return (
                <Card key={task.id} className="opacity-75 hover:opacity-100 transition-opacity">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderKanban className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">{task?.project_title}</span>
                        </div>
                        <CardTitle className="text-lg">
                          {task?.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(task)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>
                          Կատարված
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {projectSteps.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">Ձեզ դեռ առաջադրանքներ չեն նշանակվել</p>
            <p className="text-sm text-muted-foreground mt-1">
              Առաջադրանքները կհայտնվեն այստեղ, երբ ձեր նախագծերի ղեկավարները դրանք նշանակեն
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};