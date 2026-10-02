"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
      <div className="mb-16">
        <h1 className="editorial-heading text-6xl md:text-8xl mb-6 tracking-tighter">Quizzinga.</h1>
        <p className="text-[var(--muted)] text-xl font-bold uppercase tracking-widest max-w-2xl">
          University Quiz Arena
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="card text-left p-8 flex flex-col hover:border-white transition-colors">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest">Admin Panel</h2>
          <p className="text-[var(--muted)] mb-8 flex-1">
            Create quizzes, manage questions, and publish to the library.
          </p>
          <Link href="/admin">
            <Button variant="secondary" className="w-full">Open Admin →</Button>
          </Link>
        </div>

        <div className="card text-left p-8 flex flex-col hover:border-[var(--accent)] transition-colors border-[var(--accent)]/30">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest text-[var(--accent)]">Quiz Library</h2>
          <p className="text-[var(--muted)] mb-8 flex-1">
            Browse quizzes, test your knowledge, and see your results.
          </p>
          <Link href="/quiz">
            <Button className="w-full">Browse Quizzes →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
