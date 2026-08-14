// Mirrors backend/src/modules/career-analysis/{career-analysis.repository,career-analysis.types}.ts
// and prisma/schema.prisma enums. Do not invent values outside these unions.

export type CareerAnalysisStatus = "pending" | "analyzing" | "complete" | "failed";
export type EvidenceStrength = "experience_backed" | "project_backed" | "mentioned";
export type GapStatus = "strong" | "developing" | "weak_evidence" | "missing";

interface SkillRef {
  slug: string;
  name: string;
}

export interface CandidateSkillEvidence {
  id: string;
  quote: string;
  strength: EvidenceStrength;
  sourceSection: string;
  sourceLabel: string;
  skill: SkillRef;
}

export interface SkillGap {
  id: string;
  status: GapStatus;
  // Deterministic, application-computed. Lower = more urgent. Arrives
  // already sorted ascending from the backend — never re-sort client-side.
  priority: number;
  reasoning: string;
  skill: SkillRef;
}

// Task completion counted by the backend, not the client. Completion state is
// application-owned; a count assembled in a component would be a second
// definition of "progress" free to drift from the one the roadmap page uses.
export interface RoadmapProgress {
  total: number;
  completed: number;
  weekCount: number;
}

// GET /career-analyses list row — summary fields only, no evidence/gaps.
export interface CareerAnalysisSummary {
  id: string;
  resumeId: string;
  roleId: string;
  // Joined by the list query so the client renders a role name rather than
  // fetching the whole role list to map a uuid.
  role: { slug: string; title: string };
  status: CareerAnalysisStatus;
  readinessScore: number | null;
  createdAt: string;
  completedAt: string | null;
  // Existence only, not the roadmap itself — lets the sidebar's Roadmap
  // shortcut know whether this analysis has somewhere to send the user
  // without fetching every roadmap up front.
  hasRoadmap: boolean;
  // null when no roadmap has been generated yet.
  roadmapProgress: RoadmapProgress | null;
}

export interface CareerAnalysisDetail extends CareerAnalysisSummary {
  role: { slug: string; title: string };
  evidence: CandidateSkillEvidence[];
  gaps: SkillGap[];
  readinessBreakdown: unknown;
  failureReason: string | null;
  resumeSnapshot: unknown;
  roleSnapshot: unknown;
}

// POST /career-analyses response — same shape minus both frozen snapshots,
// which are large JSONB blobs no create-response consumer reads. A later
// GET of the same id returns the full CareerAnalysisDetail.
export type CreatedCareerAnalysis = Omit<
  CareerAnalysisDetail,
  "resumeSnapshot" | "roleSnapshot"
>;
