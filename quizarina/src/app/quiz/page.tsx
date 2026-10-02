"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Quiz } from "@/types/quiz";
import { getPublishedQuizzes } from "@/services/quizService";
import { createClient } from "@/lib/supabase/client";

export default function QuizLibraryPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      try {
        const [{ data: authData }, data] = await Promise.all([
          supabase.auth.getUser(),
          getPublishedQuizzes()
        ]);
        setUser(authData.user);
        setQuizzes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [supabase]);

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-12 max-w-6xl mx-auto w-full">
      <header className="mb-16 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--border)] pb-12">
        <div className="text-left">
          <p className="text-[var(--accent)] font-bold uppercase tracking-widest text-xs mb-4">Quizzinga</p>
          <h1 className="editorial-heading text-5xl md:text-7xl mb-4">Quiz Library.</h1>
          <p className="text-[var(--muted)] text-lg max-w-xl">
            Browse available quizzes and test your knowledge.
          </p>
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link href="/profile">
              <Button variant="secondary">My Profile</Button>
            </Link>
          ) : (
            <Button 
              variant="secondary" 
              onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/quiz` } })}
            >
              Login with Google
            </Button>
          )}
        </div>
      </header>

      {error && (
        <div className="card border-red-500/30 bg-red-500/5 mb-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-4 py-24">
          <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
          <p className="text-[var(--muted)] text-sm uppercase tracking-widest">Loading quizzes...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="card text-center py-24 max-w-lg mx-auto">
          <p className="text-2xl font-bold mb-2">No quizzes available</p>
          <p className="text-[var(--muted)]">Check back soon — new quizzes are being published regularly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card flex flex-col p-8 hover:border-[var(--accent)] transition-colors group">
              <p className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-4">
                {quiz.category || "Quiz"}
              </p>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
                {quiz.title}
              </h2>
              <p className="text-[var(--muted)] text-sm mb-6 flex-1">
                {quiz.description || "Test your knowledge."}
              </p>
              <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest mb-6">
                {quiz.questions_count ?? 0} Questions
              </p>
              {quiz.status === "coming_soon" ? (
                <div className="flex gap-2 mt-auto">
                  <Button className="w-full bg-amber-500 text-white hover:bg-amber-600 cursor-not-allowed opacity-80" disabled>
                    Coming Soon
                  </Button>
                </div>
              ) : quiz.status === "ended" ? (
                <div className="flex flex-col gap-2 mt-auto">
                  <Button className="w-full bg-red-500/20 text-red-300 hover:bg-red-500/20 cursor-not-allowed border border-red-500/30" disabled>
                    Quiz Ended
                  </Button>
                  <Link href={`/quiz/${quiz.id}`}>
                    <Button variant="secondary" className="w-full text-xs">View Final Leaderboard</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-auto">
                  <Link href={`/quiz/${quiz.id}`}>
                    <Button className="w-full">Attempt Now →</Button>
                  </Link>
                  <Link href={`/quiz/${quiz.id}`}>
                    <Button variant="secondary" className="w-full text-xs">View Leaderboard</Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <footer className="mt-auto pt-16 pb-8 text-center">
        <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-bold">
          Powered by Quizzinga
        </p>
      </footer>
    </div>
  );
}
