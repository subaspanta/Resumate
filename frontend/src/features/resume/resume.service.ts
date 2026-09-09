import { axiosClient } from "@/src/api/client";
import { AI_CALL_TIMEOUT_MS } from "@/src/api/config";
import type { ApiResponse } from "@/src/api/types";
import type { ResumePage, Resume } from "@/src/features/resume/types";

export const resumeApi = {
  list: () => axiosClient.get<ApiResponse<ResumePage>>("/resumes"),

  get: (id: string) => axiosClient.get<ApiResponse<Resume>>(`/resumes/${id}`),

  // Parsing remains the critical path because extraction and AI structuring are sequential.
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
