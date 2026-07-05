"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth";
import { toast } from "sonner";

// Zod registration schema aligning with backend requirements and live validation visualizer
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

export default function RegisterPage() {
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

  // Compute live visual validation rules
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      const apiError = error?.response?.data?.error;
      
      if (apiError) {
        if (apiError.code === "USER_ALREADY_EXISTS") {
          setError("email", {
            type: "manual",
            message: "User with this email already exists",
          });
          toast.error("Registration failed: Email already registered.");
        } else if (apiError.code === "VALIDATION_ERROR") {
          const details = apiError.details;
          if (details && typeof details === "object") {
            Object.keys(details).forEach((key) => {
              setError(key as any, {
                type: "server",
                message: details[key],
              });
            });
          }
          toast.error("Registration failed: Please correct validation errors.");
        } else {
          toast.error(apiError.message || "Registration failed. Please try again.");
        }
      } else {
        toast.error("Registration failed. Please check your network connection.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-text-body bg-canvas">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full h-top-nav-height z-50 flex items-center px-lg md:px-xl bg-surface border-b border-border-base no-shadow">
        <div className="max-w-max-content w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-headline-lg text-headline-lg font-bold text-primary">
              ResumeForge
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center pt-[92px] pb-xl px-md">
        {/* Register Card */}
        <div className="w-full max-w-[440px] bg-surface border border-border-base rounded-lg p-xl no-shadow">
          <div className="mb-xl text-center">
            <h1 className="font-display-md text-[30px] leading-10 font-bold text-text-primary mb-sm">
              Create account
            </h1>
            <p className="font-body-md text-body-md text-text-muted">
              Start building your professional future today.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
            {/* Full Name */}
            <div className="space-y-xs">
              <label
                className="font-label-std text-label-std text-text-primary block font-medium"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                {...register("name")}
                disabled={isLoading}
                className={`w-full h-11 px-md border rounded-DEFAULT font-body-md text-body-md focus:outline-none focus:ring-0 transition-colors ${
                  errors.name
                    ? "border-danger focus:border-danger bg-surface"
                    : "border-border-input focus:border-primary focus:bg-ai-bg bg-surface"
                }`}
                id="name"
                placeholder="John Doe"
                type="text"
              />
              {errors.name && (
                <p className="font-label-std text-[11px] text-danger mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-xs">
              <label
                className="font-label-std text-label-std text-text-primary block font-medium"
                htmlFor="email"
              >
                Email
              </label>
              <input
                {...register("email")}
                disabled={isLoading}
                className={`w-full h-11 px-md border rounded-DEFAULT font-body-md text-body-md focus:outline-none focus:ring-0 transition-colors ${
                  errors.email
                    ? "border-danger focus:border-danger bg-surface"
                    : "border-border-input focus:border-primary focus:bg-ai-bg bg-surface"
                }`}
                id="email"
                placeholder="name@company.com"
                type="email"
              />
              {errors.email && (
                <p className="font-label-std text-[11px] text-danger mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-xs">
              <label
                className="font-label-std text-label-std text-text-primary block font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <input
                {...register("password")}
                disabled={isLoading}
                className={`w-full h-11 px-md border rounded-DEFAULT font-body-md text-body-md focus:outline-none focus:ring-0 transition-colors ${
                  errors.password
                    ? "border-danger focus:border-danger bg-surface"
                    : "border-border-input focus:border-primary focus:bg-ai-bg bg-surface"
                }`}
                id="password"
                placeholder="••••••••"
                type="password"
              />
              {errors.password && (
                <p className="font-label-std text-[11px] text-danger mt-1">
                  {errors.password.message}
                </p>
              )}

              {/* Live Validation Block */}
              <div className="grid grid-cols-2 gap-y-2 mt-sm border-t border-border-base pt-2">
                <div
                  className={`flex items-center gap-1.5 font-mono-label text-mono-label transition-colors ${
                    hasLength ? "text-[#16A34A]" : "text-text-muted"
                  }`}
                  id="v-length"
                >
                  <span
                    className="material-symbols-outlined !text-[14px]"
                    style={{
                      fontVariationSettings: `'FILL' ${hasLength ? 1 : 0}`,
                    }}
                  >
                    check_circle
                  </span>
                  <span>8+ characters</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 font-mono-label text-mono-label transition-colors ${
                    hasUpper ? "text-[#16A34A]" : "text-text-muted"
                  }`}
                  id="v-upper"
                >
                  <span
                    className="material-symbols-outlined !text-[14px]"
                    style={{
                      fontVariationSettings: `'FILL' ${hasUpper ? 1 : 0}`,
                    }}
                  >
                    check_circle
                  </span>
                  <span>Uppercase</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 font-mono-label text-mono-label transition-colors ${
                    hasNumber ? "text-[#16A34A]" : "text-text-muted"
                  }`}
                  id="v-number"
                >
                  <span
                    className="material-symbols-outlined !text-[14px]"
                    style={{
                      fontVariationSettings: `'FILL' ${hasNumber ? 1 : 0}`,
                    }}
                  >
                    check_circle
                  </span>
                  <span>Number</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 font-mono-label text-mono-label transition-colors ${
                    hasSymbol ? "text-[#16A34A]" : "text-text-muted"
                  }`}
                  id="v-symbol"
                >
                  <span
                    className="material-symbols-outlined !text-[14px]"
                    style={{
                      fontVariationSettings: `'FILL' ${hasSymbol ? 1 : 0}`,
                    }}
                  >
                    check_circle
                  </span>
                  <span>Symbol</span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-xs">
              <label
                className="font-label-std text-label-std text-text-primary block font-medium"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                disabled={isLoading}
                className={`w-full h-11 px-md border rounded-DEFAULT font-body-md text-body-md focus:outline-none focus:ring-0 transition-colors ${
                  errors.confirmPassword
                    ? "border-danger focus:border-danger bg-surface"
                    : "border-border-input focus:border-primary focus:bg-ai-bg bg-surface"
                }`}
                id="confirmPassword"
                placeholder="••••••••"
                type="password"
              />
              {errors.confirmPassword && (
                <p className="font-label-std text-[11px] text-danger mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Action Button */}
            <button
              disabled={isLoading}
              className="w-full h-12 bg-primary text-white font-label-std text-label-std rounded-DEFAULT hover:opacity-90 active:opacity-80 transition-all mt-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              type="submit"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-xl pt-xl border-t border-border-base text-center">
            <p className="font-body-md text-body-md text-text-muted">
              Already have an account?{" "}
              <Link
                className="text-primary font-bold hover:underline"
                href="/login"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl px-lg md:px-xl flex flex-col md:flex-row justify-between items-center gap-md bg-canvas border-t border-border-base no-shadow">
        <div className="font-label-std text-label-std text-text-primary font-medium">
          ResumeForge
        </div>
        <div className="flex gap-lg">
          <Link
            className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors"
            href="#"
          >
            Help Center
          </Link>
        </div>
        <div className="font-body-md text-body-md text-text-muted">
          © 2024 ResumeForge. Built for professional focus.
        </div>
      </footer>
    </div>
  );
}
