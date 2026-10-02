-- Hotfix: Add 'coming_soon' to quiz status
ALTER TABLE quizzes DROP CONSTRAINT IF EXISTS quizzes_status_check;
ALTER TABLE quizzes ADD CONSTRAINT quizzes_status_check CHECK (status IN ('draft', 'published', 'archived', 'coming_soon'));
