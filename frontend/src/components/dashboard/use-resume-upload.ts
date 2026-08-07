"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useUploadResume } from "@/src/features/resume/resume.hooks";

export function useUploadResumeFlow() {
  const router = useRouter();
  const uploadResumeMutation = useUploadResume();

  const handleFileSelected = async (file: File) => {
    const form = new FormData();
    form.append("resume", file);

    try {
      const resume = await uploadResumeMutation.mutateAsync(form);
      toast.success(`"${file.name}" uploaded successfully.`);
      router.push(`/workspace/${resume.id}`);
    } catch (error) {
      if (isApiError(error)) {
        switch (error.code) {
          case "RATE_LIMIT_EXCEEDED":
            // Our own aiRateLimit (10 req / 5 min), not Gemini's — the
            // server's message names the actual wait, so prefer it.
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
            // Deliberately not "try again" — the server's own message says
            // that, but re-uploading the same file fails identically. This is
            // almost always a scanned-image PDF with no text layer.
            toast.error(
              "No readable text found in that file. If it's a scan, export a text-based PDF and re-upload.",
            );
            return;
          case "STORAGE_FAILED":
            toast.error(
              "File storage is temporarily unavailable. Try again shortly.",
            );
            return;
        }
      }
      const message =
        error instanceof Error ? error.message : "Failed to upload resume";
      toast.error(message);
    }
  };

  const triggerUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileSelected(file);
    };
    input.click();
  };

  return {
    handleFileSelected,
    triggerUpload,
    isUploading: uploadResumeMutation.isPending,
  };
}
