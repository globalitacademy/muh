-- Create notification types enum
CREATE TYPE notification_type AS ENUM (
  'course_enrollment',
  'course_completion', 
  'assignment_due',
  'exam_reminder',
  'grade_published',
  'message_received',
  'announcement',
  'application_status',
  'payment_confirmation',
  'certificate_issued',
  'system_alert',
  'instructor_assignment',
  'partner_course_update'
);

-- Create notification priority enum
CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high', 'urgent');

-- Create notification status enum  
CREATE TYPE notification_status AS ENUM ('unread', 'read', 'archived');

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type notification_type NOT NULL,
  priority notification_priority NOT NULL DEFAULT 'normal',
  status notification_status NOT NULL DEFAULT 'unread',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  frequency TEXT NOT NULL DEFAULT 'immediate',
  types_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications"
ON public.notifications FOR ALL
USING (is_admin_or_instructor(auth.uid()));

-- Create policies for notification preferences
CREATE POLICY "Users can manage their own notification preferences"
ON public.notification_preferences FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all notification preferences"
ON public.notification_preferences FOR SELECT
USING (is_admin_or_instructor(auth.uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to send notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type notification_type,
  p_title TEXT,
  p_message TEXT,
  p_priority notification_priority DEFAULT 'normal',
  p_action_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, type, title, message, priority, action_url, metadata
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_priority, p_action_url, p_metadata
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create function to mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.notifications 
  SET status = 'read', read_at = now(), updated_at = now()
  WHERE id = p_notification_id AND user_id = auth.uid();
END;
$$;

-- Create function to mark all notifications as read for user
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.notifications 
  SET status = 'read', read_at = now(), updated_at = now()
  WHERE user_id = auth.uid() AND status = 'unread';
END;
$$;