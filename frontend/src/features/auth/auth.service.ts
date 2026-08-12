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

  // Not an axios call, deliberately. The OAuth flow is a chain of browser
  // navigations — backend -> accounts.google.com -> backend callback -> here —
  // and the callback answers with cookies plus a 302, not a JSON body. Fetching
  // it would follow the redirects in the background and leave the browser where
  // it started, so the caller assigns this to window.location instead.
  //
  // Built from apiConfig.baseURL so it points at the API origin rather than the
  // Next.js one, and stays correct wherever NEXT_PUBLIC_API_URL points.
  googleAuthUrl: () => `${apiConfig.baseURL}/auth/google`,
};

// Leaves the SPA for the backend's OAuth entry point. Shared by the login and
// register forms — Google sign-in creates the account when the verified email
// is new and signs into the existing one when it isn't, so both entry points
// are the same flow and must not drift into two.
//
// window.location.assign, not router.push: the backend owns this route, and
// Next's router would try to resolve /api/v1/auth/google as an app route. The
// browser returns via a fresh document load after the callback, which is what
// lets useAuth pick up the new cookies.
export function startGoogleSignIn() {
  window.location.assign(authApi.googleAuthUrl());
}
