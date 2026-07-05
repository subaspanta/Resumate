import axios from "axios";
import { apiConfig } from "./config";
import { normalizeAxiosError } from "./api-error";

export const axiosClient = axios.create({
  ...apiConfig,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeAxiosError(error)),
);
