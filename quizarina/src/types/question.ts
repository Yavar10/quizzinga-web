export interface CreateQuestionInput {
  quiz_id: string;
  question_text: string;
  correct_answer: string;
  accepted_answers: string[];
  points: number;
  question_order: number;
}

export interface UpdateQuestionInput {
  question_text?: string;
  correct_answer?: string;
  accepted_answers?: string[];
  points?: number;
  question_order?: number;
}
