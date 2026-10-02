import { createClient } from "@/lib/supabase/client";
import { Answer } from "@/types/answer";

function getClient() {
  return createClient();
}

/** Get all answers for a specific attempt */
export async function getAnswersForAttempt(attemptId: string): Promise<Answer[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("answers")
    .select("*")
    .eq("attempt_id", attemptId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Check if a specific question has already been answered in this attempt */
export async function hasAnswered(attemptId: string, questionId: string): Promise<boolean> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("answers")
    .select("id")
    .eq("attempt_id", attemptId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data !== null;
}
