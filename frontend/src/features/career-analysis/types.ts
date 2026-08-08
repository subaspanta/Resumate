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

// GET /career-analyses list row — summary fields only, no evidence/gaps.
export interface CareerAnalysisSummary {
  id: string;
  resumeId: string;
  roleId: string;
  status: CareerAnalysisStatus;
  readinessScore: number | null;
  createdAt: string;
  completedAt: string | null;
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
