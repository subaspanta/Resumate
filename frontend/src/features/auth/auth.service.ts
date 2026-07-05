import { axiosClient } from "@/src/api/client";
import type { ApiResponse, SafeUser } from "@/src/features/auth/types";

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
};

export const authApi = {
  register: (data: RegisterInput) =>
    axiosClient.post<ApiResponse<SafeUser>>("/auth/register", data),

  login: (data: LoginInput) =>
    axiosClient.post<ApiResponse<SafeUser>>("/auth/login", data),

  me: () => axiosClient.get<ApiResponse<SafeUser>>("/auth/me"),

  logout: () => axiosClient.post<ApiResponse<null>>("/auth/logout"),
};
