"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
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

  const descriptionValid =
    description.trim().length >= MIN_DESCRIPTION_LENGTH &&
    description.trim().length <= MAX_DESCRIPTION_LENGTH;

  const canSubmit = descriptionValid && !isDisabled;

  const handleSubmit = () => {
    if (isSubmitting || !canSubmit) return;
    onSubmit(description.trim());
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Textarea
          id="job-description"
          aria-label="Job description"
          value={description}
          disabled={isSubmitting || isDisabled}
          rows={10}
          maxLength={MAX_DESCRIPTION_LENGTH}
          placeholder="Paste the full job description here..."
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            Full accuracy — tailored to the exact posting.
          </span>
          <span
            className={
              descriptionValid ? "text-muted-foreground" : "text-destructive"
            }
          >
            {description.trim().length} / {MIN_DESCRIPTION_LENGTH} min
          </span>
        </div>
      </div>
      <Button
        type="button"
        size="lg"
        className="self-end"
        disabled={!canSubmit || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            Continue
            <ArrowRight />
          </>
        )}
      </Button>
    </div>
  );
}
