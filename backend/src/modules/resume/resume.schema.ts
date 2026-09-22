import { z } from "zod";

export const uploadResumeSchema = z.object({
  title: z.string().min(1).max(255).optional(),
});

export const listResumesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().uuid().optional(),
});

// Reject malformed UUIDs before Prisma.
export const resumeIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type ListResumesQuery = z.infer<typeof listResumesQuerySchema>;
