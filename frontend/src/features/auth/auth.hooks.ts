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
        if (isApiError(err) && err.status === 401) return null;
        throw err;
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: defaultQueryRetry,
  });

  const isAuthenticated = !!user;

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await authApi.login(data);
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
    onSettled: () => {
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.clear();
    },
  });

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
