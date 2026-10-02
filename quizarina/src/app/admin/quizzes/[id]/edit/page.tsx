"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Quiz, QuestionAdmin } from "@/types/quiz";
import { getQuiz, updateQuiz } from "@/services/quizService";
import {
  getAdminQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/services/questionService";

export default function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const quizId = resolvedParams.id;
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuestionAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Quiz edit fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [quizData, questionsData] = await Promise.all([
        getQuiz(quizId),
        getAdminQuestions(quizId),
      ]);

      if (!quizData) {
        setError("Quiz not found");
        return;
      }

      setQuiz(quizData);
      setTitle(quizData.title);
      setDescription(quizData.description);
      setCategory(quizData.category);
      setQuestions(questionsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    load();
  }, [load]);

  function showFeedback(msg: string) {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  }

  // ---- Quiz mutations ----

  async function handleSaveQuiz() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    try {
      setSaving(true);
      const updated = await updateQuiz(quizId, {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
      });
      setQuiz(updated);
      showFeedback("Quiz details saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateStatus(newStatus: "draft" | "active" | "ended" | "coming_soon") {
    if (!quiz) return;
    try {
      setSaving(true);
      const updated = await updateQuiz(quizId, { status: newStatus });
      setQuiz(updated);
      showFeedback(`Quiz status set to ${newStatus}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  // ---- Question mutations ----

  async function handleAddQuestion() {
    try {
      const newQ = await createQuestion({
        quiz_id: quizId,
        question_text: "",
        correct_answer: "",
        accepted_answers: [],
        points: 10,
        question_order: questions.length,
      });
      setQuestions((prev) => [...prev, newQ]);
      showFeedback("Question added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add question");
    }
  }

  async function handleUpdateQuestion(id: string, field: string, value: string | number | string[]) {
    try {
      const updated = await updateQuestion(id, { [field]: value });
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? updated : q))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update question");
    }
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm("Delete this question?")) return;
    try {
      await deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      showFeedback("Question deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete question");
    }
  }

  function handleAddAcceptedAnswer(qId: string) {
    const q = questions.find((q) => q.id === qId);
    if (!q) return;
    const updated = [...q.accepted_answers, ""];
    handleUpdateQuestion(qId, "accepted_answers", updated);
  }

  function handleRemoveAcceptedAnswer(qId: string, index: number) {
    const q = questions.find((q) => q.id === qId);
    if (!q) return;
    const updated = q.accepted_answers.filter((_, i) => i !== index);
    handleUpdateQuestion(qId, "accepted_answers", updated);
  }

  function handleUpdateAcceptedAnswer(qId: string, index: number, value: string) {
    const q = questions.find((q) => q.id === qId);
    if (!q) return;
    const updated = [...q.accepted_answers];
    updated[index] = value;
    // Update locally immediately for responsiveness, persist on blur
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === qId ? { ...question, accepted_answers: updated } : question
      )
    );
  }

  function persistAcceptedAnswers(qId: string) {
    const q = questions.find((q) => q.id === qId);
    if (!q) return;
    handleUpdateQuestion(qId, "accepted_answers", q.accepted_answers);
  }

  if (loading) {
    return (
      <div className="p-8 md:p-12 max-w-4xl w-full mx-auto flex-1 flex items-center gap-4">
        <div className="w-5 h-5 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
        <p className="text-[var(--muted)] text-sm uppercase tracking-widest">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8 md:p-12 max-w-4xl w-full mx-auto flex-1">
        <p className="text-red-400">Quiz not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-4xl w-full mx-auto flex-1">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="editorial-heading text-4xl md:text-5xl mb-2">Edit Quiz</h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge status={quiz.status} />
            <p className="text-[var(--muted)] text-sm">{questions.length} questions</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href={`/admin/quizzes/${quizId}/attempts`}>
            <Button variant="ghost">View Results</Button>
          </Link>
          {quiz.status === "active" && (
            <a href={`/quiz/${quizId}`} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost">Preview</Button>
            </a>
          )}
          <div className="flex bg-[var(--border)] rounded-md p-1 overflow-hidden">
            <button
              onClick={() => handleUpdateStatus("draft")}
              disabled={saving}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                quiz.status === "draft" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:text-white"
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => handleUpdateStatus("coming_soon")}
              disabled={saving}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                quiz.status === "coming_soon" ? "bg-amber-500 text-white" : "text-[var(--muted)] hover:text-white"
              }`}
            >
              Coming Soon
            </button>
            <button
              onClick={() => handleUpdateStatus("active")}
              disabled={saving}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                quiz.status === "active" ? "bg-[#00ff88] text-black" : "text-[var(--muted)] hover:text-white"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleUpdateStatus("ended")}
              disabled={saving}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                quiz.status === "ended" ? "bg-red-500 text-white" : "text-[var(--muted)] hover:text-white"
              }`}
            >
              Ended
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="card border-red-500/30 bg-red-500/5 mb-8">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 text-xs mt-2 underline">Dismiss</button>
        </div>
      )}

      {feedback && (
        <div className="card border-[#00ff88]/30 bg-[#00ff88]/5 mb-8">
          <p className="text-[#00ff88] text-sm">{feedback}</p>
        </div>
      )}

      <div className="space-y-12 pb-24">
        {/* Quiz Details */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-widest border-b border-[var(--border)] pb-4">Quiz Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Quiz Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title..."
                className="text-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Category</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. General Knowledge"
              />
            </div>
            <div className="pt-2">
              <Button variant="secondary" onClick={handleSaveQuiz} disabled={saving}>
                {saving ? "Saving..." : "Save Details"}
              </Button>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <h2 className="text-xl font-bold uppercase tracking-widest">Questions</h2>
          </div>

          {questions.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-[var(--muted)] mb-4">No questions yet. Add your first one.</p>
            </div>
          )}

          <div className="space-y-8">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="card relative group">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-[var(--muted)] hover:text-red-500 uppercase tracking-widest text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] mb-6">
                  Question {(qIndex + 1).toString().padStart(2, "0")}
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Question Text</label>
                    <Input
                      value={q.question_text}
                      onChange={(e) => {
                        setQuestions((prev) =>
                          prev.map((question) =>
                            question.id === q.id ? { ...question, question_text: e.target.value } : question
                          )
                        );
                      }}
                      onBlur={() => handleUpdateQuestion(q.id, "question_text", q.question_text)}
                      placeholder="e.g. Who painted Guernica?"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Answer Type</label>
                      <Input value="Single Answer" readOnly className="bg-white/5 cursor-not-allowed text-[var(--muted)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Correct Answer</label>
                      <Input
                        value={q.correct_answer}
                        onChange={(e) => {
                          setQuestions((prev) =>
                            prev.map((question) =>
                              question.id === q.id ? { ...question, correct_answer: e.target.value } : question
                            )
                          );
                        }}
                        onBlur={() => handleUpdateQuestion(q.id, "correct_answer", q.correct_answer)}
                        placeholder="e.g. Pablo Picasso"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Accepted Answers (variants)</label>
                    <div className="space-y-2 mb-4">
                      {q.accepted_answers.map((ans, aIndex) => (
                        <div key={aIndex} className="flex gap-2">
                          <Input
                            value={ans}
                            onChange={(e) => handleUpdateAcceptedAnswer(q.id, aIndex, e.target.value)}
                            onBlur={() => persistAcceptedAnswers(q.id)}
                            placeholder="Alternative correct answer..."
                          />
                          <button
                            onClick={() => handleRemoveAcceptedAnswer(q.id, aIndex)}
                            className="text-[var(--muted)] hover:text-red-500 px-2 text-lg transition-colors shrink-0"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleAddAcceptedAnswer(q.id)}
                      className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] hover:text-white transition-colors"
                    >
                      + Add Accepted Answer
                    </button>
                  </div>

                  <div className="pt-4 border-t border-[var(--border)]">
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Points</label>
                    <Input
                      type="number"
                      value={q.points}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 10;
                        setQuestions((prev) =>
                          prev.map((question) =>
                            question.id === q.id ? { ...question, points: val } : question
                          )
                        );
                      }}
                      onBlur={() => handleUpdateQuestion(q.id, "points", q.points)}
                      className="max-w-32"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="secondary" className="w-full py-6" onClick={handleAddQuestion}>
            + Add Question
          </Button>
        </section>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-[var(--border)] flex justify-between z-10">
          <Button variant="ghost" onClick={() => router.push("/admin/quizzes")}>
            ← Back to Quizzes
          </Button>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={handleSaveQuiz} disabled={saving}>
              Save
            </Button>
            <div className="flex bg-[var(--border)] rounded-md p-1">
              <button
                onClick={() => handleUpdateStatus("draft")}
                disabled={saving}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                  quiz.status === "draft" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:text-white"
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => handleUpdateStatus("coming_soon")}
                disabled={saving}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                  quiz.status === "coming_soon" ? "bg-amber-500 text-white" : "text-[var(--muted)] hover:text-white"
                }`}
              >
                Coming Soon
              </button>
              <button
                onClick={() => handleUpdateStatus("active")}
                disabled={saving}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                  quiz.status === "active" ? "bg-[#00ff88] text-black" : "text-[var(--muted)] hover:text-white"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleUpdateStatus("ended")}
                disabled={saving}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                  quiz.status === "ended" ? "bg-red-500 text-white" : "text-[var(--muted)] hover:text-white"
                }`}
              >
                Ended
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
