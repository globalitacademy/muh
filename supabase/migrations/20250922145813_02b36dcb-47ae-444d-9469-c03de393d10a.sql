-- Create project tasks table
CREATE TABLE public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create project task assignments table
CREATE TABLE public.project_task_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  submission_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(task_id, assigned_to)
);

-- Enable RLS
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_task_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_tasks
CREATE POLICY "Project creators can manage tasks"
ON public.project_tasks
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_tasks.project_id 
    AND p.creator_id = auth.uid()
  )
);

CREATE POLICY "Project members can view tasks"
ON public.project_tasks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = project_tasks.project_id 
    AND (p.creator_id = auth.uid() OR is_project_member(project_tasks.project_id, auth.uid()))
  )
);

-- RLS policies for project_task_assignments
CREATE POLICY "Assigned users can view their assignments"
ON public.project_task_assignments
FOR SELECT
USING (assigned_to = auth.uid());

CREATE POLICY "Task creators can manage assignments"
ON public.project_task_assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.project_tasks pt
    JOIN public.projects p ON p.id = pt.project_id
    WHERE pt.id = project_task_assignments.task_id
    AND p.creator_id = auth.uid()
  )
);

CREATE POLICY "Assigned users can update their assignments"
ON public.project_task_assignments
FOR UPDATE
USING (assigned_to = auth.uid());

-- Add triggers for updated_at
CREATE TRIGGER update_project_tasks_updated_at
BEFORE UPDATE ON public.project_tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_task_assignments_updated_at
BEFORE UPDATE ON public.project_task_assignments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();