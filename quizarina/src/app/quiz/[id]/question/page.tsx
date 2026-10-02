"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { QuestionPublic } from "@/types/quiz";
import { getPublicQuestions } from "@/services/questionService";
import { getAttempt, completeAttempt } from "@/services/attemptService";
import { getAnswersForAttempt } from "@/services/answerService";

type QuestionState = "ANSWERING" | "SUBMITTING";

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const quizId = resolvedParams.id;
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attempt");
  const router = useRouter();

  const [questions, setQuestions] = useState<QuestionPublic[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<QuestionState>("ANSWERING");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState("");

  const loadData = useCallback(async () => {
    if (!attemptId) {
      setError("No attempt found. Please start the quiz from the quiz page.");
      setLoading(false);
      return;
    }

    try {
      const [questionsData, attempt, existingAnswers] = await Promise.all([
        getPublicQuestions(quizId),
        getAttempt(attemptId),
        getAnswersForAttempt(attemptId),
      ]);

      if (!attempt) {
        setError("Attempt not found.");
        setLoading(false);
        return;
      }

      if (attempt.completed_at) {
        router.replace(`/quiz/${quizId}/results?attempt=${attemptId}`);
        return;
      }

      setQuestions(questionsData);

      // Resume from where we left off
      const answeredIds = new Set(existingAnswers.map((a) => a.question_id));
      const firstUnanswered = questionsData.findIndex((q) => !answeredIds.has(q.id));
      if (firstUnanswered === -1) {
        // All questions answered — complete and redirect
        await completeAttempt(attemptId);
        router.replace(`/quiz/${quizId}/results?attempt=${attemptId}`);
        return;
      }
      setCurrentIndex(firstUnanswered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quiz data");
    } finally {
      setLoading(false);
    }
  }, [quizId, attemptId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fetch quiz title
  useEffect(() => {
    async function fetchTitle() {
      try {
        const { getQuiz } = await import("@/services/quizService");
        const quiz = await getQuiz(quizId);
        if (quiz) setQuizTitle(quiz.title);
      } catch {
        // non-critical
      }
    }
    fetchTitle();
  }, [quizId]);

  async function handleSubmitAnswer() {
    if (!answer.trim() || !attemptId) return;
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;

    try {
      setState("SUBMITTING");

      const response = await fetch("/api/answers/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attempt_id: attemptId,
          question_id: currentQuestion.id,
          submitted_answer: answer.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit answer");
        setState("ANSWERING");
        return;
      }

      // Immediately move to the next question
      await handleNextQuestion();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answer");
      setState("ANSWERING");
    }
  }

  async function handleNextQuestion() {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      // Quiz complete
      try {
        await completeAttempt(attemptId!);
        router.push(`/quiz/${quizId}/results?attempt=${attemptId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to complete quiz");
        setState("ANSWERING"); // Allow retry on failure
      }
      return;
    }

    setCurrentIndex(nextIndex);
    setAnswer("");
    setState("ANSWERING");
    setError(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-4">
        <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-[var(--muted)] text-sm uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-400 text-xl mb-4">{error}</p>
        <Button variant="secondary" onClick={() => router.push("/quiz")}>
          ← Back to Library
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto w-full p-6 md:p-8">
      {/* Top Bar */}
      <header className="flex justify-between items-center pb-6 border-b border-[var(--border)] mb-12">
        <div>
          <p className="text-[var(--accent)] font-bold uppercase tracking-widest text-xs">Quizzinga</p>
          <p className="text-white font-bold uppercase tracking-widest text-sm">{quizTitle}</p>
        </div>
        <div className="text-right">
          <p className="text-[var(--muted)] font-bold uppercase tracking-widest text-xs">
            Question {(currentIndex + 1).toString().padStart(2, "0")} / {questions.length.toString().padStart(2, "0")}
          </p>
        </div>
      </header>

      {error && (
        <div className="card border-red-500/30 bg-red-500/5 mb-8">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 text-xs mt-2 underline">Dismiss</button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        {state === "ANSWERING" && currentQuestion && (
          <div className="w-full text-center space-y-16">
            <div className="flex flex-col items-center">
              <p className="text-[var(--muted)] font-bold uppercase tracking-widest text-xs mb-2">
                {currentQuestion.points} Points
              </p>
            </div>

            <h2 className="editorial-heading text-3xl md:text-5xl leading-tight max-w-4xl mx-auto">
              {currentQuestion.question_text}
            </h2>

            <div className="max-w-2xl mx-auto w-full space-y-6">
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="text-center text-2xl py-6 border-2 focus:border-[var(--accent)] bg-black/50"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && answer.trim() && handleSubmitAnswer()}
              />
              <Button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim()}
                className="w-full py-6 text-xl"
              >
                Submit Answer →
              </Button>
            </div>
          </div>
        )}

        {state === "SUBMITTING" && (
          <div className="w-full text-center space-y-12">
            <div className="inline-block border border-[var(--border)] p-8 bg-white/5">
              <p className="text-[var(--accent)] font-bold uppercase tracking-widest text-xs mb-2">Answer Submitted</p>
              <p className="text-4xl font-bold tracking-tight">{answer}</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
              <p className="text-[var(--muted)] font-bold uppercase tracking-widest text-sm">
                Evaluating your answer...
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
