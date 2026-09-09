"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth.service";
import { type LoginInput, type RegisterInput, type SafeUser } from "./types";
import { isApiError } from "@/src/api/api-error";
import { queryKeys } from "@/src/lib/query-keys";
import { defaultQueryRetry } from "@/src/lib/query-client";

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<SafeUser | null>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      try {
        const response = await authApi.me();
        return response?.data?.data ?? null;
      } catch (err) {
        // 401 = legitimately signed out, not a query error.
        if (isApiError(err) && err.status === 401) return null;
        throw err;
      }
    },
    // Deliberately longer than DEFAULT_STALE_TIME — the session identity
    // changes far less often than resume or analysis data.
    staleTime: 1000 * 60 * 10,
    retry: defaultQueryRetry,
  });

  const isAuthenticated = !!user;

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await authApi.login(data);
      // Unwrap twice: axios `.data` is the API envelope, `.data.data` is the
      // user. Must match the `me` queryFn above — both write the same cache key.
      return response?.data?.data ?? null;
    },
    onSuccess: (newUser: SafeUser | null) => {
      queryClient.setQueryData<SafeUser | null>(queryKeys.auth.me(), newUser);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await authApi.register(data);
      return response?.data?.data ?? null;
    },
    onSuccess: (newUser: SafeUser | null) => {
      queryClient.setQueryData<SafeUser | null>(queryKeys.auth.me(), newUser);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    // onSettled, not onSuccess: the logout route requires auth, so an
    // already-expired session 401s. The user is logged out server-side either
    // way — failing to clear the cache would strand stale user data behind a
    // UI that says "logout failed".
    onSettled: () => {
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.clear();
    },
  });

  // Unlike logout, a failed delete must NOT clear the session — the account
  // (and its data) still exists, so leaving the user signed in behind a
  // "delete failed" toast is correct; only a real 200 means the account and
  // every cascaded row are actually gone.
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await authApi.deleteAccount();
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.clear();
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    isError,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
    refetchMe: refetch,
  };
}
