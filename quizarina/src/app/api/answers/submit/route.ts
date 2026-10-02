import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluateAnswer } from "@/services/answerEvaluator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attempt_id, question_id, submitted_answer } = body;

    if (!attempt_id || !question_id || submitted_answer === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: attempt_id, question_id, submitted_answer" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Fetch the attempt
    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .select("*")
      .eq("id", attempt_id)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    if (attempt.completed_at) {
      return NextResponse.json({ error: "This attempt is already completed" }, { status: 400 });
    }

    // 2. Fetch the question (server-side only — includes correct answer)
    const { data: question, error: questionError } = await supabase
      .from("questions")
      .select("*")
      .eq("id", question_id)
      .single();

    if (questionError || !question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // 3. Validate question belongs to quiz
    if (question.quiz_id !== attempt.quiz_id) {
      return NextResponse.json(
        { error: "Question does not belong to this quiz" },
        { status: 400 }
      );
    }

    // 4. Check for duplicate submission
    const { data: existingAnswer } = await supabase
      .from("answers")
      .select("id")
      .eq("attempt_id", attempt_id)
      .eq("question_id", question_id)
      .maybeSingle();

    if (existingAnswer) {
      return NextResponse.json(
        { error: "This question has already been answered" },
        { status: 409 }
      );
    }

    // 5. Evaluate the answer server-side (exact + AI pipeline)
    const evaluation = await evaluateAnswer(
      question.question_text,
      submitted_answer,
      question.correct_answer,
      question.accepted_answers ?? []
    );

    const pointsAwarded = evaluation.is_correct ? question.points : 0;

    // 6. Store the answer
    const { error: insertError } = await supabase
      .from("answers")
      .insert({
        attempt_id,
        question_id,
        submitted_answer,
        is_correct: evaluation.is_correct,
        points_awarded: pointsAwarded,
        evaluation_method: evaluation.evaluation_method,
        confidence: evaluation.confidence,
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 7. Update the attempt score
    const newScore = attempt.score + pointsAwarded;
    const { error: updateError } = await supabase
      .from("quiz_attempts")
      .update({ score: newScore })
      .eq("id", attempt_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 8. Return minimal confirmation — do NOT reveal the correct answer
    //    The user will see full results only after completing the quiz.
    return NextResponse.json({ submitted: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
