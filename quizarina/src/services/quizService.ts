import { createClient } from "@/lib/supabase/client";
import { Quiz, CreateQuizInput, UpdateQuizInput } from "@/types/quiz";

function getClient() {
  return createClient();
}

/** Fetch all quizzes (admin view — all statuses) */
export async function getAdminQuizzes(): Promise<Quiz[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(count)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((q) => ({
    ...q,
    questions_count: q.questions?.[0]?.count ?? 0,
  }));
}

/** Fetch only published quizzes (public library) */
export async function getPublishedQuizzes(): Promise<Quiz[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(count)")
    .in("status", ["active", "coming_soon", "ended"])
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((q) => ({
    ...q,
    questions_count: q.questions?.[0]?.count ?? 0,
  }));
}

/** Fetch a single quiz by ID */
export async function getQuiz(id: string): Promise<Quiz | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select("*, questions(count)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(error.message);
  }

  return {
    ...data,
    questions_count: data.questions?.[0]?.count ?? 0,
  };
}

/** Create a new quiz */
export async function createQuiz(input: CreateQuizInput): Promise<Quiz> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quizzes")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Update an existing quiz */
export async function updateQuiz(id: string, input: UpdateQuizInput): Promise<Quiz> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("quizzes")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Delete a quiz */
export async function deleteQuiz(id: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase
    .from("quizzes")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
