import { z } from "zod";

export const uploadResumeSchema = z.object({
  title: z.string().min(1).max(255),
});

export type UploadResumeInput = z.infer<typeof uploadResumeSchema>;
