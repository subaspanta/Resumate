import { z } from "zod";

// Route params. Without this an arbitrary string reaches the DB lookup and
// surfaces as a generic 404 instead of validating the shape first — matches
// resume.schema.ts's resumeIdParamSchema.
export const roleSlugParamSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
});
