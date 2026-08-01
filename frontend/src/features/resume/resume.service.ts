import { axiosClient } from "@/src/api/client";
import type { ApiResponse } from "@/src/features/auth/types";
import type {
  ResumeSummary,
  ResumePage,
  Resume,
  CreateResumeInput,
} from "@/src/features/resume/types";

export const resumeApi = {
  list: () => axiosClient.get<ApiResponse<ResumePage>>("/resumes"),

  get: (id: string) => axiosClient.get<ApiResponse<Resume>>(`/resumes/${id}`),

  // Storage upload + document parsing + AI structuring run sequentially on
  // the backend and can comfortably exceed the client's default 10s
  // timeout — a real upload was still succeeding server-side after the
  // client had already given up and shown a failure.
  upload: (form: FormData) =>
    axiosClient.post<ApiResponse<Resume>>("/resumes", form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    }),

  remove: (id: string) =>
    axiosClient.delete<ApiResponse<{ id: string }>>(`/resumes/${id}`),
};
