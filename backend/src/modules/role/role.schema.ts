import { z } from "zod";

// Validate route params before the database lookup.
export const roleSlugParamSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
});
