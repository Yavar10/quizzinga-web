export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id?: string;
  participant_name: string;
  score: number;
  total_questions: number;
  started_at: string;
  completed_at: string | null;
}

export interface CreateAttemptInput {
  quiz_id: string;
  user_id?: string;
  participant_name: string;
  total_questions: number;
}
