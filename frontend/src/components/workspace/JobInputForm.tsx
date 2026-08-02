"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const MIN_DESCRIPTION_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 10000;

interface JobInputFormProps {
  isSubmitting: boolean;
  onSubmit: (jobDescription: string) => void;
}

export function JobInputForm({ isSubmitting, onSubmit }: JobInputFormProps) {
  const [description, setDescription] = useState("");

  const descriptionValid =
    description.trim().length >= MIN_DESCRIPTION_LENGTH &&
    description.trim().length <= MAX_DESCRIPTION_LENGTH;

  const handleSubmit = () => {
    if (isSubmitting || !descriptionValid) return;
    onSubmit(description.trim());
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="job-description">Job description</Label>
        <Textarea
          id="job-description"
          value={description}
          disabled={isSubmitting}
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
        disabled={!descriptionValid || isSubmitting}
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
