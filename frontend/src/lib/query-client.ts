import { QueryClient } from "@tanstack/react-query";
import { isApiError } from "@/src/api/api-error";

// Every query hook shares this policy, so it lives in one place rather than
// being re-typed per hook. A 401 is a real answer ("you are signed out"), not
// a transient failure — retrying it just delays the redirect.
export function defaultQueryRetry(failureCount: number, err: unknown): boolean {
  if (isApiError(err) && err.status === 401) return false;
  return failureCount < 2;
}

export const DEFAULT_STALE_TIME = 1000 * 60 * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
