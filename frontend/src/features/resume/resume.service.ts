import { axiosClient } from "@/src/api/client";
import type { ApiResponse } from "@/src/features/auth/types";
import type {
  ResumeSummary,
  Resume,
  CreateResumeInput,
} from "@/src/features/resume/types";

export const resumeApi = {
  list: () =>
    axiosClient.get<ApiResponse<ResumeSummary[]>>("/resumes"),

  get: (id: string) =>
    axiosClient.get<ApiResponse<Resume>>(`/resumes/${id}`),

  upload: (form: FormData) =>
    axiosClient.post<ApiResponse<Resume>>("/resumes", form, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  remove: (id: string) =>
    axiosClient.delete<ApiResponse<{ id: string }>>(`/resumes/${id}`),
};
