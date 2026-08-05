"use client";

import { Check, Eye, EyeOff, Minus, Plus, Redo2, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeReviewToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  showChanges: boolean;
  onToggleShowChanges: () => void;
  onAccept: () => void;
  onDecline: () => void;
  canReview: boolean;
  isMutating: boolean;
}

export function ResumeReviewToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  showChanges,
  onToggleShowChanges,
  onAccept,
  onDecline,
  canReview,
  isMutating,
}: ResumeReviewToolbarProps) {
  return (
    <div className="resume-review-toolbar">
      <div className="resume-review-toolbar-group">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onZoomOut}
          aria-label="Zoom out"
        >
          <Minus />
        </Button>
        <span className="resume-review-zoom-label">{Math.round(zoom * 100)}%</span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onZoomIn}
          aria-label="Zoom in"
        >
          <Plus />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canUndo}
          onClick={onUndo}
          aria-label="Undo"
        >
          <Undo2 />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canRedo}
          onClick={onRedo}
          aria-label="Redo"
        >
          <Redo2 />
        </Button>
      </div>

      <div className="resume-review-toolbar-group">
        <Button
          type="button"
          disabled={!canReview || isMutating}
          onClick={onAccept}
          className="resume-review-accept-button"
        >
          <Check />
          Accept Changes
        </Button>
        <Button
          type="button"
          onClick={onToggleShowChanges}
          className="resume-review-show-button"
        >
          {showChanges ? <EyeOff /> : <Eye />}
          {showChanges ? "Hide Changes" : "Show Changes"}
        </Button>
        <Button
          type="button"
          disabled={!canReview || isMutating}
          onClick={onDecline}
          className="resume-review-decline-button"
        >
          <X />
          Decline Changes
        </Button>
      </div>
    </div>
  );
}
