"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { QuizAttempt } from "@/types/attempt";
import { getUserAttempts } from "@/services/attemptService";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<(QuizAttempt & { quizzes: { title: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          router.push("/quiz"); // Redirect to library if not logged in
          return;
        }
        setUser(authData.user);

        const userAttempts = await getUserAttempts(authData.user.id);
        setAttempts(userAttempts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-4">
        <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-[var(--muted)] text-sm uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-400 text-xl mb-4">{error || "User not found"}</p>
        <Button variant="secondary" onClick={() => router.push("/quiz")}>
          ← Back to Library
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-12 w-full max-w-5xl mx-auto">
      <header className="mb-16 border-b border-[var(--border)] pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="editorial-heading text-5xl md:text-7xl mb-4 text-[var(--accent)]">My Profile</h1>
          <p className="text-[var(--muted)] text-xl font-bold uppercase tracking-widest">
            {user.user_metadata?.full_name || user.email}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => supabase.auth.signOut().then(() => router.push("/quiz"))}>
            Sign Out
          </Button>
          <Link href="/quiz">
            <Button variant="secondary">Back to Library</Button>
          </Link>
        </div>
      </header>

      <section className="w-full">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-8 text-[var(--muted)]">Quiz History</h2>
        
        {attempts.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-2xl font-bold mb-2">No attempts yet</p>
            <p className="text-[var(--muted)]">Go to the library and complete a quiz to see your results here.</p>
            <Link href="/quiz">
              <Button className="mt-8">Browse Quizzes</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-[var(--border)] bg-white/5 hover:bg-white/10 transition-colors gap-4"
              >
                <div>
                  <h3 className="text-xl font-bold text-[var(--accent)]">{attempt.quizzes?.title || "Unknown Quiz"}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mt-2">
                    {new Date(attempt.completed_at!).toLocaleDateString()} at {new Date(attempt.completed_at!).toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-8 md:text-right">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Score</p>
                    <p className="text-3xl font-bold">{attempt.score}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1">Accuracy</p>
                    <p className="text-2xl font-bold">
                      {attempt.total_questions > 0 
                        ? Math.round((attempt.score / (attempt.total_questions * 10)) * 100) // Rough approx if 10 pts per q
                        : 0}%
                    </p>
                  </div>
                  <Link href={`/quiz/${attempt.quiz_id}/results?attempt=${attempt.id}`}>
                    <Button variant="secondary" className="px-4 py-2 text-xs">Details →</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
