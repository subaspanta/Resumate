import { axiosClient } from "@/src/api/client";
import type { ApiResponse } from "@/src/features/auth/types";
import type {
  ResumePage,
  Resume,
  EnabledSections,
} from "@/src/features/resume/types";

export const resumeApi = {
  list: () => axiosClient.get<ApiResponse<ResumePage>>("/resumes"),

  get: (id: string) => axiosClient.get<ApiResponse<Resume>>(`/resumes/${id}`),

  // Body is only the keys the caller wants to change — the backend deep-
  // merges into the stored enabledSections, so never send a reconstructed
  // full object here.
  updateSections: (id: string, patch: Partial<EnabledSections>) =>
    axiosClient.patch<ApiResponse<Resume>>(`/resumes/${id}/sections`, patch),

  // Storage upload and document parsing/AI structuring run concurrently on
  // the backend, but the combined wait can still comfortably exceed the
  // client's default 10s timeout — a real upload was still succeeding
  // server-side after the client had already given up and shown a failure.
  upload: (form: FormData) =>
    axiosClient.post<ApiResponse<Resume>>("/resumes", form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    }),

  remove: (id: string) =>
    axiosClient.delete<ApiResponse<{ id: string }>>(`/resumes/${id}`),
};
