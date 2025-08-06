-- Create enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_member_role') THEN
    CREATE TYPE public.project_member_role AS ENUM ('participant', 'mentor');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_step_status') THEN
    CREATE TYPE public.project_step_status AS ENUM ('todo', 'in_progress', 'done', 'blocked');
  END IF;
END $$;

-- Helper function to check membership
CREATE OR REPLACE FUNCTION public.is_project_member(p_project_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members
    WHERE project_id = p_project_id AND user_id = p_user_id
  );
$$;

-- Projects table (independent from modules/partner courses)
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamptz,
  end_date timestamptz,
  is_public boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  creator_id uuid NOT NULL,
  creator_role public.user_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Members table
CREATE TABLE IF NOT EXISTS public.project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role public.project_member_role NOT NULL DEFAULT 'participant',
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Steps (Schedule/Steps)
CREATE TABLE IF NOT EXISTS public.project_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  order_index int NOT NULL DEFAULT 0,
  due_date timestamptz,
  status public.project_step_status NOT NULL DEFAULT 'todo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_steps ENABLE ROW LEVEL SECURITY;

-- Discussions (threaded)
CREATE TABLE IF NOT EXISTS public.project_discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  author_id uuid NOT NULL,
  content text NOT NULL,
  parent_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_discussions ENABLE ROW LEVEL SECURITY;

-- Files
CREATE TABLE IF NOT EXISTS public.project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  uploader_id uuid NOT NULL,
  file_path text NOT NULL,
  name text NOT NULL,
  mime_type text,
  size bigint,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- Evaluations (per student/team)
CREATE TABLE IF NOT EXISTS public.project_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  evaluator_id uuid NOT NULL,
  subject_user_id uuid NULL,
  subject_team text NULL,
  score numeric NOT NULL,
  rubric jsonb NOT NULL DEFAULT '{}'::jsonb,
  comments text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_evaluations ENABLE ROW LEVEL SECURITY;

-- Timeline events (manual and system-generated)
CREATE TABLE IF NOT EXISTS public.project_timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_timeline_events ENABLE ROW LEVEL SECURITY;

-- Timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_project_steps_updated_at
BEFORE UPDATE ON public.project_steps
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_project_evaluations_updated_at
BEFORE UPDATE ON public.project_evaluations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
-- Projects: only instructors/employers can create; creator or members can read; only creator (or admin/instructor) can update/delete
CREATE POLICY "Projects: create by instructor/employer" ON public.projects
FOR INSERT TO authenticated
WITH CHECK (
  (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'employer'))
  AND creator_id = auth.uid()
);

CREATE POLICY "Projects: read by creator or members" ON public.projects
FOR SELECT TO authenticated
USING (
  creator_id = auth.uid() OR public.is_project_member(id, auth.uid())
);

CREATE POLICY "Projects: update by creator or admin/instructor" ON public.projects
FOR UPDATE TO authenticated
USING (
  creator_id = auth.uid() OR public.is_admin_or_instructor(auth.uid())
) WITH CHECK (
  creator_id = auth.uid() OR public.is_admin_or_instructor(auth.uid())
);

CREATE POLICY "Projects: delete by creator or admin/instructor" ON public.projects
FOR DELETE TO authenticated
USING (
  creator_id = auth.uid() OR public.is_admin_or_instructor(auth.uid())
);

-- Project members
CREATE POLICY "Members: read by project creator or members" ON public.project_members
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_project_member(project_id, auth.uid())))
);

CREATE POLICY "Members: add by project creator or admin/instructor" ON public.project_members
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_admin_or_instructor(auth.uid())))
);

CREATE POLICY "Members: remove/update by project creator or admin/instructor" ON public.project_members
FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_admin_or_instructor(auth.uid())))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_admin_or_instructor(auth.uid())))
);

CREATE POLICY "Members: delete by project creator or admin/instructor" ON public.project_members
FOR DELETE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_admin_or_instructor(auth.uid())))
);

-- Steps
CREATE POLICY "Steps: read by members" ON public.project_steps
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_project_member(project_id, auth.uid())))
);

CREATE POLICY "Steps: manage by creator or admin/instructor" ON public.project_steps
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_admin_or_instructor(auth.uid())))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_admin_or_instructor(auth.uid())))
);

-- Discussions
CREATE POLICY "Discussions: read by members" ON public.project_discussions
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_project_member(project_id, auth.uid())))
);

CREATE POLICY "Discussions: create by members" ON public.project_discussions
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.creator_id = auth.uid())
);

CREATE POLICY "Discussions: update by author" ON public.project_discussions
FOR UPDATE TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Discussions: delete by author or creator" ON public.project_discussions
FOR DELETE TO authenticated
USING (
  author_id = auth.uid() OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.creator_id = auth.uid())
);

-- Files
CREATE POLICY "Files: read by members or public" ON public.project_files
FOR SELECT TO authenticated
USING (
  is_public = true OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_project_member(project_id, auth.uid())))
);

-- Also allow anon to read public files metadata
CREATE POLICY "Files: public read for public files" ON public.project_files
FOR SELECT TO anon
USING (is_public = true);

CREATE POLICY "Files: upload by members or creator" ON public.project_files
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.creator_id = auth.uid())
  AND uploader_id = auth.uid()
);

CREATE POLICY "Files: delete by uploader or creator" ON public.project_files
FOR DELETE TO authenticated
USING (
  uploader_id = auth.uid() OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.creator_id = auth.uid())
);

-- Evaluations
CREATE POLICY "Evaluations: read by members" ON public.project_evaluations
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_project_member(project_id, auth.uid())))
);

CREATE POLICY "Evaluations: create/update by instructor/employer who are creator or members" ON public.project_evaluations
FOR ALL TO authenticated
USING (
  (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'employer'))
  AND (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.creator_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  )
) WITH CHECK (
  (public.has_role(auth.uid(), 'instructor') OR public.has_role(auth.uid(), 'employer'))
  AND (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.creator_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.project_members m WHERE m.project_id = project_id AND m.user_id = auth.uid())
  )
);

-- Timeline events
CREATE POLICY "Timeline: read by members" ON public.project_timeline_events
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.creator_id = auth.uid() OR public.is_project_member(project_id, auth.uid())))
);

CREATE POLICY "Timeline: insert by creator or mentor" ON public.project_timeline_events
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.creator_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.project_members m
    WHERE m.project_id = project_id AND m.user_id = auth.uid() AND m.role = 'mentor'
  )
);

-- Realtime setup
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.project_members REPLICA IDENTITY FULL;
ALTER TABLE public.project_steps REPLICA IDENTITY FULL;
ALTER TABLE public.project_discussions REPLICA IDENTITY FULL;
ALTER TABLE public.project_files REPLICA IDENTITY FULL;
ALTER TABLE public.project_evaluations REPLICA IDENTITY FULL;
ALTER TABLE public.project_timeline_events REPLICA IDENTITY FULL;

-- Add tables to realtime publication
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'projects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'project_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.project_members;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'project_steps'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.project_steps;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'project_discussions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.project_discussions;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'project_files'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.project_files;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'project_evaluations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.project_evaluations;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'project_timeline_events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.project_timeline_events;
  END IF;
END $$;

-- Storage bucket for project files (public read, we'll control via is_public in metadata table)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', true)
ON CONFLICT (id) DO NOTHING;
