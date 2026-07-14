import { axiosClient } from "@/src/api/client";
import type {
  ApiResponse,
  LoginInput,
  RegisterInput,
  SafeUser,
} from "@/src/features/auth/types";

export const authApi = {
  register: (data: RegisterInput) =>
    axiosClient.post<ApiResponse<SafeUser>>("/auth/register", data),

  login: (data: LoginInput) =>
    axiosClient.post<ApiResponse<SafeUser>>("/auth/login", data),

  me: () => axiosClient.get<ApiResponse<SafeUser>>("/auth/me"),

  refresh: () => axiosClient.post<ApiResponse<SafeUser>>("/auth/refresh"),

  logout: () => axiosClient.post<ApiResponse<null>>("/auth/logout"),
};
