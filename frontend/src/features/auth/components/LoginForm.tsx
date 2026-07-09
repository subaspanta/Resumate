"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth";
import { isApiError } from "@/src/api/api-error";
import { toast } from "sonner";
import { AuthFormField } from "./AuthFormField";
import { RememberMeCheckbox } from "./RememberMeCheckbox";
import { AuthFooterPrompt } from "./AuthFooterPrompt";
import { AuthSubmitButton } from "./AuthSubmitButton";

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

export function LoginForm() {
  const { login: loginUser, isLoggingIn: isLoading } = useAuth();
  const router = useRouter();

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
    } catch (error) {
      // The axios interceptor normalizes every failure to a flat `ApiError`,
      // so we branch on the typed envelope — not the raw axios error shape.
      if (isApiError(error)) {
        if (error.code === "INVALID_CREDENTIALS") {
          setError("email", {
            type: "manual",
            message: "Invalid email or password",
          });
          setError("password", {
            type: "manual",
            message: "Invalid email or password",
          });
          toast.error("Login failed: Invalid email or password.");
        } else if (error.status === 0) {
          toast.error("Login failed. Please check your network connection.");
        } else {
          toast.error(error.message || "Login failed. Please try again.");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  const forgotPasswordHandler = () =>
    toast.info("Password reset is not implemented yet.");

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
        <AuthFormField
          id="email"
          label="Email Address"
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
          showPasswordToggle
          labelAction={
            <button
              className="font-label-std text-label-std text-primary hover:opacity-80 transition-all font-medium bg-transparent border-0 cursor-pointer"
              type="button"
              onClick={forgotPasswordHandler}
            >
              Forgot Password?
            </button>
          }
        />

        <RememberMeCheckbox
          registration={register("remember")}
          disabled={isLoading}
        />

        <AuthSubmitButton
          isLoading={isLoading}
          loadingText="Signing In..."
          className="font-headline-sm text-headline-sm"
          type="submit"
        >
          Sign In
        </AuthSubmitButton>

        {/* <AuthDivider /> */}

        {/* <GoogleAuthButton
          onClick={forgotPasswordHandler}
          disabled={isLoading}
        /> */}
      </form>

      <AuthFooterPrompt
        promptText="Don't have an account?"
        linkText="Sign Up"
        href="/register"
      />
    </>
  );
}
