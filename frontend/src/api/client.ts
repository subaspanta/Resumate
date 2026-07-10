import axios from "axios";
import { apiConfig } from "./config";
import { normalizeAxiosError } from "./api-error";
import { queryClient } from "@/src/lib/query-client";

export const axiosClient = axios.create({
  ...apiConfig,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeAxiosError(error);

    if (normalized.status === 401) {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    }

    return Promise.reject(normalized);
  },
);
