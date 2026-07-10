import { useEffect } from "react";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";

/**
 * Toasts a friendly message whenever `error` changes to a non-null value.
 * Errors are expected to already be normalized to ApiError (see
 * src/api/api-error.ts) — its `message` is the backend-provided,
 * user-facing text for every status, including network failures.
 */
export function useErrorResponse(error?: unknown | null) {
  useEffect(() => {
    if (!error) return;

    if (isApiError(error)) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  }, [error]);
}
