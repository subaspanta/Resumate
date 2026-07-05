"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth";
import { toast } from "sonner";

// Zod login schema
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login: loginUser, isLoggingIn: isLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginUser({
        email: values.email,
        password: values.password,
      });
      toast.success("Welcome back!");
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      const apiError = error?.response?.data?.error;
      if (apiError) {
        if (apiError.code === "INVALID_CREDENTIALS") {
          setError("email", {
            type: "manual",
            message: "Invalid email or password",
          });
          setError("password", {
            type: "manual",
            message: "Invalid email or password",
          });
          toast.error("Login failed: Invalid email or password.");
        } else {
          toast.error(apiError.message || "Login failed. Please try again.");
        }
      } else {
        toast.error("Login failed. Please check your network connection.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-md bg-canvas font-body-md text-text-body">
      <main className="w-full max-w-[480px]">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-xl text-center">
          <div className="mb-md flex items-center justify-center w-12 h-12 rounded-lg bg-surface border border-border-base">
            <span
              className="material-symbols-outlined text-primary text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              description
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight mb-sm">
            ResumeForge
          </h2>
          <h1 className="font-display-md text-display-md text-text-primary mb-sm px-md leading-10 font-bold">
            Build resumes recruiters want to read.
          </h1>
          <p className="font-body-lg text-body-lg text-text-body max-w-[360px]">
            AI-powered resume optimization built for modern job seekers.
          </p>
        </div>

        {/* Auth Card */}
        <section className="bg-surface border border-border-base rounded-xxl p-xl shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-lg">
            {/* Email Field */}
            <div className="space-y-sm">
              <label
                className="block font-label-std text-label-std font-bold text-text-primary"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                {...register("email")}
                disabled={isLoading}
                className={`w-full px-md py-[10px] rounded-lg border bg-surface font-body-md text-body-md text-text-primary focus:outline-none transition-all placeholder:text-text-muted ${
                  errors.email
                    ? "border-danger focus:border-danger bg-surface"
                    : "border-border-input focus:border-primary focus:bg-ai-bg"
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

            {/* Password Field */}
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <label
                  className="block font-label-std text-label-std font-bold text-text-primary"
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  className="font-label-std text-label-std text-primary hover:opacity-80 transition-all font-medium bg-transparent border-0 cursor-pointer"
                  type="button"
                  onClick={() => toast.info("Password reset is not implemented yet.")}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  disabled={isLoading}
                  className={`w-full px-md py-[10px] pr-[60px] rounded-lg border bg-surface font-body-md text-body-md text-text-primary focus:outline-none transition-all placeholder:text-text-muted ${
                    errors.password
                      ? "border-danger focus:border-danger bg-surface"
                      : "border-border-input focus:border-primary focus:bg-ai-bg"
                  }`}
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-md top-1/2 -translate-y-1/2 font-label-std text-label-std text-text-body hover:text-text-primary transition-all bg-transparent border-0 cursor-pointer"
                  id="toggle-password"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="font-label-std text-[11px] text-danger mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-sm">
              <input
                {...register("remember")}
                disabled={isLoading}
                className="w-4 h-4 rounded border-border-input text-primary focus:ring-primary cursor-pointer"
                id="remember"
                type="checkbox"
              />
              <label
                className="font-body-md text-body-md text-text-body cursor-pointer select-none"
                htmlFor="remember"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Action Button */}
            <button
              disabled={isLoading}
              className="w-full py-md px-xl bg-primary text-white font-semibold rounded-lg font-headline-sm text-headline-sm hover:opacity-90 active:opacity-80 transition-all flex items-center justify-center gap-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-sm">
              <div className="flex-grow border-t border-border-base"></div>
              <span className="flex-shrink mx-md font-mono-label text-mono-label text-text-muted uppercase tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-border-base"></div>
            </div>

            {/* OAuth Social */}
            <button
              className="w-full py-md px-xl bg-surface border border-border-base text-text-primary rounded-lg font-body-lg text-body-lg hover:bg-canvas transition-all flex items-center justify-center gap-md cursor-pointer disabled:opacity-50"
              type="button"
              disabled={isLoading}
              onClick={() => toast.info("Google OAuth is not implemented yet.")}
            >
              <svg
                fill="none"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              Continue with Google
            </button>
          </form>
        </section>

        {/* Footer Link */}
        <p className="mt-xl text-center font-body-md text-body-md text-text-body">
          Don't have an account?{" "}
          <Link
            className="text-primary font-bold hover:underline transition-all"
            href="/register"
          >
            Sign Up
          </Link>
        </p>
      </main>
    </div>
  );
}