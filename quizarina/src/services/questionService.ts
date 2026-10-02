import { createClient } from "@/lib/supabase/client";
import { QuestionAdmin, QuestionPublic } from "@/types/quiz";
import { CreateQuestionInput, UpdateQuestionInput } from "@/types/question";

function getClient() {
  return createClient();
}

/** Fetch all questions for a quiz (admin — includes answers) */
export async function getAdminQuestions(quizId: string): Promise<QuestionAdmin[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("question_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Fetch questions for public view (no correct_answer or accepted_answers) */
export async function getPublicQuestions(quizId: string): Promise<QuestionPublic[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("questions")
    .select("id, quiz_id, question_text, points, question_order")
    .eq("quiz_id", quizId)
    .order("question_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Create a question */
export async function createQuestion(input: CreateQuestionInput): Promise<QuestionAdmin> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("questions")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Update a question */
export async function updateQuestion(id: string, input: UpdateQuestionInput): Promise<QuestionAdmin> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("questions")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Delete a question */
export async function deleteQuestion(id: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/** Reorder questions: accepts an array of { id, question_order } */
export async function reorderQuestions(
  updates: { id: string; question_order: number }[]
): Promise<void> {
  const supabase = getClient();
  for (const update of updates) {
    const { error } = await supabase
      .from("questions")
      .update({ question_order: update.question_order })
      .eq("id", update.id);
    if (error) throw new Error(error.message);
  }
}
