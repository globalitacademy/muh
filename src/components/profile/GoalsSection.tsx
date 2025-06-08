import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Plus, Calendar, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useUserGoals, useAddUserGoal, useUpdateUserGoal, useDeleteUserGoal } from '@/hooks/useUserGoals';
import { toast } from 'sonner';

const GoalsSection = () => {
  const { data: goals = [], isLoading } = useUserGoals();
  const addGoalMutation = useAddUserGoal();
  const updateGoalMutation = useUpdateUserGoal();
  const deleteGoalMutation = useDeleteUserGoal();

  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'skill' as const,
    priority: 'medium' as const,
    deadline: '',
    progress: 0,
    status: 'active' as const
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'career': return 'bg-green-100 text-green-800';
      case 'skill': return 'bg-purple-100 text-purple-800';
      case 'personal': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'paused': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const addGoal = async () => {
    if (!newGoal.title.trim()) {
      toast.error('Նպատակի վերնագիրը պարտադիր է');
      return;
    }
    if (!newGoal.deadline) {
      toast.error('Ավարտման ժամկետը պարտադիր է');
      return;
    }

    try {
      await addGoalMutation.mutateAsync(newGoal);
      setNewGoal({
        title: '',
        description: '',
        category: 'skill',
        priority: 'medium',
        deadline: '',
        progress: 0,
        status: 'active'
      });
      setIsAdding(false);
      toast.success('Նպատակը հաջողությամբ ավելացվեց');
    } catch (error) {
      toast.error('Սխալ նպատակը ավելացնելիս');
    }
  };

  const updateProgress = async (id: string, progress: number) => {
    try {
      const status = progress === 100 ? 'completed' : 'active';
      await updateGoalMutation.mutateAsync({ id, progress, status });
    } catch (error) {
      toast.error('Սխալ առաջընթացը թարմացնելիս');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-armenian flex items-center gap-2">
          <Target className="w-5 h-5" />
          Նպատակներ և ծրագրեր
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(true)}
          className="font-armenian"
          disabled={isAdding}
        >
          <Plus className="w-4 h-4 mr-2" />
          Նոր նպատակ
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAdding && (
          <Card className="p-4 border-dashed">
            <div className="space-y-4">
              <Input
                placeholder="Նպատակի վերնագիր"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
              <Textarea
                placeholder="Նկարագրություն"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                rows={2}
              />
              <div className="grid grid-cols-3 gap-2">
                <Select value={newGoal.category} onValueChange={(value: any) => setNewGoal({ ...newGoal, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Ուսումնական</SelectItem>
                    <SelectItem value="career">Կարիերա</SelectItem>
                    <SelectItem value="skill">Հմտություն</SelectItem>
                    <SelectItem value="personal">Անձնական</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newGoal.priority} onValueChange={(value: any) => setNewGoal({ ...newGoal, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Բարձր</SelectItem>
                    <SelectItem value="medium">Միջին</SelectItem>
                    <SelectItem value="low">Ցածր</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={addGoal}
                  disabled={addGoalMutation.isPending}
                >
                  {addGoalMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ավելացնել'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsAdding(false)}
                  disabled={addGoalMutation.isPending}
                >
                  Չեղարկել
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(goal.status)}
                      <h4 className="font-semibold">{goal.title}</h4>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className={getCategoryColor(goal.category)}>
                      {goal.category === 'academic' ? 'Ուսումնական' :
                       goal.category === 'career' ? 'Կարիերա' :
                       goal.category === 'skill' ? 'Հմտություն' :
                       goal.category === 'personal' ? 'Անձնական' : goal.category}
                    </Badge>
                    <Badge variant="secondary" className={getPriorityColor(goal.priority)}>
                      {goal.priority === 'high' ? 'Բարձր' :
                       goal.priority === 'medium' ? 'Միջին' :
                       goal.priority === 'low' ? 'Ցածր' : goal.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {goal.deadline && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Ավարտ՝ {new Date(goal.deadline).toLocaleDateString('hy-AM')}
                      </span>
                      <span>{goal.progress}%</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Progress value={goal.progress} className="flex-1" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                      className="w-20"
                      disabled={updateGoalMutation.isPending}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {goals.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-armenian">Նպատակներ չեն սահմանվել</p>
            <p className="text-sm">Սահմանեք ձեր առաջիկա նպատակները</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsSection;
