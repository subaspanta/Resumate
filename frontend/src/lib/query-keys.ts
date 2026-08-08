// One owner for every TanStack Query cache key.
//
// Keys used to live as private constants inside each feature's .hooks.ts, so
// anything outside that module — the axios interceptor, a cross-feature
// invalidation — had to retype the array as a literal. That drifts silently: a
// mistyped key doesn't throw, it just stops matching, and the cache serves
// stale data with no signal.
//
// Every entry is a function, even the ones taking no argument, so call sites
// read uniformly: queryKeys.resumes.all(), never a mix of `.all` and
// `.detail(id)`.
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
  },
  roadmap: {
    byAnalysis: (analysisId: string) =>
      ["roadmap", "analysis", analysisId] as const,
    detail: (roadmapId: string) => ["roadmap", roadmapId] as const,
  },
} as const;
