-- Delete all pending applications from user_applications table
DELETE FROM public.user_applications 
WHERE status = 'pending';