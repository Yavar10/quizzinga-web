"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Quiz } from "@/types/quiz";
import { QuizAttempt } from "@/types/attempt";
import { Answer } from "@/types/answer";
import { getQuiz } from "@/services/quizService";
import { getAttempt } from "@/services/attemptService";
import { getAnswersForAttempt } from "@/services/answerService";

export default function QuizResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const quizId = resolvedParams.id;
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attempt");
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!attemptId) {
        setError("No attempt found.");
        setLoading(false);
        return;
      }

      try {
        const [quizData, attemptData, answersData] = await Promise.all([
          getQuiz(quizId),
          getAttempt(attemptId),
          getAnswersForAttempt(attemptId),
        ]);

        setQuiz(quizData);
        setAttempt(attemptData);
        setAnswers(answersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quizId, attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-4">
        <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-[var(--muted)] text-sm uppercase tracking-widest">Loading results...</p>
      </div>
    );
  }

  if (error || !attempt || !quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-400 text-xl mb-4">{error || "Results not found"}</p>
        <Button variant="secondary" onClick={() => router.push("/quiz")}>
          ← Back to Library
        </Button>
      </div>
    );
  }

  const correctCount = answers.filter((a) => a.is_correct).length;
  const totalPoints = answers.reduce((sum, a) => sum + a.points_awarded, 0);
  const maxPoints = attempt.total_questions > 0
    ? answers.reduce((sum, a) => sum + (a.is_correct ? a.points_awarded : 0), 0) + answers.filter((a) => !a.is_correct).length * (answers.find((a) => a.is_correct)?.points_awarded || 10)
    : 0;
  // Simpler: use the score from the attempt directly
  const percentage = attempt.total_questions > 0
    ? Math.round((correctCount / attempt.total_questions) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col items-center p-6 md:p-12 w-full max-w-5xl mx-auto">
      <header className="text-center mb-16 w-full pt-12">
        <h1 className="editorial-heading text-6xl md:text-8xl mb-4 text-[var(--accent)]">Quiz Complete.</h1>
        <p className="text-[var(--muted)] text-xl font-bold uppercase tracking-widest">{quiz.title}</p>
        <p className="text-[var(--muted)] text-sm mt-2 uppercase tracking-widest">{attempt.participant_name}</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
        <div className="card text-center py-12">
          <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest mb-4">Your Score</p>
          <p className="text-6xl font-bold tracking-tighter">{attempt.score}</p>
        </div>

        <div className="card border-[var(--accent)] bg-[var(--accent)]/5 text-center py-12">
          <p className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-4">Accuracy</p>
          <p className="text-6xl font-bold tracking-tighter text-white">{percentage}%</p>
        </div>

        <div className="card text-center py-12">
          <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest mb-4">Correct Answers</p>
          <p className="text-6xl font-bold tracking-tighter">
            {correctCount} <span className="text-3xl text-[var(--muted)]">/ {attempt.total_questions}</span>
          </p>
        </div>
      </section>

      {/* Answer breakdown */}
      {answers.length > 0 && (
        <section className="w-full max-w-3xl mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-[var(--border)] pb-4 text-center">Answer Breakdown</h2>
          <div className="space-y-3">
            {answers.map((a, index) => (
              <div
                key={a.id}
                className={`flex items-center justify-between p-4 border ${
                  a.is_correct ? "border-[#00ff88]/30 bg-[#00ff88]/5" : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--muted)] w-8">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className={`text-sm font-bold ${a.is_correct ? "text-[#00ff88]" : "text-red-500"}`}>
                    {a.submitted_answer}
                  </span>
                </div>
                <span className={`text-sm font-bold ${a.is_correct ? "text-[#00ff88]" : "text-[var(--muted)]"}`}>
                  +{a.points_awarded}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="flex flex-col md:flex-row gap-6 justify-center w-full pb-12">
        <Link href={`/quiz/${quizId}`}>
          <Button variant="primary" className="w-full md:w-auto px-12 py-5 text-lg">Retry Quiz</Button>
        </Link>
        <Link href="/quiz">
          <Button variant="secondary" className="w-full md:w-auto px-12 py-5 text-lg">Back to Library</Button>
        </Link>
      </footer>
    </div>
  );
}
