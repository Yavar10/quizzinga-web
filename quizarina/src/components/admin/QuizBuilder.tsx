"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function QuizBuilder() {
  const [questions, setQuestions] = useState([{ id: 1, text: "", correctAnswer: "", acceptedAnswers: [""], points: 10, timeLimit: 20 }]);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: "", correctAnswer: "", acceptedAnswers: [""], points: 10, timeLimit: 20 }]);
  };

  const addAcceptedAnswer = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].acceptedAnswers.push("");
    setQuestions(newQuestions);
  };

  const updateQuestion = (qIndex: number, field: string, value: any) => {
    const newQuestions = [...questions] as any;
    newQuestions[qIndex][field] = value;
    setQuestions(newQuestions);
  };

  const updateAcceptedAnswer = (qIndex: number, aIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].acceptedAnswers[aIndex] = value;
    setQuestions(newQuestions);
  };

  const showToast = (message: string) => {
    alert(message); // simple prototype toast
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Quiz Settings */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold uppercase tracking-widest border-b border-[var(--border)] pb-4">Quiz Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Quiz Title</label>
            <Input placeholder="Enter quiz title..." className="text-xl font-bold" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Description</label>
            <Input placeholder="Brief description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Mode</label>
              <div className="card text-center py-4 border-[var(--accent)] text-[var(--accent)] font-bold uppercase tracking-widest">
                Live Event
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Visibility</label>
              <div className="card text-center py-4 text-[var(--muted)] font-bold uppercase tracking-widest">
                Private
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Question Builder */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-bold uppercase tracking-widest">Questions</h2>
        </div>

        <div className="space-y-8">
          {questions.map((q, qIndex) => (
            <div key={q.id} className="card relative group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-[var(--muted)] hover:text-red-500 uppercase tracking-widest text-xs font-bold">Delete</button>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] mb-6">Question {(qIndex + 1).toString().padStart(2, '0')}</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Question Text</label>
                  <Input 
                    value={q.text}
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                    placeholder="e.g. Who painted Guernica?" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Answer Type</label>
                    <Input value="Single Answer" readOnly className="bg-white/5 cursor-not-allowed text-[var(--muted)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Correct Answer</label>
                    <Input 
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                      placeholder="e.g. Pablo Picasso" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Accepted Answers (Fuzzy matches)</label>
                  <div className="space-y-2 mb-4">
                    {q.acceptedAnswers.map((ans, aIndex) => (
                      <Input 
                        key={aIndex} 
                        value={ans}
                        onChange={(e) => updateAcceptedAnswer(qIndex, aIndex, e.target.value)}
                        placeholder="Alternative correct answer..." 
                      />
                    ))}
                  </div>
                  <button 
                    onClick={() => addAcceptedAnswer(qIndex)}
                    className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] hover:text-white transition-colors"
                  >
                    + Add Accepted Answer
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[var(--border)]">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Points</label>
                    <Input 
                      type="number" 
                      value={q.points}
                      onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 10)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Time Limit (Seconds)</label>
                    <Input 
                      type="number" 
                      value={q.timeLimit}
                      onChange={(e) => updateQuestion(qIndex, 'timeLimit', parseInt(e.target.value) || 20)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="secondary" className="w-full py-6" onClick={addQuestion}>
          + Add Question
        </Button>
      </section>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-[var(--border)] flex justify-end gap-4 z-10">
        <Button variant="ghost" onClick={() => showToast("Draft saved.")}>Save Draft</Button>
        <Button variant="secondary" onClick={() => showToast("Preview mode opening...")}>Preview Quiz</Button>
        <Button onClick={() => showToast("Quiz published!")}>Publish Quiz</Button>
      </div>
    </div>
  );
}
