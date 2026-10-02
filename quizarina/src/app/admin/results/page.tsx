"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { QuizAttempt } from "@/types/attempt";
import { getAllAttempts, deleteAttempt } from "@/services/attemptService";

export default function AdminGlobalResultsPage() {
  const [attempts, setAttempts] = useState<(QuizAttempt & { quizzes: { title: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getAllAttempts();
        setAttempts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
      <div className="p-8 md:p-12 flex-1 flex items-center gap-4">
        <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-[var(--muted)] text-sm uppercase tracking-widest">Loading all results...</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-7xl w-full mx-auto flex-1 flex flex-col">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="editorial-heading text-4xl md:text-5xl mb-2">Global Results</h1>
          <p className="text-[var(--muted)] text-lg">Every participant attempt across all quizzes.</p>
        </div>
      </header>

      {error && (
        <div className="card border-red-500/30 bg-red-500/5 mb-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {attempts.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-2xl font-bold mb-2">No attempts yet</p>
          <p className="text-[var(--muted)]">When participants complete quizzes, their results will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto p-0 border-x-0 border-b-0 md:border md:p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Participant</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Quiz</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Score</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hidden md:table-cell">Date</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.id} className="border-b border-[var(--border)] hover:bg-white/5 transition-colors">
                  <td className="p-4 md:p-6 font-bold">{attempt.participant_name}</td>
                  <td className="p-4 md:p-6 text-[var(--accent)] font-semibold">{attempt.quizzes?.title || "Unknown Quiz"}</td>
                  <td className="p-4 md:p-6 font-bold text-lg">{attempt.score}</td>
                  <td className="p-4 md:p-6 hidden md:table-cell text-[var(--muted)] text-sm">
                    {new Date(attempt.completed_at!).toLocaleString()}
                  </td>
                  <td className="p-4 md:p-6 text-right space-x-4">
                    <Link
                      href={`/quiz/${attempt.quiz_id}/results?attempt=${attempt.id}`}
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
