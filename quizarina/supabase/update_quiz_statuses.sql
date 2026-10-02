-- Hotfix: Update quiz statuses to draft, coming_soon, active, ended
ALTER TABLE quizzes DROP CONSTRAINT IF EXISTS quizzes_status_check;

-- Migrate existing rows
UPDATE quizzes SET status = 'active' WHERE status = 'published';
UPDATE quizzes SET status = 'ended' WHERE status = 'archived';

-- Add new constraint
ALTER TABLE quizzes ADD CONSTRAINT quizzes_status_check CHECK (status IN ('draft', 'coming_soon', 'active', 'ended'));
