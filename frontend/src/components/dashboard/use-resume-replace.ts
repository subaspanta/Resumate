"use client";

import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useReplaceResume } from "@/src/features/resume/resume.hooks";
import { validateResumeFile } from "@/src/features/resume/resume.utils";
import { pickSingleFile } from "@/src/lib/file-picker";

export function useReplaceResumeFlow() {
  const replaceResume = useReplaceResume();

  const handleFileSelected = async (id: string, title: string, file: File) => {
    const validationError = validateResumeFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const form = new FormData();
    form.append("resume", file);

    try {
      await replaceResume.mutateAsync({ id, form });
      toast.success(`"${title}" replaced with "${file.name}".`);
    } catch (error) {
      if (isApiError(error)) {
        switch (error.code) {
          case "RATE_LIMIT_EXCEEDED":
            toast.error(error.message);
            return;
          case "GEMINI_RATE_LIMITED":
            toast.error("AI is busy right now. Please try again in a moment.");
            return;
          case "FILE_TOO_LARGE":
            toast.error("That file is over the 2MB limit. Try a smaller PDF.");
            return;
          case "UNSUPPORTED_FILE_TYPE":
            toast.error(
              "That file isn't a PDF or DOCX. Check the file itself, not just the extension.",
            );
            return;
          case "PARSING_FAILED":
            toast.error(
              "No readable text found in that file. If it's a scan, export a text-based PDF and re-upload.",
            );
            return;
          case "STORAGE_FAILED":
            toast.error(
              "File storage is temporarily unavailable. Try again shortly.",
            );
            return;
          case "RESOURCE_NOT_FOUND":
            toast.error(`"${title}" no longer exists.`);
            return;
        }
      }
      const message =
        error instanceof Error ? error.message : "Failed to replace resume";
      toast.error(message);
    }
  };

  const triggerReplace = async (id: string, title: string) => {
    const file = await pickSingleFile();
    if (file) {
      await handleFileSelected(id, title, file);
    }
    // If no file selected (user cancelled), do nothing
  };

  return {
    triggerReplace,
    isReplacing: replaceResume.isPending,
    replacingId: replaceResume.isPending
      ? replaceResume.variables?.id
      : undefined,
  };
}
