import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters long" }),

  email: z
    .string()
    .trim()
    .pipe(z.email({ message: "Invalid email address" })),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password must be at most 32 characters long" }),
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: "Invalid email address" })),
  password: z.string().min(1, { message: "Password is required" }),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
