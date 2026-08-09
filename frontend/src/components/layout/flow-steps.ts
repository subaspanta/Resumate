/**
 * The five-step career-navigator journey, shared by every surface in the
 * flow so the step rail reads identically on the dashboard, the profile
 * review page, the role-selection page, the analysis page, and the roadmap
 * page.
 */
export const FLOW_STEPS = [
  { key: "upload", label: "Resume" },
  { key: "review", label: "Review Profile" },
  { key: "role", label: "Target Role" },
  { key: "analysis", label: "Analysis" },
  { key: "roadmap", label: "Roadmap" },
] as const;

export type FlowStepKey = (typeof FLOW_STEPS)[number]["key"];

export const FLOW_STEP_INDEX: Record<FlowStepKey, number> = {
  upload: 0,
  review: 1,
  role: 2,
  analysis: 3,
  roadmap: 4,
};
