"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useUploadResume } from "@/src/features/resume/resume.hooks";

export function useResumeUpload() {
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
      if (isApiError(error) && error.code === "GEMINI_RATE_LIMITED") {
        toast.error("AI is busy right now. Please try again in a moment.");
        return;
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
