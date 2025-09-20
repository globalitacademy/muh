-- Fix the recursive RLS policy issue on user_roles table
-- First, let's drop the existing problematic policies
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can read own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Service role can manage all roles (for system operations)
CREATE POLICY "Service role can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Separate policy for admin users that doesn't use has_role function to avoid recursion
CREATE POLICY "Admin users can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);