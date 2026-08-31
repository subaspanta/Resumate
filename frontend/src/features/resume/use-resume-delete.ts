"use client";

import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useDeleteResume } from "@/src/features/resume/resume.hooks";

export function useDeleteResumeFlow() {
  const deleteResume = useDeleteResume();

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteResume.mutateAsync(id);
      toast.success(`"${title}" deleted.`);
    } catch (error) {
      // 404 = already deleted in another tab; treat as success
      if (isApiError(error) && error.status === 404) {
        toast.success(`"${title}" deleted.`);
        return;
      }
      const message =
        error instanceof Error ? error.message : "Failed to delete resume";
      toast.error(message);
    }
  };

  return {
    handleDelete,
    isDeleting: deleteResume.isPending,
    deletingId: deleteResume.isPending ? deleteResume.variables : undefined,
  };
}
