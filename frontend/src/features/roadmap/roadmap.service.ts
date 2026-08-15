import { axiosClient } from "@/src/api/client";
import { AI_CALL_TIMEOUT_MS } from "@/src/api/config";
import type { ApiResponse } from "@/src/api/types";
import type { Roadmap, RoadmapTaskRow } from "./types";

export const roadmapApi = {
  // Roadmap task content is a Gemini call — same budget as career-analysis
  // creation and resume upload.
  generate: (analysisId: string) =>
    axiosClient.post<ApiResponse<Roadmap>>(
      `/career-analyses/${analysisId}/roadmap`,
      undefined,
      { timeout: AI_CALL_TIMEOUT_MS },
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
