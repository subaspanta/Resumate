"use client";

import { Check, Eye, EyeOff, Minus, Plus, Redo2, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionVisibilityMenu } from "@/src/components/workspace/SectionVisibilityMenu";

interface ResumeReviewToolbarProps {
  resumeId: string;
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
  pendingCount: number;
}

export function ResumeReviewToolbar({
  resumeId,
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
  pendingCount,
}: ResumeReviewToolbarProps) {
  return (
    <div className="resume-review-toolbar">
      <div className="resume-review-toolbar-group">
        <div className="resume-review-zoom">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isMutating}
            onClick={onZoomOut}
            aria-label="Zoom out"
          >
            <Minus />
          </Button>
          <span className="resume-review-zoom-label">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isMutating}
            onClick={onZoomIn}
            aria-label="Zoom in"
          >
            <Plus />
          </Button>
        </div>

        <span className="resume-review-divider" aria-hidden="true" />

        <div className="resume-review-toolbar-group">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={!canUndo || isMutating}
            onClick={onUndo}
            aria-label="Undo"
          >
            <Undo2 />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={!canRedo || isMutating}
            onClick={onRedo}
            aria-label="Redo"
          >
            <Redo2 />
          </Button>
        </div>

        <span className="resume-review-divider" aria-hidden="true" />

        <SectionVisibilityMenu resumeId={resumeId} />
      </div>

      <div className="resume-review-toolbar-group">
        {/* Show Changes gates the accept/decline pair, so it leads them. Once
            changes are visible it steps back to a quiet toggle and the two
            decisions take the weight. */}
        <Button
          type="button"
          variant={showChanges ? "outline" : "default"}
          onClick={onToggleShowChanges}
          disabled={isMutating}
        >
          {showChanges ? <EyeOff /> : <Eye />}
          {showChanges ? "Hide changes" : "Show changes"}
          {!showChanges && pendingCount > 0 ? (
            <span className="resume-review-pending-count">{pendingCount}</span>
          ) : null}
        </Button>

        {showChanges && (
          <>
            <Button
              type="button"
              variant="outline"
              className="resume-review-decline-button"
              disabled={!canReview || isMutating}
              onClick={onDecline}
            >
              <X />
              Decline all
            </Button>
            <Button
              type="button"
              disabled={!canReview || isMutating}
              onClick={onAccept}
            >
              <Check />
              Accept all
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
