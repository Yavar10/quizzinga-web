-- Hotfix: Replace auth-gated RLS policies with permissive ones
-- Run this in Supabase SQL Editor to fix the "violates row-level security" error.
-- This is needed because auth is not yet implemented.

-- Drop old quiz policies
DROP POLICY IF EXISTS "quizzes_select_published" ON quizzes;
DROP POLICY IF EXISTS "quizzes_select_own" ON quizzes;
DROP POLICY IF EXISTS "quizzes_insert_admin" ON quizzes;
DROP POLICY IF EXISTS "quizzes_update_own" ON quizzes;
DROP POLICY IF EXISTS "quizzes_delete_own" ON quizzes;

-- Drop old question policies
DROP POLICY IF EXISTS "questions_select_published" ON questions;
DROP POLICY IF EXISTS "questions_select_own" ON questions;
DROP POLICY IF EXISTS "questions_insert_admin" ON questions;
DROP POLICY IF EXISTS "questions_update_admin" ON questions;
DROP POLICY IF EXISTS "questions_delete_admin" ON questions;

-- Create permissive quiz policies
CREATE POLICY "quizzes_select_all" ON quizzes
  FOR SELECT USING (true);

CREATE POLICY "quizzes_insert_all" ON quizzes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "quizzes_update_all" ON quizzes
  FOR UPDATE USING (true);

CREATE POLICY "quizzes_delete_all" ON quizzes
  FOR DELETE USING (true);

-- Create permissive question policies
CREATE POLICY "questions_select_all" ON questions
  FOR SELECT USING (true);

CREATE POLICY "questions_insert_all" ON questions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "questions_update_all" ON questions
  FOR UPDATE USING (true);

CREATE POLICY "questions_delete_all" ON questions
  FOR DELETE USING (true);
