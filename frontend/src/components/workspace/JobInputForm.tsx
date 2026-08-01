"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MIN_TITLE_LENGTH = 4;
const MIN_DESCRIPTION_LENGTH = 50;

interface JobInputFormProps {
  isSubmitting: boolean;
  onSubmit: (jobDescription: string) => void;
}

export function JobInputForm({ isSubmitting, onSubmit }: JobInputFormProps) {
  const [tab, setTab] = useState<"title" | "description">("title");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const titleValid = title.trim().length >= MIN_TITLE_LENGTH;
  const descriptionValid = description.trim().length >= MIN_DESCRIPTION_LENGTH;

  const handleSubmit = () => {
    if (isSubmitting) return;
    if (tab === "title" && titleValid) {
      onSubmit(title.trim());
    } else if (tab === "description" && descriptionValid) {
      onSubmit(description.trim());
    }
  };

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as "title" | "description")}
      className="gap-6"
    >
      <TabsList className="w-full">
        <TabsTrigger value="title" disabled={isSubmitting}>
          Job Title
        </TabsTrigger>
        <TabsTrigger value="description" disabled={isSubmitting}>
          Job Description
        </TabsTrigger>
      </TabsList>

      <TabsContent value="title" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="job-title">Job title</Label>
          <Input
            id="job-title"
            value={title}
            disabled={isSubmitting}
            placeholder="e.g., Software Engineer at F1Soft"
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <p className="text-xs text-muted-foreground">
            Quick start — we&apos;ll infer requirements from the role.
          </p>
        </div>
        <SubmitButton
          disabled={!titleValid || isSubmitting}
          isSubmitting={isSubmitting}
          onClick={handleSubmit}
        />
      </TabsContent>

      <TabsContent value="description" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="job-description">Job description</Label>
          <Textarea
            id="job-description"
            value={description}
            disabled={isSubmitting}
            rows={10}
            placeholder="Paste the full job description here..."
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              Full accuracy — tailored to the exact posting.
            </span>
            <span
              className={
                descriptionValid
                  ? "text-muted-foreground"
                  : "text-destructive"
              }
            >
              {description.trim().length} / {MIN_DESCRIPTION_LENGTH} min
            </span>
          </div>
        </div>
        <SubmitButton
          disabled={!descriptionValid || isSubmitting}
          isSubmitting={isSubmitting}
          onClick={handleSubmit}
        />
      </TabsContent>
    </Tabs>
  );
}

function SubmitButton({
  disabled,
  isSubmitting,
  onClick,
}: {
  disabled: boolean;
  isSubmitting: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="lg"
      className="self-end"
      disabled={disabled}
      onClick={onClick}
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
  );
}
