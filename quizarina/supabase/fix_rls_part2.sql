-- Hotfix: Add missing DELETE policy for quiz_attempts so Admins can delete them
CREATE POLICY "quiz_attempts_delete" ON quiz_attempts
  FOR DELETE USING (true);
