// Mirrors backend/src/modules/career-analysis/career-analysis.repository.ts
// (RootAnalysisForReassessment / findRevisionsByRootId) and prisma/schema.prisma
// (CareerAnalysis.parentAnalysisId / revision).

import type { CareerAnalysisStatus } from "@/src/features/career-analysis/types";

// GET /career-analyses/:id/revisions row.
export interface RevisionSummary {
  id: string;
  revision: number;
  status: CareerAnalysisStatus;
  readinessScore: number | null;
  createdAt: string;
  completedAt: string | null;
}
