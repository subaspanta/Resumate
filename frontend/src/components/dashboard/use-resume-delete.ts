"use client";

import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useDeleteResume } from "@/src/features/resume/resume.hooks";

/**
 * Delete flow for a resume: mutation plus error mapping, matching how
 * useResumeUpload handles the upload side. The confirmation dialog lives in
 * the list row — by the time this runs, the user has already confirmed.
 */
export function useResumeDelete() {
  const deleteResume = useDeleteResume();

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteResume.mutateAsync(id);
      toast.success(`"${title}" deleted.`);
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        // Already gone — someone deleted it in another tab. The optimistic
        // removal already took the row out, so this is the state the user
        // wanted; saying "failed" would be a lie.
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
    // Gated on isPending: `variables` keeps the last id after the mutation
    // settles, so reading it alone would leave a failed row's button disabled
    // forever once the optimistic removal rolled it back into the list.
    deletingId: deleteResume.isPending ? deleteResume.variables : undefined,
  };
}
