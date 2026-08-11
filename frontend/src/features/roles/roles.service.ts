import { axiosClient } from "@/src/api/client";
import type { ApiResponse } from "@/src/api/types";
import type { RoleSummary, RoleDetail } from "./types";

export const rolesApi = {
  list: () => axiosClient.get<ApiResponse<RoleSummary[]>>("/roles"),

  get: (slug: string) =>
    axiosClient.get<ApiResponse<RoleDetail>>(`/roles/${slug}`),
};
