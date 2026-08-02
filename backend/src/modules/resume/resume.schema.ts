import { z } from "zod";

export const uploadResumeSchema = z.object({
  title: z.string().min(1).max(255).optional(),
});

export const listResumesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().uuid().optional(),
});

export type UploadResumeInput = z.infer<typeof uploadResumeSchema>;
export type ListResumesQuery = z.infer<typeof listResumesQuerySchema>;
