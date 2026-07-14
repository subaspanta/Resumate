import axios, { AxiosRequestConfig } from "axios";
import { apiConfig } from "./config";
import { normalizeAxiosError } from "./api-error";
import { queryClient } from "@/src/lib/query-client";

export const axiosClient = axios.create({
  ...apiConfig,
});

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Endpoints that should never trigger the refresh flow themselves —
// a 401 from any of these means the session is genuinely gone.
const NO_REFRESH_URLS = ["/auth/me", "/auth/login", "/auth/register", "/auth/refresh"];

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

function onRefreshSettled() {
  pendingRequests.forEach((retry) => retry());
  pendingRequests = [];
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const normalized = normalizeAxiosError(error);
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const url = originalRequest?.url ?? "";
    const isAuthEndpoint = NO_REFRESH_URLS.some((path) => url.includes(path));

    // 401 on /auth/me, /auth/login, /auth/register, /auth/refresh, or an
    // already-retried request: pass through as-is. useAuth's queryFn already
    // treats a 401 on /auth/me as "signed out", no invalidation needed here.
    if (
      normalized.status !== 401 ||
      !originalRequest ||
      isAuthEndpoint ||
      originalRequest._retry
    ) {
      return Promise.reject(normalized);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push(() => {
          axiosClient(originalRequest).then(resolve, reject);
        });
      });
    }

    isRefreshing = true;

    try {
      await axiosClient.post("/auth/refresh");
      isRefreshing = false;
      onRefreshSettled();
      return axiosClient(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      pendingRequests = [];
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      return Promise.reject(normalizeAxiosError(refreshError));
    }
  },
);
