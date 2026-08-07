"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MIN_DESCRIPTION_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 10000;

interface JobInputFormProps {
  isSubmitting: boolean;
  // Set while the resume this analysis would attach to is still loading or
  // absent — submitting then would create an analysis against nothing.
  isDisabled?: boolean;
  onSubmit: (jobDescription: string) => void;
}

export function JobInputForm({
  isSubmitting,
  isDisabled = false,
  onSubmit,
}: JobInputFormProps) {
  const [description, setDescription] = useState("");

  const trimmedLength = description.trim().length;
  const descriptionValid =
    trimmedLength >= MIN_DESCRIPTION_LENGTH &&
    trimmedLength <= MAX_DESCRIPTION_LENGTH;

  const canSubmit = descriptionValid && !isDisabled;
  const progress = Math.min(1, trimmedLength / MIN_DESCRIPTION_LENGTH);

  const handleSubmit = () => {
    if (isSubmitting || !canSubmit) return;
    onSubmit(description.trim());
  };

  return (
    <div className="jd-form">
      <Textarea
        id="job-description"
        aria-label="Job description"
        aria-describedby="job-description-hint"
        value={description}
        disabled={isSubmitting || isDisabled}
        rows={12}
        maxLength={MAX_DESCRIPTION_LENGTH}
        placeholder="Paste the full job description here — responsibilities, requirements, and the tech stack."
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* The submit control and the requirement that gates it live in one
          bar, so "why is this disabled" and "where do I click" answer each
          other without scrolling. */}
      <div className="jd-form-actions">
        <div className="jd-form-status" id="job-description-hint">
          <div className="jd-form-meter" aria-hidden="true">
            <span
              className={`jd-form-meter-fill ${
                descriptionValid ? "jd-form-meter-fill--valid" : ""
              }`}
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <span className="jd-form-status-text">
            {descriptionValid
              ? `${trimmedLength.toLocaleString()} characters — ready to analyze`
              : `${trimmedLength} of ${MIN_DESCRIPTION_LENGTH} characters minimum`}
          </span>
        </div>

        <Button
          type="button"
          size="lg"
          className="jd-form-submit"
          disabled={!canSubmit || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles />
              Analyze Resume
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
