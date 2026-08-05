import { z } from "zod";

export const uploadResumeSchema = z.object({
  title: z.string().min(1).max(255).optional(),
});

export const listResumesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().uuid().optional(),
});

export const updateSectionVisibilitySchema = z.object({
  summary: z.boolean().optional(),
  experience: z.boolean().optional(),
  projects: z.boolean().optional(),
  education: z.boolean().optional(),
  skills: z.boolean().optional(),
  certifications: z.boolean().optional(),
  customSections: z.record(z.string(), z.boolean()).optional(),
});

export type UploadResumeInput = z.infer<typeof uploadResumeSchema>;
export type ListResumesQuery = z.infer<typeof listResumesQuerySchema>;
export type UpdateSectionVisibilityInput = z.infer<
  typeof updateSectionVisibilitySchema
>;
