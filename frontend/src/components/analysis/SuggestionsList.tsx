"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SuggestionCard } from "./SuggestionCard";
import type { Suggestion } from "@/src/features/analysis/types";

interface SuggestionsListProps {
  suggestions: Suggestion[];
  isLoading?: boolean;
  mutatingId?: string | null;
  onApply: (id: string) => void;
  onReject: (id: string) => void;
  onGenerate?: () => void;
  canGenerate?: boolean;
  isGenerating?: boolean;
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
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No suggestions found for this analysis.
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
