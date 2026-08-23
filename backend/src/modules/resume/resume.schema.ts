import { z } from "zod";

export const uploadResumeSchema = z.object({
  title: z.string().min(1).max(255).optional(),
});

export const listResumesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().uuid().optional(),
});

// Route params. Without this a malformed id reaches Prisma's uuid cast and
// surfaces as a generic 500 instead of the 400 the rest of the API returns.
export const resumeIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type ListResumesQuery = z.infer<typeof listResumesQuerySchema>;
