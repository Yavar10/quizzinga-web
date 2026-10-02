import React from "react";
import { QuizStatus } from "@/types/quiz";

interface BadgeProps {
  status: QuizStatus;
  className?: string;
}

const statusClassMap: Record<QuizStatus, string> = {
  active: "badge-live",
  draft: "badge-draft",
  ended: "badge-completed",
  coming_soon: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
};

const statusLabelMap: Record<QuizStatus, string> = {
  active: "ACTIVE",
  draft: "DRAFT",
  ended: "ENDED",
  coming_soon: "COMING SOON",
};

export function Badge({ status, className = "" }: BadgeProps) {
  const statusClass = statusClassMap[status] ?? "badge-draft";
  const label = statusLabelMap[status] ?? status.toUpperCase();
  return (
    <span className={`badge ${statusClass} ${className}`}>
      {label}
    </span>
  );
}
