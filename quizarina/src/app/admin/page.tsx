"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Quiz } from "@/types/quiz";
import { getAdminQuizzes } from "@/services/quizService";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminQuizzes();
        setQuizzes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalQuizzes = quizzes.length;
  const activeCount = quizzes.filter((q) => q.status === "active").length;
  const draftCount = quizzes.filter((q) => q.status === "draft").length;
  const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions_count ?? 0), 0);

  return (
    <div className="p-8 md:p-12 max-w-6xl w-full mx-auto">
      <header className="mb-16">
        <p className="text-[var(--accent)] font-bold uppercase tracking-widest text-xs mb-4">Quizzinga / Admin</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="editorial-heading text-5xl md:text-7xl mb-4">Control The Arena.</h1>
            <p className="text-[var(--muted)] text-lg max-w-xl">Create, manage and run quizzes from one place.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
            <Link href="/admin/quizzes/new">
              <Button>+ Create Quiz</Button>
            </Link>
          </div>
        </div>
      </header>

      {error && (
        <div className="card border-red-500/30 bg-red-500/5 mb-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { label: "Total Quizzes", value: loading ? "—" : totalQuizzes.toString().padStart(2, "0") },
          { label: "Active", value: loading ? "—" : activeCount.toString().padStart(2, "0") },
          { label: "Drafts", value: loading ? "—" : draftCount.toString().padStart(2, "0") },
          { label: "Questions", value: loading ? "—" : totalQuestions.toString() },
        ].map((stat, i) => (
          <div key={i} className="card flex flex-col justify-between aspect-square">
            <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-5xl font-bold tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-[var(--border)] pb-4">Recent Quizzes</h2>

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
          <div className="flex flex-col gap-4">
            {quizzes.slice(0, 5).map((quiz) => (
              <Link key={quiz.id} href={`/admin/quizzes/${quiz.id}/edit`} className="block group">
                <div className="card hover:border-[var(--accent)] transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-[var(--accent)] transition-colors">{quiz.title}</h3>
                    <p className="text-[var(--muted)] text-sm">
                      {quiz.questions_count ?? 0} questions · {quiz.category || "Uncategorized"}
                    </p>
                  </div>
                  <Badge status={quiz.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
