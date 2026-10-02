-- Fix: Ensure the role constraint allows 'user'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'user'));

-- Backfill: Create a profile for any auth.users that don't have one yet
-- This fixes the foreign key error for users who signed in before the trigger was fully working
INSERT INTO public.profiles (id, email, display_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', email, 'Unknown User'), 
  'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
