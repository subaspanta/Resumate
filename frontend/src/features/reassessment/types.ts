// Mirrors the backend reassessment repository and Prisma revision fields.

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
