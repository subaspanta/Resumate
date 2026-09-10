import { axiosClient } from "@/src/api/client";
import { apiConfig } from "@/src/api/config";
import type { ApiResponse } from "@/src/api/types";
import type {
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

  logout: () => axiosClient.post<ApiResponse<null>>("/auth/logout"),

  deleteAccount: () => axiosClient.delete<ApiResponse<null>>("/auth/me"),

  // OAuth starts on backend, not Next.js origin.
  googleAuthUrl: () => `${apiConfig.baseURL}/auth/google`,
};

// Full navigation lets backend OAuth callback set cookies and redirect back.
export function startGoogleSignIn() {
  window.location.assign(authApi.googleAuthUrl());
}
