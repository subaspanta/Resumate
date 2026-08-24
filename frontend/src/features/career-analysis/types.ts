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

// GET /career-analyses response shape — cursor-paginated, mirroring
// ResumePage on the resume feature.
export interface CareerAnalysisPage {
  items: CareerAnalysisSummary[];
  nextCursor: string | null;
}

// Neither this nor the POST /career-analyses response carries either frozen
// snapshot — both are large JSONB blobs no client consumer reads, and the
// backend omits them from every response except the internal roadmap-
// generation read, which never reaches the client.
//
// hasRoadmap/roadmapProgress are also omitted: the backend only computes
// them in the list query (for the sidebar's "continue where you left off"
// card), never in the single-analysis read — GET /career-analyses/:id has
// never returned them.
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
