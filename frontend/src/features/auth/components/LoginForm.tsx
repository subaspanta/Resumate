"use client";

import { useForm, type UseFormSetError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/features/auth";
import { isApiError } from "@/src/api/api-error";
import { getSafeRedirect } from "@/src/lib/safe-redirect";
import { toast } from "sonner";
import { AuthFormField } from "./AuthFormField";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthDivider } from "./AuthDivider";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { useErrorResponse } from "@/src/components/useErrorResponse";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";

function applyLoginError(
  error: unknown,
  setError: UseFormSetError<LoginFormValues>,
) {
  if (!isApiError(error)) {
    toast.error("Login failed. Please try again.");
    return;
  }

  if (error.code === "INVALID_CREDENTIALS") {
    setError("email", { type: "manual", message: INVALID_CREDENTIALS_MESSAGE });
    setError("password", { type: "manual", message: INVALID_CREDENTIALS_MESSAGE });
    toast.error(`Login failed: ${INVALID_CREDENTIALS_MESSAGE}.`);
    return;
  }

  if (error.status === 0) {
    toast.error("Login failed. Please check your network connection.");
    return;
  }

  toast.error(error.message || "Login failed. Please try again.");
}

export function LoginForm() {
  const { login: loginUser, isLoggingIn: isLoading, isError: isLoginError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

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
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginUser({
        email: values.email,
        password: values.password,
      });
      toast.success("Welcome back!");
      router.push(getSafeRedirect(searchParams.get("next")));
    } catch (error) {
      applyLoginError(error, setError);
    }
  };

  const handleUnavailableFeature = (feature: string) =>
    toast.info(`${feature} is not implemented yet.`);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form auth-form--login">
      <AuthFormField
        id="email"
        label="Email Address"
        type="email"
        placeholder="name@company.com"
        registration={register("email")}
        error={errors.email?.message}
        disabled={isLoading}
        variant="login"
      />

      <AuthFormField
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        registration={register("password")}
        error={errors.password?.message}
        disabled={isLoading}
        showPasswordToggle
        variant="login"
        labelAction={
          <button
            className="auth-link"
            type="button"
            onClick={() => handleUnavailableFeature("Password reset")}
          >
            Forgot Password?
          </button>
        }
      />

      <AuthSubmitButton
        isLoading={isLoading}
        loadingText="Signing In..."
        variant="login"
      >
        Sign In
      </AuthSubmitButton>

      <AuthDivider />

      <GoogleAuthButton
        onClick={() => handleUnavailableFeature("Google sign-in")}
        disabled={true}
      />
    </form>
  );
}
