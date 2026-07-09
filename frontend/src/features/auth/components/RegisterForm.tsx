"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth";
import { isApiError } from "@/src/api/api-error";
import { toast } from "sonner";
import { AuthFormField } from "./AuthFormField";
import { PasswordStrengthChecklist } from "./PasswordStrengthChecklist";
import { AuthFooterPrompt } from "./AuthFooterPrompt";
import { AuthSubmitButton } from "./AuthSubmitButton";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(50, "Name must be at most 50 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser, isRegistering: isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password", "");

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error) {
      // The axios interceptor normalizes every failure to a flat `ApiError`,
      // so we branch on the typed envelope and its canonical `code`.
      if (isApiError(error)) {
        if (error.code === "EMAIL_ALREADY_EXISTS") {
          setError("email", {
            type: "manual",
            message: "An account with this email already exists",
          });
          toast.error("Registration failed: Email already registered.");
        } else if (error.code === "VALIDATION_FAILED") {
          toast.error("Registration failed: Please correct the highlighted fields.");
        } else if (error.status === 0) {
          toast.error("Registration failed. Please check your network connection.");
        } else {
          toast.error(error.message || "Registration failed. Please try again.");
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
        <AuthFormField
          id="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          registration={register("name")}
          error={errors.name?.message}
          disabled={isLoading}
        />

        <AuthFormField
          id="email"
          label="Email"
          type="email"
          placeholder="name@company.com"
          registration={register("email")}
          error={errors.email?.message}
          disabled={isLoading}
        />

        <AuthFormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          registration={register("password")}
          error={errors.password?.message}
          disabled={isLoading}
          footer={<PasswordStrengthChecklist password={password} />}
        />

        <AuthFormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
          disabled={isLoading}
        />

        <AuthSubmitButton
          isLoading={isLoading}
          loadingText="Creating Account..."
          className="mt-4 font-label-std text-label-std"
          type="submit"
        >
          Create Account
        </AuthSubmitButton>
      </form>

      <div className="mt-lg pt-lg border-t border-border-base text-center">
        <AuthFooterPrompt
          promptText="Already have an account?"
          linkText="Sign In"
          href="/login"
        />
      </div>
    </>
  );
}
