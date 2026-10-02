export type EvaluationMethod = "exact" | "fuzzy" | "ai" | "manual";

export interface Answer {
  id: string;
  attempt_id: string;
  question_id: string;
  submitted_answer: string;
  is_correct: boolean;
  points_awarded: number;
  evaluation_method: EvaluationMethod;
  confidence: number | null;
  created_at: string;
}

export interface SubmitAnswerInput {
  attempt_id: string;
  question_id: string;
  submitted_answer: string;
}

export interface AnswerResult {
  is_correct: boolean;
  points_awarded: number;
  correct_answer: string;
  evaluation_method: EvaluationMethod;
  submitted_answer: string;
}
