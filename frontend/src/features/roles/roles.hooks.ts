"use client";

import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "./roles.service";
import type { RoleSummary, RoleDetail } from "./types";
import { isApiError } from "@/src/api/api-error";
import { queryKeys } from "@/src/lib/query-keys";
import { DEFAULT_STALE_TIME, defaultQueryRetry } from "@/src/lib/query-client";

// Roles are deploy-time seed data, so the shared stale time is sufficient.
export function useRoles() {
  const {
    data: roles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<RoleSummary[]>({
    queryKey: queryKeys.roles.all(),
    queryFn: async () => {
      const response = await rolesApi.list();
      return response?.data?.data ?? [];
    },
    staleTime: DEFAULT_STALE_TIME,
    retry: defaultQueryRetry,
  });

  return {
    roles,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
    refetch,
  };
}

export function useRole(slug: string) {
  const {
    data: role,
    isLoading,
    isError,
    error,
  } = useQuery<RoleDetail>({
    queryKey: queryKeys.roles.detail(slug),
    queryFn: async () => {
      const response = await rolesApi.get(slug);
      return response?.data?.data as RoleDetail;
    },
    staleTime: DEFAULT_STALE_TIME,
    retry: defaultQueryRetry,
    enabled: !!slug,
  });

  return {
    role,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
  };
}
