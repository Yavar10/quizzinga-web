export type QuizStatus = "draft" | "coming_soon" | "active" | "ended";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  status: QuizStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  questions_count?: number;
  total_points?: number;
}

export interface QuizWithQuestions extends Quiz {
  questions: QuestionAdmin[];
}

// Admin-facing question (includes answers)
export interface QuestionAdmin {
  id: string;
  quiz_id: string;
  question_text: string;
  correct_answer: string;
  accepted_answers: string[];
  points: number;
  question_order: number;
  created_at: string;
  updated_at: string;
}

// Public-facing question (no answers exposed)
export interface QuestionPublic {
  id: string;
  quiz_id: string;
  question_text: string;
  points: number;
  question_order: number;
}

export interface CreateQuizInput {
  title: string;
  description: string;
  category: string;
  status: QuizStatus;
}

export interface UpdateQuizInput {
  title?: string;
  description?: string;
  category?: string;
  status?: QuizStatus;
}
