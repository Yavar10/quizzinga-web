"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createQuiz } from "@/services/quizService";

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!title.trim()) {
      setError("Quiz title is required.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const quiz = await createQuiz({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        status: "draft",
      });
      router.push(`/admin/quizzes/${quiz.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quiz");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 md:p-12 max-w-4xl w-full mx-auto flex-1">
      <header className="mb-12">
        <h1 className="editorial-heading text-4xl md:text-5xl mb-2">Create Quiz</h1>
        <p className="text-[var(--muted)] text-lg">Build your arena.</p>
      </header>

      {error && (
        <div className="card border-red-500/30 bg-red-500/5 mb-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-12 pb-24">
        <section className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-[var(--border)] pb-4">Quiz Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Quiz Title</label>
              <Input
                placeholder="Enter quiz title..."
                className="text-xl font-bold"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Description</label>
              <Input
                placeholder="Brief description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Category</label>
              <Input
                placeholder="e.g. General Knowledge, Science, History..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>
        </section>

        <p className="text-[var(--muted)] text-sm">
          Save the quiz first, then add questions on the edit page.
        </p>

        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-[var(--border)] flex justify-end gap-4 z-10">
          <Button variant="ghost" onClick={() => router.push("/admin/quizzes")}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save & Add Questions"}
          </Button>
        </div>
      </div>
    </div>
  );
}
