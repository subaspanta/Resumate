-- projectTask and expectedEvidence were introduced nullable one migration ago
-- so the column add could not fail on existing rows. They are required by the
-- roadmap agent's output schema and written on every insert, so the nullable
-- window is closed here rather than left for every consumer to null-check.
--
-- The only rows that can hold NULL are ones written before the split — on this
-- branch that means accumulated test fixtures (the test database is never
-- truncated) and local dev rows. There is no production data on this branch.
-- Backfilling them with prose would invent task content no model ever wrote,
-- so they are deleted instead: a roadmap task with no "what to build" and no
-- "what proves it done" is not a task the current code can render.
DELETE FROM "roadmap_tasks"
WHERE "projectTask" IS NULL OR "expectedEvidence" IS NULL;

-- Roadmaps orphaned by the delete above would read back as a plan with zero
-- weeks, which is indistinguishable from a generation bug.
DELETE FROM "roadmaps" r
WHERE NOT EXISTS (
  SELECT 1 FROM "roadmap_tasks" t WHERE t."roadmapId" = r."id"
);

-- AlterTable
ALTER TABLE "roadmap_tasks" ALTER COLUMN "projectTask" SET NOT NULL,
ALTER COLUMN "expectedEvidence" SET NOT NULL;
