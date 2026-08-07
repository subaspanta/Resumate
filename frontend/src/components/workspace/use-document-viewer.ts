"use client";

import { useCallback, useState } from "react";

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.15;

/**
 * Zoom and diff-visibility for the resume preview. Pure view state — it never
 * touches server data, which is why the analysis page's suggestion mutations
 * can't invalidate it.
 */
export function useDocumentViewer() {
  const [zoom, setZoom] = useState(1);
  const [showChanges, setShowChanges] = useState(false);

  // Functional setState throughout, so these need no dependencies and keep a
  // stable identity across renders — ResumeReviewToolbar owns a query-backed
  // SectionVisibilityMenu and shouldn't re-render on unrelated page state.
  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP)),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP)),
    [],
  );
  const toggleShowChanges = useCallback(() => setShowChanges((s) => !s), []);

  return { zoom, zoomIn, zoomOut, showChanges, toggleShowChanges };
}
