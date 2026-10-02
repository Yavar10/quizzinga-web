"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { QuizAttempt } from "@/types/attempt";
import { Quiz } from "@/types/quiz";
import { getQuiz } from "@/services/quizService";
import { getQuizAttempts, deleteAttempt } from "@/services/attemptService";

export default function AdminQuizAttemptsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const quizId = resolvedParams.id;
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [quizData, attemptsData] = await Promise.all([
          getQuiz(quizId),
          getQuizAttempts(quizId),
        ]);
        setQuiz(quizData);
        setAttempts(attemptsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load attempts");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quizId]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete attempt by "${name}"? This cannot be undone.`)) return;
    try {
      await deleteAttempt(id);
      setAttempts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete attempt");
    }
  }

  if (loading) {
    return (
      <div className="p-8 md:p-12 max-w-4xl w-full mx-auto flex-1 flex items-center gap-4">
        <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-[var(--muted)] text-sm uppercase tracking-widest">Loading attempts...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-8 md:p-12 max-w-4xl w-full mx-auto flex-1">
        <p className="text-red-400">{error || "Quiz not found"}</p>
        <Link href="/admin/quizzes"><Button variant="secondary" className="mt-4">Back to Quizzes</Button></Link>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-5xl w-full mx-auto flex-1 flex flex-col">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="editorial-heading text-4xl md:text-5xl mb-2">Quiz Results</h1>
          <p className="text-[var(--muted)] text-lg">Manage attempts and leaderboard for {quiz.title}.</p>
        </div>
        <Link href={`/admin/quizzes/${quizId}/edit`}>
          <Button variant="secondary">← Back to Editor</Button>
        </Link>
      </header>

      {attempts.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-2xl font-bold mb-2">No attempts yet</p>
          <p className="text-[var(--muted)]">When participants complete the quiz, their results will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto p-0 border-x-0 border-b-0 md:border md:p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Rank</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Participant</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Score</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hidden md:table-cell">Date</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt, index) => (
                <tr key={attempt.id} className="border-b border-[var(--border)] hover:bg-white/5 transition-colors">
                  <td className="p-4 md:p-6 font-bold text-[var(--accent)]">#{index + 1}</td>
                  <td className="p-4 md:p-6 font-bold">{attempt.participant_name}</td>
                  <td className="p-4 md:p-6 font-bold text-lg">{attempt.score}</td>
                  <td className="p-4 md:p-6 hidden md:table-cell text-[var(--muted)] text-sm">
                    {new Date(attempt.completed_at!).toLocaleString()}
                  </td>
                  <td className="p-4 md:p-6 text-right space-x-4">
                    <Link
                      href={`/quiz/${quiz.id}/results?attempt=${attempt.id}`}
                      className="text-xs font-bold uppercase tracking-widest hover:text-[#00ff88] transition-colors"
                      target="_blank"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDelete(attempt.id, attempt.participant_name)}
                      className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
