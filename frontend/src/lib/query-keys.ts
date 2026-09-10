export const queryKeys = {
  auth: {
    me: () => ["auth", "me"] as const,
  },
  resumes: {
    all: () => ["resumes"] as const,
    detail: (id: string) => ["resumes", id] as const,
  },
  roles: {
    all: () => ["roles"] as const,
    detail: (slug: string) => ["roles", slug] as const,
  },
  careerAnalyses: {
    all: () => ["careerAnalyses"] as const,
    list: (resumeId?: string) =>
      ["careerAnalyses", "list", resumeId ?? null] as const,
    detail: (id: string) => ["careerAnalyses", id] as const,
    revisions: (analysisId: string) =>
      ["careerAnalyses", analysisId, "revisions"] as const,
  },
  roadmap: {
    byAnalysis: (analysisId: string) =>
      ["roadmap", "analysis", analysisId] as const,
    detail: (roadmapId: string) => ["roadmap", roadmapId] as const,
  },
} as const;
