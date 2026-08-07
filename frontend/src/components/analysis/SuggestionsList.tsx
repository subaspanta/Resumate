"use client";

import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SuggestionCard } from "./SuggestionCard";
import type { Suggestion } from "@/src/features/analysis/types";

interface SuggestionsListProps {
  suggestions: Suggestion[];
  isLoading?: boolean;
  mutatingId?: string | null;
  onApply: (id: string) => void;
  onReject: (id: string) => void;
}

export function SuggestionsList({
  suggestions,
  isLoading,
  mutatingId,
  onApply,
  onReject,
}: SuggestionsListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="suggestions-empty">
        <span className="suggestions-empty-icon" aria-hidden="true">
          <Sparkles className="size-5" />
        </span>
        <p className="suggestions-empty-title">No suggestions yet</p>
        <p className="suggestions-empty-hint">
          Pick a bullet or summary in your resume and choose{" "}
          <strong>Generate Suggestions</strong> to get a rewrite tailored to
          this job.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          isMutating={mutatingId === suggestion.id}
          onApply={onApply}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
