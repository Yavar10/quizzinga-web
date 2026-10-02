// Legacy mock data — kept for reference/fallback during development.
// Production pages use Supabase as the source of truth.

import { Quiz } from "../types/quiz";

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: "q-1",
    title: "General Knowledge — Round 1",
    description: "First round of the annual GK tournament.",
    category: "General Knowledge",
    status: "published",
    created_by: null,
    created_at: "2026-10-02T00:00:00Z",
    updated_at: "2026-10-02T00:00:00Z",
    questions_count: 20,
  },
  {
    id: "q-2",
    title: "Freshers Quiz 2026",
    description: "Welcome quiz for the new batch.",
    category: "General",
    status: "draft",
    created_by: null,
    created_at: "2026-10-08T00:00:00Z",
    updated_at: "2026-10-08T00:00:00Z",
    questions_count: 30,
  },
  {
    id: "q-3",
    title: "Sports & Cinema",
    description: "Trivia on sports and movies.",
    category: "Entertainment",
    status: "archived",
    created_by: null,
    created_at: "2026-09-28T00:00:00Z",
    updated_at: "2026-09-28T00:00:00Z",
    questions_count: 25,
  },
  {
    id: "q-4",
    title: "Science & Technology",
    description: "Tech trivia.",
    category: "Science",
    status: "archived",
    created_by: null,
    created_at: "2026-09-25T00:00:00Z",
    updated_at: "2026-09-25T00:00:00Z",
    questions_count: 20,
  },
];
