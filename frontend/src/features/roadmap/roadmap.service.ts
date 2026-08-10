import { axiosClient } from "@/src/api/client";
import type { ApiResponse } from "@/src/api/types";
import type { Roadmap, RoadmapTaskRow } from "./types";

export const roadmapApi = {
  // Roadmap task content is a Gemini call — same 60s budget as career-analysis
  // creation and resume upload.
  generate: (analysisId: string) =>
    axiosClient.post<ApiResponse<Roadmap>>(
      `/career-analyses/${analysisId}/roadmap`,
      undefined,
      { timeout: 60000 },
    ),

  // `data: null` is a legitimate answer — an analysis without a roadmap yet
  // is a normal state, not a missing resource.
  getForAnalysis: (analysisId: string) =>
    axiosClient.get<ApiResponse<Roadmap | null>>(
      `/career-analyses/${analysisId}/roadmap`,
    ),

  setTaskCompletion: (
    taskId: string,
    completed: boolean,
    completionNote?: string,
  ) =>
    axiosClient.patch<ApiResponse<RoadmapTaskRow>>(`/roadmap-tasks/${taskId}`, {
      completed,
      ...(completionNote !== undefined ? { completionNote } : {}),
    }),
};
