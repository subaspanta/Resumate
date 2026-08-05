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
  analysis: {
    // Prefix key — matches every analysis query at once. For blanket
    // invalidation when the affected resume isn't known.
    all: () => ["analysis"] as const,
    detail: (id: string) => ["analysis", id] as const,
    merged: (resumeId: string) => ["analysis", "merged", resumeId] as const,
    // No live subscriber — the hooks reading these are commented out in
    // analysis.hooks.ts. Kept so those hooks can come back without having to
    // re-derive the key shape.
    latest: (resumeId: string) => ["analysis", "latest", resumeId] as const,
    history: (resumeId: string) => ["analysis", "history", resumeId] as const,
  },
} as const;
