import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useUserAssignedTasks } from '@/hooks/useProjectTasks';
import { ClipboardList } from 'lucide-react';

export const TaskNotificationBadge: React.FC = () => {
  const { data: assignedTasks = [] } = useUserAssignedTasks();

  // Count pending tasks (not completed)
  const pendingTasks = assignedTasks.filter(task => !task.completed_at);
  
  if (pendingTasks.length === 0) {
    return null;
  }

  return (
    <div className="relative inline-flex">
      <ClipboardList className="w-5 h-5" />
      <Badge 
        variant="destructive" 
        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
      >
        {pendingTasks.length > 9 ? '9+' : pendingTasks.length}
      </Badge>
    </div>
  );
};