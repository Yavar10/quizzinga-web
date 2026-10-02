import { createClient } from "@/lib/supabase/client";
import { QuizAttempt, CreateAttemptInput } from "@/types/attempt";

function getClient() {
  return createClient();
}

/** Create a new quiz attempt */
export async function createAttempt(input: CreateAttemptInput): Promise<QuizAttempt> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_id: input.quiz_id,
      user_id: input.user_id,
      participant_name: input.participant_name,
      score: 0,
      total_questions: input.total_questions,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Fetch an attempt by ID */
export async function getAttempt(attemptId: string): Promise<QuizAttempt | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data;
}

/** Mark an attempt as complete */
export async function completeAttempt(attemptId: string): Promise<QuizAttempt> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quiz_attempts")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", attemptId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Get all attempts for a quiz (for leaderboard display) */
export async function getQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("quiz_id", quizId)
    .not("completed_at", "is", null)
    .order("score", { ascending: false });

  if (error) throw new Error(error.message);

  const attempts = (data as QuizAttempt[]) ?? [];
  
  // Keep only the highest score per user (data is already ordered by score descending)
  const seen = new Set<string>();
  const uniqueAttempts: QuizAttempt[] = [];
  
  for (const att of attempts) {
    const key = att.user_id || att.participant_name;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueAttempts.push(att);
    }
  }
  
  return uniqueAttempts;
}

/** Get ALL attempts across all quizzes (for Admin Global Results) */
export async function getAllAttempts(): Promise<(QuizAttempt & { quizzes: { title: string } })[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*, quizzes(title)")
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as any;
}

/** Get all attempts for a specific user */
export async function getUserAttempts(userId: string): Promise<(QuizAttempt & { quizzes: { title: string } })[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*, quizzes(title)")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as any;
}

/** Delete an attempt (Admin only) */
export async function deleteAttempt(attemptId: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from("quiz_attempts")
    .delete()
    .eq("id", attemptId);

  if (error) throw new Error(error.message);
}
