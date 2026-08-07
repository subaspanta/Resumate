"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useApplySuggestion,
  useRejectSuggestion,
} from "@/src/features/analysis/analysis.hooks";
import type {
  Analysis,
  Suggestion,
  SuggestionStatus,
} from "@/src/features/analysis/types";
import { queryKeys } from "@/src/lib/query-keys";

interface ReviewHistoryEntry {
  suggestionIds: string[];
  prevStatus: SuggestionStatus;
  newStatus: Exclude<SuggestionStatus, "pending">;
}

/**
 * Bulk accept/decline of the pending suggestions, plus session-only undo/redo
 * over those batches. This is self-contained domain logic, so it lives here
 * rather than in the route file that renders it.
 */
export function useReviewHistory(
  analysisId: string,
  pendingSuggestions: Suggestion[],
) {
  const queryClient = useQueryClient();
  const applySuggestion = useApplySuggestion(analysisId);
  const rejectSuggestion = useRejectSuggestion(analysisId);

  const [history, setHistory] = useState<ReviewHistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<ReviewHistoryEntry[]>([]);
  const [isMutating, setIsMutating] = useState(false);

  const runStatusMutation = (
    id: string,
    status: Exclude<SuggestionStatus, "pending">,
  ) =>
    status === "applied"
      ? applySuggestion.mutateAsync({ suggestionId: id })
      : rejectSuggestion.mutateAsync({ suggestionId: id });

  const applyToAllPending = async (
    newStatus: Exclude<SuggestionStatus, "pending">,
  ) => {
    const ids = pendingSuggestions.map((s) => s.id);
    if (ids.length === 0) return;
    setIsMutating(true);
    try {
      await Promise.all(ids.map((id) => runStatusMutation(id, newStatus)));
      setHistory((h) => [
        ...h,
        { suggestionIds: ids, prevStatus: "pending", newStatus },
      ]);
      setRedoStack([]);
    } finally {
      setIsMutating(false);
    }
  };

  // Reverts a batch of suggestions to a target status. When the target is
  // "pending" there is no real endpoint to call — updateSuggestionStatus's
  // Zod schema only accepts "applied"/"rejected" — so this writes straight
  // into the analysis-detail cache instead (same setQueryData shape
  // useUpdateSuggestionStatus's onMutate already uses). That means an undo
  // back to pending is client-only and won't survive a page refresh; the
  // DB row stays at whatever it was last PATCHed to. Not a bug — history is
  // deliberately session-only. Revisit if this proves confusing in practice.
  const revertSuggestions = async (
    ids: string[],
    targetStatus: SuggestionStatus,
  ) => {
    if (targetStatus === "pending") {
      const key = queryKeys.analysis.detail(analysisId);
      const current = queryClient.getQueryData<Analysis>(key);
      if (current) {
        queryClient.setQueryData<Analysis>(key, {
          ...current,
          suggestions: current.suggestions.map((s: Suggestion) =>
            ids.includes(s.id) ? { ...s, status: "pending" } : s,
          ),
        });
      }
      return;
    }
    await Promise.all(ids.map((id) => runStatusMutation(id, targetStatus)));
  };

  const undo = async () => {
    const entry = history[history.length - 1];
    if (!entry) return;
    setIsMutating(true);
    try {
      await revertSuggestions(entry.suggestionIds, entry.prevStatus);
      setHistory((h) => h.slice(0, -1));
      setRedoStack((r) => [...r, entry]);
    } finally {
      setIsMutating(false);
    }
  };

  const redo = async () => {
    const entry = redoStack[redoStack.length - 1];
    if (!entry) return;
    setIsMutating(true);
    try {
      await Promise.all(
        entry.suggestionIds.map((id) => runStatusMutation(id, entry.newStatus)),
      );
      setRedoStack((r) => r.slice(0, -1));
      setHistory((h) => [...h, entry]);
    } finally {
      setIsMutating(false);
    }
  };

  return {
    acceptAll: () => applyToAllPending("applied"),
    declineAll: () => applyToAllPending("rejected"),
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: redoStack.length > 0,
    isMutating,
    // Handed back so the page's single-suggestion accept/reject reuses these
    // instances. Calling useApplySuggestion again there would mint a second
    // mutation observer over the same cache key — same result, twice the work.
    applySuggestion,
    rejectSuggestion,
  };
}
