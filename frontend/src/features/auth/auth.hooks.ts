"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./auth.service";
import { type LoginInput, type RegisterInput, type SafeUser } from "./types";
import { isApiError } from "@/src/api/api-error";

const AUTH_QUERY_KEY = ["auth", "me"] as const;

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<SafeUser | null>({
    queryKey: AUTH_QUERY_KEY,
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
    staleTime: 1000 * 60 * 10,
    retry: (failureCount, err) => {
      // Don't retry auth failures — only retry real transient errors.
      if (isApiError(err) && err.status === 401) return false;
      return failureCount < 2;
    },
  });

  const isAuthenticated = !!user;

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await authApi.login(data);
      return response?.data;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, newUser);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await authApi.register(data);
      return response?.data;
    },
    onSuccess: (newUser) => {
      queryClient.setQueryData(["auth", "me"], newUser);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
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
    refetchMe: refetch,
  };
}
