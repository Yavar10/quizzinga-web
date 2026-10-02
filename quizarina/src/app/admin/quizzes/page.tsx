"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Quiz } from "@/types/quiz";
import { getAdminQuizzes, deleteQuiz } from "@/services/quizService";

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await getAdminQuizzes();
      setQuizzes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete quiz");
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).toUpperCase();
  };

  return (
    <div className="p-8 md:p-12 max-w-7xl w-full mx-auto flex-1 flex flex-col">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="editorial-heading text-4xl md:text-5xl mb-2">Quizzes</h1>
          <p className="text-[var(--muted)] text-lg">Everything you've created, in one place.</p>
        </div>
        <Link href="/admin/quizzes/new">
          <Button>+ Create Quiz</Button>
        </Link>
      </header>

      {error && (
        <div className="card border-red-500/30 bg-red-500/5 mb-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-4 py-12">
          <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
          <p className="text-[var(--muted)] text-sm uppercase tracking-widest">Loading...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-2xl font-bold mb-2">No quizzes yet</p>
          <p className="text-[var(--muted)] mb-6">Create your first quiz to get started.</p>
          <Link href="/admin/quizzes/new">
            <Button>+ Create Quiz</Button>
          </Link>
        </div>
      ) : (
        <div className="card overflow-x-auto p-0 border-x-0 border-b-0 md:border md:p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Quiz</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hidden md:table-cell">Category</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hidden md:table-cell">Questions</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Status</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hidden sm:table-cell">Date</th>
                <th className="p-4 md:p-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b border-[var(--border)] hover:bg-white/5 transition-colors">
                  <td className="p-4 md:p-6 font-semibold">{quiz.title}</td>
                  <td className="p-4 md:p-6 hidden md:table-cell text-[var(--muted)]">{quiz.category || "—"}</td>
                  <td className="p-4 md:p-6 hidden md:table-cell text-[var(--muted)]">{quiz.questions_count ?? 0}</td>
                  <td className="p-4 md:p-6"><Badge status={quiz.status} /></td>
                  <td className="p-4 md:p-6 hidden sm:table-cell text-[var(--muted)]">{formatDate(quiz.created_at)}</td>
                  <td className="p-4 md:p-6 text-right space-x-4">
                    <Link
                      href={`/admin/quizzes/${quiz.id}/edit`}
                      className="text-xs font-bold uppercase tracking-widest hover:text-[var(--accent)] transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/quizzes/${quiz.id}/attempts`}
                      className="text-xs font-bold uppercase tracking-widest hover:text-[#00ff88] transition-colors"
                    >
                      Results
                    </Link>
                    {quiz.status === "active" && (
                      <Link
                        href={`/quiz/${quiz.id}`}
                        className="text-xs font-bold uppercase tracking-widest hover:text-white text-[var(--muted)] transition-colors"
                      >
                        Preview
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(quiz.id, quiz.title)}
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
