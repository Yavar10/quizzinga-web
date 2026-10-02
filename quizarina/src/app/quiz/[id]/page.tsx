"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Quiz } from "@/types/quiz";
import { QuizAttempt } from "@/types/attempt";
import { getQuiz } from "@/services/quizService";
import { getPublicQuestions } from "@/services/questionService";
import { createAttempt, getQuizAttempts } from "@/services/attemptService";
import { createClient } from "@/lib/supabase/client";

// Define a minimal User type to avoid importing full Supabase types if not needed
interface User {
  id: string;
  user_metadata: {
    full_name?: string;
  };
  email?: string;
}

export default function QuizInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const quizId = resolvedParams.id;
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [leaderboard, setLeaderboard] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [starting, setStarting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      try {
        const [quizData, questions, attempts, { data: authData }] = await Promise.all([
          getQuiz(quizId),
          getPublicQuestions(quizId),
          getQuizAttempts(quizId),
          supabase.auth.getUser(),
        ]);

        if (!quizData) {
          setError("Quiz not found");
          return;
        }

        setQuiz(quizData);
        setQuestionsCount(questions.length);
        setTotalPoints(questions.reduce((sum, q) => sum + q.points, 0));
        setLeaderboard(attempts);
        if (authData.user) {
          setUser(authData.user as unknown as User);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quizId, supabase.auth]);

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/quiz/${quizId}`,
      },
    });
  }

  async function handleStartQuiz() {
    if (!user) return;
    try {
      setStarting(true);
      // Use full_name from Google, or fallback to email
      const participantName = user.user_metadata?.full_name || user.email || "Anonymous Player";
      
      const attempt = await createAttempt({
        quiz_id: quizId,
        user_id: user.id,
        participant_name: participantName,
        total_questions: questionsCount,
      });
      // Navigate to the question page with the attempt ID
      router.push(`/quiz/${quizId}/question?attempt=${attempt.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start quiz");
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-4">
        <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-[var(--muted)] text-sm uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-red-400 text-xl mb-4">{error || "Quiz not found"}</p>
        <Button variant="secondary" onClick={() => router.push("/quiz")}>
          ← Back to Library
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto w-full py-16">
      <div className="w-full max-w-xl mb-16">
        <p className="text-[var(--accent)] font-bold uppercase tracking-widest text-xs mb-8">Quizzinga</p>

        <h1 className="editorial-heading text-4xl md:text-6xl mb-4">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-[var(--muted)] text-lg mb-8">{quiz.description}</p>
        )}

        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="card text-center py-6">
            <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest mb-2">Questions</p>
            <p className="text-3xl font-bold">{questionsCount}</p>
          </div>
          <div className="card text-center py-6">
            <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest mb-2">Points</p>
            <p className="text-3xl font-bold">{totalPoints}</p>
          </div>
          <div className="card text-center py-6">
            <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest mb-2">Category</p>
            <p className="text-sm font-bold uppercase tracking-widest mt-2">{quiz.category || "—"}</p>
          </div>
        </div>

        {quiz.status === "ended" ? (
          <div className="space-y-4">
            <Button className="w-full py-4 text-lg bg-red-500/10 text-red-500 cursor-not-allowed border border-red-500/20" disabled>
              Quiz Ended
            </Button>
            <p className="text-[var(--muted)] text-xs uppercase tracking-widest">This quiz is no longer accepting new attempts.</p>
          </div>
        ) : !user ? (
          <div className="space-y-4">
            <Button className="w-full py-4 text-lg bg-white text-black hover:bg-gray-200" onClick={handleGoogleLogin}>
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Login with Google to Start
              </span>
            </Button>
            <p className="text-[var(--muted)] text-xs uppercase tracking-widest">A Quizzinga account is required to save your scores.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[var(--accent)] font-bold uppercase tracking-widest text-xs">
              Logged in as {user.user_metadata?.full_name || user.email}
            </p>
            <Button
              className="w-full py-4 text-lg"
              onClick={handleStartQuiz}
              disabled={starting}
            >
              {starting ? "Starting..." : "Begin Quiz →"}
            </Button>
            <button
              onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
              className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors underline mt-4 flex mx-auto"
            >
              Sign out
            </button>
          </div>
        )}

        <div className="mt-8">
          <Button variant="ghost" onClick={() => router.push("/quiz")}>
            ← Back to Library
          </Button>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="w-full max-w-2xl border-t border-[var(--border)] pt-16">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-8 text-center">Live Leaderboard</h2>
        
        {leaderboard.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[var(--muted)]">No one has completed this quiz yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.slice(0, 10).map((att, index) => (
              <div 
                key={att.id} 
                className={`flex items-center justify-between p-5 border ${
                  index === 0 ? "border-[#00ff88]/30 bg-[#00ff88]/5" :
                  index === 1 ? "border-[var(--accent)]/30 bg-[var(--accent)]/5" :
                  index === 2 ? "border-amber-500/30 bg-amber-500/5" :
                  "border-[var(--border)] bg-[var(--background)]"
                }`}
              >
                <div className="flex items-center gap-6">
                  <span className={`text-xl font-bold w-6 ${
                    index === 0 ? "text-[#00ff88]" :
                    index === 1 ? "text-[var(--accent)]" :
                    index === 2 ? "text-amber-500" :
                    "text-[var(--muted)]"
                  }`}>
                    #{index + 1}
                  </span>
                  <span className="font-bold text-lg">{att.participant_name}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-xl ${
                    index === 0 ? "text-[#00ff88]" :
                    index === 1 ? "text-[var(--accent)]" :
                    index === 2 ? "text-amber-500" :
                    "text-white"
                  }`}>
                    {att.score}
                  </span>
                  <span className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest ml-2">Pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-[var(--muted)] uppercase tracking-widest font-bold mt-16">
        Powered by Quizzinga
      </p>
    </div>
  );
}
