/**
 * The three-step tailoring journey, shared by every surface in the flow so
 * the step rail reads identically on the dashboard, the workspace, and the
 * analysis page. Previously only the workspace knew it was "step 2 of 3",
 * which is what made the other two screens feel like separate products.
 */
export const FLOW_STEPS = [
  { key: "upload", label: "Resume" },
  { key: "job", label: "Job Description" },
  { key: "review", label: "Review" },
] as const;

export type FlowStepKey = (typeof FLOW_STEPS)[number]["key"];

export const FLOW_STEP_INDEX: Record<FlowStepKey, number> = {
  upload: 0,
  job: 1,
  review: 2,
};
