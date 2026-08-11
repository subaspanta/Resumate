"use client";

import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Resume } from "@/src/features/resume/types";

interface ResumeContextCardProps {
  resume?: Resume;
  isLoading?: boolean;
}

function formatUploadDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ResumeContextCard({ resume, isLoading }: ResumeContextCardProps) {
  if (isLoading) {
    return (
      <Card className="flex flex-row items-center gap-4 p-4">
        <Skeleton className="size-11 rounded-md" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-28" />
        </div>
      </Card>
    );
  }

  if (!resume) return null;

  const fileName = resume.originalFileName || resume.title;

  return (
    <Card className="flex flex-row items-center gap-4 p-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <FileText className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          Resume: {fileName}
        </p>
        <p className="text-xs text-muted-foreground">
          Uploaded {formatUploadDate(resume.createdAt)}
        </p>
      </div>
    </Card>
  );
}
