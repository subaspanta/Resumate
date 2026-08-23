import { axiosClient } from "@/src/api/client";
import { AI_CALL_TIMEOUT_MS } from "@/src/api/config";
import type { ApiResponse } from "@/src/api/types";
import type { ResumePage, Resume } from "@/src/features/resume/types";

export const resumeApi = {
  list: () => axiosClient.get<ApiResponse<ResumePage>>("/resumes"),

  get: (id: string) => axiosClient.get<ApiResponse<Resume>>(`/resumes/${id}`),

  // Storage runs concurrently with parsing on the backend, but that
  // concurrency doesn't shorten the critical path: text extraction and the
  // AI structuring call are sequential within parsing, so this is the
  // slowest route in the app and the one AI_CALL_TIMEOUT_MS is sized for.
  upload: (form: FormData) =>
    axiosClient.post<ApiResponse<Resume>>("/resumes", form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: AI_CALL_TIMEOUT_MS,
    }),

  // Same pipeline as upload, against an existing row instead of a new one.
  replace: (id: string, form: FormData) =>
    axiosClient.put<ApiResponse<Resume>>(`/resumes/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: AI_CALL_TIMEOUT_MS,
    }),

  remove: (id: string) =>
    axiosClient.delete<ApiResponse<{ id: string }>>(`/resumes/${id}`),
};
