// Mirrors backend career-analysis types and Prisma enums.

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
  // Application-computed urgency; backend sends gaps in ascending order.
  priority: number;
  reasoning: string;
  skill: SkillRef;
}

// Backend-owned completion counts keep progress consistent across views.
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
  // Joined by the list query to avoid a separate role lookup.
  role: { slug: string; title: string };
  status: CareerAnalysisStatus;
  readinessScore: number | null;
  createdAt: string;
  completedAt: string | null;
  // Existence only, used by the sidebar without loading every roadmap.
  hasRoadmap: boolean;
  // Null before roadmap generation.
  roadmapProgress: RoadmapProgress | null;
}

// Cursor-paginated GET /career-analyses response.
export interface CareerAnalysisPage {
  items: CareerAnalysisSummary[];
  nextCursor: string | null;
}

// Detail responses omit frozen snapshots and list-only roadmap progress fields.
export interface CareerAnalysisDetail
  extends Omit<CareerAnalysisSummary, "hasRoadmap" | "roadmapProgress"> {
  role: { slug: string; title: string };
  evidence: CandidateSkillEvidence[];
  gaps: SkillGap[];
  readinessBreakdown: unknown;
  failureReason: string | null;
}

// POST /career-analyses and POST .../reassess both return this same shape.
export type CreatedCareerAnalysis = CareerAnalysisDetail;
