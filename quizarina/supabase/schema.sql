-- Quizzinga Database Schema
-- Run this migration in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================
-- 2. QUIZZES
-- ============================================================

CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'coming_soon', 'active', 'ended')),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quizzes_status ON quizzes(status);
CREATE INDEX idx_quizzes_created_by ON quizzes(created_by);
CREATE INDEX idx_quizzes_created_at ON quizzes(created_at DESC);

-- ============================================================
-- 3. QUESTIONS
-- ============================================================

CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  accepted_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  points INTEGER NOT NULL DEFAULT 10,
  question_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_questions_order ON questions(quiz_id, question_order);

-- ============================================================
-- 4. QUIZ ATTEMPTS
-- ============================================================

CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  participant_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);

-- ============================================================
-- 5. ANSWERS
-- ============================================================

CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  submitted_answer TEXT NOT NULL DEFAULT '',
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  evaluation_method TEXT NOT NULL DEFAULT 'exact' CHECK (evaluation_method IN ('exact', 'fuzzy', 'ai', 'manual')),
  confidence REAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_attempt_id ON answers(attempt_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);

-- Prevent duplicate answers for the same attempt + question
CREATE UNIQUE INDEX idx_answers_attempt_question ON answers(attempt_id, question_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
--
-- NOTE: Authentication is NOT yet implemented.
-- These policies are PERMISSIVE for the pre-auth development phase.
-- When Supabase Auth is wired up, tighten quizzes/questions policies
-- to check auth.uid() = created_by.
--
-- The critical security boundary (hiding correct answers from
-- participants before submission) is enforced at the application
-- layer: the public question query selects only safe columns, and
-- answer evaluation runs server-side in /api/answers/submit.
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- ----- PROFILES -----

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- ----- QUIZZES (pre-auth: permissive) -----

CREATE POLICY "quizzes_select_all" ON quizzes
  FOR SELECT USING (true);

CREATE POLICY "quizzes_insert_all" ON quizzes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "quizzes_update_all" ON quizzes
  FOR UPDATE USING (true);

CREATE POLICY "quizzes_delete_all" ON quizzes
  FOR DELETE USING (true);

-- ----- QUESTIONS (pre-auth: permissive) -----

CREATE POLICY "questions_select_all" ON questions
  FOR SELECT USING (true);

CREATE POLICY "questions_insert_all" ON questions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "questions_update_all" ON questions
  FOR UPDATE USING (true);

CREATE POLICY "questions_delete_all" ON questions
  FOR DELETE USING (true);

-- ----- QUIZ ATTEMPTS -----

CREATE POLICY "quiz_attempts_insert_anon" ON quiz_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "quiz_attempts_select" ON quiz_attempts
  FOR SELECT USING (true);

CREATE POLICY "quiz_attempts_update" ON quiz_attempts
  FOR UPDATE USING (true);

CREATE POLICY "quiz_attempts_delete" ON quiz_attempts
  FOR DELETE USING (true);

-- ----- ANSWERS -----

CREATE POLICY "answers_insert_anon" ON answers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "answers_select" ON answers
  FOR SELECT USING (true);

-- ============================================================
-- HELPER: updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
