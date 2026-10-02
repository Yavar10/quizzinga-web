"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdminQuestionsPage() {
  return (
    <div className="p-8 md:p-12 max-w-7xl w-full mx-auto flex-1 flex items-center justify-center">
      <div className="text-center card py-24 px-12 max-w-xl">
        <h1 className="editorial-heading text-4xl mb-4 text-[var(--accent)]">Question Bank</h1>
        <p className="text-xl font-bold uppercase tracking-widest mb-2">Coming Soon</p>
        <p className="text-[var(--muted)] mb-8">
          The global question bank is currently under development. Soon, you'll be able to manage all questions from a single place and re-use them across multiple quizzes.
        </p>
        <Link href="/admin/quizzes">
          <Button>Manage Quizzes Instead</Button>
        </Link>
      </div>
    </div>
  );
}
